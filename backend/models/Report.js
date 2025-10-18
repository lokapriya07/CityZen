const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: String,

  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0],
    },
    address: { type: String },
  },

  wasteType: { type: String, required: true },
  wasteAmount: { type: String, required: true },
  urgency: { type: String, required: true },
  description: { type: String, required: false },

  preferredContact: String,
  previousReports: String,

  images: [{ url: String, publicId: String }],
  status: { type: String, default: "pending" },
  timeline: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  completedAt: Date,

  // ======================================================
  // ✅ ADD THIS SECTION
  // This adds the fields to store feedback in the database
  // It matches the logic in your routes/reports.js file
  // ======================================================
  feedback: {
    serviceRating: { type: Number, min: 1, max: 5 },
    workerRating: { type: Number, min: 0, max: 5 },
    comments: { type: String, trim: true, maxlength: 500 },
    submittedAt: { type: Date }
  },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", ReportSchema);