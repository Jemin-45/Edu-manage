const { supabase } = require('../config/supabase');

// @route   GET /api/assignments/:courseId
// @desc    Get all assignments for a course
const getAssignments = async (req, res) => {
    const { courseId } = req.params;
    const { data, error } = await supabase.from('assignments').select('*').eq('course_id', courseId).order('due_date', { ascending: true });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   POST /api/assignments
// @desc    Create a new assignment (Teacher only)
const createAssignment = async (req, res) => {
    const { course_id, title, description, due_date } = req.body;
    if (!course_id || !title || !due_date)
        return res.status(400).json({ status: 'error', message: 'course_id, title, and due_date are required.' });
    
    // Create assignment
    const { data, error } = await supabase.from('assignments').insert({ course_id, title, description, due_date, teacher_id: req.user.id }).select().single();
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    
    // --- Async Email Notification ---
    (async () => {
        try {
            const { sendNewAssignmentEmail } = require('../services/emailService');
            
            // Get teacher name
            const { data: teacher } = await supabase.from('profiles').select('full_name').eq('id', req.user.id).single();
            // Get course name
            const { data: course } = await supabase.from('courses').select('name').eq('id', course_id).single();
            // Get enrolled students
            const { data: enrollments } = await supabase.from('enrollments').select('profiles(email, full_name)').eq('course_id', course_id);
            
            if (teacher && course && enrollments && enrollments.length > 0) {
                // Send email to all enrolled students concurrently
                await Promise.all(enrollments.map(e => {
                    const student = e.profiles;
                    if (student && student.email) {
                        return sendNewAssignmentEmail({
                            to: student.email,
                            student_name: student.full_name,
                            assignment_title: title,
                            course_name: course.name,
                            due_date,
                            teacher_name: teacher.full_name
                        });
                    }
                }));
            }
        } catch (emailErr) {
            console.error('Failed to send assignment emails:', emailErr);
        }
    })();

    res.status(201).json({ status: 'success', message: 'Assignment created.', data });
};

// @route   PUT /api/assignments/:id
// @desc    Update an assignment (Teacher only)
const updateAssignment = async (req, res) => {
    const { id } = req.params;
    const { title, description, due_date } = req.body;
    const { data, error } = await supabase.from('assignments').update({ title, description, due_date }).eq('id', id).eq('teacher_id', req.user.id).select().single();
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', message: 'Assignment updated.', data });
};

// @route   DELETE /api/assignments/:id
// @desc    Delete an assignment (Teacher only)
const deleteAssignment = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('assignments').delete().eq('id', id).eq('teacher_id', req.user.id);
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', message: 'Assignment deleted.' });
};

// @route   POST /api/assignments/:id/submit
// @desc    Submit an assignment (Student only)
const submitAssignment = async (req, res) => {
    const { id } = req.params;
    const { submission_url, notes } = req.body;
    if (!submission_url) return res.status(400).json({ status: 'error', message: 'submission_url is required.' });
    const { data, error } = await supabase.from('submissions').upsert({
        assignment_id: id,
        student_id: req.user.id,
        submission_url,
        notes,
        submitted_at: new Date().toISOString()
    }, { onConflict: 'assignment_id,student_id' }).select().single();
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(201).json({ status: 'success', message: 'Assignment submitted.', data });
};

// @route   GET /api/assignments/:id/submissions
// @desc    Get all submissions for an assignment (Teacher only)
const getSubmissions = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('submissions').select('*, profiles(full_name, email)').eq('assignment_id', id).order('submitted_at', { ascending: false });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   GET /api/assignments/student/me
// @desc    Get all assignments for the logged-in student
const getMyAssignments = async (req, res) => {
    // Get courses first, then get assignments for those courses
    const { data: enrollments } = await supabase.from('enrollments').select('course_id').eq('student_id', req.user.id);
    if (!enrollments || enrollments.length === 0)
        return res.status(200).json({ status: 'success', data: [] });

    const courseIds = enrollments.map(e => e.course_id);
    const { data, error } = await supabase.from('assignments').select('*, courses(name)').in('course_id', courseIds).order('due_date', { ascending: true });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

module.exports = { getAssignments, createAssignment, updateAssignment, deleteAssignment, submitAssignment, getSubmissions, getMyAssignments };
