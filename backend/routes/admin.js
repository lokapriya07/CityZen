// const express = require("express")
// const mongoose = require("mongoose");
// const { body, query, param } = require("express-validator")
// const Report = require("../models/Report")
// const User = require("../models/User")
// const Task = require("../models/Task")
// const Analytics = require("../models/Analytics")
// const { protect, authorize } = require("../middleware/auth")
// const { handleValidationErrors } = require("../middleware/validation")

// const router = express.Router()

// router.use(protect)
// router.use(authorize("admin"))

// // @desc      Get dashboard overview statistics
// // @route     GET /api/admin/dashboard
// router.get("/dashboard", async (req, res) => {
//   try {
//     const [
//       overviewStats,
//       unassignedReports,
//       assignedTasks
//     ] = await Promise.all([
//       // Fetch all overview counts in a single aggregation for speed
//       Report.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalReports: { $sum: 1 },
//             pendingReports: { $sum: { $cond: [{ $in: ["$status", ["pending", "submitted"]] }, 1, 0] } },
//             inProgressReports: { $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] } },
//             completedReports: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
//           }
//         }
//       ]),
//       Report.find({
//         assignedWorker: { $exists: false },
//         status: { $in: ["submitted", "pending"] },
//       }).sort({ createdAt: -1 }).limit(10),
//       Task.find({
//         status: { $in: ["assigned", "in-progress", "accepted", "on-the-way"] },
//       }).populate("assignedWorker", "name").sort({ createdAt: -1 }).limit(10)
//     ]);

//     const [workerCounts] = await User.aggregate([
//         {
//             $group: {
//                 _id: null,
//                 totalWorkers: { $sum: { $cond: [{ $eq: ["$role", "worker"] }, 1, 0] } },
//                 activeWorkers: { $sum: { $cond: [{ $and: [{ $eq: ["$role", "worker"] }, { $eq: ["$isActive", true] }] }, 1, 0] } },
//                 totalUsers: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } },
//             }
//         }
//     ]);
    
//     const overview = { ...overviewStats[0], ...workerCounts };
//     delete overview._id; // Clean up the final object

//     res.json({
//       success: true,
//       data: {
//         overview,
//         unassignedReports,
//         assignedTasks,
//       },
//     })
//   } catch (error) {
//     console.error("Dashboard data error:", error)
//     res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
//   }
// })


// // @desc      Get all workers with their performance
// // @route     GET /api/admin/workers
// // ✅ THIS ENTIRE ROUTE HAS BEEN REWRITTEN FOR EFFICIENCY
// router.get("/workers", async (req, res) => {
//     try {
//         const { page = 1, limit = 20 } = req.query;
//         const skip = (parseInt(page) - 1) * parseInt(limit);

//         const workers = await User.aggregate([
//             // Step 1: Find only the users who are workers
//             { $match: { role: "worker" } },
//             // Step 2: Join with the 'tasks' collection to get all tasks for these workers
//             {
//                 $lookup: {
//                     from: "tasks",
//                     localField: "_id",
//                     foreignField: "assignedWorker",
//                     as: "tasks"
//                 }
//             },
//             // Step 3: Process the data for each worker
//             {
//                 $project: {
//                     name: 1,
//                     email: 1,
//                     isActive: 1,
//                     workerDetails: 1,
//                     stats: {
//                         assignedTasks: { $size: "$tasks" },
//                         completedTasks: {
//                             $size: {
//                                 $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.status", "completed"] } }
//                             }
//                         },
//                         avgRating: { $avg: "$tasks.qualityRating" }
//                     }
//                 }
//             },
//             // Step 4: Add the completionRate field
//             {
//                 $addFields: {
//                    "stats.completionRate": {
//                        $cond: { if: { $gt: ["$stats.assignedTasks", 0] }, then: { $multiply: [{ $divide: ["$stats.completedTasks", "$stats.assignedTasks"] }, 100] }, else: 0 }
//                    }
//                 }
//             },
//             // Step 5: Sort and paginate
//             { $sort: { "stats.rating": -1 } },
//             { $skip: skip },
//             { $limit: parseInt(limit) }
//         ]);
        
//         const total = await User.countDocuments({ role: "worker" });

//         res.json({
//             success: true,
//             data: {
//                 workers, // The structure is slightly different, so the frontend needs to adapt
//                 pagination: {
//                     current: parseInt(page),
//                     pages: Math.ceil(total / parseInt(limit)),
//                     total,
//                 },
//             },
//         });

//     } catch (error) {
//         console.error("Get workers error:", error);
//         res.status(500).json({ success: false, message: "Failed to fetch workers" });
//     }
// });


// // @desc      Assign report to worker
// // @route     PUT /api/admin/reports/:reportId/assign
// router.put( "/reports/:reportId/assign", [
//     param("reportId").isMongoId(),
//     body("workerId").isMongoId()
// ], handleValidationErrors, async (req, res) => {
//     try {
//       const { workerId } = req.body;
//       const report = await Report.findById(req.params.reportId);
//       if (!report) {
//         return res.status(404).json({ success: false, message: "Report not found" });
//       }

//       const worker = await User.findOne({ _id: workerId, role: "worker" });
//       if (!worker) {
//         return res.status(404).json({ success: false, message: "Worker not found" });
//       }

//       report.assignedWorker = worker._id;
//       report.status = "assigned";
//       report.assignedAt = new Date();
//       report.timeline.push({ status: "assigned", updatedBy: req.user.id, notes: `Assigned to ${worker.name}` });
      
//       const task = new Task({
//         report: report._id,
//         assignedWorker: worker._id,
//         assignedBy: req.user.id,
//         title: `Collect ${report.wasteType} at ${report.location.address}`,
//         description: report.description,
//         priority: report.urgency,
//         status: "assigned",
//         location: report.location,
//       });

//       await Promise.all([ report.save(), task.save() ]);

//       res.json({ success: true, message: "Report assigned and task created" });
//     } catch (error) {
//         console.error("Assign report error:", error);
//         res.status(500).json({ success: false, message: "Failed to assign report" });
//     }
// });

// module.exports = router;
const express = require("express")
const mongoose = require("mongoose");
const { body, query, param } = require("express-validator")
const Report = require("../models/Report")
const User = require("../models/User")
const Task = require("../models/Task")
const Analytics = require("../models/Analytics")
const { protect, authorize } = require("../middleware/auth")
const { handleValidationErrors } = require("../middleware/validation")

const router = express.Router()

router.use(protect)
router.use(authorize("admin"))

// @desc      Get dashboard overview statistics
// @route     GET /api/admin/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const [
      overviewStats,
      unassignedReports,
      assignedTasks
    ] = await Promise.all([
      // Fetch all overview counts in a single aggregation for speed
      Report.aggregate([
        {
          $group: {
            _id: null,
            totalReports: { $sum: 1 },
            pendingReports: { $sum: { $cond: [{ $in: ["$status", ["pending", "submitted"]] }, 1, 0] } },
            inProgressReports: { $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] } },
            completedReports: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          }
        }
      ]),
      Report.find({
        assignedWorker: { $exists: false },
        status: { $in: ["submitted", "pending"] },
      }).sort({ createdAt: -1 }).limit(10),
      Task.find({
        status: { $in: ["assigned", "in-progress", "accepted", "on-the-way"] },
      }).populate("assignedWorker", "name").sort({ createdAt: -1 }).limit(10)
    ]);

    const [workerCounts] = await User.aggregate([
        {
            $group: {
                _id: null,
                totalWorkers: { $sum: { $cond: [{ $eq: ["$role", "worker"] }, 1, 0] } },
                activeWorkers: { $sum: { $cond: [{ $and: [{ $eq: ["$role", "worker"] }, { $eq: ["$isActive", true] }] }, 1, 0] } },
                totalUsers: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } },
            }
        }
    ]);
    
    const overview = { ...overviewStats[0], ...workerCounts };
    delete overview._id; // Clean up the final object

    res.json({
      success: true,
      data: {
        overview,
        unassignedReports,
        assignedTasks,
      },
    })
  } catch (error) {
    console.error("Dashboard data error:", error)
    res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
  }
})


// @desc      Get all workers with their performance
// @route     GET /api/admin/workers
router.get("/workers", async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const workers = await User.aggregate([
            { $match: { role: "worker" } },
            {
                $lookup: {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "assignedWorker",
                    as: "tasks"
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    isActive: 1,
                    workerDetails: 1,
                    stats: {
                        assignedTasks: { $size: "$tasks" },
                        completedTasks: {
                            $size: {
                                $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.status", "completed"] } }
                            }
                        },
                        avgRating: { $avg: "$tasks.qualityRating" }
                    }
                }
            },
            {
                $addFields: {
                   "stats.completionRate": {
                       $cond: { if: { $gt: ["$stats.assignedTasks", 0] }, then: { $multiply: [{ $divide: ["$stats.completedTasks", "$stats.assignedTasks"] }, 100] }, else: 0 }
                   }
                }
            },
            { $sort: { "stats.rating": -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ]);
        
        const total = await User.countDocuments({ role: "worker" });

        res.json({
            success: true,
            data: {
                workers,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    total,
                },
            },
        });

    } catch (error) {
        console.error("Get workers error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch workers" });
    }
});

// =========================================================================
// ✅ NEW ENDPOINT FOR WORKER PERFORMANCE
// =========================================================================
// @desc      Get detailed performance stats for all workers
// @route     GET /api/admin/worker-performance
router.get("/worker-performance", async (req, res) => {
    try {
        const performanceData = await User.aggregate([
            { $match: { role: "worker" } },
            {
                $lookup: {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "assignedWorker",
                    as: "tasks"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    "workerDetails.avatar": 1,
                    completedTasksArray: {
                        $filter: {
                            input: "$tasks",
                            as: "task",
                            cond: { $eq: ["$$task.status", "completed"] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    completedTasks: { $size: "$completedTasksArray" },
                    totalPoints: { $sum: "$completedTasksArray.pointsEarned" },
                    avgCompletionTime: { 
                        $avg: {
                            $map: {
                                input: "$completedTasksArray",
                                as: "task",
                                in: { 
                                    $divide: [
                                        { $subtract: ["$$task.completedAt", "$$task.createdAt"] },
                                        1000 * 60 
                                    ]
                                }
                            }
                        }
                    },
                    rating: { $avg: "$completedTasksArray.qualityRating" }, 
                    recentCompletions: { $slice: ["$completedTasksArray", -3] }
                }
            },
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    name: 1,
                    avatar: "$workerDetails.avatar",
                    completedTasks: 1,
                    totalPoints: { $ifNull: ["$totalPoints", 0] },
                    avgCompletionTime: { $ifNull: [{ $round: ["$avgCompletionTime", 0] }, 0] },
                    rating: { $ifNull: [{ $round: ["$rating", 1] }, 0] },
                    recentCompletions: {
                        $map: {
                            input: "$recentCompletions",
                            as: "task",
                            in: {
                                taskId: "$$task._id",
                                taskType: "$$task.title",
                                completionTime: { $round: [{ $divide: [{ $subtract: ["$$task.completedAt", "$$task.createdAt"] }, 1000 * 60] }, 0] },
                                pointsEarned: "$$task.pointsEarned",
                                completedAt: "$$task.completedAt"
                            }
                        }
                    }
                }
            },
            { $sort: { totalPoints: -1 } }
        ]);

        res.json({ success: true, data: performanceData });

    } catch (error) {
        console.error("Worker performance error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch worker performance data" });
    }
});


// @desc      Assign report to worker
// @route     PUT /api/admin/reports/:reportId/assign
router.put( "/reports/:reportId/assign", [
    param("reportId").isMongoId(),
    body("workerId").isMongoId()
], handleValidationErrors, async (req, res) => {
    try {
        const { workerId } = req.body;
        const report = await Report.findById(req.params.reportId);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        const worker = await User.findOne({ _id: workerId, role: "worker" });
        if (!worker) {
            return res.status(404).json({ success: false, message: "Worker not found" });
        }

        report.assignedWorker = worker._id;
        report.status = "assigned";
        report.assignedAt = new Date();
        report.timeline.push({ status: "assigned", updatedBy: req.user.id, notes: `Assigned to ${worker.name}` });
        
        const task = new Task({
            report: report._id,
            assignedWorker: worker._id,
            assignedBy: req.user.id,
            title: `Collect ${report.wasteType} at ${report.location.address}`,
            description: report.description,
            priority: report.urgency,
            status: "assigned",
            location: report.location,
        });

        await Promise.all([ report.save(), task.save() ]);

        res.json({ success: true, message: "Report assigned and task created" });
    } catch (error) {
        console.error("Assign report error:", error);
        res.status(500).json({ success: false, message: "Failed to assign report" });
    }
});

// @desc      Get all reports (for heatmap)
// @route     GET /api/admin/reports/all
router.get("/reports/all", async (req, res) => {
    try {
        const reports = await Report.find()
            .select("address status location createdAt")
            .lean();

        if (!reports || reports.length === 0) {
            return res.json({
                success: true,
                count: 0,
                data: [],
                message: "No reports found.",
            });
        }

        res.json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching reports",
        });
    }
});

module.exports = router;