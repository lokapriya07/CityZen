// // models/Report.js
// const mongoose = require("mongoose");

// const TimelineSchema = new mongoose.Schema({
//   status: { type: String, required: true },
//   time: { type: Date, required: true },
// });

// const ReportSchema = new mongoose.Schema({
//   type: { type: String, required: true },
//   location: { type: String, required: true },
//   description: { type: String, required: true },
//   citizenName: { type: String },
//   status: { type: String, default: "submitted" },
//   reportedAt: { type: Date, default: Date.now },
//   estimatedCompletion: { type: Date },
//   progress: { type: Number, default: 10 },
//   timeline: [TimelineSchema],
// });

// module.exports = mongoose.model("Report", ReportSchema);
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  // --- Identifiers & Assignments ---
  complaintId: { type: String, required: true, unique: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // --- Reporter Info (from form) ---
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: String,

  // --- Location Info (from form) ---
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  gpsCoordinates: String,

  // --- Waste Details (from form) ---
  wasteType: { type: String, required: true }, // Using wasteType to match the form
  wasteAmount: { type: String, required: true },
  urgency: { type: String, required: true },
  description: { type: String, required: true },

  // --- Additional Info (from form) ---
  preferredContact: String,
  previousReports: String,

  // --- System Managed Fields ---
  images: [{ url: String, publicId: String }],
  status: { type: String, default: "pending" },
  timeline: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

module.exports = mongoose.model("Report", ReportSchema);