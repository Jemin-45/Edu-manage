import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Users, GraduationCap, BookOpen, Download, Edit, Trash2, Loader2, Search } from 'lucide-react';
import { useFetch, useMutation, exportToCSV } from '../../services/hooks';
import { toast } from 'sonner';

interface FacultyPageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

export function FacultyPage({ userRole }: FacultyPageProps) {
  const [search, setSearch] = useState('');
  const { data: users, loading, refetch } = useFetch<any[]>('/users');
  const { mutate } = useMutation();

  const faculty = (users || []).filter((u: any) => u.role === 'teacher');
  const filtered = faculty.filter((u: any) =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) =>
    (name || 'F').split(' ').map((n: string) => n[0]).join('').toUpperCase();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove faculty member "${name}" from the system?`)) return;
    try {
      await mutate(`/users/${id}`, 'DELETE');
      toast.success('Faculty removed.');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleExport = () => {
    const data = filtered.map((u: any) => ({
      'Full Name': u.full_name || '',
      'Email': u.email,
      'Role': u.role,
      'Joined': u.created_at ? new Date(u.created_at).toLocaleDateString() : '',
    }));
    exportToCSV(data, 'faculty_list');
    toast.success('Exported to CSV!');
  };

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Faculty Management</h1>
          <p className="text-[#6B7280]">View and manage faculty members</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: 'Total Faculty', value: faculty.length, icon: Users, color: 'blue' },
          { label: 'Total Students', value: (users || []).filter((u: any) => u.role === 'student').length, icon: GraduationCap, color: 'green' },
          { label: 'Total Admins', value: (users || []).filter((u: any) => u.role === 'admin').length, icon: BookOpen, color: 'purple' },
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

      {/* Faculty Table */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Faculty Directory</CardTitle>
          <CardDescription>
            <div className="relative mt-2 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search faculty..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No faculty members found. Add one via User Management → Add User → Role: Teacher.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  {userRole === 'admin' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-r from-[#2F80ED] to-[#27AE60] text-white">
                            {getInitials(user.full_name || user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#333333]">{user.full_name || '—'}</p>
                          <p className="text-sm text-[#6B7280]">Faculty Member</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#6B7280]">{user.email}</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800 text-xs capitalize">Teacher</Badge></TableCell>
                    <TableCell className="text-sm text-[#6B7280]">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</TableCell>
                    {userRole === 'admin' && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(user.id, user.full_name)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
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