import { useState, useEffect } from "react";
import { LoginPage } from "./components/auth/login-page";
import { StudentDashboard } from "./components/dashboards/student-dashboard";
import { FacultyDashboard } from "./components/dashboards/faculty-dashboard";
import { AdminDashboard } from "./components/dashboards/admin-dashboard";
import { Sidebar } from "./components/layout/sidebar";
import { Topbar } from "./components/layout/topbar";
import { AttendancePage } from "./components/pages/attendance-page";
import { TimetablePage } from "./components/pages/timetable-page";
import { MarksPage } from "./components/pages/marks-page";
import { AnnouncementsPage } from "./components/pages/announcements-page";
import { StudentsPage } from "./components/pages/students-page";
import { FacultyPage } from "./components/pages/faculty-page";
import { CoursesPage } from "./components/pages/courses-page";
import { ReportsPage } from "./components/pages/reports-page";
import { SettingsPage } from "./components/pages/settings-page";
import { Toaster } from "./components/ui/sonner";
import { authAPI, getUser, removeToken, removeUser } from "./services/api";

type UserRole = "student" | "faculty" | "admin";
type User = {
  role: UserRole;
  name: string;
  email: string;
  id?: string;
  avatar?: string;
};

export default function App () {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Restore session from localStorage on first load
  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      // Map backend role 'teacher' to frontend role 'faculty'
      const role = savedUser.role === 'teacher' ? 'faculty' : savedUser.role;
      setUser({
        role: role as UserRole,
        name: savedUser.full_name || savedUser.email,
        email: savedUser.email,
        id: savedUser.id,
        avatar: role === 'student' ? '👨‍🎓' : role === 'faculty' ? '👩‍🏫' : '👨‍💼',
      });
    }
  }, []);

  const handleLogin = async (
    role: UserRole,
    credentials: any,
  ) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      // Map frontend 'faculty' role to backend 'teacher' role
      const data = await authAPI.login(credentials.email, credentials.password);

      // Map backend 'teacher' role back to frontend 'faculty'
      const mappedRole = data.user.role === 'teacher' ? 'faculty' : data.user.role;

      setUser({
        role: mappedRole as UserRole,
        name: data.user.full_name || data.user.email,
        email: data.user.email,
        id: data.user.id,
        avatar: mappedRole === 'student' ? '👨‍🎓' : mappedRole === 'faculty' ? '👩‍🏫' : '👨‍💼',
      });
      setCurrentPage("dashboard");
      setLoginError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      setLoginError(errorMessage);
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } finally {
      removeToken();
      removeUser();
      setUser(null);
      setCurrentPage("dashboard");
    }
  };

  const renderCurrentPage = () => {
    if (!user) return null;

    switch (currentPage) {
      case "dashboard":
        switch (user.role) {
          case "student":
            return <StudentDashboard />;
          case "faculty":
            return <FacultyDashboard />;
          case "admin":
            return <AdminDashboard />;
          default:
            return <StudentDashboard />;
        }

      case "attendance":
        return <AttendancePage userRole={user.role} />;

      case "timetable":
        return <TimetablePage userRole={user.role} />;

      case "marks":
        return <MarksPage userRole={user.role} />;

      case "announcements":
        return <AnnouncementsPage userRole={user.role} />;

      case "students":
        return <StudentsPage userRole={user.role} />;

      case "faculty":
        return <FacultyPage userRole={user.role} />;

      case "courses":
        return <CoursesPage userRole={user.role} />;

      case "reports":
        return <ReportsPage userRole={user.role} />;

      case "settings":
        return <SettingsPage userRole={user.role} />;

      default:
        return user.role === "student" ? (
          <StudentDashboard />
        ) : user.role === "faculty" ? (
          <FacultyDashboard />
        ) : (
          <AdminDashboard />
        );
    }
  };

  if (!user) {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          isLoggingIn={isLoggingIn}
        />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          userRole={user.role}
          collapsed={sidebarCollapsed}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar
            userRole={user.role}
            userName={user.name}
            onMenuToggle={() =>
              setSidebarCollapsed(!sidebarCollapsed)
            }
            collapsed={sidebarCollapsed}
            onLogout={handleLogout}
          />

          <main className="flex-1 overflow-auto">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
}