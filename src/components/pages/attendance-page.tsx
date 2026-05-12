import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar as CalendarIcon, Users, CheckCircle, XCircle, Clock, Download, Loader2, Search } from 'lucide-react';
import { useFetch, useMutation, exportToCSV } from '../../services/hooks';
import { toast } from 'sonner';

interface AttendancePageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

export function AttendancePage({ userRole }: AttendancePageProps) {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const { data: courses } = useFetch<any[]>('/courses');
  const { data: myAttendance, loading: loadingMine } = useFetch<any[]>(
    userRole === 'student' ? '/attendance/student/me' : null
  );
  const { data: enrolledStudents, loading: loadingStudents } = useFetch<any[]>(
    selectedCourse ? `/courses/${selectedCourse}/students` : null
  );
  const { data: existingAttendance } = useFetch<any[]>(
    selectedCourse ? `/attendance/${selectedCourse}?date=${selectedDate}` : null
  );
  const { mutate, loading: saving } = useMutation();

  // Pre-fill attendance map from existing records
  const students = (enrolledStudents || []).map((e: any) => e.profiles);

  const getStatus = (studentId: string): 'present' | 'absent' | 'late' => {
    if (attendanceMap[studentId]) return attendanceMap[studentId];
    const existing = (existingAttendance || []).find((a: any) => a.student_id === studentId);
    return existing?.status || 'present';
  };

  const setStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    const newMap: Record<string, any> = {};
    students.forEach((s: any) => { newMap[s.id] = status; });
    setAttendanceMap(newMap);
  };

  const handleSave = async () => {
    if (!selectedCourse) return toast.error('Please select a course first.');
    if (students.length === 0) return toast.error('No students enrolled in this course.');
    try {
      const records = students.map((s: any) => ({ student_id: s.id, status: getStatus(s.id) }));
      await mutate('/attendance', 'POST', { course_id: selectedCourse, date: selectedDate, records });
      toast.success('Attendance saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save attendance');
    }
  };

  const handleExport = () => {
    if (userRole === 'student') {
      const data = (myAttendance || []).map((a: any) => ({
        'Course': a.courses?.name || '',
        'Date': a.date,
        'Status': a.status,
      }));
      exportToCSV(data, 'my_attendance');
    } else {
      const data = students.map((s: any) => ({
        'Student': s?.full_name || '',
        'Email': s?.email || '',
        'Date': selectedDate,
        'Status': getStatus(s.id),
      }));
      exportToCSV(data, `attendance_${selectedDate}`);
    }
    toast.success('Exported to CSV!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter((s: any) =>
    s?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    s?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Student View ──────────────────────────────────────────────────────────
  if (userRole === 'student') {
    const presentCount = (myAttendance || []).filter((a: any) => a.status === 'present').length;
    const absentCount = (myAttendance || []).filter((a: any) => a.status === 'absent').length;
    const total = (myAttendance || []).length;
    const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    return (
      <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#333333] mb-2">My Attendance</h1>
            <p className="text-[#6B7280]">Track your attendance across all your courses</p>
          </div>
          <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
              <div><p className="text-2xl font-bold text-[#333333]">{pct}%</p><p className="text-sm text-[#6B7280]">Attendance Rate</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><CalendarIcon className="w-6 h-6 text-blue-600" /></div>
              <div><p className="text-2xl font-bold text-[#333333]">{presentCount}</p><p className="text-sm text-[#6B7280]">Days Present</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"><XCircle className="w-6 h-6 text-red-600" /></div>
              <div><p className="text-2xl font-bold text-[#333333]">{absentCount}</p><p className="text-sm text-[#6B7280]">Days Absent</p></div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader><CardTitle>Attendance Record</CardTitle></CardHeader>
          <CardContent>
            {loadingMine ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (myAttendance || []).length === 0 ? (
              <p className="text-center py-8 text-gray-400">No attendance records yet. Your teacher hasn't marked attendance for you.</p>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {myAttendance!.map((a: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{a.courses?.name || '—'}</TableCell>
                      <TableCell>{new Date(a.date).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell><Badge className={`${getStatusColor(a.status)} text-xs capitalize`}>{a.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Teacher / Admin View ──────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Take Attendance</h1>
          <p className="text-[#6B7280]">Mark and manage student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={!selectedCourse}><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button className="bg-[#27AE60] hover:bg-[#229954]" onClick={handleSave} disabled={saving || !selectedCourse}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Selectors */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Select Course</Label>
              <Select value={selectedCourse} onValueChange={v => { setSelectedCourse(v); setAttendanceMap({}); }}>
                <SelectTrigger><SelectValue placeholder="Choose a course" /></SelectTrigger>
                <SelectContent>
                  {(courses || []).map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Date</Label>
              <Input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setAttendanceMap({}); }} />
            </div>
            <div className="space-y-1">
              <Label>Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Student List</CardTitle>
            <CardDescription>{selectedCourse ? `${students.length} students enrolled` : 'Select a course to mark attendance'}</CardDescription>
          </div>
          {selectedCourse && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleMarkAll('present')}>Mark All Present</Button>
              <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleMarkAll('absent')}>Mark All Absent</Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!selectedCourse ? (
            <p className="text-center py-8 text-gray-400">Select a course and date to begin marking attendance.</p>
          ) : loadingStudents ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No students enrolled in this course yet.</p>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student: any) => {
                if (!student) return null;
                const status = getStatus(student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#2F80ED] to-[#27AE60] rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {(student.full_name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#333333]">{student.full_name}</p>
                        <p className="text-sm text-[#6B7280]">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(['present', 'absent', 'late'] as const).map(s => (
                        <Button key={s} size="sm"
                          variant={status === s ? 'default' : 'outline'}
                          className={status === s ? (s === 'present' ? 'bg-green-600 hover:bg-green-700' : s === 'absent' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700') : ''}
                          onClick={() => setStatus(student.id, s)}>
                          {s === 'present' ? <CheckCircle className="w-4 h-4 mr-1" /> : s === 'absent' ? <XCircle className="w-4 h-4 mr-1" /> : <Clock className="w-4 h-4 mr-1" />}
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}