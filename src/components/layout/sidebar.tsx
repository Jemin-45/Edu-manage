import { 
  Home, 
  Calendar, 
  ClipboardList, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  GraduationCap,
  BookOpen,
  FileText,
  UserCheck,
  PlusCircle,
  Trophy
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userRole: 'student' | 'faculty' | 'admin';
  collapsed?: boolean;
  onToggle?: () => void;
  onLogout?: () => void;
}

export function Sidebar({ currentPage, onPageChange, userRole, collapsed = false, onLogout }: SidebarProps) {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'attendance', label: 'Attendance', icon: UserCheck },
      { id: 'timetable', label: 'Timetable', icon: Calendar },
    ];

    switch (userRole) {
      case 'student':
        return [
          ...commonItems,
          { id: 'marks', label: 'Exam Results', icon: Trophy },
          { id: 'announcements', label: 'Announcements', icon: FileText },
        ];
      
      case 'faculty':
        return [
          ...commonItems,
          { id: 'marks', label: 'Manage Marks', icon: BarChart3 },
          { id: 'students', label: 'My Students', icon: Users },
          { id: 'announcements', label: 'Announcements', icon: FileText },
        ];
      
      case 'admin':
        return [
          ...commonItems,
          { id: 'students', label: 'Manage Students', icon: GraduationCap },
          { id: 'faculty', label: 'Manage Faculty', icon: Users },
          { id: 'courses', label: 'Manage Courses', icon: BookOpen },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
        ];
      
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#2F80ED] to-[#27AE60] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-[#333333]">EduManage</h2>
              <p className="text-xs text-[#6B7280] capitalize">{userRole} Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`
                  w-full justify-start h-12 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#2F80ED] to-[#27AE60] text-white shadow-lg' 
                    : 'text-[#6B7280] hover:text-[#333333] hover:bg-gray-50'
                  }
                  ${collapsed ? 'px-0 justify-center' : 'px-4'}
                `}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="ghost"
          className={`
            w-full justify-start h-12 rounded-xl text-[#6B7280] hover:text-[#333333] hover:bg-gray-50
            ${collapsed ? 'px-0 justify-center' : 'px-4'}
          `}
          onClick={() => onPageChange('settings')}
        >
          <Settings className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
          {!collapsed && <span>Settings</span>}
        </Button>
        
        <Button
          variant="ghost"
          className={`
            w-full justify-start h-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50
            ${collapsed ? 'px-0 justify-center' : 'px-4'}
          `}
          onClick={onLogout}
        >
          <LogOut className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}