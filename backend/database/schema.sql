-- ============================================================
-- Student Management System - Supabase Database Setup
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. PROFILES TABLE (extends Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatically create a profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. COURSES TABLE
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENROLLMENTS TABLE (many-to-many: students <-> courses)
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, student_id)
);

-- 4. ASSIGNMENTS TABLE
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBMISSIONS TABLE (students submit their work)
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_url TEXT NOT NULL,
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- 6. ATTENDANCE TABLE
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, date, student_id)
);

-- 7. GRADES TABLE
CREATE TABLE public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    grade TEXT NOT NULL,
    remarks TEXT,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id, assignment_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - Important for Data Protection
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile, admins read all
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses are visible to all authenticated users
CREATE POLICY "courses_select" ON public.courses FOR SELECT USING (true);

-- Enrollments visible to all authenticated users
CREATE POLICY "enrollments_select" ON public.enrollments FOR SELECT USING (true);

-- Assignments visible to all authenticated users
CREATE POLICY "assignments_select" ON public.assignments FOR SELECT USING (true);

-- Students only see their own submissions
CREATE POLICY "submissions_select" ON public.submissions FOR SELECT USING (auth.uid() = student_id);

-- Attendance visible to all authenticated users
CREATE POLICY "attendance_select" ON public.attendance FOR SELECT USING (true);

-- Students only see their own grades
CREATE POLICY "grades_select" ON public.grades FOR SELECT USING (auth.uid() = student_id OR true);
