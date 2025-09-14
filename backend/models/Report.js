const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ add this

  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: String,
  address: { type: String, required: true },
  city: String,
  pincode: String,
  state: String,
  gpsCoordinates: String,

  wasteType: { type: String, required: true },
  wasteAmount: { type: String, required: true },
  urgency: { type: String, required: true },
  description: { type: String, required: true },

  preferredContact: String,
  previousReports: String,

  images: [{ url: String, publicId: String }],
  completionImages: [{ url: String, publicId: String, uploadedAt: Date }],

  status: { type: String, default: "pending" },
  workerNotes: String,
  feedback: {
    rating: Number,
    comment: String,
    submittedAt: Date,
  },
  timeline: [
    {
      status: String,
      timestamp: Date,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      notes: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});


module.exports = mongoose.model("Report", ReportSchema);
