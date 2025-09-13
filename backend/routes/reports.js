const express = require("express")
const { body, query, param } = require("express-validator")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const axios = require("axios")
const Report = require("../models/Report")
const User = require("../models/User")
const { protect, authorize } = require("../middleware/auth")
const { handleValidationErrors } = require("../middleware/validation")
const { reportLimiter } = require("../middleware/rateLimiter")

const router = express.Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configure multer for image uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increased to 10MB to match FastAPI service
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

const validateImageWithAI = async (imageBuffer, mimetype) => {
  try {
    const formData = new FormData()
    const blob = new Blob([imageBuffer], { type: mimetype })
    formData.append("file", blob, "image.jpg")

    const response = await axios.post(
      `${process.env.AI_CLASSIFICATION_SERVICE_URL || "http://localhost:8000"}/classify-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      },
    )

    return {
      isValid: response.data.status === "accepted",
      message: response.data.message,
      confidence: response.data.confidence || "unknown",
    }
  } catch (error) {
    console.error("AI validation error:", error.message)
    // If AI service is down, allow the image but log the issue
    return {
      isValid: true,
      message: "AI validation service unavailable - image accepted",
      confidence: "unknown",
      error: error.message,
    }
  }
}

// @desc    Submit new waste report
// @route   POST /api/reports
// @access  Private
router.post(
  "/",
  protect,
  reportLimiter,
  upload.array("images", 5), // Max 5 images
  [
    body("location.address").notEmpty().withMessage("Address is required"),
    body("location.coordinates.lat").isFloat({ min: -90, max: 90 }).withMessage("Valid latitude is required"),
    body("location.coordinates.lng").isFloat({ min: -180, max: 180 }).withMessage("Valid longitude is required"),
    body("wasteType")
      .isIn([
        "household",
        "construction",
        "electronic",
        "medical",
        "industrial",
        "organic",
        "plastic",
        "hazardous",
        "other",
      ])
      .withMessage("Invalid waste type"),
    body("wasteSize").isIn(["small", "medium", "large", "very-large"]).withMessage("Invalid waste size"),
    body("urgency").isIn(["low", "medium", "high", "critical"]).withMessage("Invalid urgency level"),
    body("description").isLength({ min: 10, max: 500 }).withMessage("Description must be 10-500 characters"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { location, wasteType, wasteSize, urgency, description, aiAnalysis } = req.body

      const imageUploads = []
      const aiValidationResults = []

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            // Validate image with AI first
            const aiValidation = await validateImageWithAI(file.buffer, file.mimetype)
            aiValidationResults.push(aiValidation)

            // Only upload if AI validation passes or service is unavailable
            if (aiValidation.isValid) {
              const result = await new Promise((resolve, reject) => {
                cloudinary.uploader
                  .upload_stream(
                    {
                      resource_type: "image",
                      folder: "waste-reports",
                      transformation: [{ width: 800, height: 600, crop: "limit", quality: "auto" }],
                    },
                    (error, result) => {
                      if (error) reject(error)
                      else resolve(result)
                    },
                  )
                  .end(file.buffer)
              })

              imageUploads.push({
                url: result.secure_url,
                publicId: result.public_id,
                aiValidation: {
                  isValid: aiValidation.isValid,
                  message: aiValidation.message,
                  confidence: aiValidation.confidence,
                  validatedAt: new Date(),
                },
              })
            } else {
              // Return error if AI rejects the image
              return res.status(400).json({
                success: false,
                message: `Image validation failed: ${aiValidation.message}`,
                error: "INVALID_IMAGE",
              })
            }
          } catch (uploadError) {
            console.error("Image processing error:", uploadError)
            return res.status(400).json({
              success: false,
              message: "Failed to process uploaded image",
              error: "IMAGE_PROCESSING_ERROR",
            })
          }
        }
      }

      const enhancedAiAnalysis = {
        ...(aiAnalysis || {}),
        imageValidation: aiValidationResults,
        validationTimestamp: new Date(),
        allImagesValid: aiValidationResults.every((result) => result.isValid),
      }

      // Create report
      const report = await Report.create({
        reporter: req.user.id,
        location: {
          address: location.address,
          coordinates: {
            lat: Number.parseFloat(location.coordinates.lat),
            lng: Number.parseFloat(location.coordinates.lng),
          },
          landmark: location.landmark,
          area: location.area,
          city: location.city,
          pincode: location.pincode,
        },
        wasteType,
        wasteSize,
        urgency,
        description,
        images: imageUploads,
        aiAnalysis: enhancedAiAnalysis,
        timeline: [
          {
            status: "pending",
            timestamp: new Date(),
            updatedBy: req.user.id,
            notes: "Report submitted with AI-validated images",
          },
        ],
      })

      // Update user's report count and points
      await User.findByIdAndUpdate(req.user.id, {
        $inc: {
          reportsSubmitted: 1,
          points: 10, // Award 10 points for submitting a report
        },
      })

      // Populate reporter details
      await report.populate("reporter", "name email phone")

      res.status(201).json({
        success: true,
        message: "Waste report submitted successfully with AI validation",
        data: {
          report: {
            id: report._id,
            reportId: report.reportId,
            location: report.location,
            wasteType: report.wasteType,
            wasteSize: report.wasteSize,
            urgency: report.urgency,
            description: report.description,
            images: report.images,
            status: report.status,
            priority: report.priority,
            createdAt: report.createdAt,
            reporter: report.reporter,
            aiValidation: {
              validated: true,
              results: aiValidationResults,
            },
          },
        },
      })
    } catch (error) {
      console.error("Report submission error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to submit report",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// @desc    Validate image with AI (for frontend preview)
// @route   POST /api/reports/validate-image
// @access  Private
router.post("/validate-image", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      })
    }

    const aiValidation = await validateImageWithAI(req.file.buffer, req.file.mimetype)

    res.json({
      success: true,
      data: {
        validation: aiValidation,
        fileInfo: {
          size: req.file.size,
          mimetype: req.file.mimetype,
          originalName: req.file.originalname,
        },
      },
    })
  } catch (error) {
    console.error("Image validation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to validate image",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// @desc    Get all reports (with filters)
// @route   GET /api/reports
// @access  Private (Admin/Worker)
router.get(
  "/",
  protect,
  authorize("admin", "worker"),
  [
    query("status").optional().isIn(["pending", "assigned", "in-progress", "completed", "rejected"]),
    query("urgency").optional().isIn(["low", "medium", "high", "critical"]),
    query("wasteType")
      .optional()
      .isIn([
        "household",
        "construction",
        "electronic",
        "medical",
        "industrial",
        "organic",
        "plastic",
        "hazardous",
        "other",
      ]),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        status,
        urgency,
        wasteType,
        assignedWorker,
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query

      // Build filter object
      const filter = {}
      if (status) filter.status = status
      if (urgency) filter.urgency = urgency
      if (wasteType) filter.wasteType = wasteType
      if (assignedWorker) filter.assignedWorker = assignedWorker

      // For workers, only show their assigned reports
      if (req.user.role === "worker") {
        filter.assignedWorker = req.user.id
      }

      // Calculate pagination
      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

      // Build sort object
      const sort = {}
      sort[sortBy] = sortOrder === "desc" ? -1 : 1

      // Get reports with pagination
      const reports = await Report.find(filter)
        .populate("reporter", "name email phone")
        .populate("assignedWorker", "name email workerDetails.employeeId")
        .sort(sort)
        .skip(skip)
        .limit(Number.parseInt(limit))

      // Get total count for pagination
      const total = await Report.countDocuments(filter)

      res.json({
        success: true,
        data: {
          reports,
          pagination: {
            current: Number.parseInt(page),
            pages: Math.ceil(total / Number.parseInt(limit)),
            total,
            limit: Number.parseInt(limit),
          },
        },
      })
    } catch (error) {
      console.error("Get reports error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch reports",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// @desc    Get user's own reports
// @route   GET /api/reports/my-reports
// @access  Private
router.get("/my-reports", protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const reports = await Report.find({ reporter: req.user.id })
      .populate("assignedWorker", "name workerDetails.employeeId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Report.countDocuments({ reporter: req.user.id })

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / Number.parseInt(limit)),
          total,
          limit: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Get user reports error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch your reports",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
router.get(
  "/:id",
  protect,
  [param("id").isMongoId().withMessage("Invalid report ID")],
  handleValidationErrors,
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id)
        .populate("reporter", "name email phone address")
        .populate("assignedWorker", "name email phone workerDetails")
        .populate("timeline.updatedBy", "name role")

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        })
      }

      // Check access permissions
      if (req.user.role === "user" && report.reporter._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        })
      }

      if (req.user.role === "worker" && report.assignedWorker && report.assignedWorker._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        })
      }

      res.json({
        success: true,
        data: { report },
      })
    } catch (error) {
      console.error("Get report error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch report",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private (Admin/Worker)
router.put(
  "/:id/status",
  protect,
  authorize("admin", "worker"),
  [
    param("id").isMongoId().withMessage("Invalid report ID"),
    body("status").isIn(["pending", "assigned", "in-progress", "completed", "rejected"]).withMessage("Invalid status"),
    body("notes").optional().isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { status, notes } = req.body

      const report = await Report.findById(req.params.id)
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        })
      }

      // Check if worker is trying to update a report not assigned to them
      if (req.user.role === "worker" && report.assignedWorker && report.assignedWorker.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can only update reports assigned to you",
        })
      }

      // Update status and add timeline entry
      report.status = status
      report.timeline.push({
        status,
        timestamp: new Date(),
        updatedBy: req.user.id,
        notes: notes || `Status updated to ${status}`,
      })

      // Set completion time if completed
      if (status === "completed") {
        report.completedAt = new Date()
      }

      await report.save()

      await report.populate("assignedWorker", "name email workerDetails.employeeId")

      res.json({
        success: true,
        message: "Report status updated successfully",
        data: { report },
      })
    } catch (error) {
      console.error("Update report status error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update report status",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// @desc    Add completion images and notes
// @route   PUT /api/reports/:id/complete
// @access  Private (Worker)
router.put(
  "/:id/complete",
  protect,
  authorize("worker"),
  upload.array("completionImages", 3),
  [
    param("id").isMongoId().withMessage("Invalid report ID"),
    body("workerNotes").optional().isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { workerNotes } = req.body

      const report = await Report.findById(req.params.id)
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        })
      }

      // Check if worker is assigned to this report
      if (!report.assignedWorker || report.assignedWorker.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can only complete reports assigned to you",
        })
      }

      // Upload completion images
      const completionImages = []
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            const result = await new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  {
                    resource_type: "image",
                    folder: "waste-reports/completion",
                    transformation: [{ width: 800, height: 600, crop: "limit", quality: "auto" }],
                  },
                  (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                  },
                )
                .end(file.buffer)
            })

            completionImages.push({
              url: result.secure_url,
              publicId: result.public_id,
              uploadedAt: new Date(),
            })
          } catch (uploadError) {
            console.error("Completion image upload error:", uploadError)
          }
        }
      }

      // Update report
      report.status = "completed"
      report.completedAt = new Date()
      report.workerNotes = workerNotes
      report.completionImages = completionImages
      report.timeline.push({
        status: "completed",
        timestamp: new Date(),
        updatedBy: req.user.id,
        notes: "Task completed by worker",
      })

      await report.save()

      // Update worker's completed tasks count
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { "workerDetails.completedTasks": 1 },
      })

      res.json({
        success: true,
        message: "Report marked as completed successfully",
        data: { report },
      })
    } catch (error) {
      console.error("Complete report error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to complete report",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// @desc    Submit feedback for completed report
// @route   PUT /api/reports/:id/feedback
// @access  Private (Reporter only)
router.put(
  "/:id/feedback",
  protect,
  [
    param("id").isMongoId().withMessage("Invalid report ID"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { rating, comment } = req.body

      const report = await Report.findById(req.params.id)
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        })
      }

      // Check if user is the reporter
      if (report.reporter.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can only provide feedback for your own reports",
        })
      }

      // Check if report is completed
      if (report.status !== "completed") {
        return res.status(400).json({
          success: false,
          message: "Feedback can only be provided for completed reports",
        })
      }

      // Update feedback
      report.feedback = {
        rating,
        comment,
        submittedAt: new Date(),
      }

      await report.save()

      res.json({
        success: true,
        message: "Feedback submitted successfully",
        data: { report },
      })
    } catch (error) {
      console.error("Submit feedback error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to submit feedback",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

module.exports = router
