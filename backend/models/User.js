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

  // --- 💡 FIX 1: Moved fields to the top level ---
  points: {
    type: Number,
    default: 0,
  },
  phone: {
    type: String,
    // This function makes 'phone' required ONLY if role is 'worker'
    required: function () { return this.role === 'worker'; }
  },
  avatar: {
    type: String,
    // A default image can prevent UI bugs if one isn't provided
    default: 'https://i.pravatar.cc/150', // A placeholder image service
    // This function makes 'avatar' required ONLY if role is 'worker'
    required: function () { return this.role === 'worker'; }
  },

  // This object is only populated when role === 'worker'
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
    },

    // --- 💡 FIX 2: Removed 'points' from here ---
    // points: { type: Number, default: 0 }, 
    // 'avatar' and 'phone' were also incorrectly here
  },
});

// This special function runs *before* a user is saved
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);