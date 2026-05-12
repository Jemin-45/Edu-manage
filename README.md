# 🎓 EduManage — Student Management System

A full-stack **Student Management System** built with React, Node.js, Express, and Supabase. Features role-based dashboards for **Admins**, **Faculty**, and **Students** with real-time data, attendance tracking, grade management, and more.

---

## ✨ Features

- 🔐 **Role-Based Authentication** — Admin, Faculty & Student login with Supabase Auth
- 📊 **Dynamic Dashboards** — Unique dashboard per role with real-time data
- 📋 **Attendance Tracking** — Mark, view, and export attendance records
- 📝 **Assignment Management** — Create, submit, and grade assignments
- 📈 **Grade Management** — Post and view grades with remarks
- 📚 **Course Management** — Create courses, enroll students
- 👥 **User Management** — Admin can manage all users (CRUD)
- 📅 **Timetable View** — Visual weekly timetable
- 📢 **Announcements** — Post and view announcements
- 📄 **Reports & Export** — Generate and export reports
- 🎨 **Modern UI** — Clean, responsive design with animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **UI Components** | Radix UI, Lucide Icons, Recharts |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | Supabase Auth (JWT) |
| **Email** | Nodemailer (Gmail SMTP) |

---

## 📁 Project Structure

```
Student-Management-System/
├── src/                    # React Frontend
│   ├── components/
│   │   ├── auth/           # Login page
│   │   ├── dashboards/     # Admin, Faculty, Student dashboards
│   │   ├── layout/         # Sidebar, Topbar
│   │   ├── pages/          # Attendance, Marks, Courses, etc.
│   │   └── ui/             # Reusable UI components
│   ├── services/           # API service & hooks
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
│
├── backend/                # Express Backend
│   ├── config/             # Supabase client setup
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth & role middleware
│   ├── routes/             # API route definitions
│   ├── services/           # Email service
│   ├── database/           # SQL schema
│   └── server.js           # Express server entry
│
├── .env.example            # Frontend env template
├── vite.config.ts          # Vite configuration
└── package.json            # Frontend dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+  
- **npm** v9+  
- A **Supabase** project ([create one free](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

### 2. Setup the Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**
2. Copy and run the SQL from `backend/database/schema.sql`

### 3. Configure Environment Variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your Supabase keys
```

**Frontend:**
```bash
cp .env.example .env
# Default is http://localhost:5000/api — update if needed
```

### 4. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 5. Seed Demo Data (Optional)

```bash
cd backend
node initUsers.js        # Create demo user accounts
node seedData.js         # Seed courses, grades, attendance
```

### 6. Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend (from backend/ folder)
cd backend
node server.js

# Terminal 2 — Frontend (from root folder)
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@demo.com` | `password123` |
| **Faculty** | `faculty@demo.com` | `password123` |
| **Student** | `student@demo.com` | `password123` |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/users` | List all users |
| `POST` | `/api/users` | Create user |
| `GET` | `/api/courses` | List courses |
| `POST` | `/api/courses` | Create course |
| `GET` | `/api/attendance/:courseId` | Get attendance |
| `POST` | `/api/attendance` | Mark attendance |
| `GET` | `/api/grades/:courseId` | Get grades |
| `POST` | `/api/grades` | Post grade |
| `GET` | `/api/assignments/:courseId` | Get assignments |
| `POST` | `/api/assignments` | Create assignment |
| `GET` | `/api/health` | Health check |

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Jemin Vadgama**

---

> Built with ❤️ using React, Express & Supabase