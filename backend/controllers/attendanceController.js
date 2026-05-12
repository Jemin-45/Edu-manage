const { supabase } = require('../config/supabase');

// @route   GET /api/attendance/:courseId
// @desc    Get attendance for a course (Teacher/Admin)
const getAttendance = async (req, res) => {
    const { courseId } = req.params;
    const { date } = req.query;
    let query = supabase.from('attendance').select('*, profiles(full_name)').eq('course_id', courseId);
    if (date) query = query.eq('date', date);
    const { data, error } = await query.order('date', { ascending: false });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   GET /api/attendance/student/me
// @desc    Get logged-in student's own attendance
const getMyAttendance = async (req, res) => {
    const { data, error } = await supabase
        .from('attendance')
        .select('*, courses(name)')
        .eq('student_id', req.user.id)
        .order('date', { ascending: false });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   POST /api/attendance
// @desc    Mark attendance for students in a course (Teacher only)
const markAttendance = async (req, res) => {
    const { course_id, date, records } = req.body;
    // records is an array: [{ student_id, status: 'present' | 'absent' }]
    if (!course_id || !date || !records || !records.length)
        return res.status(400).json({ status: 'error', message: 'course_id, date, and records are required.' });

    const rows = records.map(r => ({ course_id, date, student_id: r.student_id, status: r.status }));
    // Upsert to avoid duplicates if attendance is re-marked
    const { data, error } = await supabase.from('attendance').upsert(rows, { onConflict: 'course_id,date,student_id' }).select();
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    
    // --- Async Email Notification for Absentees ---
    (async () => {
        try {
            const { sendAbsentEmail } = require('../services/emailService');
            
            // Filter absent students
            const absentStudentsIds = records.filter(r => r.status === 'absent').map(r => r.student_id);
            if (absentStudentsIds.length > 0) {
                // Get teacher name
                const { data: teacher } = await supabase.from('profiles').select('full_name').eq('id', req.user.id).single();
                // Get course name
                const { data: course } = await supabase.from('courses').select('name').eq('id', course_id).single();
                // Get student profiles
                const { data: students } = await supabase.from('profiles').select('id, full_name, email').in('id', absentStudentsIds);

                if (teacher && course && students && students.length > 0) {
                    await Promise.all(students.map(student => {
                        if (student.email) {
                            return sendAbsentEmail({
                                to: student.email,
                                student_name: student.full_name,
                                course_name: course.name,
                                date,
                                teacher_name: teacher.full_name
                            });
                        }
                    }));
                }
            }
        } catch (emailErr) {
            console.error('Failed to send absent emails:', emailErr);
        }
    })();

    res.status(201).json({ status: 'success', message: 'Attendance marked successfully.', data });
};

module.exports = { getAttendance, getMyAttendance, markAttendance };
