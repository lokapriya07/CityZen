// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Needed to compare passwords
const jwt = require('jsonwebtoken'); // Needed to create a login token

// SECRET KEY for JWT - In production, this should be in a secure .env file
const JWT_SECRET = "YourSuperSecretKey123";

// --- SIGNUP ROUTE (You already have this) ---
router.post('/signup', async (req, res) => {
  // ... your existing signup code ...
});


// --- LOGIN ROUTE (Add this new block) ---
// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the submitted password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. If credentials are correct, create a JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name, // Include user's name in the token payload
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        // 4. Send the token and user info back to the frontend
        res.json({
          token,
          user: {
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