// sockets/socketHandler.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

// Store connected users: Map<userId, { socketIds: Set<string>, user: User, lastActivity: Date }>
const connectedUsers = new Map();

// Middleware to authenticate socket connection
const authenticateSocket = async (socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.replace?.("Bearer ", "") ||
            socket.handshake.query?.token;

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user || !user.isActive) {
            return next(new Error("Authentication error: Invalid or inactive user"));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.user = user;
        next();
    } catch (error) {
        console.error("Socket auth error:", error);
        next(new Error("Authentication error: Invalid token"));
    }
};

// Initialize socket events
const initializeSocket = (io) => {
    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        const userId = socket.userId;
        const userName = socket.user?.name || socket.user?.email || userId;
        console.log(`🔌 Connected: ${userName} (${socket.userRole}) - socket ${socket.id}`);

        // Ensure entry exists
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, {
                socketIds: new Set(),
                user: socket.user,
                lastActivity: new Date(),
            });
        }

        const conn = connectedUsers.get(userId);
        conn.socketIds.add(socket.id);
        conn.user = socket.user; // update user object
        conn.lastActivity = new Date();
        connectedUsers.set(userId, conn);

        // Rooms
        socket.join(`role:${socket.userRole}`);
        socket.join(`user:${userId}`);

        // Confirm connection
        socket.emit("connected", {
            message: "Connected to Smart Waste Management System",
            user: socket.user,
            timestamp: new Date(),
        });

        // Helper: create + emit notification
        const sendNotification = async ({
            recipientId,
            senderId = socket.userId,
            type = "system",
            title = "Notification",
            message = "",
            data = {},
            priority = "normal",
        }) => {
            try {
                const notification = await Notification.create({
                    recipient: recipientId,
                    sender: senderId,
                    type,
                    title,
                    message,
                    data,
                    priority,
                });

                // populate sender for immediate emission
                const populated = await notification.populate("sender", "name role");

                // Emit to recipient if online
                const target = connectedUsers.get(recipientId?.toString());
                if (target && target.socketIds.size > 0) {
                    io.to(`user:${recipientId}`).emit("new_notification", {
                        id: populated._id,
                        type: populated.type,
                        title: populated.title,
                        message: populated.message,
                        data: populated.data,
                        priority: populated.priority,
                        sender: populated.sender,
                        createdAt: populated.createdAt,
                    });
                }

                return populated;
            } catch (err) {
                console.error("Failed to create/send notification:", err);
                throw err;
            }
        };

        // Subscribe to task updates
        socket.on("subscribe_task", async ({ taskId }) => {
            try {
                const task = await Task.findById(taskId).populate("report");

                if (!task) {
                    socket.emit("socket_error", { message: "Task not found" });
                    return;
                }

                // Safe check for report.createdBy
                const reportCreatedBy =
                    task.report && (task.report.createdBy || task.report.createdBy === 0)
                        ? task.report.createdBy.toString()
                        : null;

                const hasAccess =
                    socket.userRole === "admin" ||
                    (socket.userRole === "citizen" && reportCreatedBy === socket.userId) ||
                    (socket.userRole === "worker" &&
                        task.assignedWorker &&
                        task.assignedWorker.toString() === socket.userId);

                if (!hasAccess) {
                    socket.emit("socket_error", { message: "Access denied" });
                    return;
                }

                socket.join(`task:${taskId}`);
                socket.emit("task_subscribed", { taskId, message: "Subscribed to task updates" });
                console.log(`📋 ${userName} subscribed to task ${taskId}`);
            } catch (err) {
                console.error("subscribe_task error:", err);
                socket.emit("socket_error", { message: "Failed to subscribe to task" });
            }
        });

        // Unsubscribe from task
        socket.on("unsubscribe_task", ({ taskId }) => {
            try {
                socket.leave(`task:${taskId}`);
                socket.emit("task_unsubscribed", { taskId });
            } catch (err) {
                socket.emit("socket_error", { message: "Failed to unsubscribe from task" });
            }
        });

        // Worker location updates
        socket.on("worker_location_update", async ({ latitude, longitude, taskId }) => {
            if (socket.userRole !== "worker") {
                socket.emit("socket_error", { message: "Only workers can send location updates" });
                return;
            }

            try {
                await User.findByIdAndUpdate(socket.userId, {
                    "workerDetails.currentLocation": {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    "workerDetails.lastLocationUpdate": new Date(),
                });

                const payload = {
                    workerId: socket.userId,
                    workerName: userName,
                    location: { latitude, longitude },
                    timestamp: new Date(),
                };

                if (taskId) {
                    socket.to(`task:${taskId}`).emit("worker_location", payload);
                }

                socket.to("role:admin").emit("worker_location_update", payload);
            } catch (err) {
                console.error("worker_location_update error:", err);
                socket.emit("socket_error", { message: "Failed to update location" });
            }
        });

        // Example: assign_task -> creates notification + emits
        socket.on("assign_task", async ({ taskId, workerId }) => {
            try {
                // Optionally you can also update the Task document here (not doing that automatically).
                await sendNotification({
                    recipientId: workerId,
                    senderId: socket.userId,
                    type: "task_update",
                    title: "New Task Assigned",
                    message: `You have been assigned task ${taskId}`,
                    data: { taskId },
                    priority: "high",
                });

                socket.emit("task_assigned_ack", { taskId, workerId });
            } catch (err) {
                console.error("assign_task error:", err);
                socket.emit("socket_error", { message: "Failed to send task notification" });
            }
        });

        // Typing indicators
        socket.on("typing_start", ({ taskId }) => {
            socket.to(`task:${taskId}`).emit("user_typing", {
                userId,
                userName,
                userRole: socket.userRole,
            });
        });

        socket.on("typing_stop", ({ taskId }) => {
            socket.to(`task:${taskId}`).emit("user_stopped_typing", { userId });
        });

        // Heartbeat
        socket.on("heartbeat", () => {
            const c = connectedUsers.get(userId);
            if (c) {
                c.lastActivity = new Date();
                connectedUsers.set(userId, c);
            }
            socket.emit("heartbeat_ack", { timestamp: new Date() });
        });

        // On disconnect
        socket.on("disconnect", (reason) => {
            console.log(`🔌 Disconnected: ${userName} - socket ${socket.id} - Reason: ${reason}`);
            const c = connectedUsers.get(userId);
            if (c) {
                c.socketIds.delete(socket.id);
                // if no sockets remain, remove user from map
                if (c.socketIds.size === 0) {
                    connectedUsers.delete(userId);
                } else {
                    connectedUsers.set(userId, c);
                }
            }

            if (socket.userRole === "worker") {
                socket.to("role:admin").emit("worker_offline", {
                    workerId: socket.userId,
                    workerName: userName,
                    timestamp: new Date(),
                });
            }
        });
    });

    // Cleanup inactive users periodically
    setInterval(() => {
        const now = Date.now();
        const inactiveMs = 5 * 60 * 1000; // 5 minutes
        for (const [userId, conn] of connectedUsers.entries()) {
            if (!conn.lastActivity) continue;
            if (now - conn.lastActivity.getTime() > inactiveMs) {
                console.log(`🧹 Cleaning inactive user ${conn.user?.name || userId}`);
                connectedUsers.delete(userId);
            }
        }
    }, 60 * 1000); // every minute

    return io;
};

// Utility functions (require an io instance to actually emit if used externally)
const emitToUser = (io, userId, event, data) => io.to(`user:${userId}`).emit(event, data);
const emitToRole = (io, role, event, data) => io.to(`role:${role}`).emit(event, data);
const emitToTask = (io, taskId, event, data) => io.to(`task:${taskId}`).emit(event, data);

// Broadcast notification helper (external)
const broadcastNotification = async (io, notification) => {
    try {
        const populated = await Notification.findById(notification._id).populate("sender", "name role");
        emitToUser(io, notification.recipient.toString(), "new_notification", {
            id: populated._id,
            type: populated.type,
            title: populated.title,
            message: populated.message,
            data: populated.data,
            priority: populated.priority,
            sender: populated.sender,
            createdAt: populated.createdAt,
        });
    } catch (err) {
        console.error("broadcastNotification error:", err);
    }
};

const broadcastTaskUpdate = (io, taskId, updateType, data) => {
    emitToTask(io, taskId, "task_updated", {
        taskId,
        updateType,
        data,
        timestamp: new Date(),
    });
};

const getConnectedUsers = () =>
    Array.from(connectedUsers.entries()).map(([userId, c]) => ({
        userId,
        name: c.user?.name,
        role: c.user?.role,
        socketCount: c.socketIds.size,
        lastActivity: c.lastActivity,
    }));

const isUserOnline = (userId) => connectedUsers.has(userId.toString());

module.exports = {
    initializeSocket,
    emitToUser,
    emitToRole,
    emitToTask,
    broadcastNotification,
    broadcastTaskUpdate,
    getConnectedUsers,
    isUserOnline,
};
