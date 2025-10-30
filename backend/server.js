// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");
// const { initializeSocket } = require("./sockets/socketHandler");
// require("dotenv").config();
// const cookieParser = require("cookie-parser");

// const app = express();
// const PORT = 8001;

// // Basic env check
// if (!process.env.JWT_SECRET) {
//   console.error("❌ process.env.JWT_SECRET is not defined. Set JWT_SECRET and restart.");
//   process.exit(1);
// }

// // Middleware
// // ✅ This is the fix
// app.use(cors({
//   origin: ["http://localhost:3000", "http://localhost:3001"], // Added worker frontend
//   credentials: true                // Allow cookies/credentials
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cityzenApp";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected successfully"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Routes
// app.use(cookieParser());
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/reports", require("./routes/reports"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/worker", require("./routes/worker"));
// app.use("/api/notifications", require("./routes/notify"));
// const userRoutes = require("./routes/user");
// app.use("/api/users", userRoutes); 

// // ✅ ADD THIS LINE - Message routes
// app.use("/api/messages", require("./routes/messages"));

// // Create HTTP server + Socket.IO
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000", "http://localhost:3001"], // Both frontends
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// });

// // Initialize sockets
// initializeSocket(io);

// // Start server
// server.listen(PORT, () => {
//   console.log(`✅ Server is running on http://localhost:${PORT}`);
//   console.log(`💬 WebSocket server available at ws://localhost:${PORT}`);
// });
// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { initializeSocket } = require("./sockets/socketHandler");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8001;

// Basic env check
if (!process.env.JWT_SECRET) {
  console.error("❌ process.env.JWT_SECRET is not defined. Set JWT_SECRET and restart.");
  process.exit(1);
}

console.log("🚀 Starting server initialization...");

// Middleware
console.log("🔧 Setting up middleware...");
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // Added worker frontend
  credentials: true                // Allow cookies/credentials
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
console.log("📦 Connecting to MongoDB...");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cityzenApp";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
console.log("🛣️ Setting up routes...");
app.use(cookieParser());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/worker", require("./routes/worker"));
app.use("/api/notifications", require("./routes/notify"));
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes); 

// ✅ ADD THIS LINE - Message routes
console.log("💬 Setting up message routes...");
app.use("/api/messages", require("./routes/messages"));

// Create HTTP server + Socket.IO
console.log("🔌 Creating HTTP server and Socket.IO...");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Both frontends
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Add Socket.IO connection logging
io.on("connection", (socket) => {
  console.log(`🔗 New client connected: ${socket.id}`);
  
  socket.on("disconnect", (reason) => {
    console.log(`🔌 Client disconnected: ${socket.id}, Reason: ${reason}`);
  });
  
  socket.on("error", (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// Initialize sockets
console.log("🔧 Initializing socket handlers...");
initializeSocket(io);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Add specific logging for message routes
app.use("/api/messages", (req, res, next) => {
  console.log(`💬 Message API call: ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`💬 WebSocket server available at ws://localhost:${PORT}`);
  console.log("📋 Server startup completed successfully");
});

// FIXED: Graceful shutdown - corrected Mongoose connection close
process.on('SIGINT', async () => {
  console.log('🛑 Server shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ HTTP server closed.');
    
    // Fixed Mongoose connection close - no callback in newer versions
    mongoose.connection.close()
      .then(() => {
        console.log('✅ MongoDB connection closed.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('❌ Error closing MongoDB connection:', err);
        process.exit(1);
      });
  });
});