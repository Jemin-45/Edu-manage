const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = '***REMOVED_SERVICE_ROLE_KEY***';

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function seedData() {
    console.log('\n🌱 Starting database seed...\n');

    // ─── Step 1: Get existing user IDs ──────────────────────────────────────────
    const { data: { users }, error: usersError } = await db.auth.admin.listUsers();
    if (usersError) return console.error('❌ Could not list users:', usersError.message);

    const adminUser   = users.find(u => u.email === 'admin@demo.com');
    const teacherUser = users.find(u => u.email === 'faculty@demo.com');
    const studentUser = users.find(u => u.email === 'student@demo.com');

    if (!adminUser || !teacherUser || !studentUser) {
        return console.error('❌ Could not find all 3 demo users. Make sure admin@demo.com, faculty@demo.com, and student@demo.com exist.');
    }

    console.log(`✅ Found users:`);
    console.log(`   Admin:   ${adminUser.email}`);
    console.log(`   Teacher: ${teacherUser.email}`);
    console.log(`   Student: ${studentUser.email}`);

    // ─── Step 2: Update profiles with real names ─────────────────────────────────
    const profileUpdates = [
        { id: adminUser.id,   full_name: 'Rajesh Kumar',    role: 'admin'   },
        { id: teacherUser.id, full_name: 'Dr. Priya Sharma', role: 'teacher' },
        { id: studentUser.id, full_name: 'Jemin Vadgama',   role: 'student' },
    ];

    for (const p of profileUpdates) {
        const { error } = await db.from('profiles').upsert({ id: p.id, full_name: p.full_name, role: p.role, email: users.find(u => u.id === p.id).email }, { onConflict: 'id' });
        if (error) console.log(`⚠️  Profile update for ${p.full_name}:`, error.message);
        else        console.log(`✅ Profile updated: ${p.full_name} (${p.role})`);
    }

    // ─── Step 3: Create Courses ───────────────────────────────────────────────────
    const coursesToCreate = [
        { name: 'Data Structures & Algorithms',  description: 'Learn DSA fundamentals: arrays, trees, graphs, and sorting algorithms.', teacher_id: teacherUser.id },
        { name: 'Database Management Systems',   description: 'SQL, normalization, transactions, and real-world database design.', teacher_id: teacherUser.id },
        { name: 'Python Programming',            description: 'From beginner to advanced Python — OOP, libraries, and projects.', teacher_id: teacherUser.id },
        { name: 'Web Development',               description: 'HTML, CSS, JavaScript, React, and REST APIs.', teacher_id: teacherUser.id },
        { name: 'Operating Systems',             description: 'Process management, memory, file systems, and concurrency.', teacher_id: teacherUser.id },
    ];

    const createdCourseIds = [];
    for (const course of coursesToCreate) {
        const { data, error } = await db.from('courses').insert(course).select().single();
        if (error) {
            console.log(`⚠️  Course "${course.name}":`, error.message);
        } else {
            console.log(`✅ Course created: ${course.name}`);
            createdCourseIds.push(data.id);
        }
    }

    if (createdCourseIds.length === 0) return console.error('❌ No courses were created. Stopping.');

    // ─── Step 4: Enroll Student in all courses ────────────────────────────────────
    for (const courseId of createdCourseIds) {
        const { error } = await db.from('enrollments').insert({ course_id: courseId, student_id: studentUser.id });
        if (error) console.log(`⚠️  Enrollment:`, error.message);
        else        console.log(`✅ Student enrolled in course ${courseId}`);
    }

    // ─── Step 5: Create Assignments ───────────────────────────────────────────────
    const assignmenetsData = [
        { course_id: createdCourseIds[0], title: 'Implement a Binary Search Tree', description: 'Code a BST with insert, delete, and search in Python.', due_date: '2026-04-10', teacher_id: teacherUser.id },
        { course_id: createdCourseIds[0], title: 'Graph Traversal Lab',            description: 'Submit BFS and DFS implementations with test cases.', due_date: '2026-04-20', teacher_id: teacherUser.id },
        { course_id: createdCourseIds[1], title: 'Design an ER Diagram',           description: 'Create a complete ER diagram for a school management system.', due_date: '2026-04-12', teacher_id: teacherUser.id },
        { course_id: createdCourseIds[2], title: 'OOP Project',                    description: 'Build a library management system using Python OOP concepts.', due_date: '2026-04-15', teacher_id: teacherUser.id },
        { course_id: createdCourseIds[3], title: 'Build a Portfolio Website',      description: 'Create a responsive portfolio using HTML, CSS, and JavaScript.', due_date: '2026-04-25', teacher_id: teacherUser.id },
    ];

    const createdAssignmentIds = [];
    for (const assignment of assignmenetsData) {
        const { data, error } = await db.from('assignments').insert(assignment).select().single();
        if (error) console.log(`⚠️  Assignment "${assignment.title}":`, error.message);
        else {
            console.log(`✅ Assignment created: ${assignment.title}`);
            createdAssignmentIds.push(data.id);
        }
    }

    // ─── Step 6: Add Grades for Student ──────────────────────────────────────────
    const gradesToAdd = [
        { student_id: studentUser.id, course_id: createdCourseIds[0], assignment_id: createdAssignmentIds[0], grade: '88', remarks: 'Excellent implementation! Clean code.', graded_by: teacherUser.id },
        { student_id: studentUser.id, course_id: createdCourseIds[1], assignment_id: createdAssignmentIds[2], grade: '75', remarks: 'Good effort. Normalization could be improved.', graded_by: teacherUser.id },
        { student_id: studentUser.id, course_id: createdCourseIds[2], assignment_id: createdAssignmentIds[3], grade: '92', remarks: 'Outstanding! Perfect use of OOP principles.', graded_by: teacherUser.id },
        { student_id: studentUser.id, course_id: createdCourseIds[3], assignment_id: createdAssignmentIds[4], grade: '68', remarks: 'Decent design. Responsiveness needs work.', graded_by: teacherUser.id },
    ];

    for (const grade of gradesToAdd) {
        const { error } = await db.from('grades').insert(grade);
        if (error) console.log(`⚠️  Grade:`, error.message);
        else        console.log(`✅ Grade added: ${grade.grade}/100`);
    }

    // ─── Step 7: Mark Attendance ──────────────────────────────────────────────────
    const today = new Date();
    const attendanceDates = [-4, -3, -2, -1, 0].map(offset => {
        const d = new Date(today);
        d.setDate(d.getDate() + offset);
        return d.toISOString().split('T')[0];
    });

    const attendanceStatuses = ['present', 'present', 'absent', 'present', 'present'];

    for (let i = 0; i < attendanceDates.length; i++) {
        const date = attendanceDates[i];
        const status = attendanceStatuses[i];
        // Mark for first 2 courses only
        for (const courseId of createdCourseIds.slice(0, 2)) {
            const { error } = await db.from('attendance').insert({
                course_id: courseId,
                student_id: studentUser.id,
                date,
                status
            });
            if (error) console.log(`⚠️  Attendance (${date}):`, error.message);
        }
    }
    console.log(`✅ Attendance records added for last 5 days`);

    console.log('\n🎉 DATABASE SEEDED SUCCESSFULLY!\n');
    console.log('─────────────────────────────────────────');
    console.log('📋 Summary:');
    console.log(`   ✅ ${coursesToCreate.length} Courses created`);
    console.log(`   ✅ ${coursesToCreate.length} Enrollments created`);
    console.log(`   ✅ ${assignmenetsData.length} Assignments created`);
    console.log(`   ✅ ${gradesToAdd.length} Grades posted`);
    console.log(`   ✅ Attendance for 5 days x 2 courses`);
    console.log('─────────────────────────────────────────');
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin:   admin@demo.com   / password123');
    console.log('   Teacher: faculty@demo.com / password123');
    console.log('   Student: student@demo.com / password123\n');
}

seedData().catch(console.error);
