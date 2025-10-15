// server/routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// SECRET KEY for JWT - In production, this should be in a secure .env file
const JWT_SECRET = process.env.JWT_SECRET;

// --- SIGNUP ROUTE (UPDATED) ---
// @route   POST api/auth/signup
// @desc    Register a new user and save their location if they are a worker
router.post('/signup', async (req, res) => {
  console.log('--- New Signup Request Received ---');
  console.log('Request Body:', req.body);

  const { name, email, password, role, latitude, longitude } = req.body;

  try {
    console.log(`Step 1: Checking if user with email '${email}' already exists...`);
    let user = await User.findOne({ email });

    if (user) {
      console.log('Result: User found. Sending 400 error.');
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    console.log('Result: User does not exist. Continuing...');
    console.log('Step 2: Creating new user instance in memory...');

    const userData = { name, email, password, role };

    // 🚨 NEW LOGIC: Only save location if the role is 'worker' and location data is available
    if (role === 'worker' && latitude && longitude) {
      userData.workerDetails = {
        currentLocation: {
          latitude: latitude,
          longitude: longitude,
          timestamp: new Date(),
        },
      };
      userData.isActive = true;
    }

    user = new User(userData);
    console.log('Result: Instance created with data:', userData);

    console.log('Step 3: Attempting to save user to database...');
    await user.save();
    console.log('Result: User saved to database successfully!');

    console.log('--- Sending success response to browser ---');
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error('---!! AN ERROR OCCURRED during signup !!---');
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// --- LOGIN ROUTE (Unchanged, provided for context) ---
// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user.id, role: user.role };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || JWT_SECRET,
      { expiresIn: '10y' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;