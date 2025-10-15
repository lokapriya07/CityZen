const express = require("express");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const Report = require("../models/Report"); // Assuming your Mongoose model is named Report
const { protect } = require("../middleware/auth"); // Auth middleware for user verification

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
      // --- Validate input ---
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication error" });
      }

      const complaintId = `CMP${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // --- Determine coordinates ---
      let coordinates = [0, 0];

      if (req.body.gpsCoordinates?.lat && req.body.gpsCoordinates?.lng) {
        coordinates = [req.body.gpsCoordinates.lng, req.body.gpsCoordinates.lat];
      } else if (req.body.address) {
        coordinates = await geocodeAddress(req.body.address);
      }

      // --- Create report ---
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

        // ✅ GeoJSON location
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

// --- Make sure to export the router ---
module.exports = router;