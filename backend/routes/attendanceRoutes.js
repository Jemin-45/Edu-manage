const express = require('express');
const router = express.Router();
const { getAttendance, getMyAttendance, markAttendance } = require('../controllers/attendanceController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/student/me', authenticate, authorizeRole('student'), getMyAttendance);
router.get('/:courseId', authenticate, authorizeRole('admin', 'teacher'), getAttendance);
router.post('/', authenticate, authorizeRole('teacher'), markAttendance);

module.exports = router;
