const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 8001; // Use a port different from your React app

// Middleware
app.use(cors()); // Allows your React app to make requests to this server
app.use(express.json()); // Allows the server to accept JSON data

// MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/cityzenApp"; // Your MongoDB connection string

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use('/api/auth', require('./routes/auth'));

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});