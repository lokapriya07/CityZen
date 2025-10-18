// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { initializeSocket } = require("./sockets/sock");
require("dotenv").config();


const app = express();
const PORT = 8001;

// Basic env check
if (!process.env.JWT_SECRET) {
  console.error("❌ process.env.JWT_SECRET is not defined. Set JWT_SECRET and restart.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cityzenApp";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/worker", require("./routes/worker"));
app.use("/api/notifications", require("./routes/notify"));

// Create HTTP server + Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*", // set to frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Initialize sockets
initializeSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
