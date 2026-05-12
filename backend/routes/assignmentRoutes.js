const express = require('express');
const router = express.Router();
const { getAssignments, createAssignment, updateAssignment, deleteAssignment, submitAssignment, getSubmissions, getMyAssignments } = require('../controllers/assignmentController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/student/me', authenticate, authorizeRole('student'), getMyAssignments);
router.get('/:courseId', authenticate, authorizeRole('admin', 'teacher', 'student'), getAssignments);
router.post('/', authenticate, authorizeRole('teacher'), createAssignment);
router.put('/:id', authenticate, authorizeRole('teacher'), updateAssignment);
router.delete('/:id', authenticate, authorizeRole('teacher'), deleteAssignment);
router.post('/:id/submit', authenticate, authorizeRole('student'), submitAssignment);
router.get('/:id/submissions', authenticate, authorizeRole('teacher', 'admin'), getSubmissions);

module.exports = router;
