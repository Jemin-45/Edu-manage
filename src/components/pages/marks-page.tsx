import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { BarChart3, Download, Plus, Loader2, Trophy, BookOpen } from 'lucide-react';
import { useFetch, useMutation, exportToCSV } from '../../services/hooks';
import { toast } from 'sonner';

interface MarksPageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

export function MarksPage({ userRole }: MarksPageProps) {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [open, setOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({ student_id: '', course_id: '', assignment_id: '', grade: '', remarks: '' });

  const { data: myGrades, loading: loadingMyGrades } = useFetch<any[]>(userRole === 'student' ? '/grades/student/me' : null);
  const { data: courses } = useFetch<any[]>('/courses');
  const { data: courseGrades, loading: loadingCourseGrades, refetch: refetchGrades } = useFetch<any[]>(
    selectedCourse ? `/grades/${selectedCourse}` : null
  );
  const { data: users } = useFetch<any[]>(userRole !== 'student' ? '/users' : null);
  const { data: assignments } = useFetch<any[]>(selectedCourse ? `/assignments/${selectedCourse}` : null);
  const { mutate, loading: saving } = useMutation();

  const students = (users || []).filter((u: any) => u.role === 'student');

  const getGradeColor = (grade: string) => {
    const g = parseFloat(grade);
    if (g >= 80) return 'text-green-600';
    if (g >= 60) return 'text-blue-600';
    if (g >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBadge = (grade: string) => {
    const g = parseFloat(grade);
    if (g >= 90) return { label: 'A+', cls: 'bg-green-100 text-green-800' };
    if (g >= 80) return { label: 'A', cls: 'bg-green-100 text-green-800' };
    if (g >= 70) return { label: 'B', cls: 'bg-blue-100 text-blue-800' };
    if (g >= 60) return { label: 'C', cls: 'bg-yellow-100 text-yellow-800' };
    if (g >= 40) return { label: 'D', cls: 'bg-orange-100 text-orange-800' };
    return { label: 'F', cls: 'bg-red-100 text-red-800' };
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate('/grades', 'POST', { ...gradeForm, course_id: selectedCourse || gradeForm.course_id });
      toast.success('Grade saved!');
      setOpen(false);
      setGradeForm({ student_id: '', course_id: '', assignment_id: '', grade: '', remarks: '' });
      refetchGrades();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save grade');
    }
  };

  const handleExport = () => {
    if (userRole === 'student') {
      const data = (myGrades || []).map((g: any) => ({
        'Course': g.courses?.name || '',
        'Assignment': g.assignments?.title || 'General',
        'Grade': g.grade,
        'Remarks': g.remarks || '',
      }));
      exportToCSV(data, 'my_grades');
    } else {
      const data = (courseGrades || []).map((g: any) => ({
        'Student': g.profiles?.full_name || '',
        'Assignment': g.assignments?.title || 'General',
        'Grade': g.grade,
        'Remarks': g.remarks || '',
      }));
      exportToCSV(data, 'course_grades');
    }
    toast.success('Exported to CSV!');
  };

  // Student View
  if (userRole === 'student') {
    const avg = myGrades && myGrades.length > 0
      ? (myGrades.reduce((sum: number, g: any) => sum + parseFloat(g.grade || 0), 0) / myGrades.length).toFixed(1)
      : '—';

    return (
      <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#333333] mb-2">My Grades</h1>
            <p className="text-[#6B7280]">Track your academic performance</p>
          </div>
          <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export Grades
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Average Score', value: avg, icon: Trophy, color: 'green' },
            { label: 'Graded Items', value: myGrades?.length ?? '...', icon: BarChart3, color: 'blue' },
            { label: 'Courses', value: [...new Set((myGrades || []).map((g: any) => g.course_id))].length, icon: BookOpen, color: 'orange' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="rounded-xl shadow-sm border-0 bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">{loadingMyGrades ? '...' : value}</p>
                  <p className="text-sm text-[#6B7280]">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Grade Report</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMyGrades ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (myGrades || []).length === 0 ? (
              <p className="text-center py-8 text-gray-400">No grades posted yet. Check back once your teacher grades your submissions.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Course</TableHead><TableHead>Assignment</TableHead><TableHead>Score</TableHead><TableHead>Grade</TableHead><TableHead>Remarks</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {myGrades!.map((grade: any, i: number) => {
                    const { label, cls } = getGradeBadge(grade.grade);
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{grade.courses?.name || '—'}</TableCell>
                        <TableCell>{grade.assignments?.title || 'General Grade'}</TableCell>
                        <TableCell className={`font-bold ${getGradeColor(grade.grade)}`}>{grade.grade}</TableCell>
                        <TableCell><Badge className={cls}>{label}</Badge></TableCell>
                        <TableCell className="text-sm text-gray-500">{grade.remarks || '—'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Teacher / Admin View
  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Grade Management</h1>
          <p className="text-[#6B7280]">Post and manage student grades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={!selectedCourse}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]" disabled={!selectedCourse}><Plus className="w-4 h-4 mr-2" /> Add Grade</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>Post a Grade</DialogTitle></DialogHeader>
              <form onSubmit={handleAddGrade} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <Label>Student</Label>
                  <Select value={gradeForm.student_id} onValueChange={v => setGradeForm(f => ({ ...f, student_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Assignment (optional)</Label>
                  <Select value={gradeForm.assignment_id} onValueChange={v => setGradeForm(f => ({ ...f, assignment_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select assignment" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">General Grade</SelectItem>
                      {(assignments || []).map((a: any) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Score (0-100)</Label>
                  <Input type="number" min="0" max="100" value={gradeForm.grade} onChange={e => setGradeForm(f => ({ ...f, grade: e.target.value }))} placeholder="e.g. 85" required />
                </div>
                <div className="space-y-1">
                  <Label>Remarks (optional)</Label>
                  <Input value={gradeForm.remarks} onChange={e => setGradeForm(f => ({ ...f, remarks: e.target.value }))} placeholder="Teacher feedback" />
                </div>
                <Button type="submit" className="w-full bg-[#27AE60] hover:bg-[#229954]" disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Grade'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Course Selector */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium whitespace-nowrap">Select Course:</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Choose a course to view grades" />
              </SelectTrigger>
              <SelectContent>
                {(courses || []).map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-600" /> Grade Sheet</CardTitle>
          <CardDescription>{selectedCourse ? `Showing grades for selected course` : 'Select a course above to view grades'}</CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedCourse ? (
            <p className="text-center py-8 text-gray-400">Please select a course to view or add grades.</p>
          ) : loadingCourseGrades ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : (courseGrades || []).length === 0 ? (
            <p className="text-center py-8 text-gray-400">No grades posted for this course yet. Click "Add Grade" to get started!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Student</TableHead><TableHead>Assignment</TableHead><TableHead>Score</TableHead><TableHead>Grade</TableHead><TableHead>Remarks</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {courseGrades!.map((grade: any, i: number) => {
                  const { label, cls } = getGradeBadge(grade.grade);
                  return (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{grade.profiles?.full_name || '—'}</TableCell>
                      <TableCell>{grade.assignments?.title || 'General'}</TableCell>
                      <TableCell className={`font-bold ${getGradeColor(grade.grade)}`}>{grade.grade}</TableCell>
                      <TableCell><Badge className={cls}>{label}</Badge></TableCell>
                      <TableCell className="text-sm text-gray-500">{grade.remarks || '—'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}