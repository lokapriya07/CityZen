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
  wasteType: { type: String, required: true },
  wasteAmount: { type: String, required: true },
  urgency: { type: String, required: true },
  
  // =========================================================================
  // MODIFIED: 'required' is now set to 'false' for the description.
  // =========================================================================
  description: { type: String, required: false },

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