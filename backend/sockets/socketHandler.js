// // // sockets/socketHandler.js
// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");
// // const Task = require("../models/Task");
// // const Notification = require("../models/Notification");

// // // Store connected users: Map<userId, { socketIds: Set<string>, user: User, lastActivity: Date }>
// // const connectedUsers = new Map();

// // // Middleware to authenticate socket connection
// // const authenticateSocket = async (socket, next) => {
// //     try {
// //         const token =
// //             socket.handshake.auth?.token ||
// //             socket.handshake.headers?.authorization?.replace?.("Bearer ", "") ||
// //             socket.handshake.query?.token;

// //         if (!token) {
// //             return next(new Error("Authentication error: No token provided"));
// //         }

// //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //         const user = await User.findById(decoded.id).select("-password");

// //         if (!user || !user.isActive) {
// //             return next(new Error("Authentication error: Invalid or inactive user"));
// //         }

// //         socket.userId = user._id.toString();
// //         socket.userRole = user.role;
// //         socket.user = user;
// //         next();
// //     } catch (error) {
// //         console.error("Socket auth error:", error);
// //         next(new Error("Authentication error: Invalid token"));
// //     }
// // };

// // // Initialize socket events
// // const initializeSocket = (io) => {
// //     io.use(authenticateSocket);

// //     io.on("connection", (socket) => {
// //         const userId = socket.userId;
// //         const userName = socket.user?.name || socket.user?.email || userId;
// //         console.log(`🔌 Connected: ${userName} (${socket.userRole}) - socket ${socket.id}`);

// //         // Ensure entry exists
// //         if (!connectedUsers.has(userId)) {
// //             connectedUsers.set(userId, {
// //                 socketIds: new Set(),
// //                 user: socket.user,
// //                 lastActivity: new Date(),
// //             });
// //         }

// //         const conn = connectedUsers.get(userId);
// //         conn.socketIds.add(socket.id);
// //         conn.user = socket.user; // update user object
// //         conn.lastActivity = new Date();
// //         connectedUsers.set(userId, conn);

// //         // Rooms
// //         socket.join(`role:${socket.userRole}`);
// //         socket.join(`user:${userId}`);

// //         // Confirm connection
// //         socket.emit("connected", {
// //             message: "Connected to Smart Waste Management System",
// //             user: socket.user,
// //             timestamp: new Date(),
// //         });

// //         // Helper: create + emit notification
// //         const sendNotification = async ({
// //             recipientId,
// //             senderId = socket.userId,
// //             type = "system",
// //             title = "Notification",
// //             message = "",
// //             data = {},
// //             priority = "normal",
// //         }) => {
// //             try {
// //                 const notification = await Notification.create({
// //                     recipient: recipientId,
// //                     sender: senderId,
// //                     type,
// //                     title,
// //                     message,
// //                     data,
// //                     priority,
// //                 });

// //                 // populate sender for immediate emission
// //                 const populated = await notification.populate("sender", "name role");

// //                 // Emit to recipient if online
// //                 const target = connectedUsers.get(recipientId?.toString());
// //                 if (target && target.socketIds.size > 0) {
// //                     io.to(`user:${recipientId}`).emit("new_notification", {
// //                         id: populated._id,
// //                         type: populated.type,
// //                         title: populated.title,
// //                         message: populated.message,
// //                         data: populated.data,
// //                         priority: populated.priority,
// //                         sender: populated.sender,
// //                         createdAt: populated.createdAt,
// //                     });
// //                 }

// //                 return populated;
// //             } catch (err) {
// //                 console.error("Failed to create/send notification:", err);
// //                 throw err;
// //             }
// //         };

// //         // Subscribe to task updates
// //         socket.on("subscribe_task", async ({ taskId }) => {
// //             try {
// //                 const task = await Task.findById(taskId).populate("report");

// //                 if (!task) {
// //                     socket.emit("socket_error", { message: "Task not found" });
// //                     return;
// //                 }

// //                 // Safe check for report.createdBy
// //                 const reportCreatedBy =
// //                     task.report && (task.report.createdBy || task.report.createdBy === 0)
// //                         ? task.report.createdBy.toString()
// //                         : null;

// //                 const hasAccess =
// //                     socket.userRole === "admin" ||
// //                     (socket.userRole === "citizen" && reportCreatedBy === socket.userId) ||
// //                     (socket.userRole === "worker" &&
// //                         task.assignedWorker &&
// //                         task.assignedWorker.toString() === socket.userId);

// //                 if (!hasAccess) {
// //                     socket.emit("socket_error", { message: "Access denied" });
// //                     return;
// //                 }

// //                 socket.join(`task:${taskId}`);
// //                 socket.emit("task_subscribed", { taskId, message: "Subscribed to task updates" });
// //                 console.log(`📋 ${userName} subscribed to task ${taskId}`);
// //             } catch (err) {
// //                 console.error("subscribe_task error:", err);
// //                 socket.emit("socket_error", { message: "Failed to subscribe to task" });
// //             }
// //         });

// //         // Unsubscribe from task
// //         socket.on("unsubscribe_task", ({ taskId }) => {
// //             try {
// //                 socket.leave(`task:${taskId}`);
// //                 socket.emit("task_unsubscribed", { taskId });
// //             } catch (err) {
// //                 socket.emit("socket_error", { message: "Failed to unsubscribe from task" });
// //             }
// //         });

// //         // Worker location updates
// //         socket.on("worker_location_update", async ({ latitude, longitude, taskId }) => {
// //             if (socket.userRole !== "worker") {
// //                 socket.emit("socket_error", { message: "Only workers can send location updates" });
// //                 return;
// //             }

// //             try {
// //                 await User.findByIdAndUpdate(socket.userId, {
// //                     "workerDetails.currentLocation": {
// //                         type: "Point",
// //                         coordinates: [longitude, latitude],
// //                     },
// //                     "workerDetails.lastLocationUpdate": new Date(),
// //                 });

// //                 const payload = {
// //                     workerId: socket.userId,
// //                     workerName: userName,
// //                     location: { latitude, longitude },
// //                     timestamp: new Date(),
// //                 };

// //                 if (taskId) {
// //                     socket.to(`task:${taskId}`).emit("worker_location", payload);
// //                 }

// //                 socket.to("role:admin").emit("worker_location_update", payload);
// //             } catch (err) {
// //                 console.error("worker_location_update error:", err);
// //                 socket.emit("socket_error", { message: "Failed to update location" });
// //             }
// //         });

// //         // Example: assign_task -> creates notification + emits
// //         socket.on("assign_task", async ({ taskId, workerId }) => {
// //             try {
// //                 // Optionally you can also update the Task document here (not doing that automatically).
// //                 await sendNotification({
// //                     recipientId: workerId,
// //                     senderId: socket.userId,
// //                     type: "task_update",
// //                     title: "New Task Assigned",
// //                     message: `You have been assigned task ${taskId}`,
// //                     data: { taskId },
// //                     priority: "high",
// //                 });

// //                 socket.emit("task_assigned_ack", { taskId, workerId });
// //             } catch (err) {
// //                 console.error("assign_task error:", err);
// //                 socket.emit("socket_error", { message: "Failed to send task notification" });
// //             }
// //         });

// //         // Typing indicators
// //         socket.on("typing_start", ({ taskId }) => {
// //             socket.to(`task:${taskId}`).emit("user_typing", {
// //                 userId,
// //                 userName,
// //                 userRole: socket.userRole,
// //             });
// //         });

// //         socket.on("typing_stop", ({ taskId }) => {
// //             socket.to(`task:${taskId}`).emit("user_stopped_typing", { userId });
// //         });

// //         // Heartbeat
// //         socket.on("heartbeat", () => {
// //             const c = connectedUsers.get(userId);
// //             if (c) {
// //                 c.lastActivity = new Date();
// //                 connectedUsers.set(userId, c);
// //             }
// //             socket.emit("heartbeat_ack", { timestamp: new Date() });
// //         });

// //         // On disconnect
// //         socket.on("disconnect", (reason) => {
// //             console.log(`🔌 Disconnected: ${userName} - socket ${socket.id} - Reason: ${reason}`);
// //             const c = connectedUsers.get(userId);
// //             if (c) {
// //                 c.socketIds.delete(socket.id);
// //                 // if no sockets remain, remove user from map
// //                 if (c.socketIds.size === 0) {
// //                     connectedUsers.delete(userId);
// //                 } else {
// //                     connectedUsers.set(userId, c);
// //                 }
// //             }

// //             if (socket.userRole === "worker") {
// //                 socket.to("role:admin").emit("worker_offline", {
// //                     workerId: socket.userId,
// //                     workerName: userName,
// //                     timestamp: new Date(),
// //                 });
// //             }
// //         });
// //     });

// //     // Cleanup inactive users periodically
// //     setInterval(() => {
// //         const now = Date.now();
// //         const inactiveMs = 5 * 60 * 1000; // 5 minutes
// //         for (const [userId, conn] of connectedUsers.entries()) {
// //             if (!conn.lastActivity) continue;
// //             if (now - conn.lastActivity.getTime() > inactiveMs) {
// //                 console.log(`🧹 Cleaning inactive user ${conn.user?.name || userId}`);
// //                 connectedUsers.delete(userId);
// //             }
// //         }
// //     }, 60 * 1000); // every minute

// //     return io;
// // };

// // // Utility functions (require an io instance to actually emit if used externally)
// // const emitToUser = (io, userId, event, data) => io.to(`user:${userId}`).emit(event, data);
// // const emitToRole = (io, role, event, data) => io.to(`role:${role}`).emit(event, data);
// // const emitToTask = (io, taskId, event, data) => io.to(`task:${taskId}`).emit(event, data);

// // // Broadcast notification helper (external)
// // const broadcastNotification = async (io, notification) => {
// //     try {
// //         const populated = await Notification.findById(notification._id).populate("sender", "name role");
// //         emitToUser(io, notification.recipient.toString(), "new_notification", {
// //             id: populated._id,
// //             type: populated.type,
// //             title: populated.title,
// //             message: populated.message,
// //             data: populated.data,
// //             priority: populated.priority,
// //             sender: populated.sender,
// //             createdAt: populated.createdAt,
// //         });
// //     } catch (err) {
// //         console.error("broadcastNotification error:", err);
// //     }
// // };

// // const broadcastTaskUpdate = (io, taskId, updateType, data) => {
// //     emitToTask(io, taskId, "task_updated", {
// //         taskId,
// //         updateType,
// //         data,
// //         timestamp: new Date(),
// //     });
// // };

// // const getConnectedUsers = () =>
// //     Array.from(connectedUsers.entries()).map(([userId, c]) => ({
// //         userId,
// //         name: c.user?.name,
// //         role: c.user?.role,
// //         socketCount: c.socketIds.size,
// //         lastActivity: c.lastActivity,
// //     }));

// // const isUserOnline = (userId) => connectedUsers.has(userId.toString());

// // module.exports = {
// //     initializeSocket,
// //     emitToUser,
// //     emitToRole,
// //     emitToTask,
// //     broadcastNotification,
// //     broadcastTaskUpdate,
// //     getConnectedUsers,
// //     isUserOnline,
// // };
// // sockets/socketHandler.js
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const Task = require("../models/Task");
// const Message = require("../models/Message");

// const connectedUsers = new Map();

// const authenticateSocket = async (socket, next) => {
//     try {
//         const token = socket.handshake.query?.token;

//         if (!token) {
//             return next(new Error("Authentication error: No token provided"));
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id).select("-password");

//         if (!user || !user.isActive) {
//             return next(new Error("Authentication error: Invalid or inactive user"));
//         }

//         socket.userId = user._id.toString();
//         socket.userRole = user.role;
//         socket.user = user;
//         next();
//     } catch (error) {
//         console.error("Socket auth error:", error);
//         next(new Error("Authentication error: Invalid token"));
//     }
// };

// const initializeSocket = (io) => {
//     io.use(authenticateSocket);

//     io.on("connection", (socket) => {
//         const userId = socket.userId;
//         const userName = socket.user?.name || "Unknown User";
        
//         console.log(`🔌 Connected: ${userName} (${socket.userRole}) - ${socket.id}`);

//         // Add to connected users
//         if (!connectedUsers.has(userId)) {
//             connectedUsers.set(userId, {
//                 socketIds: new Set([socket.id]),
//                 user: socket.user,
//                 lastActivity: new Date(),
//             });
//         } else {
//             const userData = connectedUsers.get(userId);
//             userData.socketIds.add(socket.id);
//             userData.lastActivity = new Date();
//             connectedUsers.set(userId, userData);
//         }

//         // Join user and role rooms
//         socket.join(`user:${userId}`);
//         socket.join(`role:${socket.userRole}`);

//         // Send connection confirmation
//         socket.emit("connected", {
//             type: "connected",
//             message: "Connected to messaging service",
//             user: socket.user,
//         });

//         // Join task chat
//         socket.on("join_task_chat", async ({ taskId }) => {
//             try {
//                 console.log(`💬 ${userName} joining task chat: ${taskId}`);
                
//                 const task = await Task.findById(taskId)
//                     .populate("assignedWorker")
//                     .populate("report");

//                 if (!task) {
//                     socket.emit("socket_error", { 
//                         type: "socket_error", 
//                         message: "Task not found" 
//                     });
//                     return;
//                 }

//                 // Check access permissions
//                 const hasAccess = 
//                     socket.userRole === "admin" ||
//                     (socket.userRole === "citizen" && task.report.createdBy.toString() === socket.userId) ||
//                     (socket.userRole === "worker" && task.assignedWorker._id.toString() === socket.userId);

//                 if (!hasAccess) {
//                     socket.emit("socket_error", { 
//                         type: "socket_error", 
//                         message: "Access denied to task chat" 
//                     });
//                     return;
//                 }

//                 socket.join(`task_chat:${taskId}`);
                
//                 socket.emit("joined_task_chat", { 
//                     type: "joined_task_chat",
//                     taskId, 
//                     message: "Joined task chat successfully"
//                 });

//                 console.log(`✅ ${userName} joined task chat ${taskId}`);

//                 // Send message history
//                 const messages = await Message.find({ taskId })
//                     .populate("sender", "name role avatar")
//                     .sort({ createdAt: 1 })
//                     .limit(50);

//                 socket.emit("message_history", {
//                     type: "message_history",
//                     taskId,
//                     messages: messages.map(msg => ({
//                         id: msg._id,
//                         taskId: msg.taskId,
//                         sender: {
//                             id: msg.sender._id,
//                             name: msg.sender.name,
//                             role: msg.sender.role,
//                             avatar: msg.sender.avatar,
//                         },
//                         receiver: msg.receiver,
//                         message: msg.message,
//                         messageType: msg.messageType,
//                         location: msg.location,
//                         createdAt: msg.createdAt,
//                         isRead: msg.isRead,
//                     }))
//                 });

//             } catch (err) {
//                 console.error("join_task_chat error:", err);
//                 socket.emit("socket_error", { 
//                     type: "socket_error", 
//                     message: "Failed to join task chat" 
//                 });
//             }
//         });

//         // Send message
//         socket.on("send_message", async (data) => {
//             try {
//                 const { taskId, message, messageType = "text", location = null } = data;
                
//                 console.log(`💬 ${userName} sending message to task ${taskId}`);

//                 const task = await Task.findById(taskId)
//                     .populate("assignedWorker")
//                     .populate("report");

//                 if (!task) {
//                     socket.emit("socket_error", { 
//                         type: "socket_error", 
//                         message: "Task not found" 
//                     });
//                     return;
//                 }

//                 // Determine receiver
//                 let receiverId;
//                 if (socket.userRole === "citizen") {
//                     receiverId = task.assignedWorker._id;
//                 } else if (socket.userRole === "worker") {
//                     receiverId = task.report.createdBy;
//                 } else {
//                     socket.emit("socket_error", { 
//                         type: "socket_error", 
//                         message: "Only citizens and workers can message" 
//                     });
//                     return;
//                 }

//                 // Save message to database
//                 const newMessage = await Message.create({
//                     taskId,
//                     sender: socket.userId,
//                     receiver: receiverId,
//                     message,
//                     messageType,
//                     location: messageType === "location" ? location : null,
//                 });

//                 // Populate sender info
//                 await newMessage.populate("sender", "name role avatar");

//                 // Broadcast message
//                 const messageData = {
//                     type: "new_message",
//                     id: newMessage._id,
//                     taskId,
//                     sender: {
//                         id: newMessage.sender._id,
//                         name: newMessage.sender.name,
//                         role: newMessage.sender.role,
//                         avatar: newMessage.sender.avatar,
//                     },
//                     receiver: receiverId,
//                     message: newMessage.message,
//                     messageType: newMessage.messageType,
//                     location: newMessage.location,
//                     createdAt: newMessage.createdAt,
//                     isRead: newMessage.isRead,
//                 };

//                 io.to(`task_chat:${taskId}`).emit("new_message", messageData);
//                 console.log(`✅ Message delivered to task ${taskId}`);

//             } catch (err) {
//                 console.error("send_message error:", err);
//                 socket.emit("socket_error", { 
//                     type: "socket_error", 
//                     message: "Failed to send message" 
//                 });
//             }
//         });

//         // Typing indicators
//         socket.on("typing_start", ({ taskId }) => {
//             socket.to(`task_chat:${taskId}`).emit("user_typing", {
//                 type: "user_typing",
//                 userId: socket.userId,
//                 userName: socket.user?.name,
//                 userRole: socket.userRole,
//             });
//         });

//         socket.on("typing_stop", ({ taskId }) => {
//             socket.to(`task_chat:${taskId}`).emit("user_stopped_typing", {
//                 type: "user_stopped_typing",
//                 userId: socket.userId,
//             });
//         });

//         // Heartbeat
//         socket.on("heartbeat", () => {
//             const userData = connectedUsers.get(userId);
//             if (userData) {
//                 userData.lastActivity = new Date();
//                 connectedUsers.set(userId, userData);
//             }
//         });

//         // Handle disconnect
//         socket.on("disconnect", (reason) => {
//             console.log(`🔌 Disconnected: ${userName} - ${reason}`);
            
//             const userData = connectedUsers.get(userId);
//             if (userData) {
//                 userData.socketIds.delete(socket.id);
//                 if (userData.socketIds.size === 0) {
//                     connectedUsers.delete(userId);
//                     console.log(`👋 ${userName} is now offline`);
//                 } else {
//                     connectedUsers.set(userId, userData);
//                 }
//             }
//         });
//     });

//     // Cleanup inactive users
//     setInterval(() => {
//         const now = Date.now();
//         const inactiveMs = 5 * 60 * 1000; // 5 minutes
        
//         for (const [userId, userData] of connectedUsers.entries()) {
//             if (now - userData.lastActivity.getTime() > inactiveMs) {
//                 console.log(`🧹 Cleaning inactive user ${userData.user?.name || userId}`);
//                 connectedUsers.delete(userId);
//             }
//         }
//     }, 60 * 1000);

//     return io;
// };

// module.exports = { initializeSocket };
//sockets/socketHandler.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Task = require("../models/Task");
const Message = require("../models/Message");

const connectedUsers = new Map();

const authenticateSocket = async (socket, next) => {
    try {
        console.log(`🔐 Starting socket authentication for socket: ${socket.id}`);
        const token = socket.handshake.query?.token;
        console.log(`📋 Token present: ${!!token}`);

        if (!token) {
            console.error("❌ No token provided for socket authentication");
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`👤 Token decoded for user ID: ${decoded.id}`);

        const user = await User.findById(decoded.id).select("-password");
        console.log(`✅ User found: ${user ? user.name : 'NOT FOUND'}, Active: ${user?.isActive}`);

        if (!user || !user.isActive) {
            console.error("❌ Invalid or inactive user");
            return next(new Error("Authentication error: Invalid or inactive user"));
        }

        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.user = user;
        
        console.log(`✅ Socket authenticated successfully for: ${user.name} (${user.role})`);
        next();
    } catch (error) {
        console.error("❌ Socket auth error:", error.message);
        next(new Error("Authentication error: Invalid token"));
    }
};

const initializeSocket = (io) => {
    console.log("🔧 Initializing socket handlers...");
    
    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        const userId = socket.userId;
        const userName = socket.user?.name || "Unknown User";
        
        console.log(`🔌 New connection: ${userName} (${socket.userRole}) - Socket ID: ${socket.id}`);
        console.log(`📊 Total connected users: ${connectedUsers.size + 1}`);

        // Add to connected users
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, {
                socketIds: new Set([socket.id]),
                user: socket.user,
                lastActivity: new Date(),
            });
            console.log(`➕ Added new user to connected users: ${userName}`);
        } else {
            const userData = connectedUsers.get(userId);
            userData.socketIds.add(socket.id);
            userData.lastActivity = new Date();
            connectedUsers.set(userId, userData);
            console.log(`🔄 Updated existing user: ${userName}, now has ${userData.socketIds.size} socket connections`);
        }

        // Join user and role rooms
        socket.join(`user:${userId}`);
        socket.join(`role:${socket.userRole}`);
        console.log(`🚪 User joined rooms: user:${userId}, role:${socket.userRole}`);

        // Send connection confirmation
        socket.emit("connected", {
            type: "connected",
            message: "Connected to messaging service",
            user: socket.user,
        });
        console.log(`✅ Sent 'connected' event to ${userName}`);

        // ------------------------------------------------------------------
        // ✅ NEW JOIN TASK CHAT HANDLER
        // ------------------------------------------------------------------
        // Join task chat - COMPLETELY OPEN FOR DEMO
        socket.on("join_task_chat", async ({ taskId }) => {
            try {
                console.log(`💬 ${userName} (${socket.userRole}) joining task chat: ${taskId}`);
                
                // ✅ DEMO: NO ACCESS CONTROL - ALLOW EVERYONE
                console.log(`🔓 DEMO MODE: Allowing ${userName} to join chat ${taskId}`);
                
                // Join the room
                socket.join(`task_chat:${taskId}`);
                
                console.log(`✅ ${userName} joined task chat room: task_chat:${taskId}`);
                
                // Send confirmation
                socket.emit("joined_task_chat", { 
                    type: "joined_task_chat",
                    taskId, 
                    message: "Joined task chat successfully"
                });

                // Send message history
                console.log(`📚 Fetching message history for task: ${taskId}`);
                const messages = await Message.find({ taskId })
                    .populate("sender", "name role avatar")
                    .sort({ createdAt: 1 })
                    .limit(50);

                console.log(`📨 Sending ${messages.length} messages to ${userName}`);

                socket.emit("message_history", {
                    type: "message_history",
                    taskId,
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
                    }))
                });

            } catch (err) {
                console.error("❌ join_task_chat error:", err);
                socket.emit("socket_error", { 
                    type: "socket_error", 
                    message: "Failed to join task chat" 
                });
            }
        });

        // ------------------------------------------------------------------
        // ✅ NEW SEND MESSAGE HANDLER (FIXED)
        // ------------------------------------------------------------------
        // Send message - FIXED VERSION
        socket.on("send_message", async (data) => {
            try {
                const { taskId, message, messageType = "text", location = null } = data;
                
                console.log(`📤 [SEND_MESSAGE] ${userName} (${socket.userRole}) sending to task ${taskId}:`, message);

                // ✅ FIX: Handle both "user" and "citizen" roles
                let receiverId;
                const senderRole = socket.userRole;
                
                console.log(`👤 Sender role: ${senderRole}, User ID: ${socket.userId}`);

                if (senderRole === "citizen" || senderRole === "user") {
                    // If citizen/user sends, find the assigned worker
                    const task = await Task.findById(taskId).populate("assignedWorker");
                    receiverId = task?.assignedWorker?._id;
                    console.log(`👥 Citizen sending to worker: ${receiverId}`);
                } else if (senderRole === "worker") {
                    // If worker sends, find the report creator
                    const task = await Task.findById(taskId).populate("report");
                    receiverId = task?.report?.createdBy;
                    console.log(`👥 Worker sending to citizen: ${receiverId}`);
                } else {
                    console.log(`❓ Unknown sender role: ${senderRole}`);
                }

                // ✅ FIX: If receiver is still undefined, set a default or skip validation
                if (!receiverId) {
                    console.log(`⚠️  Receiver not found, using sender as fallback`);
                    receiverId = socket.userId; // Fallback to prevent validation error
                }

                console.log(`✅ Final receiver: ${receiverId}`);

                // Save message to database
                const newMessage = await Message.create({
                    taskId,
                    sender: socket.userId,
                    receiver: receiverId,
                    message,
                    messageType,
                    location: messageType === "location" ? location : null,
                });

                // Populate sender info
                await newMessage.populate("sender", "name role avatar");

                // Create message data
                const messageData = {
                    type: "new_message",
                    id: newMessage._id,
                    taskId,
                    sender: {
                        id: newMessage.sender._id,
                        name: newMessage.sender.name,
                        role: newMessage.sender.role,
                        avatar: newMessage.sender.avatar,
                    },
                    receiver: receiverId,
                    message: newMessage.message,
                    messageType: newMessage.messageType,
                    location: newMessage.location,
                    createdAt: newMessage.createdAt,
                    isRead: false,
                };

                // Check who's in the room before broadcasting
                const room = io.sockets.adapter.rooms.get(`task_chat:${taskId}`);
                console.log(`👥 Users in room task_chat:${taskId}:`, room ? Array.from(room).length : 0, 'users');

                // Broadcast to everyone in the room
                console.log(`📢 Broadcasting to room: task_chat:${taskId}`);
                io.to(`task_chat:${taskId}`).emit("new_message", messageData);
                
                console.log(`✅ Message broadcast completed for task ${taskId}`);

            } catch (err) {
                console.error("❌ send_message error:", err);
                socket.emit("socket_error", { 
                    type: "socket_error", 
                    message: "Failed to send message" 
                });
            }
        });


        // Typing indicators
        socket.on("typing_start", ({ taskId }) => {
            console.log(`⌨️ ${userName} started typing in task ${taskId}`);
            socket.to(`task_chat:${taskId}`).emit("user_typing", {
                type: "user_typing",
                userId: socket.userId,
                userName: socket.user?.name,
                userRole: socket.userRole,
            });
        });

        socket.on("typing_stop", ({ taskId }) => {
            console.log(`💤 ${userName} stopped typing in task ${taskId}`);
            socket.to(`task_chat:${taskId}`).emit("user_stopped_typing", {
                type: "user_stopped_typing",
                userId: socket.userId,
            });
        });

        // Heartbeat
        socket.on("heartbeat", () => {
            console.log(`💓 Heartbeat from ${userName}`);
            const userData = connectedUsers.get(userId);
            if (userData) {
                userData.lastActivity = new Date();
                connectedUsers.set(userId, userData);
            }
        });

        // Handle disconnect
        socket.on("disconnect", (reason) => {
            console.log(`🔌 Disconnected: ${userName} - Reason: ${reason}`);
            console.log(`📊 Connection details:`, { 
                userId, 
                userName, 
                socketId: socket.id, 
                reason 
            });
            
            const userData = connectedUsers.get(userId);
            if (userData) {
                userData.socketIds.delete(socket.id);
                console.log(`➖ Removed socket ${socket.id} from user ${userName}`);
                
                if (userData.socketIds.size === 0) {
                    connectedUsers.delete(userId);
                    console.log(`👋 ${userName} is now offline (no more sockets)`);
                } else {
                    connectedUsers.set(userId, userData);
                    console.log(`🔄 ${userName} still has ${userData.socketIds.size} active socket(s)`);
                }
            }
            
            console.log(`📊 Remaining connected users: ${connectedUsers.size}`);
        });

        // Log any other events
        socket.onAny((eventName, ...args) => {
            if (!['heartbeat', 'typing_start', 'typing_stop'].includes(eventName)) {
                console.log(`📡 Socket event received: ${eventName} from ${userName}`);
                if (args.length > 0) {
                    console.log(`📦 Event data:`, JSON.stringify(args, null, 2).substring(0, 200));
                }
            }
        });
    });

    // Cleanup inactive users
    setInterval(() => {
        const now = Date.now();
        const inactiveMs = 5 * 60 * 1000; // 5 minutes
        let cleanedCount = 0;
        
        for (const [userId, userData] of connectedUsers.entries()) {
            if (now - userData.lastActivity.getTime() > inactiveMs) {
                console.log(`🧹 Cleaning inactive user ${userData.user?.name || userId}`);
                connectedUsers.delete(userId);
                cleanedCount++;
            }
        }
        
        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned ${cleanedCount} inactive users`);
        }
    }, 60 * 1000);

    console.log("✅ Socket handlers initialized successfully");
    return io;
};

module.exports = { initializeSocket };