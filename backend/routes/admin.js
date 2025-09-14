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

/**
 * Helper function: update Analytics doc for today
 */
async function updateAnalytics(updates) {
  const today = new Date(new Date().setHours(0, 0, 0, 0))

  await Analytics.findOneAndUpdate(
    { date: today },
    {
      $setOnInsert: { date: today },
      $inc: updates, // increment fields dynamically
    },
    { upsert: true, new: true }
  )
}

// @desc    Get dashboard overview statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get("/dashboard", async (req, res) => {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

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

    const recentReports = await Report.find()
      .populate("reporter", "name email")
      .populate("assignedWorker", "name workerDetails.employeeId")
      .sort({ createdAt: -1 })
      .limit(10)

    const priorityStats = await Report.aggregate([
      { $group: { _id: "$urgency", count: { $sum: 1 } } },
    ])

    const wasteTypeStats = await Report.aggregate([
      { $group: { _id: "$wasteType", count: { $sum: 1 } } },
    ])

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
            $multiply: [
              { $divide: ["$completedReports", "$totalReports"] },
              100,
            ],
          },
          avgRating: { $round: ["$avgRating", 1] },
        },
      },
      { $sort: { totalReports: -1 } },
      { $limit: 10 },
    ])

    const completionRate =
      totalReports > 0
        ? Math.round((completedReports / totalReports) * 100)
        : 0

    const avgResponseTime = 2.5 // mock

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
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    })
  }
})

// @desc    Get all workers with their performance
router.get("/workers", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, department } = req.query

    const filter = { role: "worker" }
    if (status) filter.isActive = status === "active"
    if (department) filter["workerDetails.department"] = department

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const workers = await User.find(filter)
      .select("-password")
      .sort({ "workerDetails.rating": -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const workersWithStats = await Promise.all(
      workers.map(async (worker) => {
        const [assignedTasks, completedTasks, avgRating] = await Promise.all([
          Task.countDocuments({ assignedWorker: worker._id }),
          Task.countDocuments({
            assignedWorker: worker._id,
            status: "completed",
          }),
          Task.aggregate([
            {
              $match: {
                assignedWorker: worker._id,
                qualityRating: { $exists: true },
              },
            },
            {
              $group: { _id: null, avgRating: { $avg: "$qualityRating" } },
            },
          ]),
        ])

        return {
          ...worker.toObject(),
          stats: {
            assignedTasks,
            completedTasks,
            completionRate:
              assignedTasks > 0
                ? Math.round((completedTasks / assignedTasks) * 100)
                : 0,
            avgRating:
              avgRating.length > 0
                ? Math.round(avgRating[0].avgRating * 10) / 10
                : 0,
          },
        }
      })
    )

    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      data: {
        workers: workersWithStats,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Get workers error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch workers",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    })
  }
})

// @desc    Assign report to worker (updates Analytics)
// @route   PUT /api/admin/reports/:reportId/assign
router.put(
  "/reports/:reportId/assign",
  [
    param("reportId").isMongoId().withMessage("Invalid report ID"),
    body("workerId").isMongoId().withMessage("Invalid worker ID"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { workerId } = req.body

      const report = await Report.findById(req.params.reportId)
      if (!report) {
        return res
          .status(404)
          .json({ success: false, message: "Report not found" })
      }

      const worker = await User.findOne({
        _id: workerId,
        role: "worker",
        isActive: true,
      })
      if (!worker) {
        return res
          .status(404)
          .json({ success: false, message: "Worker not found or inactive" })
      }

      report.assignedWorker = workerId
      report.status = "assigned"
      report.assignedAt = new Date()

      report.timeline.push({
        status: "assigned",
        timestamp: new Date(),
        updatedBy: req.user.id,
        notes: `Assigned to ${worker.name}`,
      })

      await report.save()

      const task = new Task({
        report: report._id,
        assignedWorker: workerId,
        assignedBy: req.user.id,
        title: report.title || "Report Task",
        description: report.description || "",
        priority: report.urgency || "medium",
        status: "assigned",
        location: report.location || {},
      })

      await task.save()

      // 🔥 Update analytics
      await updateAnalytics({ reportsReceived: 1, tasksAssigned: 1 })

      res.json({
        success: true,
        message: "Report assigned and task created successfully",
        data: { report, task },
      })
    } catch (error) {
      console.error("Assign report error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to assign report",
        error: error.message,
      })
    }
  }
)


// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
// GET /analytics
router.get("/analytics", async (req, res) => {
  try {
    const { period = "week", startDate, endDate } = req.query

    // Helper: build a range filter on a given field (createdAt / completedAt)
    function buildDateRangeFilter({ period = "week", startDate, endDate, field = "createdAt" }) {
      if (startDate && endDate) {
        return {
          [field]: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        }
      }

      const now = new Date()
      let start

      switch (period) {
        case "today":
          start = new Date()
          start.setHours(0, 0, 0, 0)
          break
        case "week":
          start = new Date()
          start.setDate(start.getDate() - 7)
          start.setHours(0, 0, 0, 0)
          break
        case "month":
          start = new Date()
          start.setMonth(start.getMonth() - 1)
          start.setHours(0, 0, 0, 0)
          break
        case "year":
          start = new Date()
          start.setFullYear(start.getFullYear() - 1)
          start.setHours(0, 0, 0, 0)
          break
        default:
          start = new Date()
          start.setDate(start.getDate() - 7)
          start.setHours(0, 0, 0, 0)
      }

      return { [field]: { $gte: start } }
    }

    // Build filters:
    const reportCreatedFilter = buildDateRangeFilter({ period, startDate, endDate, field: "createdAt" })
    const reportCompletedFilter = buildDateRangeFilter({ period, startDate, endDate, field: "completedAt" })
    const taskCompletedFilter = buildDateRangeFilter({ period, startDate, endDate, field: "completedAt" })

    // TIME SERIES: counts of reports grouped by creation time (change to completedAt if you prefer)
    const timeSeriesFormat = period === "today" ? "%H:00" : period === "week" ? "%Y-%m-%d" : "%Y-%m"
    const timeSeriesData = await Report.aggregate([
      { $match: reportCreatedFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timeSeriesFormat,
              date: "$createdAt",
            },
          },
          reports: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // PERFORMANCE METRICS: consider only reports completed within the selected range (match on completedAt)
    const performanceMetricsAgg = await Report.aggregate([
      { $match: { ...reportCompletedFilter, status: "completed" } },
      {
        $group: {
          _id: null,
          avgCompletionTime: {
            // difference between completedAt and createdAt in hours
            $avg: {
              $divide: [{ $subtract: ["$completedAt", "$createdAt"] }, 1000 * 60 * 60],
            },
          },
          avgRating: { $avg: "$feedback.rating" },
          totalCompleted: { $sum: 1 },
        },
      },
    ])

    const performanceMetrics = performanceMetricsAgg[0] || {
      avgCompletionTime: 0,
      avgRating: 0,
      totalCompleted: 0,
    }

    // WORKER PERFORMANCE: tasks completed within selected range (match on completedAt)
    const workerPerformance = await Task.aggregate([
      { $match: { ...taskCompletedFilter, status: "completed" } },
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

    // ENVIRONMENTAL IMPACT (mock)
    const environmentalImpact = {
      wasteCollected: 1250, // kg
      recycledWaste: 875, // kg
      carbonFootprintReduced: 450, // kg CO2
    }

    res.json({
      success: true,
      data: {
        timeSeriesData,
        performanceMetrics,
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
