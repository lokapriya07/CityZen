const express = require("express");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const Report = require("../models/Report"); // Assuming your Mongoose model is named Report
const { protect } = require("../middleware/auth"); // Auth middleware for user verification

const router = express.Router();

// Configure multer for in-memory storage.
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =========================================================================
// @desc      GET ALL REPORTS FOR THE LOGGED-IN USER
// @route     GET /api/reports
// @access    Private (requires login)
// =========================================================================
router.get("/", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }
    const reports = await Report.find({ reporter: req.user._id }).sort({ createdAt: -1 });
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
    // Validation rules
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("wasteType").notEmpty().withMessage("Waste type is required"),
    body("wasteAmount").notEmpty().withMessage("Waste amount is required"),
    body("urgency").notEmpty().withMessage("Urgency is required"),

    // =========================================================================
    // MODIFIED: The validation for the description has been removed.
    // body("description")
    //   .isLength({ min: 10 })
    //   .withMessage("Description must be at least 10 characters long"),
    // =========================================================================
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("❌ Validation Errors:", errors.array());
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication error, user not found." });
      }

      const complaintId = `CMP${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
        gpsCoordinates: req.body.gpsCoordinates,
        wasteType: req.body.wasteType,
        wasteAmount: req.body.wasteAmount,
        urgency: req.body.urgency,
        description: req.body.description,
        preferredContact: req.body.preferredContact,
        previousReports: req.body.previousReports,
      });

      console.log("✅ Report Saved Successfully:", report._id);

      res.status(201).json({
        success: true,
        message: "Complaint submitted successfully!",
        data: report,
      });

    } catch (error) {
      console.error("🔥 Report Submission Error:", error);
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  }
);

// --- Make sure to export the router ---
module.exports = router;