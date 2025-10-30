const express = require("express");
const Message = require("../models/Message");
const Task = require("../models/Task");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @desc    Send a message (REST fallback)
// @route   POST /api/messages/send
// @access  Private
router.post("/send", protect, async (req, res) => {
  try {
    const { taskId, message, messageType = "text", location = null } = req.body;

    if (!taskId || !message) {
      return res.status(400).json({
        success: false,
        message: "Task ID and message are required",
      });
    }

    // Verify task exists with better population
    const task = await Task.findById(taskId)
      .populate("assignedWorker", "name role avatar")
      .populate("report", "createdBy location description");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Enhanced access control
    let hasAccess = false;

    if (req.user.role === "admin") {
      hasAccess = true;
    } else if (req.user.role === "citizen" || req.user.role === "user") {
      hasAccess = task.report?.createdBy?.toString() === req.user.id;
    } else if (req.user.role === "worker") {
      hasAccess = task.assignedWorker?._id?.toString() === req.user.id;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to send message for this task",
      });
    }

    // ✅ FIXED: Enhanced receiver determination
    let receiverId;
    const citizenId = task.report?.createdBy;
    const workerId = task.assignedWorker?._id;

    if (req.user.role === "citizen" || req.user.role === "user") {
      receiverId = workerId;
    } else if (req.user.role === "worker") {
      receiverId = citizenId;
    } else if (req.user.role === "admin") {
      receiverId = workerId || citizenId;
    }

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "No recipient found for this message",
      });
    }

    // Save message
    const newMessage = await Message.create({
      taskId,
      sender: req.user.id,
      receiver: receiverId,
      message: message.trim(),
      messageType,
      location: messageType === "location" ? location : null,
    });

    await newMessage.populate("sender", "name role avatar");

    res.json({
      success: true,
      data: {
        id: newMessage._id,
        taskId: newMessage.taskId,
        sender: {
          id: newMessage.sender._id,
          name: newMessage.sender.name,
          role: newMessage.sender.role,
          avatar: newMessage.sender.avatar,
        },
        receiver: newMessage.receiver,
        message: newMessage.message,
        messageType: newMessage.messageType,
        location: newMessage.location,
        createdAt: newMessage.createdAt,
        isRead: newMessage.isRead,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// @desc    Get message history for a task
// @route   GET /api/messages/task/:taskId
// @access  Private
router.get("/task/:taskId", protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { page = 1, limit = 100 } = req.query;

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
      (req.user.role === "user" && task.report.createdBy.toString() === req.user.id) ||
      (req.user.role === "worker" && task.assignedWorker._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to task messages",
      });
    }

    const messages = await Message.find({ taskId })
      .populate("sender", "name role avatar")
      .sort({ createdAt: 1 })
      .limit(parseInt(limit));

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
        messages: messages.map(msg => ({
          id: msg._id,
          taskId: msg.taskId,
          sender: {
            id: msg.sender._id,
            name: msg.sender.name,
            role: msg.sender.role,
            avatar: msg.sender.avatar,
          },
          receiver: msg.receiver,
          message: msg.message,
          messageType: msg.messageType,
          location: msg.location,
          createdAt: msg.createdAt,
          isRead: msg.isRead,
        })),
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