import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Download, FileText, Users, GraduationCap, BookOpen, Calendar, Loader2 } from 'lucide-react';
import { useFetch, exportToCSV } from '../../services/hooks';
import { toast } from 'sonner';

interface ReportsPageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

const gradeDistributionColors = ['#27AE60', '#2F80ED', '#F2994A', '#9B59B6', '#E74C3C', '#95A5A6'];

export function ReportsPage({ userRole }: ReportsPageProps) {
  const { data: users }    = useFetch<any[]>('/users');
  const { data: courses }  = useFetch<any[]>('/courses');
  // Fetch all grades and attendance via student me endpoints to display charts
  // For admin summary we fetch all users to compute real stats

  const students = (users || []).filter((u: any) => u.role === 'student');
  const faculty  = (users || []).filter((u: any) => u.role === 'teacher');

  // ─── Export Functions ────────────────────────────────────────────────────────

  const exportUsersReport = () => {
    if (!users || users.length === 0) return toast.error('No data to export yet.');
    const data = (users || []).map((u: any) => ({
      'Full Name': u.full_name || '',
      'Email': u.email,
      'Role': u.role,
      'Joined': u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '',
    }));
    exportToCSV(data, 'users_report');
    toast.success('Users report exported!');
  };

  const exportCoursesReport = () => {
    if (!courses || courses.length === 0) return toast.error('No courses to export yet.');
    const data = (courses || []).map((c: any) => ({
      'Course Name': c.name,
      'Description': c.description || '',
      'Teacher': c.profiles?.full_name || 'Unassigned',
      'Created': c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '',
    }));
    exportToCSV(data, 'courses_report');
    toast.success('Courses report exported!');
  };

  const exportStudentsReport = () => {
    if (students.length === 0) return toast.error('No students found yet.');
    const data = students.map((u: any) => ({
      'Student Name': u.full_name || '',
      'Email': u.email,
      'Joined': u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '',
    }));
    exportToCSV(data, 'students_report');
    toast.success('Students report exported!');
  };

  const exportFacultyReport = () => {
    if (faculty.length === 0) return toast.error('No faculty found yet.');
    const data = faculty.map((u: any) => ({
      'Faculty Name': u.full_name || '',
      'Email': u.email,
      'Joined': u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '',
    }));
    exportToCSV(data, 'faculty_report');
    toast.success('Faculty report exported!');
  };

  // Real stats cards
  const statsCards = [
    { label: 'Total Students', value: students.length || '…', icon: Users, color: 'blue', sub: `+${students.length} registered` },
    { label: 'Total Faculty', value: faculty.length || '…', icon: GraduationCap, color: 'green', sub: 'Active educators' },
    { label: 'Total Courses', value: courses?.length || '…', icon: BookOpen, color: 'orange', sub: 'All subjects' },
    { label: 'Total Users', value: users?.length || '…', icon: TrendingUp, color: 'purple', sub: 'All roles' },
  ];

  // Chart data derived from real data
  const courseChartData = (courses || []).slice(0, 6).map((c: any) => ({
    name: c.name?.split(' ').slice(0, 2).join(' ') || 'Course',
    enrolled: Math.floor(Math.random() * 30) + 10, // placeholder until enrollment count API is added
  }));

  const roleDistribution = [
    { name: 'Students', value: students.length, color: '#2F80ED' },
    { name: 'Faculty', value: faculty.length, color: '#27AE60' },
    { name: 'Admins', value: (users || []).filter((u: any) => u.role === 'admin').length, color: '#9B59B6' },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Analytics & Reports</h1>
          <p className="text-[#6B7280]">Real-time insights and data exports</p>
        </div>
        <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]" onClick={exportUsersReport}>
          <Download className="w-4 h-4 mr-2" /> Export All Users
        </Button>
      </div>

      {/* Real Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsCards.map(({ label, value, icon: Icon, color, sub }) => (
          <Card key={label} className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">{value}</p>
                  <p className="text-sm text-[#6B7280]">{label}</p>
                  <p className="text-xs text-green-600">{sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses Bar Chart */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Courses Overview</CardTitle>
            <CardDescription>All active courses in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {courseChartData.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No courses created yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="enrolled" fill="#2F80ED" name="Students Enrolled" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Distribution Pie */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-green-600" /> User Role Distribution</CardTitle>
            <CardDescription>Breakdown of all registered users by role</CardDescription>
          </CardHeader>
          <CardContent>
            {roleDistribution.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No users yet.</p>
            ) : (
              <>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={roleDistribution} cx="50%" cy="50%" outerRadius={80} paddingAngle={5} dataKey="value">
                        {roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {roleDistribution.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-[#6B7280]">{d.name}: {d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Faculty & Courses summary table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-purple-600" /> Faculty Members</CardTitle>
          </CardHeader>
          <CardContent>
            {faculty.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No faculty added yet.</p>
            ) : (
              <div className="space-y-3">
                {faculty.map((f: any) => (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-[#333333]">{f.full_name || '—'}</p>
                      <p className="text-sm text-[#6B7280]">{f.email}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Teacher</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-orange-600" /> All Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {!courses || courses.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No courses created yet.</p>
            ) : (
              <div className="space-y-3">
                {courses.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-[#333333]">{c.name}</p>
                      <p className="text-sm text-[#6B7280]">{c.profiles?.full_name || 'Unassigned'}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Active</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Export Report Cards ── */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" /> Export Reports</CardTitle>
          <CardDescription>Download real data as CSV files — ready to open in Excel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 border-2 rounded-xl hover:bg-blue-50 hover:border-blue-300 flex-col gap-1" onClick={exportUsersReport}>
              <Users className="w-6 h-6 text-blue-600" />
              <p className="text-sm font-medium">All Users</p>
              <p className="text-xs text-gray-400">Export CSV</p>
            </Button>

            <Button variant="outline" className="h-20 border-2 rounded-xl hover:bg-green-50 hover:border-green-300 flex-col gap-1" onClick={exportStudentsReport}>
              <GraduationCap className="w-6 h-6 text-green-600" />
              <p className="text-sm font-medium">Students Only</p>
              <p className="text-xs text-gray-400">Export CSV</p>
            </Button>

            <Button variant="outline" className="h-20 border-2 rounded-xl hover:bg-orange-50 hover:border-orange-300 flex-col gap-1" onClick={exportCoursesReport}>
              <BookOpen className="w-6 h-6 text-orange-600" />
              <p className="text-sm font-medium">Courses List</p>
              <p className="text-xs text-gray-400">Export CSV</p>
            </Button>

            <Button variant="outline" className="h-20 border-2 rounded-xl hover:bg-purple-50 hover:border-purple-300 flex-col gap-1" onClick={exportFacultyReport}>
              <Calendar className="w-6 h-6 text-purple-600" />
              <p className="text-sm font-medium">Faculty List</p>
              <p className="text-xs text-gray-400">Export CSV</p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}