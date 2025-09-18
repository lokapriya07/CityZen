const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'worker', 'admin'],
    default: 'user',
  },
  // isActive applies to ALL roles (admin/worker status)
  isActive: {
    type: Boolean,
    default: true,
  },

  // 💡 workerDetails is now treated as an OPTIONAL sub-document
  // It should only be populated/updated when role === 'worker'

  workerDetails: {
    type: { // Define the structure of the workerDetails object
      employeeId: { type: String, unique: true, sparse: true },
      phone: { type: String },
      specialization: {
        type: [String],
        default: ['general waste'],
        enum: ['general waste', 'recycling', 'hazardous waste', 'illegal dumping', 'organic waste', 'composting'],
      },
      currentLocation: { // Used for distance calculation
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 },
        // 🚨 ADD THIS FIELD 🚨
        timestamp: { type: Date, default: Date.now },
      },
      points: { type: Number, default: 0 },
      avatar: { type: String },
    },
  },
});

// This special function runs *before* a user is saved
// It automatically hashes the password for security
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);