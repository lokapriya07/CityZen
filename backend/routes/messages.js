// routes/messages.js
const express = require("express");
const Message = require("../models/Message");
const Task = require("../models/Task");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @desc    Get message history for a task
// @route   GET /api/messages/task/:taskId
// @access  Private
router.get("/task/:taskId", protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user has access to this task
    const task = await Task.findById(taskId)
      .populate("assignedWorker")
      .populate("report");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const hasAccess = 
      req.user.role === "admin" ||
      (req.user.role === "citizen" && task.report.createdBy.toString() === req.user.id) ||
      (req.user.role === "worker" && task.assignedWorker._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to task messages",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ taskId })
      .populate("sender", "name role avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ taskId });

    // Mark messages as read for current user
    await Message.updateMany(
      {
        taskId,
        receiver: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
router.get("/unread/count", protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false,
    });

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
    });
  }
});

module.exports = router;