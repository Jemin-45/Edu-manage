import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, AlertCircle, CheckCircle, Plus } from 'lucide-react';


const systemStats = [
  { label: 'CS Students', value: 1671, icon: GraduationCap, color: 'blue', trend: '+15%' },
  { label: 'CS Faculty', value: 33, icon: Users, color: 'green', trend: '+8%' },
  { label: 'CS Subjects', value: 6, icon: BookOpen, color: 'orange', trend: '+2%' },
  { label: 'Lab Utilization', value: '92%', icon: TrendingUp, color: 'purple', trend: '+5%' }
];



const csSubjectsData = [
  { name: 'Data Structures & Algorithms', students: 320, faculty: 8, code: 'DSA' },
  { name: 'Database Management Systems', students: 285, faculty: 6, code: 'DBMS' },
  { name: 'Python Programming', students: 340, faculty: 7, code: 'PYT' },
  { name: 'Web Programming', students: 298, faculty: 5, code: 'WEB' },
  { name: 'Android Development', students: 246, faculty: 4, code: 'AND' },
  { name: 'Machine Learning', students: 182, faculty: 3, code: 'ML' }
];

const recentActivities = [
  { activity: 'DSA lab equipment upgrade completed', time: '1 hour ago', type: 'success' },
  { activity: 'Python certification program launched', time: '3 hours ago', type: 'success' },
  { activity: 'Web Development workshop scheduled', time: '1 day ago', type: 'warning' },
  { activity: 'Android Development course enrollment opened', time: '2 days ago', type: 'info' },
  { activity: 'Machine Learning faculty hiring completed', time: '3 days ago', type: 'success' }
];

const pendingApprovals = [
  { item: 'CS Lab Access Requests', count: 18, priority: 'high' },
  { item: 'Project Submission Extensions', count: 12, priority: 'medium' },
  { item: 'Industry Internship Approvals', count: 8, priority: 'high' },
  { item: 'Software License Renewals', count: 5, priority: 'medium' },
  { item: 'Research Paper Publication Requests', count: 3, priority: 'low' }
];

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">Admin Dashboard</h1>
        <p className="text-[#6B7280]">System overview and management tools</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#333333]">{stat.value}</p>
                    <p className="text-sm text-[#6B7280] mb-2">{stat.label}</p>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CS Subjects Overview */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            Computer Science Subjects
          </CardTitle>
          <CardDescription>Students and faculty across CS subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {csSubjectsData.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-[#333333]">{subject.name}</h4>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {subject.code}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6B7280]">{subject.faculty} faculty members</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#2F80ED]">{subject.students}</p>
                  <p className="text-sm text-[#6B7280]">students</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Items requiring admin attention</CardDescription>
            </div>
            <Button size="sm" className="bg-[#2F80ED] hover:bg-[#2A73D4]">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#333333] mb-1">{item.item}</h4>
                    <p className="text-sm text-[#6B7280]">{item.count} pending items</p>
                  </div>
                  <Badge 
                    className={`text-xs ${
                      item.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : item.priority === 'medium'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Recent System Activities
            </CardTitle>
            <CardDescription>Latest system events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-[#333333] mb-1">{activity.activity}</p>
                    <p className="text-xs text-[#9CA3AF]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle>Quick Management Actions</CardTitle>
          <CardDescription>Commonly used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 bg-gradient-to-r from-[#2F80ED] to-[#27AE60] hover:from-[#2A73D4] hover:to-[#229954] text-white rounded-xl">
              <div className="text-center">
                <Plus className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">Add Student</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 rounded-xl hover:bg-gray-50">
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">Manage Faculty</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 rounded-xl hover:bg-gray-50">
              <div className="text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">Course Setup</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-16 border-2 rounded-xl hover:bg-gray-50">
              <div className="text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">View Reports</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}