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
  isActive: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: Number // Or String, Number matches our logic
  },
  otpExpires: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  points: {
    type: Number,
    default: 0,
  },
  phone: {
    type: String,
    required: function () { return this.role === 'worker'; }
  },
  avatar: {
    type: String,
    default: 'https://i.pravatar.cc/150',
    required: function () { return this.role === 'worker'; }
  },

  workerDetails: {
    employeeId: { type: String, unique: true, sparse: true },
    specialization: {
      type: [String],
      default: ['general waste'],
      enum: [
        'general waste',
        'recycling',
        'hazardous waste',
        'illegal dumping',
        'organic waste',
        'composting',
      ],
    },
    currentLocation: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
      timestamp: { type: Date, default: Date.now },
      // 💡 ADDED: Address text field for the worker's location
      address: { type: String, default: "" },
    },
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);