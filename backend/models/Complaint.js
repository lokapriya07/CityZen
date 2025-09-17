// models/Complaint.js
const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: String,
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  gpsLocation: Boolean,
  gpsCoordinates: String,
  wasteType: { type: String, required: true },
  wasteAmount: String,
  description: { type: String, required: true },
  urgency: String,
  previousReports: String,
  preferredContact: String,
  updates: Boolean,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
