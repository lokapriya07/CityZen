// const express = require("express");
// const { body, param, validationResult } = require("express-validator");
// const multer = require("multer");
// const Report = require("../models/Report");
// const Task = require("../models/Task"); // Required for updating worker rating
// const { protect } = require("../middleware/auth");
// const axios = require("axios"); // Required for the geocode function

// const router = express.Router();

// // Configure multer for in-memory storage.
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// async function geocodeAddress(address) {
//     const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//     try {
//         const response = await axios.get(
//             `https://maps.googleapis.com/maps/api/geocode/json`,
//             { params: { address, key: apiKey } }
//         );

//         if (response.data.status === "OK" && response.data.results.length > 0) {
//             const loc = response.data.results[0].geometry.location;
//             return [loc.lng, loc.lat]; // GeoJSON format
//         }
//     } catch (error) {
//         console.error("Geocoding failed:", error.message);
//     }
//     return [0, 0]; // fallback if geocoding fails
// }

// // =========================================================================
// // @desc      GET ALL REPORTS FOR THE LOGGED-IN USER (with worker details)
// // @route     GET /api/reports
// // @access    Private (requires login)
// // =========================================================================
// router.get("/", protect, async (req, res) => {
//     try {
//         if (!req.user || !req.user._id) {
//             return res.status(401).json({ success: false, message: "Authentication required." });
//         }
//         // ✅ UPDATED: This query now populates the assigned worker's details.
//         const reports = await Report.find({ reporter: req.user._id })
//             .sort({ createdAt: -1 })
//             .populate({
//                 path: "assignedWorker",
//                 select: "name workerDetails" // Selects the worker's name and details
//             });
            
//         res.status(200).json({
//             success: true,
//             count: reports.length,
//             data: reports,
//         });
//     } catch (error) {
//         console.error("🔥 Error fetching reports for user:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server Error: Could not retrieve reports.",
//             error: error.message,
//         });
//     }
// });

// // =========================================================================
// // @desc      SUBMIT NEW WASTE REPORT
// // @route     POST /api/reports
// // @access    Private (requires login)
// // =========================================================================
// router.post(
//     "/",
//     protect,
//     upload.single("images"),
//     [
//         body("fullName").notEmpty().withMessage("Full name is required"),
//         body("email").isEmail().withMessage("A valid email is required"),
//         body("phone").notEmpty().withMessage("Phone number is required"),
//         body("address").notEmpty().withMessage("Address is required"),
//         body("city").notEmpty().withMessage("City is required"),
//         body("state").notEmpty().withMessage("State is required"),
//         body("pincode").notEmpty().withMessage("Pincode is required"),
//         body("wasteType").notEmpty().withMessage("Waste type is required"),
//         body("wasteAmount").notEmpty().withMessage("Waste amount is required"),
//         body("urgency").notEmpty().withMessage("Urgency is required"),
//     ],
//     async (req, res) => {
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({ success: false, errors: errors.array() });
//             }

//             if (!req.user) {
//                 return res.status(401).json({ success: false, message: "Authentication error" });
//             }

//             const complaintId = `CMP${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//             let coordinates = [0, 0];

//             if (req.body.gpsCoordinates?.lat && req.body.gpsCoordinates?.lng) {
//                 coordinates = [req.body.gpsCoordinates.lng, req.body.gpsCoordinates.lat];
//             } else if (req.body.address) {
//                 coordinates = await geocodeAddress(req.body.address);
//             }

//             const report = await Report.create({
//                 reporter: req.user._id,
//                 complaintId,
//                 fullName: req.body.fullName,
//                 email: req.body.email,
//                 phone: req.body.phone,
//                 altPhone: req.body.altPhone,
//                 address: req.body.address,
//                 city: req.body.city,
//                 pincode: req.body.pincode,
//                 state: req.body.state,
//                 location: {
//                     type: "Point",
//                     coordinates,
//                     address: req.body.address,
//                 },
//                 wasteType: req.body.wasteType,
//                 wasteAmount: req.body.wasteAmount,
//                 urgency: req.body.urgency,
//                 description: req.body.description,
//                 preferredContact: req.body.preferredContact,
//                 previousReports: req.body.previousReports,
//             });

//             res.status(201).json({
//                 success: true,
//                 message: "Complaint submitted successfully!",
//                 data: report,
//             });
//         } catch (error) {
//             console.error("Report Submission Error:", error);
//             res.status(500).json({
//                 success: false,
//                 message: "Server Error",
//                 error: error.message,
//             });
//         }
//     }
// );

// // =========================================================================
// // @desc      SUBMIT FEEDBACK FOR A COMPLETED REPORT
// // @route     PUT /api/reports/:reportId/feedback
// // @access    Private (requires login)
// // =========================================================================
// router.put(
//     "/:reportId/feedback",
//     protect,
//     [
//         param("reportId").isMongoId().withMessage("Invalid Report ID"),
//         body("serviceRating").isInt({ min: 1, max: 5 }).withMessage("Service rating must be between 1 and 5."),
//         // ✅ FIX: workerRating is now optional to handle cases with no assigned worker.
//         body("workerRating").optional().isInt({ min: 0, max: 5 }).withMessage("Worker rating must be between 1 and 5."),
//         body("comments").optional().isString().trim().isLength({ max: 500 }).withMessage("Comments cannot exceed 500 characters."),
//     ],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ success: false, errors: errors.array() });
//         }

//         try {
//             const { serviceRating, workerRating, comments } = req.body;
//             const { reportId } = req.params;

//             const report = await Report.findOne({ _id: reportId, reporter: req.user._id });

//             if (!report) {
//                 return res.status(404).json({ success: false, message: "Report not found or you are not authorized to review it." });
//             }
//             if (report.status !== 'completed') {
//                 return res.status(400).json({ success: false, message: "You can only submit feedback for completed reports." });
//             }
//             if (report.feedback && report.feedback.submittedAt) {
//                 return res.status(400).json({ success: false, message: "Feedback has already been submitted for this report." });
//             }

//             report.feedback = { serviceRating, workerRating, comments, submittedAt: new Date() };
            
//             // If a worker rating was provided and is not 0, update the corresponding task
//             if (workerRating && workerRating > 0) {
//                 const task = await Task.findOne({ report: report._id });
//                 if (task) {
//                     task.qualityRating = workerRating;
//                     await task.save();
//                 }
//             }
            
//             await report.save();

//             res.status(200).json({
//                 success: true,
//                 message: "Thank you for your feedback!",
//             });

//         } catch (error) {
//             console.error("Feedback submission error:", error);
//             res.status(500).json({ success: false, message: "Server Error: Could not submit feedback." });
//         }
//     }
// );

// module.exports = router;








const express = require("express");
const { body, param, validationResult } = require("express-validator");
const multer = require("multer");
const Report = require("../models/Report");
const Task = require("../models/Task"); // Required for updating worker rating
const { protect } = require("../middleware/auth");
const axios = require("axios"); // Required for the geocode function

const router = express.Router();

// Configure multer for in-memory storage.
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function geocodeAddress(address) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            { params: { address, key: apiKey } }
        );

        if (response.data.status === "OK" && response.data.results.length > 0) {
            const loc = response.data.results[0].geometry.location;
            return [loc.lng, loc.lat]; // GeoJSON format
        }
    } catch (error) {
        console.error("Geocoding failed:", error.message);
    }
    return [0, 0]; // fallback if geocoding fails
}

// =========================================================================
// @desc      GET ALL REPORTS FOR THE LOGGED-IN USER (with worker details)
// @route     GET /api/reports
// @access    Private (requires login)
// =========================================================================
router.get("/", protect, async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Authentication required." });
        }
        // ✅ UPDATED: This query now populates the assigned worker's details.
        const reports = await Report.find({ reporter: req.user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "assignedWorker",
                select: "name workerDetails" // Selects the worker's name and details
            });
            
        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        console.error("🔥 Error fetching reports for user:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Could not retrieve reports.",
            error: error.message,
        });
    }
});

// =========================================================================
// @desc      SUBMIT NEW WASTE REPORT
// @route     POST /api/reports
// @access    Private (requires login)
// =========================================================================
router.post(
    "/",
    protect,
    upload.single("images"),
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("email").isEmail().withMessage("A valid email is required"),
        body("phone").notEmpty().withMessage("Phone number is required"),
        body("address").notEmpty().withMessage("Address is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("state").notEmpty().withMessage("State is required"),
        body("pincode").notEmpty().withMessage("Pincode is required"),
        body("wasteType").notEmpty().withMessage("Waste type is required"),
        body("wasteAmount").notEmpty().withMessage("Waste amount is required"),
        body("urgency").notEmpty().withMessage("Urgency is required"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            if (!req.user) {
                return res.status(401).json({ success: false, message: "Authentication error" });
            }

            const complaintId = `CMP${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            let coordinates = [0, 0];

            if (req.body.gpsCoordinates?.lat && req.body.gpsCoordinates?.lng) {
                coordinates = [req.body.gpsCoordinates.lng, req.body.gpsCoordinates.lat];
            } else if (req.body.address) {
                coordinates = await geocodeAddress(req.body.address);
            }

            const report = await Report.create({
                reporter: req.user._id,
                complaintId,
                fullName: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone,
                altPhone: req.body.altPhone,
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode,
                state: req.body.state,
                location: {
                    type: "Point",
                    coordinates,
                    address: req.body.address,
                },
                wasteType: req.body.wasteType,
                wasteAmount: req.body.wasteAmount,
                urgency: req.body.urgency,
                description: req.body.description,
                preferredContact: req.body.preferredContact,
                previousReports: req.body.previousReports,
            });

            res.status(201).json({
                success: true,
                message: "Complaint submitted successfully!",
                data: report,
            });
        } catch (error) {
            console.error("Report Submission Error:", error);
            res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message,
            });
        }
    }
);

// =========================================================================
// @desc      Share user location with assigned worker
// @route     POST /api/reports/location-share
// @access    Private
// =========================================================================
router.post(
  "/location-share",
  protect,
  [
    body("complaintId").isMongoId().withMessage("Valid complaint ID is required"),
    body("location.lat").isFloat({ min: -90, max: 90 }).withMessage("Valid latitude is required"),
    body("location.lng").isFloat({ min: -180, max: 180 }).withMessage("Valid longitude is required")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { complaintId, location } = req.body;
      const userId = req.user.id;

      // Find the report and verify user ownership
      const report = await Report.findOne({ 
        _id: complaintId, 
        reporter: userId 
      }).populate("assignedWorker", "name");

      if (!report) {
        return res.status(404).json({ 
          success: false, 
          message: "Complaint not found or access denied" 
        });
      }

      if (!report.assignedWorker) {
        return res.status(400).json({ 
          success: false, 
          message: "No worker assigned to this complaint yet" 
        });
      }

      // Update report with user's shared location
      report.userSharedLocation = {
        coordinates: [location.lng, location.lat],
        address: location.address || "User shared location",
        timestamp: new Date(),
        accuracy: location.accuracy
      };

      // Add to timeline
      report.timeline.push({
        status: "location_shared",
        timestamp: new Date(),
        updatedBy: userId,
        notes: `User shared their current location with worker`
      });

      await report.save();

      res.json({
        success: true,
        message: "Location shared successfully with assigned worker",
        data: {
          location: report.userSharedLocation,
          worker: {
            name: report.assignedWorker.name,
            id: report.assignedWorker._id
          }
        }
      });

    } catch (error) {
      console.error("Location sharing error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to share location",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      });
    }
  }
);

// =========================================================================
// @desc      Report an issue to admin
// @route     POST /api/reports/issue
// @access    Private
// =========================================================================
router.post(
  "/issue",
  protect,
  [
    body("complaintId").isMongoId().withMessage("Valid complaint ID is required"),
    body("issueType").notEmpty().withMessage("Issue type is required"),
    body("description").notEmpty().withMessage("Description is required")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { complaintId, issueType, description, workerId } = req.body;
      const userId = req.user.id;

      // Find the report and verify user ownership
      const report = await Report.findOne({ 
        _id: complaintId, 
        reporter: userId 
      });

      if (!report) {
        return res.status(404).json({ 
          success: false, 
          message: "Complaint not found or access denied" 
        });
      }

      // Create issue report (you might want to create an Issue model)
      // For now, we'll add it to the report timeline
      report.timeline.push({
        status: "issue_reported",
        timestamp: new Date(),
        updatedBy: userId,
        notes: `Issue Reported: ${issueType} - ${description}`
      });

      await report.save();

      // Here you would typically:
      // 1. Create a notification for admin
      // 2. Send email to admin
      // 3. Log the issue in a separate collection

      res.json({
        success: true,
        message: "Issue reported successfully to admin",
        data: {
          complaintId: report._id,
          issueType,
          description,
          reportedAt: new Date()
        }
      });

    } catch (error) {
      console.error("Issue reporting error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to report issue",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      });
    }
  }
);

// =========================================================================
// @desc      Get worker location for a specific complaint
// @route     GET /api/reports/:complaintId/worker-location
// @access    Private
// =========================================================================
router.get(
  "/:complaintId/worker-location",
  protect,
  [
    param("complaintId").isMongoId().withMessage("Valid complaint ID is required")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { complaintId } = req.params;
      const userId = req.user.id;

      // Find report and verify user is the reporter
      const report = await Report.findOne({ 
        _id: complaintId, 
        reporter: userId 
      }).populate("assignedWorker", "name workerDetails isActive");

      if (!report) {
        return res.status(404).json({ 
          success: false, 
          message: "Complaint not found or access denied" 
        });
      }

      if (!report.assignedWorker) {
        return res.status(404).json({ 
          success: false, 
          message: "No worker assigned to this complaint" 
        });
      }

      // Check if worker location is available and recent (within 15 minutes)
      const worker = report.assignedWorker;
      const location = worker.workerDetails?.currentLocation;
      const locationTimestamp = location?.timestamp;
      
      if (!location || !locationTimestamp) {
        return res.status(404).json({ 
          success: false, 
          message: "Worker location not available" 
        });
      }

      const locationAge = Date.now() - new Date(locationTimestamp).getTime();
      const isLocationRecent = locationAge < 15 * 60 * 1000; // 15 minutes

      if (!isLocationRecent) {
        return res.status(404).json({ 
          success: false, 
          message: "Worker location is not recent" 
        });
      }

      // Calculate distance if user also shared their location
      let distance = null;
      if (report.userSharedLocation) {
        const userLat = report.userSharedLocation.coordinates[1];
        const userLng = report.userSharedLocation.coordinates[0];
        const workerLat = location.latitude;
        const workerLng = location.longitude;
        
        // Simple distance calculation (Haversine formula)
        const R = 6371; // Earth's radius in km
        const dLat = (workerLat - userLat) * Math.PI / 180;
        const dLng = (workerLng - userLng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(userLat * Math.PI / 180) * Math.cos(workerLat * Math.PI / 180) * 
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c; // Distance in km
      }

      res.json({
        success: true,
        data: {
          worker: {
            id: worker._id,
            name: worker.name,
            isActive: worker.isActive
          },
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp,
            isRecent: isLocationRecent,
            lastUpdated: new Date(location.timestamp).toISOString()
          },
          distance: distance ? Math.round(distance * 10) / 10 : null, // 1 decimal place
          complaint: {
            id: report._id,
            status: report.status
          }
        }
      });

    } catch (error) {
      console.error("Get worker location error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch worker location",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      });
    }
  }
);

// =========================================================================
// @desc      SUBMIT FEEDBACK FOR A COMPLETED REPORT
// @route     PUT /api/reports/:reportId/feedback
// @access    Private (requires login)
// =========================================================================
router.put(
    "/:reportId/feedback",
    protect,
    [
        param("reportId").isMongoId().withMessage("Invalid Report ID"),
        body("serviceRating").isInt({ min: 1, max: 5 }).withMessage("Service rating must be between 1 and 5."),
        // ✅ FIX: workerRating is now optional to handle cases with no assigned worker.
        body("workerRating").optional().isInt({ min: 0, max: 5 }).withMessage("Worker rating must be between 1 and 5."),
        body("comments").optional().isString().trim().isLength({ max: 500 }).withMessage("Comments cannot exceed 500 characters."),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { serviceRating, workerRating, comments } = req.body;
            const { reportId } = req.params;

            const report = await Report.findOne({ _id: reportId, reporter: req.user._id });

            if (!report) {
                return res.status(404).json({ success: false, message: "Report not found or you are not authorized to review it." });
            }
            if (report.status !== 'completed') {
                return res.status(400).json({ success: false, message: "You can only submit feedback for completed reports." });
            }
            if (report.feedback && report.feedback.submittedAt) {
                return res.status(400).json({ success: false, message: "Feedback has already been submitted for this report." });
            }

            report.feedback = { serviceRating, workerRating, comments, submittedAt: new Date() };
            
            // If a worker rating was provided and is not 0, update the corresponding task
            if (workerRating && workerRating > 0) {
                const task = await Task.findOne({ report: report._id });
                if (task) {
                    task.qualityRating = workerRating;
                    await task.save();
                }
            }
            
            await report.save();

            res.status(200).json({
                success: true,
                message: "Thank you for your feedback!",
            });

        } catch (error) {
            console.error("Feedback submission error:", error);
            res.status(500).json({ success: false, message: "Server Error: Could not submit feedback." });
        }
    }
);

module.exports = router;