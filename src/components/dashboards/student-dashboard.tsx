import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Clock, Trophy, BookOpen, AlertCircle, CheckCircle, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';




const marksData = [
  { subject: 'DSA', marks: 92, total: 100 },
  { subject: 'DBMS', marks: 87, total: 100 },
  { subject: 'Python', marks: 78, total: 100 },
  { subject: 'Web Programming', marks: 94, total: 100 },
  { subject: 'Android Development', marks: 89, total: 100 }
];

const upcomingClasses = [
  { subject: 'DSA', time: '09:00 AM', room: 'Room 101', faculty: 'Dr. Vikram Singh' },
  { subject: 'Python', time: '11:00 AM', room: 'Lab 201', faculty: 'Prof. Neha Gupta' },
  { subject: 'DBMS', time: '02:00 PM', room: 'Lab 301', faculty: 'Dr. Suresh Sharma' }
];

const announcements = [
  { title: 'DSA Assignment Due', message: 'Binary Search Tree implementation due tomorrow at 11:59 PM', type: 'important', date: '1 hour ago' },
  { title: 'Python Workshop', message: 'Advanced Flask development workshop this Saturday', type: 'info', date: '3 hours ago' },
  { title: 'Industry Visit', message: 'Google India campus visit for CS students next week', type: 'success', date: '1 day ago' },
  { title: 'Lab Access Update', message: 'Programming lab access cards have been updated', type: 'info', date: '2 days ago' },
  { title: 'Internship Fair', message: 'Tech companies recruitment fair scheduled for next month', type: 'success', date: '3 days ago' }
];

const syllabusData = [
  { 
    subject: 'DSA', 
    faculty: 'Dr. Vikram Singh',
    topics: ['Arrays & Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Sorting Algorithms', 'Dynamic Programming'],
    credits: 4,
    code: 'CS301'
  },
  { 
    subject: 'DBMS', 
    faculty: 'Dr. Suresh Sharma',
    topics: ['ER Model', 'Relational Algebra', 'SQL', 'Normalization', 'Transaction Management'],
    credits: 4,
    code: 'CS302'
  },
  { 
    subject: 'Python', 
    faculty: 'Prof. Neha Gupta',
    topics: ['Python Basics', 'OOP Concepts', 'File Handling', 'Libraries (NumPy, Pandas)', 'Web Scraping'],
    credits: 3,
    code: 'CS303'
  },
  { 
    subject: 'Web Programming', 
    faculty: 'Ms. Priya Mehta',
    topics: ['HTML5 & CSS3', 'JavaScript & ES6', 'React.js', 'Node.js & Express', 'RESTful APIs'],
    credits: 4,
    code: 'CS304'
  },
  { 
    subject: 'Android Development', 
    faculty: 'Dr. Ravi Kumar',
    topics: ['Android Studio Setup', 'UI Components', 'Activities & Intents', 'SQLite Database', 'API Integration'],
    credits: 3,
    code: 'CS305'
  }
];

export function StudentDashboard() {
  const handleDownloadSyllabus = (subject: typeof syllabusData[0]) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(47, 128, 237);
    doc.text('EduManage', 14, 20);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${subject.subject} - Course Syllabus`, 14, 35);
    
    // Course details
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Course Code: ${subject.code}`, 14, 45);
    doc.text(`Credits: ${subject.credits}`, 14, 52);
    doc.text(`Faculty: ${subject.faculty}`, 14, 59);
    doc.text(`Academic Year: 2024-2025`, 14, 66);
    
    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 72, 196, 72);
    
    // Topics section
    doc.setFontSize(14);
    doc.setTextColor(47, 128, 237);
    doc.text('Course Topics:', 14, 82);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    let yPosition = 92;
    subject.topics.forEach((topic, index) => {
      doc.text(`${index + 1}. ${topic}`, 20, yPosition);
      yPosition += 8;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 280);
    doc.text('EduManage - Student Management System', 14, 287);
    
    // Save PDF
    doc.save(`${subject.subject}_Syllabus.pdf`);
    toast.success(`Syllabus for ${subject.subject} downloaded successfully!`);
  };

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">Welcome Back, Jemin!</h1>
        <p className="text-[#6B7280]">Here's your academic overview for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">85%</p>
                <p className="text-sm text-[#6B7280]">Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">88%</p>
                <p className="text-sm text-[#6B7280]">Average Grade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">5</p>
                <p className="text-sm text-[#6B7280]">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333333]">3</p>
                <p className="text-sm text-[#6B7280]">Classes Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Marks */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Subject Performance
            </CardTitle>
            <CardDescription>Your marks in different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marksData.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#333333]">{subject.subject}</span>
                    <span className="text-sm font-bold text-[#2F80ED]">{subject.marks}/{subject.total}</span>
                  </div>
                  <Progress 
                    value={subject.marks} 
                    className="h-2"
                    style={{ 
                      background: '#F3F4F6',
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Today's Classes
            </CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((class_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#2F80ED] rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#333333]">{class_.subject}</p>
                    <p className="text-xs text-[#6B7280]">{class_.faculty} • {class_.room}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {class_.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Recent Announcements
          </CardTitle>
          <CardDescription>Important notifications and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  announcement.type === 'important' ? 'bg-red-500' : 
                  announcement.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#333333] mb-1">{announcement.title}</h4>
                  <p className="text-sm text-[#6B7280] mb-2">{announcement.message}</p>
                  <p className="text-xs text-[#9CA3AF]">{announcement.date}</p>
                </div>
                <Badge 
                  variant={announcement.type === 'important' ? 'destructive' : 
                         announcement.type === 'success' ? 'default' : 'secondary'}
                  className={`text-xs ${
                    announcement.type === 'success' ? 'bg-green-100 text-green-800' : ''
                  }`}
                >
                  {announcement.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Syllabus Download */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Course Syllabus
          </CardTitle>
          <CardDescription>Download syllabus for your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syllabusData.map((subject, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-[#2F80ED] rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#333333] mb-1">{subject.subject}</h4>
                  <p className="text-sm text-[#6B7280] mb-2">{subject.faculty} • {subject.credits} Credits</p>
                </div>
                <Button 
                  variant="outline" 
                  className="text-xs"
                  onClick={() => handleDownloadSyllabus(subject)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}