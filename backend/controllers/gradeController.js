const { supabase } = require('../config/supabase');

// @route   GET /api/grades/:courseId
// @desc    Get all grades for a course (Teacher/Admin)
const getGradesByCourse = async (req, res) => {
    const { courseId } = req.params;
    const { data, error } = await supabase.from('grades').select('*, profiles(full_name), assignments(title)').eq('course_id', courseId).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   GET /api/grades/student/me
// @desc    Get logged-in student's own grades
const getMyGrades = async (req, res) => {
    const { data, error } = await supabase.from('grades').select('*, courses(name), assignments(title)').eq('student_id', req.user.id).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   POST /api/grades
// @desc    Add or update a grade (Teacher only)
const upsertGrade = async (req, res) => {
    const { student_id, course_id, assignment_id, grade, remarks } = req.body;
    if (!student_id || !course_id || !grade)
        return res.status(400).json({ status: 'error', message: 'student_id, course_id, and grade are required.' });

    const { data, error } = await supabase.from('grades').upsert({
        student_id,
        course_id,
        assignment_id: assignment_id || null,
        grade,
        remarks,
        graded_by: req.user.id
    }, { onConflict: 'student_id,course_id,assignment_id' }).select().single();

    if (error) return res.status(500).json({ status: 'error', message: error.message });
    
    // --- Async Email Notification for Grade ---
    if (assignment_id) {
        (async () => {
            try {
                const { sendGradeEmail } = require('../services/emailService');
                
                // Get student info
                const { data: student } = await supabase.from('profiles').select('full_name, email').eq('id', student_id).single();
                // Get assignment info
                const { data: assignment } = await supabase.from('assignments').select('title').eq('id', assignment_id).single();
                // Get course info
                const { data: course } = await supabase.from('courses').select('name').eq('id', course_id).single();
                
                if (student && student.email && assignment && course) {
                    await sendGradeEmail({
                        to: student.email,
                        student_name: student.full_name,
                        assignment_title: assignment.title,
                        course_name: course.name,
                        grade,
                        remarks
                    });
                }
            } catch (emailErr) {
                console.error('Failed to send grade email:', emailErr);
            }
        })();
    }

    res.status(201).json({ status: 'success', message: 'Grade saved successfully.', data });
};

module.exports = { getGradesByCourse, getMyGrades, upsertGrade };
