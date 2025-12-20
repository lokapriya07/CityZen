const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

class SocketServer {
    constructor(server) {
        this.io = socketIO(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });

        this.connectedUsers = new Map(); // userId -> socketId
        this.connectedWorkers = new Map(); // workerId -> socketId

        this.setupMiddleware();
        this.setupEventHandlers();
    }

    setupMiddleware() {
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                socket.userId = decoded.userId || decoded.id;
                socket.userType = decoded.userType || 'citizen';
                next();
            } catch (error) {
                next(new Error('Authentication error: Invalid token'));
            }
        });
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`User ${socket.userId} (${socket.userType}) connected`);

            // Store user connection
            if (socket.userType === 'worker') {
                this.connectedWorkers.set(socket.userId, socket.id);
            } else {
                this.connectedUsers.set(socket.userId, socket.id);
            }

            // Join task-specific room for targeted messaging
            socket.on('join-task', (taskId) => {
                socket.join(`task-${taskId}`);
                console.log(`User ${socket.userId} joined task-${taskId}`);
            });

            // Leave task room
            socket.on('leave-task', (taskId) => {
                socket.leave(`task-${taskId}`);
                console.log(`User ${socket.userId} left task-${taskId}`);
            });

            // Handle sending messages
            socket.on('send-message', async (data) => {
                try {
                    const { taskId, message, senderId, senderType, senderName } = data;

                    const messageData = {
                        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        taskId,
                        message,
                        senderId,
                        senderType,
                        senderName,
                        createdAt: new Date().toISOString(),
                        read: false
                    };

                    // Save message to database (you'll implement this)
                    const savedMessage = await this.saveMessageToDatabase(messageData);

                    // Broadcast to all users in the task room
                    this.io.to(`task-${taskId}`).emit('new-message', savedMessage);

                    // Emit notification to specific user/worker
                    this.emitNotification(taskId, savedMessage, senderType);

                } catch (error) {
                    console.error('Error sending message:', error);
                    socket.emit('message-error', { error: 'Failed to send message' });
                }
            });

            // Handle message read receipts
            socket.on('mark-messages-read', (data) => {
                const { taskId, userId } = data;
                this.io.to(`task-${taskId}`).emit('messages-read', { taskId, userId });
            });

            // Handle typing indicators
            socket.on('typing-start', (data) => {
                const { taskId, userName } = data;
                socket.to(`task-${taskId}`).emit('user-typing', {
                    taskId,
                    userName,
                    typing: true
                });
            });

            socket.on('typing-stop', (data) => {
                const { taskId } = data;
                socket.to(`task-${taskId}`).emit('user-typing', {
                    taskId,
                    typing: false
                });
            });

            socket.on('disconnect', () => {
                console.log(`User ${socket.userId} disconnected`);

                if (socket.userType === 'worker') {
                    this.connectedWorkers.delete(socket.userId);
                } else {
                    this.connectedUsers.delete(socket.userId);
                }
            });
        });
    }

    async saveMessageToDatabase(messageData) {
        // Implement your database logic here
        // This is a simplified example - replace with your actual database calls

        const message = {
            _id: messageData.id,
            taskId: messageData.taskId,
            message: messageData.message,
            senderId: messageData.senderId,
            senderType: messageData.senderType,
            senderName: messageData.senderName,
            createdAt: messageData.createdAt,
            read: false
        };

        // Example using a mock database
        // const db = require('./database');
        // return await db.messages.create(message);

        return message;
    }

    emitNotification(taskId, message, senderType) {
        // If citizen sent message, notify worker and vice versa
        const targetType = senderType === 'citizen' ? 'worker' : 'citizen';

        // You would typically fetch the target user ID from your database
        // based on the taskId and senderType

        this.io.emit('new-notification', {
            taskId,
            message: `New message from ${message.senderName}`,
            type: 'message',
            createdAt: new Date().toISOString()
        });
    }

    // Utility method to send notifications to specific users
    sendToUser(userId, event, data) {
        const socketId = this.connectedUsers.get(userId) || this.connectedWorkers.get(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, data);
        }
    }

    // Utility method to send to all users in a task
    sendToTask(taskId, event, data) {
        this.io.to(`task-${taskId}`).emit(event, data);
    }
}

module.exports = SocketServer;