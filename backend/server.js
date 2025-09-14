const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 8001; // Use a port different from your React app

app.use(cors()); // allow frontend requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/cityzenApp"; // Your MongoDB connection string

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports',require('./routes/reports'));
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
const workerRoutes = require("./routes/worker");
app.use("/api/worker", workerRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});