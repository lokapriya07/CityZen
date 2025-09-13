const express = require("express")
const { body, param } = require("express-validator")
const Task = require("../models/Task")
const Report = require("../models/Report")
const User = require("../models/User")
const { protect, authorize } = require("../middleware/auth")
const { handleValidationErrors } = require("../middleware/validation")

const router = express.Router()

// All routes are worker-only
router.use(protect)
router.use(authorize("worker"))

// @desc    Get worker dashboard data
// @route   GET /api/worker/dashboard
// @access  Private (Worker)
router.get("/dashboard", async (req, res) => {
  try {
    const workerId = req.user.id

    // Get task statistics
    const [assignedTasks, completedTasks, inProgressTasks, todayTasks, weekTasks, avgRating] = await Promise.all([
      Task.countDocuments({ assignedWorker: workerId }),
      Task.countDocuments({ assignedWorker: workerId, status: "completed" }),
      Task.countDocuments({ assignedWorker: workerId, status: { $in: ["accepted", "on-the-way", "in-progress"] } }),
      Task.countDocuments({
        assignedWorker: workerId,
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Task.countDocuments({
        assignedWorker: workerId,
        createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
      }),
      Task.aggregate([
        { $match: { assignedWorker: workerId, qualityRating: { $exists: true } } },
        { $group: { _id: null, avgRating: { $avg: "$qualityRating" } } },
      ]),
    ])

    // Get recent tasks
    const recentTasks = await Task.find({ assignedWorker: workerId })
      .populate("report", "reportId location wasteType urgency description")
      .sort({ createdAt: -1 })
      .limit(10)

    // Calculate performance metrics
    const completionRate = assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0
    const averageRating = avgRating.length > 0 ? Math.round(avgRating[0].avgRating * 10) / 10 : 0

    // Get worker's badges and achievements
    const worker = await User.findById(workerId).select("workerDetails")

    res.json({
      success: true,
      data: {
        overview: {
          assignedTasks,
          completedTasks,
          inProgressTasks,
          completionRate,
          averageRating,
        },
        trends: {
          today: todayTasks,
          thisWeek: weekTasks,
        },
        recentTasks,
        achievements: {
          badges: worker.workerDetails?.badges || [],
          totalPoints: completedTasks * 10, // 10 points per completed task
        },
      },
    })
  } catch (error) {
    console.error("Worker dashboard error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// @desc    Get worker's assigned tasks
// @route   GET /api/worker/tasks
// @access  Private (Worker)
router.get("/tasks", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const workerId = req.user.id

    const filter = { assignedWorker: workerId }
    if (status) filter.status = status

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const tasks = await Task.find(filter)
      .populate("report", "reportId location wasteType urgency description images priority")
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Task.countDocuments(filter)

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / Number.parseInt(limit)),
          total,
          limit: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Get worker tasks error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// @desc    Update task status
// @route   PUT /api/worker/tasks/:taskId/status
// @access  Private (Worker)
router.put(
  "/tasks/:taskId/status",
  [
    param("taskId").isMongoId().withMessage("Invalid task ID"),
    body("status")
      .isIn(["accepted", "on-the-way", "in-progress", "completed", "rejected"])
      .withMessage("Invalid status"),
    body("message").optional().isLength({ max: 500 }).withMessage("Message cannot exceed 500 characters"),
    body("location.lat").optional().isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
    body("location.lng").optional().isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { status, message, location } = req.body
      const workerId = req.user.id

      const task = await Task.findOne({ _id: req.params.taskId, assignedWorker: workerId })
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found or not assigned to you",
        })
      }

      // Update task status
      const previousStatus = task.status
      task.status = status

      // Set timestamps based on status
      if (status === "accepted" && previousStatus === "assigned") {
        task.startedAt = new Date()
      } else if (status === "completed") {
        task.completedAt = new Date()
        if (task.startedAt) {
          task.actualDuration = Math.round((new Date() - task.startedAt) / (1000 * 60)) // minutes
        }
      }

      // Add worker update
      task.workerUpdates.push({
        status,
        message: message || `Status updated to ${status}`,
        timestamp: new Date(),
        location: location || null,
      })

      await task.save()

      // Update corresponding report status
      const report = await Report.findById(task.report)
      if (report) {
        let reportStatus = report.status
        if (status === "accepted" || status === "on-the-way") {
          reportStatus = "assigned"
        } else if (status === "in-progress") {
          reportStatus = "in-progress"
        } else if (status === "completed") {
          reportStatus = "completed"
          report.completedAt = new Date()
        }

        if (reportStatus !== report.status) {
          report.status = reportStatus
          report.timeline.push({
            status: reportStatus,
            timestamp: new Date(),
            updatedBy: workerId,
            notes: `Task ${status} by worker`,
          })
          await report.save()
        }
      }

      await task.populate("report", "reportId location wasteType urgency")

      res.json({
        success: true,
        message: "Task status updated successfully",
        data: { task },
      })
    } catch (error) {
      console.error("Update task status error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update task status",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// @desc    Get worker performance metrics
// @route   GET /api/worker/performance
// @access  Private (Worker)
router.get("/performance", async (req, res) => {
  try {
    const workerId = req.user.id
    const { period = "month" } = req.query

    let dateFilter = {}
    const now = new Date()

    switch (period) {
      case "week":
        dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } }
        break
      case "month":
        dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } }
        break
      case "year":
        dateFilter = { createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } }
        break
    }

    // Get performance metrics
    const [taskStats, ratingStats, timeStats] = await Promise.all([
      Task.aggregate([
        { $match: { assignedWorker: workerId, ...dateFilter } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Task.aggregate([
        { $match: { assignedWorker: workerId, qualityRating: { $exists: true }, ...dateFilter } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$qualityRating" },
            totalRatings: { $sum: 1 },
          },
        },
      ]),
      Task.aggregate([
        { $match: { assignedWorker: workerId, actualDuration: { $exists: true }, ...dateFilter } },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: "$actualDuration" },
            totalTasks: { $sum: 1 },
          },
        },
      ]),
    ])

    // Format task statistics
    const taskStatistics = {
      assigned: 0,
      accepted: 0,
      "on-the-way": 0,
      "in-progress": 0,
      completed: 0,
      rejected: 0,
    }

    taskStats.forEach((stat) => {
      taskStatistics[stat._id] = stat.count
    })

    const totalTasks = Object.values(taskStatistics).reduce((sum, count) => sum + count, 0)
    const completionRate = totalTasks > 0 ? Math.round((taskStatistics.completed / totalTasks) * 100) : 0

    res.json({
      success: true,
      data: {
        taskStatistics,
        performance: {
          totalTasks,
          completionRate,
          averageRating: ratingStats.length > 0 ? Math.round(ratingStats[0].avgRating * 10) / 10 : 0,
          averageDuration: timeStats.length > 0 ? Math.round(timeStats[0].avgDuration) : 0,
          totalRatings: ratingStats.length > 0 ? ratingStats[0].totalRatings : 0,
        },
      },
    })
  } catch (error) {
    console.error("Worker performance error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch performance data",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

module.exports = router
