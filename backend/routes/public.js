// routes/public.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ✅ Get worker location - NO AUTHENTICATION REQUIRED
router.get("/workers/:name/location", async (req, res) => {
    try {
        console.log(`📍 Location request for worker: ${req.params.name}`);

        const worker = await User.findOne({ name: req.params.name }).select(
            "name workerDetails.currentLocation"
        );

        if (!worker) {
            console.log(`❌ Worker not found: ${req.params.name}`);
            return res
                .status(404)
                .json({ success: false, message: "Worker not found." });
        }

        console.log(`✅ Worker found: ${worker.name}`);

        const { latitude, longitude, timestamp, address } =
            worker.workerDetails.currentLocation || {};

        if (!latitude || !longitude) {
            console.log(`ℹ️ No location data for worker: ${worker.name}`);
            return res.json({
                success: true,
                worker: worker.name,
                location: null,
                message: "Worker location not available"
            });
        }

        console.log(`📍 Location data found: ${latitude}, ${longitude}`);

        return res.json({
            success: true,
            worker: worker.name,
            location: {
                latitude,
                longitude,
                timestamp,
                address: address || "Location not specified"
            },
        });
    } catch (error) {
        console.error("❌ Error fetching worker location:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching location."
        });
    }
});

// Test route to verify public routes are working
router.get("/test", (req, res) => {
    console.log("✅ Public route test accessed");
    res.json({
        success: true,
        message: "Public routes are working!",
        timestamp: new Date().toISOString()
    });
});

module.exports = router;