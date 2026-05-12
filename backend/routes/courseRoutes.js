const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, getCourseStudents, enrollStudent } = require('../controllers/courseController');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/', authenticate, authorizeRole('admin', 'teacher', 'student'), getCourses);
router.get('/:id', authenticate, authorizeRole('admin', 'teacher', 'student'), getCourseById);
router.post('/', authenticate, authorizeRole('admin'), createCourse);
router.put('/:id', authenticate, authorizeRole('admin'), updateCourse);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteCourse);
router.get('/:id/students', authenticate, authorizeRole('admin', 'teacher'), getCourseStudents);
router.post('/:id/enroll', authenticate, authorizeRole('admin'), enrollStudent);

module.exports = router;
