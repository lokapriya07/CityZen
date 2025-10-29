const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User"); // Make sure to import your User model
const { protect } = require("../middleware/auth"); // Import your auth middleware

const router = express.Router();

// @desc     Get logged-in user profile (for points, name, etc.)
// @route    GET /api/users/profile
// @access   Private
router.get("/profile", protect, async (req, res) => {
    try {
        // 'protect' middleware should add the user object to req.user
        // We fetch the user from the DB to get the most up-to-date points
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // This is the format the frontend expects: { success: true, data: { ... } }
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                points: user.points || 0, // Default to 0 if points are null/undefined
                badges: user.badges,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ... you might have other routes here like login, register ...

module.exports = router;