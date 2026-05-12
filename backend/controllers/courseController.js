const { supabase } = require('../config/supabase');

// @route   GET /api/courses
// @desc    Get all courses (Admin) or courses assigned to the logged-in teacher
const getCourses = async (req, res) => {
    let query = supabase.from('courses').select('*, profiles(full_name)');
    if (req.userRole === 'teacher') {
        query = query.eq('teacher_id', req.user.id);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   GET /api/courses/:id
// @desc    Get a single course by ID
const getCourseById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('courses').select('*, profiles(full_name)').eq('id', id).single();
    if (error) return res.status(404).json({ status: 'error', message: 'Course not found.' });
    res.status(200).json({ status: 'success', data });
};

// @route   POST /api/courses
// @desc    Create a new course (Admin only)
const createCourse = async (req, res) => {
    const { name, description, teacher_id } = req.body;
    if (!name) return res.status(400).json({ status: 'error', message: 'Course name is required.' });
    const { data, error } = await supabase.from('courses').insert({ name, description, teacher_id }).select().single();
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(201).json({ status: 'success', message: 'Course created.', data });
};

// @route   PUT /api/courses/:id
// @desc    Update a course (Admin only)
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { name, description, teacher_id } = req.body;
    const { data, error } = await supabase.from('courses').update({ name, description, teacher_id }).eq('id', id).select().single();
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', message: 'Course updated.', data });
};

// @route   DELETE /api/courses/:id
// @desc    Delete a course (Admin only)
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', message: 'Course deleted successfully.' });
};

// @route   GET /api/courses/:id/students
// @desc    Get all students enrolled in a course
const getCourseStudents = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('enrollments').select('*, profiles(id, full_name, email)').eq('course_id', id);
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   POST /api/courses/:id/enroll
// @desc    Enroll a student in a course (Admin only)
const enrollStudent = async (req, res) => {
    const { id } = req.params;
    const { student_id } = req.body;
    if (!student_id) return res.status(400).json({ status: 'error', message: 'student_id is required.' });
    const { data, error } = await supabase.from('enrollments').insert({ course_id: id, student_id }).select().single();
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(201).json({ status: 'success', message: 'Student enrolled successfully.', data });
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, getCourseStudents, enrollStudent };
