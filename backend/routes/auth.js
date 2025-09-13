// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SECRET KEY for JWT - In production, this should be in a secure .env file
const JWT_SECRET = "YourSuperSecretKey123";

// --- SIGNUP ROUTE (This is the corrected and complete version) ---
// @route   POST api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  // We are keeping the debugging logs to help find any remaining issues.
  console.log('--- New Signup Request Received ---');
  console.log('Request Body:', req.body);

  const { name, email, password, role } = req.body;

  try {
    console.log(`Step 1: Checking if user with email '${email}' already exists...`);
let user = await User.findOne({ email });

if (user) {
  console.log('Result: User found. Sending 400 error.');
  return res.status(400).json({ msg: 'User with this email already exists' });
}

console.log('Result: User does not exist. Continuing...');
console.log('Step 2: Creating new user instance in memory...');
user = new User({ name, email, password, role });
console.log('Result: Instance created.');

console.log('Step 3: Attempting to save user to database...');
// The pre-save hook in your User.js model will hash the password here
await user.save();
console.log('Result: User saved to database successfully!');

console.log('--- Sending success response to browser ---');
res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
  console.error('---!! AN ERROR OCCURRED during signup !!---');
  console.error(err); // Log the full error
  res.status(500).send('Server Error');
}
});


// --- LOGIN ROUTE (This code was already correct) ---
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
        name: user.name,
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