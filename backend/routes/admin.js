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

// =========================================================================
// ✅ START: NEW HELPER FUNCTION (Straight-Line Distance)
// This calculates distance "as the crow flies" and needs no API key.
// =========================================================================
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') {
        return null;
    }
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}
// =========================================================================
// ✅ END: NEW HELPER FUNCTION
// =========================================================================


// =========================================================================
// ✅ START: 'BEST MATCH' HELPER FUNCTION (UPDATED)
// This function now uses the new, local getDistanceFromLatLonInKm
// instead of the failing Google API.
// =========================================================================
const findBestWorkerByDistance = async (report, availableWorkers) => {
    const reportLoc = report.location?.coordinates; // [lng, lat]

    // 1. Check if the report has valid coordinates
    if (!reportLoc || (reportLoc[0] === 0 && reportLoc[1] === 0)) {
        return null; // No location data for this report
    }
    const reportLat = reportLoc[1];
    const reportLng = reportLoc[0];

    let bestWorker = null;
    let minDistance = Infinity;
    const DISTANCE_THRESHOLD_KM = 5; // Your 5km limit

    for (const worker of availableWorkers) {
        const workerLoc = worker.workerDetails?.currentLocation;

        // 2. Check if the worker has valid coordinates
        if (!workerLoc || !workerLoc.latitude || !workerLoc.longitude || (workerLoc.latitude === 0 && workerLoc.longitude === 0)) {
            continue; // Skip worker if they have no location
        }

        try {
            // 3. Calculate straight-line distance using the helper function
            const distance = getDistanceFromLatLonInKm(
                reportLat,
                reportLng,
                workerLoc.latitude,
                workerLoc.longitude
            );

            // Check if distance is valid (not null)
            if (distance === null) continue;

            if (distance < minDistance) {
                minDistance = distance;
                // Store the worker and their calculated distance (as a string)
                bestWorker = { ...worker, distance: distance.toFixed(1) }; 
            }
        } catch (error) {
            console.error(`Skipping worker ${worker.name}: Distance calc failed.`, error);
        }
    }

    // 4. Only return the worker if they are within the 5km limit (0.0km is included!)
    // We compare minDistance (a number) to the threshold
    if (bestWorker && minDistance < DISTANCE_THRESHOLD_KM) {
        return bestWorker;
    }
    
    return null; // No worker was found within 5km
};
// =========================================================================
// ✅ END: 'BEST MATCH' HELPER FUNCTION (UPDATED)
// =========================================================================


// =========================================================================
// ✅ START: REFACTORED HELPER (UPDATED)
// =========================================================================
const getReportsWithBestMatch = async () => {
    const unassignedReports = await Report.find({ 
        status: { $in: ["pending", "submitted"] },
        assignedWorker: null 
    }).lean(); 

    const workers = await User.find({ 
        role: "worker", 
        isActive: true 
    }).select("name email workerDetails.currentLocation isActive").lean();

    const reportsWithDistances = await Promise.all(
        unassignedReports.map(async (report) => {
            // This function now returns a worker OR null
            const bestMatch = await findBestWorkerByDistance(report, workers);
            return {
                ...report,
                bestMatch: bestMatch 
            };
        })
    );
    return reportsWithDistances;
};
// =========================================================================
// ✅ END: REFACTORED HELPER
// =========================================================================


// @desc      Get dashboard overview statistics
// @route     GET /api/admin/dashboard
router.get("/dashboard", async (req, res) => {
    try {
        const [
            overviewStats,
            unassignedReports,
            assignedTasks
        ] = await Promise.all([
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
        delete overview._id; 

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
                    phone: 1,              // ✅ ADDED phone number
                    isActive: 1,
                    workerDetails: 1,
                    stats: {
                        assignedTasks: { $size: "$tasks" },
                        completedTasks: {
                            $size: {
                                $filter: {
                                    input: "$tasks",
                                    as: "task",
                                    cond: { $eq: ["$$task.status", "completed"] }
                                }
                            }
                        },
                        avgRating: { $avg: "$tasks.qualityRating" }
                    }
                }
            },
            {
                $addFields: {
                    "stats.completionRate": {
                        $cond: {
                            if: { $gt: ["$stats.assignedTasks", 0] },
                            then: {
                                $multiply: [
                                    { $divide: ["$stats.completedTasks", "$stats.assignedTasks"] },
                                    100
                                ]
                            },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { "stats.avgRating": -1 } }, // 🧠 small fix: correct field name for sorting
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

// @desc      Get all reports (for heatmap)
// @route     GET /api/admin/reports/all
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

// @desc      Get top reporters by points
// @route     GET /api/admin/community/leaderboard
router.get("/community/leaderboard", async (req, res) => {
    try {
        const leaderboard = await Report.aggregate([
            { $group: { _id: "$reporter", reportCount: { $sum: 1 }, area: { $first: "$city" } } },
            { $addFields: { points: { $multiply: ["$reportCount", 10] } } },
            { $sort: { points: -1 } },
            { $limit: 5 },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "userDetails" } },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: "$userDetails.name",
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

// @desc      Get most active areas by report count
// @route     GET /api/admin/community/active-areas
router.get("/community/active-areas", async (req, res) => {
    try {
        const topAreas = await Report.aggregate([
            { $group: { _id: "$city", reportCount: { $sum: 1 }, uniqueReporters: { $addToSet: "$reporter" } } },
            { $addFields: { residentCount: { $size: "$uniqueReporters" } } },
            { $sort: { reportCount: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, name: { $ifNull: ["$_id", "Unknown Area"] }, reportCount: "$reportCount", residentCount: "$residentCount" } },
        ]);

        const maxReports = topAreas[0]?.reportCount || 1; 
        const finalAreasData = topAreas.map(area => ({
            ...area,
            engagement: Math.round((area.reportCount / maxReports) * 100),
        }));

        res.json({ success: true, data: finalAreasData });
    } catch (error) {
        console.error("Active areas error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch active areas" });
    }
});

// @desc      Auto-assign unassigned reports to the nearest available worker.
// @route     POST /api/admin/auto-assign
router.post("/auto-assign", async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        // 1. Get all reports with their pre-calculated best match (< 5km)
        const reportsToProcess = await getReportsWithBestMatch();

        const assignedResults = [];
        const unassignedResults = [];

        for (const report of reportsToProcess) {
            // 2. Check if a valid bestMatch (who is < 5km) was found
            if (report.bestMatch) {
                const closestWorker = report.bestMatch;
                
                // 3. Assign the report and create a task
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

                // Update the original report document
                await Report.findByIdAndUpdate(report._id, {
                    assignedWorker: closestWorker._id,
                    status: "assigned",
                    assignedAt: new Date(),
                    $push: { 
                        timeline: {
                            status: "assigned",
                            updatedBy: req.user.id,
                            notes: `Auto-assigned to ${closestWorker.name}`
                        }
                    }
                });

                await task.save(); // Save the new task

                assignedResults.push({
                    reportId: report._id,
                    worker: closestWorker.name,
                    distance: closestWorker.distance,
                });
            } else {
                // 4. No best match was found (no worker < 5km or no location)
                unassignedResults.push({
                    reportId: report._id,
                    reason: "No active worker found within 5km",
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


// @desc      Get ONLY UNASSIGNED reports
// @route     GET /api/admin/reports/unassigned
router.get("/reports/unassigned", async (req, res) => {
    try {
        const reports = await Report.find({
            status: { $in: ["pending", "submitted"] },
            assignedWorker: null
        })
            .select("address status location createdAt") 
            .sort({ createdAt: 1 }); 

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

// @desc      Create a new automated reward rule
// @route     POST /api/admin/community/rules
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

// @desc      Send a bulk reward to multiple users
// @route     POST /api/admin/community/rewards/send-bulk
router.post(
    "/community/rewards/send-bulk",
    [
        body("userIds").isArray({ min: 1 }).withMessage("At least one userId is required"),
        body("userIds.*").isMongoId().withMessage("All userIds must be valid"),
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
                    { $addToSet: { badges: amount } } 
                );
            }
            res.json({ success: true, message: `Bulk reward sent to ${userIds.length} users.` });
        } catch (error) {
            console.error("Send bulk reward error:", error);
            res.status(500).json({ success: false, message: "Failed to send bulk reward" });
        }
    }
);

// @desc      Send a single reward (points or badge) to a user
// @route     POST /api/admin/community/rewards/send-single
router.post(
    "/community/rewards/send-single",
    [
        body("userId").isMongoId().withMessage("Valid userId is required"),
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

            if (rewardType === 'points' || rewardType === 'Bonus Points') {
                user.points = (user.points || 0) + parseInt(amount);
            } else if (rewardType === 'badge') {
                if (!user.badges.includes(amount)) {
                    user.badges.push(amount);
                }
            }

            await user.save();
            res.json({ success: true, message: "Reward sent successfully" });
        } catch (error) {
            console.error("Send reward error:", error);
            res.status(500).json({ success: false, message: "Failed to send reward" });
        }
    }
);

// @desc      Get all community campaigns
// @route     GET /api/admin/community/campaigns
router.get("/community/campaigns", async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.json({ success: true, data: campaigns });
    } catch (error) {
        console.error("Get campaigns error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch campaigns" });
    }
});

// @desc      Create a new community campaign
// @route     POST /api/admin/community/campaigns
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
            const { title, description, endDate, target, startDate, status } = req.body;
            const newCampaign = new Campaign({
                title,
                description,
                endDate,
                target: parseInt(target),
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

// @desc      Fetch unassigned reports with pre-calculated best-match distances
// @route     GET /api/admin/reports/unassigned/distances
router.get("/reports/unassigned/distances", async (req, res) => {
    try {
        // =================================================================
        // ✅ ADD THIS LOG
        console.log("RUNNING NEW /api/admin/reports/unassigned/distances v2"); 
        // =================================================================
        
        const reportsWithBestMatch = await getReportsWithBestMatch();
        res.json({ success: true, data: reportsWithBestMatch });
    } catch (error) {
        console.error("Error fetching reports with distances:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

module.exports = router;