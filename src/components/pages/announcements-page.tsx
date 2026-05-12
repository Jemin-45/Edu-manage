import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Bell, Plus, Search, Filter, Pin, Calendar, Users, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';

interface AnnouncementsPageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

// Mock announcements data
const announcements = [
  {
    id: 1,
    title: 'Mid-term Examinations Schedule',
    message: 'The mid-term examinations will commence from October 15th, 2024. All students are required to check their individual exam schedules on the student portal. Please ensure you have your admit cards ready.',
    type: 'important',
    category: 'academics',
    author: 'Academic Office',
    date: '2024-10-01',
    time: '09:00 AM',
    isPinned: true,
    audience: 'students',
    readCount: 245
  },
  {
    id: 2,
    title: 'Faculty Meeting - Curriculum Updates',
    message: 'All department heads and faculty members are requested to attend the mandatory curriculum review meeting scheduled for October 10th in the main auditorium.',
    type: 'info',
    category: 'meetings',
    author: 'Administration',
    date: '2024-09-28',
    time: '02:30 PM',
    isPinned: false,
    audience: 'faculty',
    readCount: 42
  },
  {
    id: 3,
    title: 'Library Extended Hours During Exams',
    message: 'The central library will remain open until 11:00 PM during the examination period (October 15-30). Students can access study halls and reference materials during these extended hours.',
    type: 'info',
    category: 'facilities',
    author: 'Library Administration',
    date: '2024-09-30',
    time: '11:15 AM',
    isPinned: false,
    audience: 'students',
    readCount: 167
  },
  {
    id: 4,
    title: 'Sports Day Event - October 25th',
    message: 'Annual sports day celebration will be held on October 25th. Registration for various events is now open. Students can register through the sports committee or online portal.',
    type: 'event',
    category: 'events',
    author: 'Sports Committee',
    date: '2024-09-25',
    time: '04:00 PM',
    isPinned: true,
    audience: 'all',
    readCount: 389
  },
  {
    id: 5,
    title: 'System Maintenance Notice',
    message: 'The student portal and academic systems will undergo scheduled maintenance on October 5th from 2:00 AM to 6:00 AM. All services will be temporarily unavailable during this period.',
    type: 'warning',
    category: 'technical',
    author: 'IT Department',
    date: '2024-10-02',
    time: '10:00 AM',
    isPinned: false,
    audience: 'all',
    readCount: 156
  }
];

export function AnnouncementsPage({ userRole }: AnnouncementsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'info',
    category: 'general',
    audience: 'all'
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'important': return <AlertCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'info': return <Bell className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesAudience = userRole === 'admin' || 
                           announcement.audience === 'all' || 
                           announcement.audience === userRole + 's';
    
    return matchesSearch && matchesCategory && matchesType && matchesAudience;
  });

  const handleCreateAnnouncement = () => {
    // In a real app, this would make an API call
    console.log('Creating announcement:', newAnnouncement);
    setShowCreateDialog(false);
    setNewAnnouncement({
      title: '',
      message: '',
      type: 'info',
      category: 'general',
      audience: 'all'
    });
  };

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">
            {userRole === 'student' ? 'Announcements' : 
             userRole === 'faculty' ? 'Faculty Announcements' : 
             'Manage Announcements'}
          </h1>
          <p className="text-[#6B7280]">
            {userRole === 'student' ? 'Stay updated with important notifications and events' :
             userRole === 'faculty' ? 'View and create announcements for your students' :
             'Create and manage system-wide announcements'}
          </p>
        </div>
        
        {(userRole === 'faculty' || userRole === 'admin') && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]">
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>
                  Share important information with students and faculty
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter announcement message"
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newAnnouncement.type} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="audience">Audience</Label>
                    <Select value={newAnnouncement.audience} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, audience: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Everyone</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="faculty">Faculty Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAnnouncement} className="bg-[#27AE60] hover:bg-[#229954]">
                    <Send className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academics">Academics</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
                <SelectItem value="meetings">Meetings</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pinned Announcements */}
      {filteredAnnouncements.some(a => a.isPinned) && (
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pin className="w-5 h-5 text-orange-600" />
              Pinned Announcements
            </CardTitle>
            <CardDescription>Important announcements pinned for visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAnnouncements.filter(announcement => announcement.isPinned).map((announcement) => (
                <div key={announcement.id} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(announcement.type)}
                        <h3 className="font-semibold text-[#333333]">{announcement.title}</h3>
                        <Badge className={`${getTypeColor(announcement.type)} text-xs`}>
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-[#6B7280] mb-3">{announcement.message}</p>
                      <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
                        <span>By {announcement.author}</span>
                        <span>{announcement.date} at {announcement.time}</span>
                        {userRole === 'admin' && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{announcement.readCount} views</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Pin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regular Announcements */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Recent Announcements
          </CardTitle>
          <CardDescription>
            {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-[#6B7280]">No announcements found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.filter(announcement => !announcement.isPinned).map((announcement) => (
                <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(announcement.type)}
                        <h3 className="font-semibold text-[#333333]">{announcement.title}</h3>
                        <Badge className={`${getTypeColor(announcement.type)} text-xs`}>
                          {announcement.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {announcement.category}
                        </Badge>
                      </div>
                      <p className="text-[#6B7280] mb-3">{announcement.message}</p>
                      <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
                        <span>By {announcement.author}</span>
                        <span>{announcement.date} at {announcement.time}</span>
                        <Badge variant="secondary" className="text-xs">
                          {announcement.audience === 'all' ? 'Everyone' : announcement.audience}
                        </Badge>
                        {userRole === 'admin' && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{announcement.readCount} views</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {(userRole === 'faculty' || userRole === 'admin') && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        {!announcement.isPinned && (
                          <Button size="sm" variant="outline">
                            <Pin className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats for Admin */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">{announcements.length}</p>
                  <p className="text-sm text-[#6B7280]">Total Announcements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">
                    {announcements.filter(a => a.type === 'important').length}
                  </p>
                  <p className="text-sm text-[#6B7280]">Important Notices</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Pin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">
                    {announcements.filter(a => a.isPinned).length}
                  </p>
                  <p className="text-sm text-[#6B7280]">Pinned Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">
                    {announcements.reduce((sum, a) => sum + a.readCount, 0)}
                  </p>
                  <p className="text-sm text-[#6B7280]">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}