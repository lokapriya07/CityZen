// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// --- SIGNUP ROUTE ---
// @route   POST api/auth/signup
// @desc    Register a new user and save their location + phone if worker
router.post('/signup', async (req, res) => {
  console.log('--- New Signup Request Received ---');
  console.log('Request Body:', req.body);

  const { name, email, password, role, latitude, longitude, phone } = req.body;

  try {
    console.log(`Step 1: Checking if user with email '${email}' already exists...`);
    let user = await User.findOne({ email });

    if (user) {
      console.log('Result: User found. Sending 400 error.');
      return res.status(400).json({ success: false, msg: 'User with this email already exists' });
    }

    console.log('Result: User does not exist. Continuing...');
    console.log('Step 2: Creating new user instance in memory...');

    const userData = { name, email, password, role };

    // Handle worker-specific details
    if (role === 'worker') {
      userData.workerDetails = {};

      if (phone) userData.phone = phone;

      if (latitude && longitude) {
        userData.workerDetails.currentLocation = {
          latitude: latitude,
          longitude: longitude,
          timestamp: new Date(),
        };
      }

      userData.isActive = true;
    }

    user = new User(userData);
    console.log('Result: Instance created with data:', userData);

    console.log('Step 3: Attempting to save user to database...');
    await user.save();
    console.log('Result: User saved to database successfully!');

    console.log('--- Sending success response to browser ---');
    return res.status(201).json({
      success: true,
      msg: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('---!! AN ERROR OCCURRED during signup !!---');
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      details: err.message,
    });
  }
});

// --- LOGIN ROUTE ---
// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found for email:', email);
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    const payload = { id: user.id, role: user.role };
    const tokenOptions = { expiresIn: '10y' };
    const token = jwt.sign(payload, JWT_SECRET, tokenOptions);

    let tokenKey = 'authToken';
    if (user.role === 'worker') tokenKey = 'workerToken';
    else if (user.role === 'admin') tokenKey = 'adminToken';

    console.log('Login successful for:', email);

    return res.status(200).json({
      success: true,
      [tokenKey]: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error('---!! LOGIN ERROR !!---');
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      details: err.message,
    });
  }
});

module.exports = router;
