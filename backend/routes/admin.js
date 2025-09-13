const express = require("express")
const { body, query, param } = require("express-validator")
const Report = require("../models/Report")
const User = require("../models/User")
const Task = require("../models/Task")
const Analytics = require("../models/Analytics")
const { protect, authorize } = require("../middleware/auth")
const { handleValidationErrors } = require("../middleware/validation")

const router = express.Router()

// All routes are admin-only
router.use(protect)
router.use(authorize("admin"))

// @desc    Get dashboard overview statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get("/dashboard", async (req, res) => {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Get basic counts
    const [
      totalReports,
      pendingReports,
      inProgressReports,
      completedReports,
      totalWorkers,
      activeWorkers,
      totalUsers,
      todayReports,
      weekReports,
      monthReports,
    ] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      Report.countDocuments({ status: "in-progress" }),
      Report.countDocuments({ status: "completed" }),
      User.countDocuments({ role: "worker" }),
      User.countDocuments({ role: "worker", isActive: true }),
      User.countDocuments({ role: "user" }),
      Report.countDocuments({ createdAt: { $gte: startOfDay } }),
      Report.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Report.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ])

    // Get recent reports
    const recentReports = await Report.find()
      .populate("reporter", "name email")
      .populate("assignedWorker", "name workerDetails.employeeId")
      .sort({ createdAt: -1 })
      .limit(10)

    // Get priority distribution
    const priorityStats = await Report.aggregate([
      {
        $group: {
          _id: "$urgency",
          count: { $sum: 1 },
        },
      },
    ])

    // Get waste type distribution
    const wasteTypeStats = await Report.aggregate([
      {
        $group: {
          _id: "$wasteType",
          count: { $sum: 1 },
        },
      },
    ])

    // Get area-wise statistics
    const areaStats = await Report.aggregate([
      {
        $group: {
          _id: "$location.area",
          totalReports: { $sum: 1 },
          completedReports: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          avgRating: { $avg: "$feedback.rating" },
        },
      },
      {
        $project: {
          area: "$_id",
          totalReports: 1,
          completedReports: 1,
          completionRate: {
            $multiply: [{ $divide: ["$completedReports", "$totalReports"] }, 100],
          },
          avgRating: { $round: ["$avgRating", 1] },
        },
      },
      { $sort: { totalReports: -1 } },
      { $limit: 10 },
    ])

    // Calculate completion rate
    const completionRate = totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0

    // Calculate average response time (mock calculation)
    const avgResponseTime = 2.5 // hours

    res.json({
      success: true,
      data: {
        overview: {
          totalReports,
          pendingReports,
          inProgressReports,
          completedReports,
          completionRate,
          totalWorkers,
          activeWorkers,
          totalUsers,
          avgResponseTime,
        },
        trends: {
          today: todayReports,
          thisWeek: weekReports,
          thisMonth: monthReports,
        },
        recentReports,
        statistics: {
          priorityDistribution: priorityStats,
          wasteTypeDistribution: wasteTypeStats,
          areaStats,
        },
      },
    })
  } catch (error) {
    console.error("Dashboard data error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// @desc    Get all workers with their performance
// @route   GET /api/admin/workers
// @access  Private (Admin)
router.get("/workers", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, department } = req.query

    const filter = { role: "worker" }
    if (status) filter.isActive = status === "active"
    if (department) filter["workerDetails.department"] = department

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const workers = await User.find(filter)
      .select("-password")
      .sort({ "workerDetails.rating": -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get task statistics for each worker
    const workersWithStats = await Promise.all(
      workers.map(async (worker) => {
        const [assignedTasks, completedTasks, avgRating] = await Promise.all([
          Task.countDocuments({ assignedWorker: worker._id }),
          Task.countDocuments({ assignedWorker: worker._id, status: "completed" }),
          Task.aggregate([
            { $match: { assignedWorker: worker._id, qualityRating: { $exists: true } } },
            { $group: { _id: null, avgRating: { $avg: "$qualityRating" } } },
          ]),
        ])

        return {
          ...worker.toObject(),
          stats: {
            assignedTasks,
            completedTasks,
            completionRate: assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0,
            avgRating: avgRating.length > 0 ? Math.round(avgRating[0].avgRating * 10) / 10 : 0,
          },
        }
      }),
    )

    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      data: {
        workers: workersWithStats,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / Number.parseInt(limit)),
          total,
          limit: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Get workers error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch workers",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// @desc    Assign report to worker
// @route   PUT /api/admin/reports/:reportId/assign
// @access  Private (Admin)
router.put(
  "/reports/:reportId/assign",
  [
    param("reportId").isMongoId().withMessage("Invalid report ID"),
    body("workerId").isMongoId().withMessage("Invalid worker ID"),
    body("estimatedCompletionTime").optional().isISO8601().withMessage("Invalid completion time"),
    body("notes").optional().isLength({ max: 500 }).withMessage("Notes cannot exceed 500 characters"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { workerId, estimatedCompletionTime, notes } = req.body

      // Check if report exists
      const report = await Report.findById(req.params.reportId)
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        })
      }

      // Check if worker exists and is active
      const worker = await User.findOne({ _id: workerId, role: "worker", isActive: true })
      if (!worker) {
        return res.status(404).json({
          success: false,
          message: "Worker not found or inactive",
        })
      }

      // Update report
      report.assignedWorker = workerId
      report.assignedAt = new Date()
      report.status = "assigned"
      if (estimatedCompletionTime) {
        report.estimatedCompletionTime = new Date(estimatedCompletionTime)
      }

      // Add timeline entry
      report.timeline.push({
        status: "assigned",
        timestamp: new Date(),
        updatedBy: req.user.id,
        notes: notes || `Assigned to ${worker.name}`,
      })

      await report.save()

      // Create task for worker
      const task = await Task.create({
        report: report._id,
        assignedWorker: workerId,
        assignedBy: req.user.id,
        title: `${report.wasteType} waste cleanup - ${report.location.area}`,
        description: report.description,
        priority: report.urgency,
        location: report.location,
        estimatedDuration: 60, // Default 1 hour
      })

      await report.populate("assignedWorker", "name email workerDetails.employeeId")

      res.json({
        success: true,
        message: "Report assigned successfully",
        data: {
          report,
          task: {
            id: task._id,
            taskId: task.taskId,
          },
        },
      })
    } catch (error) {
      console.error("Assign report error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to assign report",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
router.get("/analytics", async (req, res) => {
  try {
    const { period = "week", startDate, endDate } = req.query

    let dateFilter = {}
    const now = new Date()

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }
    } else {
      switch (period) {
        case "today":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setHours(0, 0, 0, 0)),
            },
          }
          break
        case "week":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setDate(now.getDate() - 7)),
            },
          }
          break
        case "month":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setMonth(now.getMonth() - 1)),
            },
          }
          break
        case "year":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setFullYear(now.getFullYear() - 1)),
            },
          }
          break
      }
    }

    // Get time series data for reports
    const timeSeriesData = await Report.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === "today" ? "%H:00" : period === "week" ? "%Y-%m-%d" : "%Y-%m",
              date: "$createdAt",
            },
          },
          reports: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get performance metrics
    const performanceMetrics = await Report.aggregate([
      { $match: { ...dateFilter, status: "completed" } },
      {
        $group: {
          _id: null,
          avgCompletionTime: {
            $avg: {
              $divide: [{ $subtract: ["$completedAt", "$createdAt"] }, 1000 * 60 * 60], // hours
            },
          },
          avgRating: { $avg: "$feedback.rating" },
          totalCompleted: { $sum: 1 },
        },
      },
    ])

    // Get worker performance
    const workerPerformance = await Task.aggregate([
      { $match: { ...dateFilter, status: "completed" } },
      {
        $group: {
          _id: "$assignedWorker",
          completedTasks: { $sum: 1 },
          avgRating: { $avg: "$qualityRating" },
          avgDuration: { $avg: "$actualDuration" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "worker",
        },
      },
      { $unwind: "$worker" },
      {
        $project: {
          workerName: "$worker.name",
          employeeId: "$worker.workerDetails.employeeId",
          completedTasks: 1,
          avgRating: { $round: ["$avgRating", 1] },
          avgDuration: { $round: ["$avgDuration", 0] },
        },
      },
      { $sort: { completedTasks: -1 } },
      { $limit: 10 },
    ])

    // Get environmental impact (mock data)
    const environmentalImpact = {
      wasteCollected: 1250, // kg
      recycledWaste: 875, // kg
      carbonFootprintReduced: 450, // kg CO2
    }

    res.json({
      success: true,
      data: {
        timeSeriesData,
        performanceMetrics: performanceMetrics[0] || {
          avgCompletionTime: 0,
          avgRating: 0,
          totalCompleted: 0,
        },
        workerPerformance,
        environmentalImpact,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// @desc    Update worker status
// @route   PUT /api/admin/workers/:workerId/status
// @access  Private (Admin)
router.put(
  "/workers/:workerId/status",
  [
    param("workerId").isMongoId().withMessage("Invalid worker ID"),
    body("isActive").isBoolean().withMessage("Status must be boolean"),
    body("reason").optional().isLength({ max: 200 }).withMessage("Reason cannot exceed 200 characters"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { isActive, reason } = req.body

      const worker = await User.findOne({ _id: req.params.workerId, role: "worker" })
      if (!worker) {
        return res.status(404).json({
          success: false,
          message: "Worker not found",
        })
      }

      worker.isActive = isActive
      await worker.save()

      res.json({
        success: true,
        message: `Worker ${isActive ? "activated" : "deactivated"} successfully`,
        data: {
          worker: {
            id: worker._id,
            name: worker.name,
            email: worker.email,
            isActive: worker.isActive,
          },
        },
      })
    } catch (error) {
      console.error("Update worker status error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update worker status",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// @desc    Get system health and statistics
// @route   GET /api/admin/system-health
// @access  Private (Admin)
router.get("/system-health", async (req, res) => {
  try {
    const [totalUsers, activeUsers, totalReports, pendingReports, totalWorkers, activeWorkers, systemUptime] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Report.countDocuments(),
        Report.countDocuments({ status: "pending" }),
        User.countDocuments({ role: "worker" }),
        User.countDocuments({ role: "worker", isActive: true }),
        Promise.resolve(process.uptime()),
      ])

    // Calculate system health score (mock calculation)
    const healthScore = Math.min(
      100,
      Math.round((activeWorkers / totalWorkers) * 50 + ((totalReports - pendingReports) / totalReports) * 50),
    )

    res.json({
      success: true,
      data: {
        systemHealth: {
          score: healthScore,
          status: healthScore > 80 ? "excellent" : healthScore > 60 ? "good" : healthScore > 40 ? "fair" : "poor",
          uptime: Math.round(systemUptime / 3600), // hours
        },
        metrics: {
          totalUsers,
          activeUsers,
          totalReports,
          pendingReports,
          totalWorkers,
          activeWorkers,
          workerUtilization: totalWorkers > 0 ? Math.round((activeWorkers / totalWorkers) * 100) : 0,
        },
      },
    })
  } catch (error) {
    console.error("System health error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch system health",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

module.exports = router
