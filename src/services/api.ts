// Central API Service - connects React frontend to Express backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Token Management ─────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('sms_token');
export const setToken = (token: string) => localStorage.setItem('sms_token', token);
export const removeToken = () => localStorage.removeItem('sms_token');
export const getUser = () => {
    const user = localStorage.getItem('sms_user');
    return user ? JSON.parse(user) : null;
};
export const setUser = (user: object) => localStorage.setItem('sms_user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('sms_user');

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
    }

    return data;
};

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
    login: async (email: string, password: string) => {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        // Persist token and user info
        setToken(data.token);
        setUser(data.user);
        return data;
    },

    logout: async () => {
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } finally {
            removeToken();
            removeUser();
        }
    },

    getMe: () => apiFetch('/auth/me'),
};

// ─── Users API (Admin) ────────────────────────────────────────────────────────
export const usersAPI = {
    getAll: () => apiFetch('/users'),
    create: (userData: object) => apiFetch('/users', { method: 'POST', body: JSON.stringify(userData) }),
    update: (id: string, userData: object) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
    delete: (id: string) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
};

// ─── Courses API ──────────────────────────────────────────────────────────────
export const coursesAPI = {
    getAll: () => apiFetch('/courses'),
    getById: (id: string) => apiFetch(`/courses/${id}`),
    create: (courseData: object) => apiFetch('/courses', { method: 'POST', body: JSON.stringify(courseData) }),
    update: (id: string, courseData: object) => apiFetch(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(courseData) }),
    delete: (id: string) => apiFetch(`/courses/${id}`, { method: 'DELETE' }),
    getStudents: (courseId: string) => apiFetch(`/courses/${courseId}/students`),
    enrollStudent: (courseId: string, studentId: string) => apiFetch(`/courses/${courseId}/enroll`, { method: 'POST', body: JSON.stringify({ student_id: studentId }) }),
};

// ─── Attendance API ───────────────────────────────────────────────────────────
export const attendanceAPI = {
    getByCourse: (courseId: string, date?: string) => apiFetch(`/attendance/${courseId}${date ? `?date=${date}` : ''}`),
    getMyAttendance: () => apiFetch('/attendance/student/me'),
    mark: (data: { course_id: string; date: string; records: { student_id: string; status: string }[] }) =>
        apiFetch('/attendance', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Assignments API ──────────────────────────────────────────────────────────
export const assignmentsAPI = {
    getByCourse: (courseId: string) => apiFetch(`/assignments/${courseId}`),
    getMyAssignments: () => apiFetch('/assignments/student/me'),
    create: (data: object) => apiFetch('/assignments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: object) => apiFetch(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/assignments/${id}`, { method: 'DELETE' }),
    submit: (id: string, data: { submission_url: string; notes?: string }) =>
        apiFetch(`/assignments/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
    getSubmissions: (id: string) => apiFetch(`/assignments/${id}/submissions`),
};

// ─── Grades API ───────────────────────────────────────────────────────────────
export const gradesAPI = {
    getByCourse: (courseId: string) => apiFetch(`/grades/${courseId}`),
    getMyGrades: () => apiFetch('/grades/student/me'),
    upsert: (data: object) => apiFetch('/grades', { method: 'POST', body: JSON.stringify(data) }),
};
