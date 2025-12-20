// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const Task = require("../models/Task");
// const Message = require("../models/Message");

// const connectedUsers = new Map();

// const authenticateSocket = async (socket, next) => {
//     try {
//         console.log(`🔐 Starting socket authentication for socket: ${socket.id}`);
//         const token = socket.handshake.auth?.token || socket.handshake.query?.token;

//         if (!token) {
//             console.error("❌ No token provided for socket authentication");
//             return next(new Error("Authentication error: No token provided"));
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id).select("-password");

//         if (!user || !user.isActive) {
//             console.error("❌ Invalid or inactive user");
//             return next(new Error("Authentication error: Invalid or inactive user"));
//         }

//         socket.userId = user._id.toString();
//         socket.userRole = user.role;
//         socket.user = user;

//         console.log(`✅ Socket authenticated successfully for: ${user.name} (${user.role})`);
//         next();
//     } catch (error) {
//         console.error("❌ Socket auth error:", error.message);
//         next(new Error("Authentication error: Invalid token"));
//     }
// };

// const initializeSocket = (io) => {
//     console.log("🔧 Initializing socket handlers...");

//     io.use(authenticateSocket);

//     io.on("connection", (socket) => {
//         const userId = socket.userId;
//         const userName = socket.user?.name || "Unknown User";
//         const userRole = socket.userRole;

//         console.log(`🔌 New connection: ${userName} (${userRole}) - Socket ID: ${socket.id}`);

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
//         socket.join(`role:${userRole}`);

//         console.log(`🚪 User joined rooms: user:${userId}, role:${userRole}`);

//         // Send connection confirmation
//         socket.emit("connected", {
//             type: "connected",
//             message: "Connected to messaging service",
//             user: socket.user,
//         });

//         // ------------------------------------------------------------------
//         // ✅ FIXED JOIN TASK CHAT HANDLER
//         // ------------------------------------------------------------------
//         socket.on("join_task_chat", async ({ taskId }) => {
//             try {
//                 console.log(`💬 ${userName} (${userRole}) joining task chat: ${taskId}`);

//                 // Verify task exists
//                 const task = await Task.findById(taskId);
//                 if (!task) {
//                     socket.emit("socket_error", {
//                         type: "socket_error",
//                         message: "Task not found"
//                     });
//                     return;
//                 }

//                 // Join the room
//                 socket.join(`task_chat:${taskId}`);

//                 console.log(`✅ ${userName} joined task chat room: task_chat:${taskId}`);

//                 // Send confirmation
//                 socket.emit("joined_task_chat", {
//                     type: "joined_task_chat",
//                     taskId,
//                     message: "Joined task chat successfully"
//                 });

//                 // Send message history
//                 const messages = await Message.find({ taskId })
//                     .populate("sender", "name role avatar")
//                     .sort({ createdAt: 1 })
//                     .limit(100);

//                 console.log(`📨 Sending ${messages.length} messages to ${userName}`);

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
//                 console.error("❌ join_task_chat error:", err);
//                 socket.emit("socket_error", {
//                     type: "socket_error",
//                     message: "Failed to join task chat"
//                 });
//             }
//         });

//         // ------------------------------------------------------------------
//         // ✅ FIXED SEND MESSAGE HANDLER (NO DUPLICATION)
//         // ------------------------------------------------------------------
//         socket.on("send_message", async (data, callback) => {
//             try {
//                 const { taskId, message, messageType = "text", location = null } = data;

//                 console.log(`📤 [SEND_MESSAGE] ${userName} (${userRole}) sending to task ${taskId}:`, message);

//                 // Validate input
//                 if (!message || !taskId) {
//                     socket.emit("socket_error", {
//                         type: "socket_error",
//                         message: "Message and taskId are required"
//                     });
//                     return;
//                 }

//                 // Find task and determine receiver
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

//                 let receiverId;

//                 // ✅ FIXED: Handle all role types properly
//                 if (userRole === "citizen" || userRole === "user") {
//                     // Citizen/User sends to assigned worker
//                     receiverId = task.assignedWorker?._id;
//                     console.log(`👥 Citizen/User sending to worker: ${receiverId}`);
//                 } else if (userRole === "worker") {
//                     // Worker sends to report creator (citizen)
//                     receiverId = task.report?.createdBy;
//                     console.log(`👥 Worker sending to citizen: ${receiverId}`);
//                 } else if (userRole === "admin") {
//                     // Admin can send to anyone, default to assigned worker
//                     receiverId = task.assignedWorker?._id;
//                 }

//                 // ✅ FIX: If no receiver found, don't send message
//                 if (!receiverId) {
//                     console.log(`❌ No receiver found for task ${taskId}`);
//                     socket.emit("socket_error", {
//                         type: "socket_error",
//                         message: "No recipient found for this message"
//                     });
//                     return;
//                 }

//                 // ✅ Save message to database FIRST
//                 const newMessage = await Message.create({
//                     taskId,
//                     sender: socket.userId,
//                     receiver: receiverId,
//                     message: message.trim(),
//                     messageType,
//                     location: messageType === "location" ? location : null,
//                     isRead: false,
//                 });

//                 // Populate sender info
//                 await newMessage.populate("sender", "name role avatar");

//                 // Create message data for broadcasting
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
//                     isRead: false,
//                 };

//                 // ✅ BROADCAST to everyone in the task chat room
//                 console.log(`📢 Broadcasting message to room: task_chat:${taskId}`);
//                 io.to(`task_chat:${taskId}`).emit("new_message", messageData);

//                 // ✅ ALSO send to receiver's user room if they're not in task chat
//                 io.to(`user:${receiverId}`).emit("new_message", messageData);

//                 console.log(`✅ Message saved and broadcast successfully for task ${taskId}`);

//                 // Send acknowledgment to sender
//                 if (callback) {
//                     callback({
//                         success: true,
//                         messageId: newMessage._id
//                     });
//                 }

//             } catch (err) {
//                 console.error("❌ send_message error:", err);
//                 socket.emit("socket_error", {
//                     type: "socket_error",
//                     message: "Failed to send message"
//                 });

//                 if (callback) {
//                     callback({
//                         success: false,
//                         error: err.message
//                     });
//                 }
//             }
//         });

//         // ------------------------------------------------------------------
//         // ✅ NEW: MARK MESSAGES AS READ
//         // ------------------------------------------------------------------
//         socket.on("mark_messages_read", async ({ taskId }) => {
//             try {
//                 await Message.updateMany(
//                     {
//                         taskId,
//                         receiver: socket.userId,
//                         isRead: false
//                     },
//                     {
//                         isRead: true,
//                         readAt: new Date()
//                     }
//                 );

//                 console.log(`✅ Messages marked as read for ${userName} in task ${taskId}`);
//             } catch (err) {
//                 console.error("❌ mark_messages_read error:", err);
//             }
//         });

//         // Typing indicators
//         socket.on("typing_start", ({ taskId }) => {
//             socket.to(`task_chat:${taskId}`).emit("user_typing", {
//                 type: "user_typing",
//                 userId: socket.userId,
//                 userName: socket.user?.name,
//                 userRole: userRole,
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
//             console.log(`🔌 Disconnected: ${userName} - Reason: ${reason}`);

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
//         const inactiveMs = 5 * 60 * 1000;

//         for (const [userId, userData] of connectedUsers.entries()) {
//             if (now - userData.lastActivity.getTime() > inactiveMs) {
//                 console.log(`🧹 Cleaning inactive user ${userData.user?.name || userId}`);
//                 connectedUsers.delete(userId);
//             }
//         }
//     }, 60 * 1000);

//     console.log("✅ Socket handlers initialized successfully");
//     return io;
// };

// module.exports = { initializeSocket };
// socket.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Task = require("../models/Task");
const Message = require("../models/Message");

const connectedUsers = new Map();

const authenticateSocket = async (socket, next) => {
    try {
        console.log(`🔐 Starting socket authentication for socket: ${socket.id}`);
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;

        if (!token) {
            console.error("❌ No token provided for socket authentication");
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

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
        const userRole = socket.userRole;

        console.log(`🔌 New connection: ${userName} (${userRole}) - Socket ID: ${socket.id}`);

        // Add to connected users
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, {
                socketIds: new Set([socket.id]),
                user: socket.user,
                lastActivity: new Date(),
            });
        } else {
            const userData = connectedUsers.get(userId);
            userData.socketIds.add(socket.id);
            userData.lastActivity = new Date();
            connectedUsers.set(userId, userData);
        }

        // Join user and role rooms
        socket.join(`user:${userId}`);
        socket.join(`role:${userRole}`);

        console.log(`🚪 User joined rooms: user:${userId}, role:${userRole}`);

        // Send connection confirmation
        socket.emit("connected", {
            type: "connected",
            message: "Connected to messaging service",
            user: socket.user,
        });

        // ✅ FIXED JOIN TASK CHAT HANDLER - BETTER ACCESS CONTROL
        socket.on("join_task_chat", async ({ taskId, userType }) => {
            try {
                console.log(`💬 ${userName} (${userRole}) joining task chat: ${taskId}`);

                // Verify task exists
                const task = await Task.findById(taskId)
                    .populate("assignedWorker")
                    .populate("report");

                if (!task) {
                    socket.emit("socket_error", {
                        type: "socket_error",
                        message: "Task not found"
                    });
                    return;
                }

                // ✅ FIXED: Enhanced Access Control Logic
                let hasAccess = false;

                if (userRole === "admin") {
                    hasAccess = true;
                } else if (userRole === "citizen" || userRole === "user") {
                    // Check if user is the report creator
                    hasAccess = task.report?.createdBy?.toString() === userId;
                } else if (userRole === "worker") {
                    // Check if user is the assigned worker
                    hasAccess = task.assignedWorker?._id?.toString() === userId;
                }

                console.log(`🔐 Access Check for ${userName}:`, {
                    userRole,
                    userId,
                    reportCreator: task.report?.createdBy?.toString(),
                    assignedWorker: task.assignedWorker?._id?.toString(),
                    hasAccess
                });

                if (!hasAccess) {
                    console.log(`❌ Access denied for ${userName} to task ${taskId}`);
                    socket.emit("socket_error", {
                        type: "socket_error",
                        message: "Access denied to this task chat"
                    });
                    return;
                }

                // Join the room
                socket.join(`task_chat:${taskId}`);

                console.log(`✅ ${userName} joined task chat room: task_chat:${taskId}`);

                // Send confirmation
                socket.emit("joined_task_chat", {
                    type: "joined_task_chat",
                    taskId,
                    message: "Joined task chat successfully"
                });

                // Get ALL messages for this task
                const messages = await Message.find({ taskId })
                    .populate("sender", "name role avatar")
                    .sort({ createdAt: 1 })
                    .limit(100);

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

                // Mark messages as read for this user
                await Message.updateMany(
                    {
                        taskId,
                        receiver: userId,
                        isRead: false
                    },
                    {
                        isRead: true,
                        readAt: new Date()
                    }
                );

            } catch (err) {
                console.error("❌ join_task_chat error:", err);
                socket.emit("socket_error", {
                    type: "socket_error",
                    message: "Failed to join task chat"
                });
            }
        });

        // ✅ FIXED SEND MESSAGE HANDLER - PROPER MESSAGE ROUTING
        socket.on("send_message", async (data, callback) => {
            try {
                const { taskId, message, messageType = "text", location = null } = data;

                if (!message || !taskId) {
                    throw new Error("Message and taskId are required");
                }

                // Find task and determine participants
                const task = await Task.findById(taskId)
                    .populate("assignedWorker")
                    .populate("report");

                if (!task) {
                    throw new Error("Task not found");
                }

                // ✅ FIXED: Enhanced receiver determination
                let receiverId;
                const citizenId = task.report?.createdBy;
                const workerId = task.assignedWorker?._id;

                if (userRole === "citizen" || userRole === "user") {
                    // Citizen/User sends to assigned worker
                    receiverId = workerId;
                } else if (userRole === "worker") {
                    // Worker sends to report creator (citizen)
                    receiverId = citizenId;
                } else if (userRole === "admin") {
                    // Admin can send to both, default to worker
                    receiverId = workerId || citizenId;
                }

                if (!receiverId) {
                    throw new Error("No valid recipient found for this message.");
                }

                // Save message to database FIRST
                const newMessage = await Message.create({
                    taskId,
                    sender: socket.userId,
                    receiver: receiverId,
                    message: message.trim(),
                    messageType,
                    location: messageType === "location" ? location : null,
                    isRead: false,
                });

                // Populate sender info
                await newMessage.populate("sender", "name role avatar");

                // Create message data for broadcasting
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

                // ✅ FIXED: Broadcast to ALL participants in the task room
                io.to(`task_chat:${taskId}`).emit("new_message", messageData);

                console.log(`✅ Message saved and broadcast successfully for task ${taskId} from ${userName} to ${receiverId}`);

                // Send acknowledgment to sender
                if (callback) {
                    callback({
                        success: true,
                        messageId: newMessage._id
                    });
                }

            } catch (err) {
                console.error("❌ send_message error:", err);
                socket.emit("socket_error", {
                    type: "socket_error",
                    message: "Failed to send message: " + err.message
                });

                if (callback) {
                    callback({
                        success: false,
                        error: err.message
                    });
                }
            }
        });

        // MARK MESSAGES AS READ
        socket.on("mark_messages_read", async ({ taskId }) => {
            try {
                const result = await Message.updateMany(
                    {
                        taskId,
                        receiver: userId,
                        isRead: false
                    },
                    {
                        isRead: true,
                        readAt: new Date()
                    }
                );

                console.log(`✅ ${result.modifiedCount} messages marked as read for ${userName} in task ${taskId}`);
            } catch (err) {
                console.error("❌ mark_messages_read error:", err);
            }
        });

        // Get unread message counts
        socket.on("get_unread_count", async () => {
            try {
                const count = await Message.countDocuments({
                    receiver: userId,
                    isRead: false
                });

                socket.emit("unread_count", {
                    type: "unread_count",
                    count
                });
            } catch (err) {
                console.error("❌ get_unread_count error:", err);
            }
        });

        // Typing indicators
        socket.on("typing_start", ({ taskId }) => {
            socket.to(`task_chat:${taskId}`).emit("user_typing", {
                type: "user_typing",
                userId: userId,
                userName: userName,
                userRole: userRole,
            });
        });

        socket.on("typing_stop", ({ taskId }) => {
            socket.to(`task_chat:${taskId}`).emit("user_stopped_typing", {
                type: "user_stopped_typing",
                userId: userId,
            });
        });

        // Heartbeat
        socket.on("heartbeat", () => {
            const userData = connectedUsers.get(userId);
            if (userData) {
                userData.lastActivity = new Date();
                connectedUsers.set(userId, userData);
            }
        });

        // Handle disconnect
        socket.on("disconnect", (reason) => {
            console.log(`🔌 Disconnected: ${userName} - Reason: ${reason}`);

            const userData = connectedUsers.get(userId);
            if (userData) {
                userData.socketIds.delete(socket.id);

                if (userData.socketIds.size === 0) {
                    connectedUsers.delete(userId);
                    console.log(`👋 ${userName} is now offline`);
                } else {
                    connectedUsers.set(userId, userData);
                }
            }
        });
    });

    // Cleanup inactive users
    setInterval(() => {
        const now = Date.now();
        const inactiveMs = 5 * 60 * 1000;
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