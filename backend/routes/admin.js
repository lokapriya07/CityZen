const express = require("express")
const mongoose = require("mongoose");
const { body, query, param } = require("express-validator")
const Report = require("../models/Report")
const User = require("../models/User")
const Task = require("../models/Task")
const Campaign = require("../models/Campaign")
const AutomatedRule = require("../models/AutomatedRule")
const Analytics = require("../models/Analytics")
const { protect, authorize } = require("../middleware/auth")
const { handleValidationErrors } = require("../middleware/validation")

const router = express.Router()

router.use(protect)
router.use(authorize("admin"))

// @desc      Get dashboard overview statistics
// @route     GET /api/admin/dashboard
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


// @desc      Get all workers with their performance
// @route     GET /api/admin/workers
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
// ✅ ENDPOINT FOR WORKER PERFORMANCE
// =========================================================================
// @desc      Get detailed performance stats for all workers
// @route     GET /api/admin/worker-performance
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


// @desc      Assign report to worker
// @route     PUT /api/admin/reports/:reportId/assign
router.put("/reports/:reportId/assign", [
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

    await Promise.all([report.save(), task.save()]);

    res.json({ success: true, message: "Report assigned and task created" });
  } catch (error) {
    console.error("Assign report error:", error);
    res.status(500).json({ success: false, message: "Failed to assign report" });
  }
});

// @desc      Get all reports (for heatmap)
// @route     GET /api/admin/reports/all
router.get("/reports/all", async (req, res) => {
  try {
    const reports = await Report.find()
      .select("address status location createdAt")
      .sort({ createdAt: -1 })
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

// =========================================================================
// ✅ NEW ENDPOINT FOR COMMUNITY LEADERBOARD (Top Reporters)
// =========================================================================
// @desc      Get top reporters by points
// @route     GET /api/admin/community/leaderboard
router.get("/community/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Report.aggregate([
      // Stage 1: Group by the reporter (user)
      {
        $group: {
          _id: "$reporter",
          reportCount: { $sum: 1 },
          // Get the city from one of their reports (we'll assume it's their "area")
          area: { $first: "$city" },
        },
      },
      // Stage 2: Calculate points (e.g., 10 points per report)
      // You can make this logic more complex later
      {
        $addFields: {
          points: { $multiply: ["$reportCount", 10] },
        },
      },
      // Stage 3: Sort by points (highest first)
      { $sort: { points: -1 } },
      // Stage 4: Limit to top 5
      { $limit: 5 },
      // Stage 5: Look up the user's details (name, avatar) from the 'users' collection
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      // Stage 6: Unwind the userDetails array and format the output
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true // Keep users even if details are missing
        }
      },
      // Stage 7: Project the final shape
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: "$userDetails.name",
          // Use avatar from workerDetails if available, otherwise a general avatar field
          avatar: { $ifNull: ["$userDetails.workerDetails.avatar", "$userDetails.avatar"] },
          area: "$area",
          points: "$points",
          reportCount: "$reportCount",
        },
      },
    ]);

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error("Community leaderboard error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
});

// =========================================================================
// ✅ NEW ENDPOINT FOR MOST ACTIVE AREAS
// =========================================================================
// @desc      Get most active areas by report count
// @route     GET /api/admin/community/active-areas
router.get("/community/active-areas", async (req, res) => {
  try {
    // We get the top 5 areas from the database
    const topAreas = await Report.aggregate([
      // Stage 1: Group by city (assuming 'city' is "Block A", "Sector 15", etc.)
      // Use "$address" or "$pincode" if that's your "area"
      {
        $group: {
          _id: "$city",
          reportCount: { $sum: 1 },
          // Create a set of unique user IDs who reported in this area
          uniqueReporters: { $addToSet: "$reporter" },
        },
      },
      // Stage 2: Get the count of unique reporters
      {
        $addFields: {
          residentCount: { $size: "$uniqueReporters" },
        },
      },
      // Stage 3: Sort by report count (highest first)
      { $sort: { reportCount: -1 } },
      // Stage 4: Limit to top 5
      { $limit: 5 },
      // Stage 5: Format the output
      {
        $project: {
          _id: 0,
          name: { $ifNull: ["$_id", "Unknown Area"] }, // Handle null/missing city names
          reportCount: "$reportCount",
          residentCount: "$residentCount",
        },
      },
    ]);

    // Now, we calculate the engagement percentage in JavaScript
    // We'll base the % on the #1 area (e.g., if #1 has 100 reports, that's 100%)
    const maxReports = topAreas[0]?.reportCount || 1; // Get max reports, avoid division by zero

    const finalAreasData = topAreas.map(area => ({
      ...area,
      // Calculate engagement % relative to the top area
      engagement: Math.round((area.reportCount / maxReports) * 100),
    }));

    res.json({ success: true, data: finalAreasData });
  } catch (error) {
    console.error("Active areas error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch active areas" });
  }
});

/**
 * POST /api/admin/auto-assign
 * Auto-assign unassigned reports to the nearest available worker.
 */
router.post("/auto-assign", async (req, res) => {
  try {
    // Note: The 'protect' middleware already ran, so req.user exists.
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const unassignedReports = await Report.find({ assignedWorker: null });
    const workers = await User.find({ role: "worker", isActive: true });

    const assignedResults = [];
    const unassignedResults = [];

    for (const report of unassignedReports) {
      if (!report.location || !report.location.coordinates) {
        unassignedResults.push({ reportId: report._id, reason: "No location data" });
        continue;
      }

      const [lng, lat] = report.location.coordinates;
      let closestWorker = null;
      let minDistance = Infinity;

      for (const worker of workers) {
        const wloc = worker.workerDetails?.currentLocation;
        if (!wloc || !wloc.latitude || !wloc.longitude) continue;

        // Simple distance calculation (not great for spherical Earth, but fast)
        // This calculates distance in degrees, not km.
        const distance = Math.sqrt(
          Math.pow(lat - wloc.latitude, 2) + Math.pow(lng - wloc.longitude, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestWorker = worker;
        }
      }

      // If within ~5 km threshold (≈ 0.045 degrees, very rough estimate)
      if (closestWorker && minDistance <= 0.045) {
        report.assignedWorker = closestWorker._id;
        report.status = "assigned"; // Also update the report status
        report.assignedAt = new Date();
        report.timeline.push({
          status: "assigned",
          updatedBy: req.user.id,
          notes: `Auto-assigned to ${closestWorker.name}`
        });

        // You should also create a Task here, just like in the manual assignment
        const task = new Task({
          report: report._id,
          assignedWorker: closestWorker._id,
          assignedBy: req.user.id,
          title: `Collect ${report.wasteType || 'waste'} at ${report.address || 'location'}`,
          description: report.description,
          priority: report.urgency,
          status: "assigned",
          location: report.location,
        });

        await Promise.all([report.save(), task.save()]); // Save both

        assignedResults.push({
          reportId: report._id,
          worker: closestWorker.name,
          distance: minDistance,
        });
      } else {
        unassignedResults.push({
          reportId: report._id,
          reason: closestWorker ? "No worker within 5km" : "No active workers found",
        });
      }
    }

    res.json({
      success: true,
      message: "Auto-assignment completed",
      assigned: assignedResults,
      unassigned: unassignedResults,
    });
  } catch (error) {
    console.error("Auto-assign error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// @desc      Get ONLY UNASSIGNED reports
// @route     GET /api/admin/reports/unassigned
router.get("/reports/unassigned", async (req, res) => {
  try {
    // Find reports where status is 'pending' OR 'submitted'
    // AND assignedWorker does not exist (is null)
    const reports = await Report.find({
      status: { $in: ["pending", "submitted"] },
      assignedWorker: null
    })
      .select("address status location createdAt") // Still select all needed info
      .sort({ createdAt: 1 }); // Show oldest reports first

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching unassigned reports:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
});

// @desc      Create a new automated reward rule
// @route     POST /api/admin/community/rules
router.post(
  "/community/rules",
  [
    body("ruleName").notEmpty().withMessage("Rule name is required"),
    body("criteria").isIn(['reports', 'points']).withMessage("Invalid criteria"),
    body("threshold").isNumeric().withMessage("Threshold must be a number"),
    body("rewardType").isIn(['points', 'badge']).withMessage("Invalid reward type"),
    body("rewardAmount").notEmpty().withMessage("Reward amount/value is required"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const newRule = new AutomatedRule(req.body);
      await newRule.save();
      res.status(201).json({ success: true, data: newRule });
    } catch (error) {
      console.error("Create rule error:", error);
      res.status(500).json({ success: false, message: "Failed to create rule" });
    }
  }
);

// @desc      Send a bulk reward to multiple users
// @route     POST /api/admin/community/rewards/send-bulk
router.post(
  "/community/rewards/send-bulk",
  [
    body("userIds").isArray({ min: 1 }).withMessage("At least one userId is required"),
    body("userIds.*").isMongoId().withMessage("All userIds must be valid"),
    // ✅ FIX 2: Changed validation from 'type' to 'rewardType' to match frontend
    body("rewardType").isIn(['points', 'badge']).withMessage("Invalid reward type"),
    body("amount").notEmpty().withMessage("Amount/value is required"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { userIds, rewardType, amount, reason } = req.body;

      if (rewardType === 'points') {
        await User.updateMany(
          { _id: { $in: userIds } },
          { $inc: { points: parseInt(amount) } }
        );
      } else if (rewardType === 'badge') {
        await User.updateMany(
          { _id: { $in: userIds } },
          { $addToSet: { badges: amount } } // $addToSet prevents duplicates
        );
      }

      console.log(`Bulk reward sent to ${userIds.length} users: ${amount} ${rewardType}. Reason: ${reason}`);

      res.json({ success: true, message: `Bulk reward sent to ${userIds.length} users.` });
    } catch (error) {
      console.error("Send bulk reward error:", error);
      res.status(500).json({ success: false, message: "Failed to send bulk reward" });
    }
  }
);

// @desc      Send a single reward (points or badge) to a user
// @route     POST /api/admin/community/rewards/send-single
router.post(
  "/community/rewards/send-single",
  [
    body("userId").isMongoId().withMessage("Valid userId is required"),
    // <-- (Your existing fix was correct)
    body("rewardType").isIn(['points', 'badge', 'Bonus Points']).withMessage("Invalid reward type"),
    body("amount").notEmpty().withMessage("Amount/value is required"),
    body("reason").optional().isString(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { userId, rewardType, amount, reason } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // <-- (Your existing fix was correct)
      if (rewardType === 'points' || rewardType === 'Bonus Points') {
        user.points = (user.points || 0) + parseInt(amount);
      } else if (rewardType === 'badge') {
        // Use $addToSet logic to avoid duplicates
        if (!user.badges.includes(amount)) {
          user.badges.push(amount);
        }
      }

      await user.save();

      // TODO: You could create a Notification for the user here
      console.log(`Reward sent to ${user.name}: ${amount} ${rewardType}. Reason: ${reason}`);

      res.json({ success: true, message: "Reward sent successfully" });
    } catch (error) {
      console.error("Send reward error:", error);
      res.status(500).json({ success: false, message: "Failed to send reward" });
    }
  }
);

// =========================================================================
// ✅ FIX 1: ADDED THIS ROUTE TO FETCH ALL CAMPAIGNS
// =========================================================================
// @desc      Get all community campaigns
// @route     GET /api/admin/community/campaigns
router.get("/community/campaigns", async (req, res) => {
  try {
    // Find all campaigns, sort by newest first
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Get campaigns error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch campaigns" });
  }
});

// @desc      Create a new community campaign
// @route     POST /api/admin/community/campaigns
router.post(
  "/community/campaigns",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("endDate").isISO8601().withMessage("End date is required"),
    body("target").isNumeric().withMessage("Target must be a number"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      // ✅ FIX 1: Destructure 'startDate' and 'status' from the body
      const { title, description, endDate, target, startDate, status } = req.body;

      const newCampaign = new Campaign({
        title,
        description,
        endDate,
        target: parseInt(target),
        // ✅ FIX 1: Use the values from the frontend
        startDate: startDate || new Date(),
        status: status || "active",
      });

      await newCampaign.save();

      res.status(201).json({ success: true, data: newCampaign });
    } catch (error) {
      console.error("Create campaign error:", error);
      res.status(500).json({ success: false, message: "Failed to create campaign" });
    }
  }
);

module.exports = router;