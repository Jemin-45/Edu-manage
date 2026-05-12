import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { BookOpen, Plus, Download, Edit, Trash2, Loader2, Search, Users } from 'lucide-react';
import { useFetch, useMutation, exportToCSV } from '../../services/hooks';
import { toast } from 'sonner';

interface CoursesPageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

export function CoursesPage({ userRole }: CoursesPageProps) {
  const [open, setOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', teacher_id: '' });

  const { data: courses, loading, refetch } = useFetch<any[]>('/courses');
  const { data: teachers } = useFetch<any[]>('/users');
  const { mutate, loading: saving } = useMutation();

  const teacherList = (teachers || []).filter((u: any) => u.role === 'teacher');
  const filtered = (courses || []).filter((c: any) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editCourse) {
        await mutate(`/courses/${editCourse.id}`, 'PUT', form);
        toast.success('Course updated!');
      } else {
        await mutate('/courses', 'POST', form);
        toast.success('Course created!');
      }
      setOpen(false);
      setForm({ name: '', description: '', teacher_id: '' });
      setEditCourse(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save course');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete course "${name}"?`)) return;
    try {
      await mutate(`/courses/${id}`, 'DELETE');
      toast.success('Course deleted.');
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (course: any) => {
    setEditCourse(course);
    setForm({ name: course.name, description: course.description || '', teacher_id: course.teacher_id || '' });
    setOpen(true);
  };

  const handleExport = () => {
    const exportData = filtered.map((c: any) => ({
      'Course Name': c.name,
      'Description': c.description || '',
      'Teacher': c.profiles?.full_name || '—',
    }));
    exportToCSV(exportData, 'courses');
    toast.success('Exported to CSV!');
  };

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">
            {userRole === 'admin' ? 'Course Management' : 'My Courses'}
          </h1>
          <p className="text-[#6B7280]">
            {userRole === 'admin' ? 'Create and manage all courses' : 'Courses assigned to you'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          {userRole === 'admin' && (
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditCourse(null); setForm({ name: '', description: '', teacher_id: '' }); } }}>
              <DialogTrigger asChild>
                <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]"><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader><DialogTitle>{editCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <div className="space-y-1">
                    <Label>Course Name</Label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Data Structures" required />
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief course description" />
                  </div>
                  <div className="space-y-1">
                    <Label>Assign Teacher</Label>
                    <Select value={form.teacher_id} onValueChange={v => setForm(f => ({ ...f, teacher_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                      <SelectContent>
                        {teacherList.map((t: any) => (
                          <SelectItem key={t.id} value={t.id}>{t.full_name} ({t.email})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-[#2F80ED] hover:bg-[#2A73D4]" disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : (editCourse ? 'Update' : 'Create Course')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><BookOpen className="w-6 h-6 text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-[#333333]">{loading ? '...' : (courses || []).length}</p><p className="text-sm text-[#6B7280]">Total Courses</p></div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
            <div><p className="text-2xl font-bold text-[#333333]">{teacherList.length}</p><p className="text-sm text-[#6B7280]">Teachers</p></div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><BookOpen className="w-6 h-6 text-orange-600" /></div>
            <div><p className="text-2xl font-bold text-[#333333]">{(courses || []).filter((c: any) => c.teacher_id).length}</p><p className="text-sm text-[#6B7280]">Assigned</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Course List</CardTitle>
          <CardDescription>
            <div className="relative mt-2 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search courses..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Teacher</TableHead>
                  {userRole === 'admin' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No courses found.</TableCell></TableRow>
                ) : filtered.map((course: any) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium text-[#333333]">{course.name}</TableCell>
                    <TableCell className="text-sm text-[#6B7280]">{course.description || '—'}</TableCell>
                    <TableCell>
                      {course.profiles?.full_name
                        ? <Badge className="bg-green-100 text-green-800">{course.profiles.full_name}</Badge>
                        : <span className="text-gray-400 text-sm">Unassigned</span>}
                    </TableCell>
                    {userRole === 'admin' && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(course)}><Edit className="w-3 h-3" /></Button>
                          <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(course.id, course.name)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </TableCell>
                    )}
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