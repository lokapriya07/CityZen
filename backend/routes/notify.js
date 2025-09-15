// routes/notifications.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

// Get all notifications for logged-in user
router.get("/", protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .populate("sender", "name role");

        res.json({ success: true, count: notifications.length, data: notifications });
    } catch (err) {
        console.error("GET /api/notifications error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Mark one as read
router.patch("/:id/read", protect, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { read: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, data: notification });
    } catch (err) {
        console.error("PATCH /api/notifications/:id/read error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Mark all as read
router.patch("/read-all", protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { read: true, readAt: new Date() }
        );
        res.json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
        console.error("PATCH /api/notifications/read-all error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Delete one
router.delete("/:id", protect, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id,
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: "Notification deleted" });
    } catch (err) {
        console.error("DELETE /api/notifications/:id error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Clear all
router.delete("/", protect, async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user.id });
        res.json({ success: true, message: "All notifications cleared" });
    } catch (err) {
        console.error("DELETE /api/notifications error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
