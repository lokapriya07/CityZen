const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Environment variables (set these in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_waste';
const EMAIL_USER = process.env.EMAIL_USER || 'your_email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your_email_password';
const TWILIO_SID = process.env.TWILIO_SID || 'your_twilio_sid';
const TWILIO_TOKEN = process.env.TWILIO_TOKEN || 'your_twilio_token';
const TWILIO_PHONE = process.env.TWILIO_PHONE || '+1234567890';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Email transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Twilio client
const twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Schemas
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'worker'], default: 'user' }
}, { timestamps: true });

const complaintSchema = new mongoose.Schema({
    // User Information
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: String,

    // Location
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    gpsCoordinates: {
        lat: Number,
        lng: Number
    },

    // Waste Details
    wasteType: { type: String, required: true },
    wasteAmount: String,
    description: { type: String, required: true },
    duration: String,
    accessibility: String,
    urgency: { type: String, enum: ['low', 'medium', 'high'] },

    // Media
    photos: [String],

    // Additional Info
    previousReports: String,
    preferredContact: String,
    additionalComments: String,
    updates: { type: Boolean, default: false },
    anonymous: { type: Boolean, default: false },

    // System fields
    status: {
        type: String,
        enum: ['submitted', 'assigned', 'in_progress', 'resolved', 'cancelled'],
        default: 'submitted'
    },
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: Number, default: 1 }, // 1=low, 2=medium, 3=high

    // Tracking
    statusUpdates: [{
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        workerLocation: {
            lat: Number,
            lng: Number
        }
    }]
}, { timestamps: true });

const workerLocationSchema = new mongoose.Schema({
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);
const WorkerLocation = mongoose.model('WorkerLocation', workerLocationSchema);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Notification functions
const sendEmailNotification = async (to, subject, message) => {
    try {
        await transporter.sendMail({
            from: EMAIL_USER,
            to: to,
            subject: subject,
            html: message
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email error:', error);
    }
};

const sendSMSNotification = async (to, message) => {
    try {
        await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE,
            to: to
        });
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('SMS error:', error);
    }
};

// Socket.IO connections
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_user', (userId) => {
        socket.join(`user_${userId}`);
        connectedUsers.set(userId, socket.id);
    });

    socket.on('join_admin', () => {
        socket.join('admins');
    });

    socket.on('join_worker', (workerId) => {
        socket.join(`worker_${workerId}`);
    });

    // Worker location updates
    socket.on('update_location', async (data) => {
        try {
            const { workerId, lat, lng } = data;

            await WorkerLocation.findOneAndUpdate(
                { workerId },
                {
                    location: { lat, lng },
                    lastUpdated: new Date(),
                    isActive: true
                },
                { upsert: true }
            );

            // Broadcast to admins
            socket.to('admins').emit('worker_location_update', {
                workerId,
                location: { lat, lng },
                timestamp: new Date()
            });

            // Update assigned complaints
            const assignedComplaints = await Complaint.find({
                assignedWorker: workerId,
                status: 'in_progress'
            });

            for (let complaint of assignedComplaints) {
                socket.to(`user_${complaint.userId}`).emit('worker_location_update', {
                    complaintId: complaint._id,
                    location: { lat, lng },
                    timestamp: new Date()
                });
            }

        } catch (error) {
            console.error('Location update error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove from connected users
        for (let [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                break;
            }
        }
    });
});

// Routes

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, phone, password, role = 'user' } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Complaint Routes
app.post('/api/complaints', authenticateToken, upload.array('photos', 5), async (req, res) => {
    try {
        const complaintData = { ...req.body };
        complaintData.userId = req.user.userId;

        // Handle file uploads
        if (req.files && req.files.length > 0) {
            complaintData.photos = req.files.map(file => file.filename);
        }

        // Set priority based on urgency
        const priorityMap = { 'low': 1, 'medium': 2, 'high': 3 };
        complaintData.priority = priorityMap[complaintData.urgency] || 1;

        const complaint = new Complaint(complaintData);
        await complaint.save();

        // Notify admins
        io.to('admins').emit('new_complaint', {
            id: complaint._id,
            city: complaint.city,
            urgency: complaint.urgency,
            wasteType: complaint.wasteType,
            address: complaint.address,
            timestamp: complaint.createdAt
        });

        // Send confirmation email/SMS
        if (complaint.updates) {
            const emailMessage = `
        <h2>Complaint Submitted Successfully</h2>
        <p>Dear ${complaint.fullName},</p>
        <p>Your waste complaint has been submitted successfully.</p>
        <p><strong>Complaint ID:</strong> ${complaint._id}</p>
        <p><strong>Location:</strong> ${complaint.address}, ${complaint.city}</p>
        <p><strong>Status:</strong> Submitted</p>
        <p>We'll investigate and take action within 2-3 business days.</p>
      `;

            await sendEmailNotification(complaint.email, 'Complaint Submitted', emailMessage);

            const smsMessage = `Waste complaint submitted successfully. ID: ${complaint._id}. Status: Submitted. We'll update you soon.`;
            await sendSMSNotification(complaint.phone, smsMessage);
        }

        res.status(201).json({
            message: 'Complaint submitted successfully',
            complaintId: complaint._id
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get complaints with filtering
app.get('/api/complaints', authenticateToken, async (req, res) => {
    try {
        let query = {};
        const { city, urgency, status, role } = req.query;

        // Role-based filtering
        if (req.user.role === 'user') {
            query.userId = req.user.userId;
        } else if (req.user.role === 'worker') {
            query.assignedWorker = req.user.userId;
        }
        // Admins can see all complaints

        // Apply filters
        if (city) query.city = new RegExp(city, 'i');
        if (urgency) query.urgency = urgency;
        if (status) query.status = status;

        const complaints = await Complaint.find(query)
            .populate('assignedWorker', 'fullName email phone')
            .populate('userId', 'fullName email')
            .sort({ priority: -1, createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Assign worker to complaint (Admin only)
app.post('/api/complaints/:id/assign', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { workerId } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const worker = await User.findById(workerId);
        if (!worker || worker.role !== 'worker') {
            return res.status(400).json({ message: 'Invalid worker' });
        }

        complaint.assignedWorker = workerId;
        complaint.status = 'assigned';
        complaint.statusUpdates.push({
            status: 'assigned',
            message: `Assigned to ${worker.fullName}`,
            updatedBy: req.user.userId
        });

        await complaint.save();

        // Notify user about assignment
        io.to(`user_${complaint.userId}`).emit('complaint_update', {
            complaintId: complaint._id,
            status: 'assigned',
            message: 'Your complaint has been assigned to a worker',
            workerName: worker.fullName
        });

        // Notify worker
        io.to(`worker_${workerId}`).emit('new_assignment', {
            complaintId: complaint._id,
            address: complaint.address,
            city: complaint.city,
            urgency: complaint.urgency
        });

        // Send notifications
        if (complaint.updates) {
            const emailMessage = `
        <h2>Complaint Update</h2>
        <p>Dear ${complaint.fullName},</p>
        <p>Your complaint (ID: ${complaint._id}) has been assigned to our cleaning crew.</p>
        <p><strong>Worker:</strong> ${worker.fullName}</p>
        <p><strong>Status:</strong> Assigned</p>
        <p>You can now track the worker's location in real-time.</p>
      `;

            await sendEmailNotification(complaint.email, 'Worker Assigned', emailMessage);

            const smsMessage = `Your waste complaint (${complaint._id}) has been assigned to ${worker.fullName}. Track progress in real-time.`;
            await sendSMSNotification(complaint.phone, smsMessage);
        }

        res.json({ message: 'Worker assigned successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update complaint status (Worker only)
app.post('/api/complaints/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status, message, location } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Check permissions
        if (req.user.role === 'worker' && complaint.assignedWorker.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not assigned to this complaint' });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'worker') {
            return res.status(403).json({ message: 'Access denied' });
        }

        complaint.status = status;
        const statusUpdate = {
            status,
            message: message || `Status updated to ${status}`,
            updatedBy: req.user.userId
        };

        if (location) {
            statusUpdate.workerLocation = location;
        }

        complaint.statusUpdates.push(statusUpdate);
        await complaint.save();

        // Notify user
        io.to(`user_${complaint.userId}`).emit('complaint_update', {
            complaintId: complaint._id,
            status,
            message: statusUpdate.message,
            location,
            timestamp: new Date()
        });

        // Notify admins
        io.to('admins').emit('complaint_status_update', {
            complaintId: complaint._id,
            status,
            workerId: req.user.userId,
            location
        });

        // Send notifications
        if (complaint.updates) {
            const emailMessage = `
        <h2>Complaint Update</h2>
        <p>Dear ${complaint.fullName},</p>
        <p>Your complaint (ID: ${complaint._id}) has been updated.</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Message:</strong> ${statusUpdate.message}</p>
        ${location ? `<p>Worker is currently at location: ${location.lat}, ${location.lng}</p>` : ''}
      `;

            await sendEmailNotification(complaint.email, 'Complaint Update', emailMessage);

            const smsMessage = `Complaint ${complaint._id} updated: ${status}. ${statusUpdate.message}`;
            await sendSMSNotification(complaint.phone, smsMessage);
        }

        res.json({ message: 'Status updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get workers (Admin only)
app.get('/api/workers', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const workers = await User.find({ role: 'worker' }, 'fullName email phone');
        const workersWithLocation = await Promise.all(
            workers.map(async (worker) => {
                const location = await WorkerLocation.findOne({ workerId: worker._id });
                return {
                    ...worker.toObject(),
                    location: location ? location.location : null,
                    isActive: location ? location.isActive : false,
                    lastUpdated: location ? location.lastUpdated : null
                };
            })
        );

        res.json(workersWithLocation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        let stats = {};

        if (req.user.role === 'admin') {
            const totalComplaints = await Complaint.countDocuments();
            const pendingComplaints = await Complaint.countDocuments({ status: 'submitted' });
            const assignedComplaints = await Complaint.countDocuments({ status: 'assigned' });
            const inProgressComplaints = await Complaint.countDocuments({ status: 'in_progress' });
            const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
            const activeWorkers = await WorkerLocation.countDocuments({ isActive: true });

            stats = {
                totalComplaints,
                pendingComplaints,
                assignedComplaints,
                inProgressComplaints,
                resolvedComplaints,
                activeWorkers
            };
        } else if (req.user.role === 'worker') {
            const assignedToMe = await Complaint.countDocuments({ assignedWorker: req.user.userId });
            const inProgress = await Complaint.countDocuments({
                assignedWorker: req.user.userId,
                status: 'in_progress'
            });
            const completed = await Complaint.countDocuments({
                assignedWorker: req.user.userId,
                status: 'resolved'
            });

            stats = {
                assignedToMe,
                inProgress,
                completed
            };
        } else {
            const myComplaints = await Complaint.countDocuments({ userId: req.user.userId });
            const pending = await Complaint.countDocuments({
                userId: req.user.userId,
                status: { $in: ['submitted', 'assigned'] }
            });
            const resolved = await Complaint.countDocuments({
                userId: req.user.userId,
                status: 'resolved'
            });

            stats = {
                myComplaints,
                pending,
                resolved
            };
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});