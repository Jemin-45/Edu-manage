import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { GraduationCap, Users, Search, Plus, Download, Edit, Trash2, Loader2 } from 'lucide-react';
import { useFetch, useMutation, exportToCSV } from '../../services/hooks';
import { toast } from 'sonner';

interface StudentsPageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

export function StudentsPage({ userRole }: StudentsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'student' });

  const { data: users, loading, refetch } = useFetch<any[]>('/users');
  const { mutate, loading: saving } = useMutation();

  // All users for admin; students only for faculty
  const allStudents = (users || []).filter((u: any) => u.role === 'student');
  const filteredStudents = allStudents.filter((u: any) =>
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) =>
    (name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUser) {
        await mutate(`/users/${editUser.id}`, 'PUT', { full_name: form.full_name, role: form.role });
        toast.success('User updated successfully!');
      } else {
        await mutate('/users', 'POST', form);
        toast.success('User created successfully!');
      }
      setOpen(false);
      setForm({ email: '', password: '', full_name: '', role: 'student' });
      setEditUser(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await mutate(`/users/${id}`, 'DELETE');
      toast.success('User deleted.');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleEdit = (user: any) => {
    setEditUser(user);
    setForm({ email: user.email, password: '', full_name: user.full_name, role: user.role });
    setOpen(true);
  };

  const handleExport = () => {
    const exportData = filteredStudents.map((u: any) => ({
      'Full Name': u.full_name || '',
      'Email': u.email,
      'Role': u.role,
      'Created At': u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '',
    }));
    exportToCSV(exportData, 'students_list');
    toast.success('Exported to CSV!');
  };

  // ─── Faculty view: read-only student list ─────────────────────────────────
  const facultyView = (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">My Students</h1>
          <p className="text-[#6B7280]">All students registered in the system</p>
        </div>
        <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export List
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#333333]">{loading ? '...' : allStudents.length}</p>
              <p className="text-sm text-[#6B7280]">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#333333]">{filteredStudents.length}</p>
              <p className="text-sm text-[#6B7280]">Showing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Student Directory</CardTitle>
          <CardDescription>
            <div className="relative mt-2 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search students..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No students found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-[#2F80ED] to-[#27AE60] text-white text-sm">
                            {getInitials(user.full_name || user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-[#333333]">{user.full_name || '—'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#6B7280]">{user.email}</TableCell>
                    <TableCell className="text-sm text-[#6B7280]">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ─── Admin view: full CRUD for all users ──────────────────────────────────
  const allUsers = (users || []).filter((u: any) => u.role === 'student' || u.role === 'teacher');
  const filteredAll = allUsers.filter((u: any) =>
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminView = (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">User Management</h1>
          <p className="text-[#6B7280]">Manage all students and teachers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const exportData = filteredAll.map((u: any) => ({
              'Full Name': u.full_name || '',
              'Email': u.email,
              'Role': u.role,
              'Created At': u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '',
            }));
            exportToCSV(exportData, 'users_list');
            toast.success('Exported!');
          }}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditUser(null); setForm({ email: '', password: '', full_name: '', role: 'student' }); } }}>
            <DialogTrigger asChild>
              <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>{editUser ? 'Edit User' : 'Create New User'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Enter full name" required />
                </div>
                {!editUser && <>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Enter email" required />
                  </div>
                  <div className="space-y-1">
                    <Label>Password</Label>
                    <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" required minLength={6} />
                  </div>
                </>}
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v: string) => setForm(f => ({ ...f, role: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher / Faculty</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-[#2F80ED] hover:bg-[#2A73D4]" disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : (editUser ? 'Update User' : 'Create User')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: 'Total Users', value: users?.length ?? 0, icon: Users, color: 'blue' },
          { label: 'Students', value: (users || []).filter((u: any) => u.role === 'student').length, icon: GraduationCap, color: 'green' },
          { label: 'Teachers', value: (users || []).filter((u: any) => u.role === 'teacher').length, icon: Users, color: 'orange' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">{loading ? '...' : value}</p>
                <p className="text-sm text-[#6B7280]">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> All Users</CardTitle>
          <CardDescription>
            <div className="relative mt-2 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search by name or email..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAll.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">No users found.</TableCell></TableRow>
                  ) : filteredAll.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-[#2F80ED] to-[#27AE60] text-white text-sm">
                              {getInitials(user.full_name || user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-[#333333]">{user.full_name || '—'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[#6B7280]">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadge(user.role)} text-xs capitalize`}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#6B7280]">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(user.id, user.full_name)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return userRole === 'admin' ? adminView : facultyView;
}