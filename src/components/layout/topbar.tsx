import { Bell, Search, Menu, User, ChevronDown, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface TopbarProps {
  userRole: 'student' | 'faculty' | 'admin';
  userName?: string;
  onMenuToggle?: () => void;
  collapsed?: boolean;
  onLogout?: () => void;
}

export function Topbar({ userRole, userName = 'User', onMenuToggle, collapsed = false, onLogout }: TopbarProps) {
  const getRoleColor = () => {
    switch (userRole) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'faculty': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getNotifications = () => {
    const recentNotifications = [
      {
        id: 1,
        title: 'Mid-Term Exam Timetable',
        message: 'Updated timetable for mid-semester exams released. Check your schedule now.',
        time: '1 hour ago',
        type: 'info',
        icon: Info
      },
      {
        id: 2,
        title: 'Hackathon Event 2024',
        message: 'Annual CS Hackathon registration opens tomorrow. Prize pool: ₹50,000',
        time: '3 hours ago',
        type: 'success',
        icon: CheckCircle
      },
      {
        id: 3,
        title: 'Academic Calendar Update',
        message: 'Academic calendar for next semester is now available in student portal',
        time: '5 hours ago',
        type: 'info',
        icon: Info
      }
    ];

    switch (userRole) {
      case 'student':
        return [
          ...recentNotifications,
          {
            id: 4,
            title: 'Assignment Deadline',
            message: 'DSA Assignment submission deadline: Tomorrow 11:59 PM',
            time: '6 hours ago',
            type: 'warning',
            icon: AlertCircle
          },
          {
            id: 5,
            title: 'Attendance Alert',
            message: 'Low attendance in DBMS course (68%). Maintain 75% minimum',
            time: '1 day ago',
            type: 'error',
            icon: AlertCircle
          }
        ];
      case 'faculty':
        return [
          ...recentNotifications,
          {
            id: 4,
            title: 'Grade Submission Reminder',
            message: 'Mid-term exam grades submission deadline: 3 days remaining',
            time: '2 hours ago',
            type: 'warning',
            icon: AlertCircle
          },
          {
            id: 5,
            title: 'Faculty Meeting',
            message: 'Department meeting scheduled for Friday 2 PM in Conference Room A',
            time: '4 hours ago',
            type: 'info',
            icon: Info
          },
          {
            id: 6,
            title: 'Student Query',
            message: 'Arjun Sharma asked about Android Development project guidelines',
            time: '8 hours ago',
            type: 'info',
            icon: Info
          }
        ];
      case 'admin':
        return [
          ...recentNotifications,
          {
            id: 4,
            title: 'New Faculty Onboarding',
            message: 'Dr. Kavya Reddy joined Computer Science department today',
            time: '2 hours ago',
            type: 'success',
            icon: CheckCircle
          },
          {
            id: 5,
            title: 'Course Enrollment Stats',
            message: '127 new students enrolled across all CS courses this semester',
            time: '6 hours ago',
            type: 'info',
            icon: Info
          },
          {
            id: 6,
            title: 'System Maintenance',
            message: 'Scheduled server maintenance tonight 12 AM - 4 AM',
            time: '1 day ago',
            type: 'warning',
            icon: AlertCircle
          }
        ];
      default:
        return recentNotifications;
    }
  };

  const notifications = getNotifications();

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-500';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search students, courses, announcements..."
            className="pl-10 pr-4 h-10 border-gray-200 rounded-lg bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 bg-[#F2994A] text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full">
                {notifications.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-lg border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-medium text-[#333333]">Notifications</h3>
              <p className="text-xs text-[#6B7280]">{notifications.length} unread notifications</p>
            </div>
            
            <ScrollArea className="h-80">
              <div className="py-2">
                {notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0">
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#333333] truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-[#6B7280]" />
                            <span className="text-xs text-[#6B7280]">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            
            <div className="px-4 py-3 border-t border-gray-100">
              <Button variant="ghost" className="w-full text-xs text-[#2F80ED] hover:bg-blue-50">
                View All Notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 p-2 h-auto hover:bg-gray-100 rounded-lg">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-gradient-to-r from-[#2F80ED] to-[#27AE60] text-white text-sm">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[#333333]">{userName}</p>
                <Badge className={`${getRoleColor()} text-xs capitalize`}>
                  {userRole}
                </Badge>
              </div>
              
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-gray-200">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-[#333333]">{userName}</p>
              <p className="text-xs text-[#6B7280] capitalize">{userRole} Account</p>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={onLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}