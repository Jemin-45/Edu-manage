const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const gradeRoutes = require('./routes/gradeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Performance & Security Middleware ───────────────────────────────────────
app.use(helmet());       // Set secure HTTP headers
app.use(compression());  // Compress all responses for speed

// ─── CORS (allows React frontend to talk to backend) ─────────────────────────
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// ─── Parse incoming JSON ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Student Management System API is running smoothly.',
        timestamp: new Date().toISOString()
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/grades', gradeRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: `Endpoint ${req.originalUrl} not found.` });
});

// ─── Global Error Handler (prevents server from crashing) ────────────────────
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong on the server.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
