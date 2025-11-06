// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// // --- SIGNUP ROUTE ---
// // @route   POST api/auth/signup
// // @desc    Register a new user and save their location + phone if worker
// router.post('/signup', async (req, res) => {
//   console.log('--- New Signup Request Received ---');
//   console.log('Request Body:', req.body);

//   const { name, email, password, role, latitude, longitude, phone } = req.body;

//   try {
//     console.log(`Step 1: Checking if user with email '${email}' already exists...`);
//     let user = await User.findOne({ email });

//     if (user) {
//       console.log('Result: User found. Sending 400 error.');
//       return res.status(400).json({ success: false, msg: 'User with this email already exists' });
//     }

//     console.log('Result: User does not exist. Continuing...');
//     console.log('Step 2: Creating new user instance in memory...');

//     // ✅✅✅ THE FIX IS HERE ✅✅✅
//     // Add 'phone' to the main userData object
//     const userData = { name, email, password, role, phone };

//     // Handle worker-specific details
//     if (role === 'worker') {
//       userData.workerDetails = {};

//       if (phone) userData.phone = phone;

//       if (latitude && longitude) {
//         userData.workerDetails.currentLocation = {
//           latitude: latitude,
//           longitude: longitude,
//           timestamp: new Date(),
//         };
//       }

//       userData.isActive = true;
//     }

//     user = new User(userData);
//     console.log('Result: Instance created with data:', userData);

//     console.log('Step 3: Attempting to save user to database...');
//     await user.save();
//     console.log('Result: User saved to database successfully!');

//     console.log('--- Sending success response to browser ---');
//     return res.status(201).json({
//       success: true,
//       msg: 'User registered successfully',
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (err) {
//     console.error('---!! AN ERROR OCCURRED during signup !!---');
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error',
//       details: err.message,
//     });
//   }
// });

// // --- LOGIN ROUTE ---
// // @route   POST api/auth/login
// // @desc    Authenticate user & get token
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log('Login attempt:', email);

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log('No user found for email:', email);
//       return res.status(400).json({ success: false, msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log('Password mismatch for:', email);
//       return res.status(400).json({ success: false, msg: 'Invalid credentials' });
//     }

//     const payload = { id: user.id, role: user.role };
//     const tokenOptions = { expiresIn: '10y' };
//     const token = jwt.sign(payload, JWT_SECRET, tokenOptions);

//     let tokenKey = 'authToken';
//     if (user.role === 'worker') tokenKey = 'workerToken';
//     else if (user.role === 'admin') tokenKey = 'adminToken';

//     console.log('Login successful for:', email);

//     return res.status(200).json({
//       success: true,
//       [tokenKey]: token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (err) {
//     console.error('---!! LOGIN ERROR !!---');
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error',
//       details: err.message,
//     });
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User'); // Make sure your User model is imported
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto'); // Node.js module for generating random numbers
// const nodemailer = require('nodemailer'); // For sending emails
// require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// // --- Nodemailer Transport Setup ---
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com"
//   port: process.env.EMAIL_PORT || 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_USER, // e.g., "your-email@gmail.com"
//     pass: process.env.EMAIL_PASS, // e.g., "your-gmail-app-password"
//   },
// });

// // --- SIGNUP ROUTE ---
// // @route   POST api/auth/signup
// // @desc    Register a new user, send OTP
// router.post('/signup', async (req, res) => {
//   console.log('--- New Signup Request Received ---');
//   console.log('Request Body:', req.body);

//   const { name, email, password, role, latitude, longitude, phone } = req.body;

//   try {
//     console.log(`Step 1: Checking if user with email '${email}' already exists...`);
//     let user = await User.findOne({ email });

//     if (user && user.isVerified) {
//       console.log('Result: Verified user found. Sending 400 error.');
//       return res.status(400).json({ success: false, msg: 'User with this email already exists' });
//     }

//     // Generate 6-digit OTP
//     const otp = crypto.randomInt(100000, 999999).toString();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
//     console.log(`Step 2: Generated OTP: ${otp} (Expires: ${otpExpires.toLocaleTimeString()})`);

//     const userData = {
//       name,
//       email,
//       password, // Will be hashed by the pre-save hook
//       role,
//       phone,
//       otp, // This is what might not be saving!
//       otpExpires,
//       isVerified: false,
//     };

//     // Handle worker-specific details
//     if (role === 'worker') {
//       userData.workerDetails = {};
//       if (phone) userData.phone = phone;
//       if (latitude && longitude) {
//         userData.workerDetails.currentLocation = {
//           latitude,
//           longitude,
//           timestamp: new Date(),
//         };
//       }
//       userData.isActive = true;
//     }

//     if (user && !user.isVerified) {
//       // User signed up but didn't verify. Update their data and send a new OTP.
//       console.log('Step 3a: Updating existing unverified user...');
//       const salt = await bcrypt.genSalt(10);
//       userData.password = await bcrypt.hash(password, salt); // Manually hash password

//       user = await User.findOneAndUpdate({ email }, { $set: userData }, { new: true });
//     } else {
//       // New user
//       console.log('Step 3a: Creating new user instance...');
//       user = new User(userData);
//       console.log('Step 3b: Attempting to save user to database...');
//       await user.save(); // pre-save hook will hash password
//     }

//     console.log('Result: User saved/updated in database!');

//     // --- Send OTP Email ---
//     console.log('Step 4: Attempting to send OTP email...');
//     const mailOptions = {
//       from: process.env.EMAIL_FROM || '"CityZen" <noreply@cityzen.com>',
//       to: email,
//       subject: 'Your CityZen Verification Code',
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; padding: 20px;">
//           <h2 style="color: #2c6e49;">Welcome to CityZen!</h2>
//           <p>Thank you for registering. Please use the following code to verify your email address:</p>
//           <p style="font-size: 24px; font-weight: bold; color: #1a431a; letter-spacing: 2px; margin: 25px 0; background-color: #f4f4f4; padding: 10px 15px; border-radius: 5px; display: inline-block;">
//             ${otp}
//           </p>
//           <p>This code will expire in 10 minutes.</p>
//           <p style="font-size: 0.9em; color: #777;">If you did not request this, please ignore this email.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Result: OTP Email sent successfully!');

//     console.log('--- Sending success response to browser ---');
//     return res.status(201).json({
//       success: true,
//       msg: 'Registration successful. Please check your email for an OTP.',
//       email: user.email, // Send email back to frontend
//     });

//   } catch (err) {
//     console.error('---!! AN ERROR OCCURRED during signup !!---');
//     console.error(err);
//     if (err.code === 'EENVELOPE') {
//       return res.status(500).json({
//         success: false,
//         error: 'Email Error',
//         details: 'Failed to send verification email. Please check server logs.',
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error',
//       details: err.message,
//     });
//   }
// });

// // --- UPDATED ROUTE: VERIFY OTP ---
// // @route   POST api/auth/verify-otp
// // @desc    Verify user's OTP and log them in
// router.post('/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;
//   console.log(`--- OTP Verification attempt for ${email} with OTP ${otp} ---`);

//   if (!email || !otp) {
//     return res.status(400).json({ success: false, msg: 'Please provide both email and OTP.' });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log('Error: User not found.');
//       return res.status(400).json({ success: false, msg: 'Invalid credentials. User not found.' });
//     }

//     if (user.isVerified) {
//       console.log('Info: User already verified. Please log in.');
//       return res.status(400).json({ success: false, msg: 'Email already verified. Please log in.' });
//     }

//     // --- FIX 1: TYPE/UNDEFINED MISMATCH ---
//     // Check if user.otp even exists, *then* compare it.
//     // This prevents the "reading 'toString' of undefined" error.
//     if (!user.otp || user.otp.toString() !== otp) {
//       console.log(`Error: Invalid OTP. DB: ${user.otp} (type: ${typeof user.otp}), Got: ${otp} (type: ${typeof otp})`);
//       return res.status(400).json({ success: false, msg: 'Invalid OTP.' });
//     }
//     // --------------------------

//     if (user.otpExpires < new Date()) {
//       console.log('Error: Expired OTP.');
//       return res.status(400).json({ success: false, msg: 'OTP has expired. Please sign up again to receive a new one.' });
//     }

//     // --- Success! ---
//     console.log('Result: OTP Verified successfully!');

//     // --- FIX 2: PASSWORD CORRUPTION ---
//     // Use findOneAndUpdate to set verified and remove OTP fields.
//     // This avoids .save() and does NOT re-hash the password.
//     const updatedUser = await User.findOneAndUpdate(
//       { email: email },
//       {
//         $set: { isVerified: true },
//         $unset: { otp: 1, otpExpires: 1 } // Clears the OTP fields
//       },
//       { new: true } // Return the modified user
//     );
//     // ----------------------------------

//     if (!updatedUser) {
//       console.log('Error: Could not update user after verification.');
//       return res.status(500).json({ success: false, msg: 'Verification failed, user not found after update.' });
//     }

//     // --- Log the user in (create token) ---
//     console.log('Step 2: Creating JWT token...');
//     const payload = { id: updatedUser.id, role: updatedUser.role };
//     const tokenOptions = { expiresIn: '10y' };
//     const token = jwt.sign(payload, JWT_SECRET, tokenOptions);

//     let tokenKey = 'authToken';
//     if (updatedUser.role === 'worker') tokenKey = 'workerToken';
//     else if (updatedUser.role === 'admin') tokenKey = 'adminToken';

//     console.log('--- Sending login success response to browser ---');
//     return res.status(200).json({
//       success: true,
//       [tokenKey]: token,
//       user: {
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         role: updatedUser.role,
//       },
//     });

//   } catch (err) {
//     console.error('---!! OTP VERIFICATION ERROR !!---');
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error',
//       details: err.message,
//     });
//   }
// });


// // --- LOGIN ROUTE ---
// // @route   POST api/auth/login
// // @desc    Authenticate user & get token
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log('Login attempt:', email);

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log('No user found for email:', email);
//       return res.status(400).json({ success: false, msg: 'Invalid credentials' });
//     }

//     // --- Check if verified ---
//     if (!user.isVerified) {
//       console.log('Login failed: User not verified');
//       return res.status(401).json({ success: false, msg: 'Account not verified. Please check your email for the verification OTP.' });
//     }
//     // -------------------------

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log('Password mismatch for:', email);
//       return res.status(400).json({ success: false, msg: 'Invalid credentials' });
//     }

//     const payload = { id: user.id, role: user.role };
//     const tokenOptions = { expiresIn: '10y' };
//     const token = jwt.sign(payload, JWT_SECRET, tokenOptions);

//     let tokenKey = 'authToken';
//     if (user.role === 'worker') tokenKey = 'workerToken';
//     else if (user.role === 'admin') tokenKey = 'adminToken';

//     console.log('Login successful for:', email);

//     return res.status(200).json({
//       success: true,
//       [tokenKey]: token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (err) {
//     console.error('---!! LOGIN ERROR !!---');
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error',
//       details: err.message,
//     });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Make sure your User model is imported
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Node.js module for generating random numbers

// --- NEW: Import SendGrid ---
const sgMail = require('@sendgrid/mail');

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// --- NEW: SendGrid API Key Setup ---
// We set the API key *once* when the server starts.
// Make sure you have SENDGRID_API_KEY in your Render environment variables.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- DELETED: The old nodemailer 'transporter' setup is no longer needed. ---


// --- SIGNUP ROUTE (Modified) ---
// @route   POST api/auth/signup
// @desc    Register a new user, send OTP
router.post('/signup', async (req, res) => {
  console.log('--- New Signup Request Received ---');
  console.log('Request Body:', req.body);

  const { name, email, password, role, latitude, longitude, phone } = req.body;

  try {
    console.log(`Step 1: Checking if user with email '${email}' already exists...`);
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      console.log('Result: Verified user found. Sending 400 error.');
      return res.status(400).json({ success: false, msg: 'User with this email already exists' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    console.log(`Step 2: Generated OTP: ${otp} (Expires: ${otpExpires.toLocaleTimeString()})`);

    const userData = {
      name,
      email,
      password,
      role,
      phone,
      otp,
      otpExpires,
      isVerified: false,
    };

    if (role === 'worker') {
      userData.workerDetails = {};
      if (phone) userData.phone = phone;
      if (latitude && longitude) {
        userData.workerDetails.currentLocation = {
          latitude,
          longitude,
          timestamp: new Date(),
        };
      }
      userData.isActive = true;
    }

    if (user && !user.isVerified) {
      console.log('Step 3a: Updating existing unverified user...');
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
      user = await User.findOneAndUpdate({ email }, { $set: userData }, { new: true });
    } else {
      console.log('Step 3a: Creating new user instance...');
      user = new User(userData);
      console.log('Step 3b: Attempting to save user to database...');
      await user.save();
    }

    console.log('Result: User saved/updated in database!');

    // --- MODIFIED: Send OTP Email using SendGrid ---
    console.log('Step 4: Attempting to send OTP email via SendGrid...');

    // Note: For SendGrid, you must verify a "Sender" email or domain in your account.
    // Use that verified email in the 'from' field.
    const sendgridFromEmail = process.env.SENDGRID_FROM_EMAIL || "lokaaa7654@gmail.com"; // <-- Use your verified sender

    const msg = {
      to: email, // Recipient
      from: {
        name: 'CityZen',
        email: sendgridFromEmail, // Must be a verified sender in SendGrid
      },
      subject: 'Your CityZen Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; padding: 20px;">
          <h2 style="color: #2c6e49;">Welcome to CityZen!</h2>
          <p>Thank you for registering. Please use the following code to verify your email address:</p>
          <p style="font-size: 24px; font-weight: bold; color: #1a431a; letter-spacing: 2px; margin: 25px 0; background-color: #f4f4f4; padding: 10px 15px; border-radius: 5px; display: inline-block;">
            ${otp}
          </p>
          <p>This code will expire in 10 minutes.</p>
          <p style="font-size: 0.9em; color: #777;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    // This is an API call (HTTPS), not an SMTP connection. It will not be blocked.
    await sgMail.send(msg);

    console.log('Result: OTP Email sent successfully!');
    // --- End of modification ---

    console.log('--- Sending success response to browser ---');
    return res.status(201).json({
      success: true,
      msg: 'Registration successful. Please check your email for an OTP.',
      email: user.email,
    });

  } catch (err) {
    console.error('---!! AN ERROR OCCURRED during signup !!---');

    // --- NEW: Handle SendGrid errors ---
    if (err.response && err.response.body) {
      // Log SendGrid-specific errors
      console.error('SendGrid Error Body:', err.response.body);
    } else {
      console.error(err);
    }

    return res.status(500).json({
      success: false,
      error: 'Server Error',
      details: err.message,
    });
  }
});

// --- VERIFY OTP ROUTE (Unchanged) ---
// (Your existing /verify-otp route code goes here... it doesn't need changes)
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  console.log(`--- OTP Verification attempt for ${email} with OTP ${otp} ---`);

  if (!email || !otp) {
    return res.status(400).json({ success: false, msg: 'Please provide both email and OTP.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Error: User not found.');
      return res.status(400).json({ success: false, msg: 'Invalid credentials. User not found.' });
    }

    if (user.isVerified) {
      console.log('Info: User already verified. Please log in.');
      return res.status(400).json({ success: false, msg: 'Email already verified. Please log in.' });
    }

    if (!user.otp || user.otp.toString() !== otp) {
      console.log(`Error: Invalid OTP. DB: ${user.otp} (type: ${typeof user.otp}), Got: ${otp} (type: ${typeof otp})`);
      return res.status(400).json({ success: false, msg: 'Invalid OTP.' });
    }

    if (user.otpExpires < new Date()) {
      console.log('Error: Expired OTP.');
      return res.status(400).json({ success: false, msg: 'OTP has expired. Please sign up again to receive a new one.' });
    }

    console.log('Result: OTP Verified successfully!');

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        $set: { isVerified: true },
        $unset: { otp: 1, otpExpires: 1 } // Clears the OTP fields
      },
      { new: true } // Return the modified user
    );

    if (!updatedUser) {
      console.log('Error: Could not update user after verification.');
      return res.status(500).json({ success: false, msg: 'Verification failed, user not found after update.' });
    }

    console.log('Step 2: Creating JWT token...');
    const payload = { id: updatedUser.id, role: updatedUser.role };
    const tokenOptions = { expiresIn: '10y' };
    const token = jwt.sign(payload, JWT_SECRET, tokenOptions);

    let tokenKey = 'authToken';
    if (updatedUser.role === 'worker') tokenKey = 'workerToken';
    else if (updatedUser.role === 'admin') tokenKey = 'adminToken';

    console.log('--- Sending login success response to browser ---');
    return res.status(200).json({
      success: true,
      [tokenKey]: token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });

  } catch (err) {
    console.error('---!! OTP VERIFICATION ERROR !!---');
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      details: err.message,
    });
  }
});


// --- LOGIN ROUTE (Unchanged) ---
// (Your existing /login route code goes here... it doesn't need changes)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found for email:', email);
      return res.status(400).json({ success: false, msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      console.log('Login failed: User not verified');
      return res.status(401).json({ success: false, msg: 'Account not verified. Please check your email for the verification OTP.' });
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