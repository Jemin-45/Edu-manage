import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, BookOpen, Calendar, BarChart3, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { class: 'DSA-A', present: 28, absent: 2, total: 30 },
  { class: 'DSA-B', present: 25, absent: 5, total: 30 },
  { class: 'Python-A', present: 27, absent: 3, total: 30 },
  { class: 'Python-B', present: 24, absent: 6, total: 30 }
];



const todayClasses = [
  { subject: 'DSA', class: 'CS-A', time: '09:00 AM', room: 'Room 101', students: 30 },
  { subject: 'Python', class: 'CS-B', time: '11:00 AM', room: 'Lab 201', students: 28 },
  { subject: 'Web Programming', class: 'CS-C', time: '02:00 PM', room: 'Room 102', students: 32 }
];

const recentSubmissions = [
  { student: 'Ananya Sharma', assignment: 'DSA Binary Trees', submitted: '2 hours ago', status: 'pending' },
  { student: 'Rohit Patel', assignment: 'Python Flask Project', submitted: '1 day ago', status: 'graded' },
  { student: 'Kavya Singh', assignment: 'DBMS Normalization', submitted: '3 hours ago', status: 'pending' },
  { student: 'Arjun Mehta', assignment: 'Android UI Components', submitted: '5 hours ago', status: 'pending' },
  { student: 'Priya Nair', assignment: 'Web API Development', submitted: '1 day ago', status: 'graded' }
];

const facultyNotifications = [
  { title: 'CS Lab Maintenance', message: 'Programming lab will be closed tomorrow for system updates', type: 'warning', date: '1 hour ago' },
  { title: 'Industry Expert Session', message: 'Google engineer visit scheduled for next week', type: 'info', date: '3 hours ago' },
  { title: 'Research Proposal Deadline', message: 'Submit your research proposals by Friday', type: 'important', date: '1 day ago' },
  { title: 'New Assignment Platform', message: 'Updated submission portal is now live', type: 'success', date: '2 days ago' }
];

export function FacultyDashboard() {
  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">Good Morning, Dr. Priya!</h1>
        <p className="text-[#6B7280]">Manage your classes and track student progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">120</p>
                <p className="text-sm text-[#6B7280]">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">6</p>
                <p className="text-sm text-[#6B7280]">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">3</p>
                <p className="text-sm text-[#6B7280]">Classes Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">85%</p>
                <p className="text-sm text-[#6B7280]">Avg. Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Attendance Overview */}
      <Card className="rounded-xl shadow-sm border-0 bg-white mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Class Attendance Overview
          </CardTitle>
          <CardDescription>Attendance statistics for your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#27AE60" name="Present" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Today's Classes
              </CardTitle>
              <CardDescription>Your teaching schedule for today</CardDescription>
            </div>
            <Button size="sm" className="bg-[#2F80ED] hover:bg-[#2A73D4]">
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((class_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-[#2F80ED] rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-[#333333]">{class_.subject}</h4>
                      <Badge variant="outline" className="text-xs">
                        {class_.class}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6B7280]">{class_.room} • {class_.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#333333]">{class_.time}</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Take Attendance
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                Recent Submissions
              </CardTitle>
              <CardDescription>Latest assignment submissions to review</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#333333] mb-1">{submission.student}</h4>
                    <p className="text-sm text-[#6B7280] mb-2">{submission.assignment}</p>
                    <p className="text-xs text-[#9CA3AF]">{submission.submitted}</p>
                  </div>
                  <Badge 
                    variant={submission.status === 'graded' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      submission.status === 'graded' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {submission.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faculty Notifications */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Faculty Notifications
          </CardTitle>
          <CardDescription>Important updates and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facultyNotifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'important' ? 'bg-red-500' : 
                  notification.type === 'warning' ? 'bg-orange-500' :
                  notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#333333] mb-1">{notification.title}</h4>
                  <p className="text-sm text-[#6B7280] mb-2">{notification.message}</p>
                  <p className="text-xs text-[#9CA3AF]">{notification.date}</p>
                </div>
                <Badge 
                  variant={notification.type === 'important' ? 'destructive' : 
                         notification.type === 'warning' ? 'secondary' :
                         notification.type === 'success' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {notification.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 bg-gradient-to-r from-[#2F80ED] to-[#27AE60] hover:from-[#2A73D4] hover:to-[#229954] text-white rounded-xl">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">Take Attendance</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 rounded-xl hover:bg-gray-50">
              <div className="text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">Upload Marks</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 rounded-xl hover:bg-gray-50">
              <div className="text-center">
                <Calendar className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">Manage Schedule</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 rounded-xl hover:bg-gray-50">
              <div className="text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">Send Announcement</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}