const express = require('express');
const router = express.Router();
const { getGradesByCourse, getMyGrades, upsertGrade } = require('../controllers/gradeController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/student/me', authenticate, authorizeRole('student'), getMyGrades);
router.get('/:courseId', authenticate, authorizeRole('admin', 'teacher'), getGradesByCourse);
router.post('/', authenticate, authorizeRole('teacher'), upsertGrade);

module.exports = router;
