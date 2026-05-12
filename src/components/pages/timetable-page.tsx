import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Calendar, Clock, BookOpen, MapPin, Edit, Plus, Download, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface TimetablePageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

// Mock timetable data
const studentTimetable = {
  Monday: [
    { time: '09:00 AM - 10:00 AM', subject: 'DSA', faculty: 'Dr. Vikram Singh', room: 'Room 101', type: 'lecture' },
    { time: '10:15 AM - 11:15 AM', subject: 'Python', faculty: 'Prof. Neha Gupta', room: 'Lab 201', type: 'lab' },
    { time: '11:30 AM - 12:30 PM', subject: 'DBMS', faculty: 'Dr. Suresh Sharma', room: 'Lab 301', type: 'lab' },
    { time: '02:00 PM - 03:00 PM', subject: 'Web Programming', faculty: 'Ms. Priya Mehta', room: 'Room 205', type: 'lecture' },
  ],
  Tuesday: [
    { time: '09:00 AM - 10:00 AM', subject: 'Android Development', faculty: 'Dr. Ravi Kumar', room: 'Lab 101', type: 'lab' },
    { time: '10:15 AM - 11:15 AM', subject: 'DSA', faculty: 'Dr. Vikram Singh', room: 'Room 101', type: 'lecture' },
    { time: '11:30 AM - 12:30 PM', subject: 'Computer Networks', faculty: 'Prof. Anjali Joshi', room: 'Room 301', type: 'lecture' },
    { time: '02:00 PM - 03:00 PM', subject: 'Python', faculty: 'Prof. Neha Gupta', room: 'Lab 201', type: 'practical' },
  ],
  Wednesday: [
    { time: '09:00 AM - 10:00 AM', subject: 'DBMS', faculty: 'Dr. Suresh Sharma', room: 'Lab 301', type: 'lecture' },
    { time: '10:15 AM - 11:15 AM', subject: 'Web Programming', faculty: 'Ms. Priya Mehta', room: 'Room 205', type: 'lecture' },
    { time: '11:30 AM - 12:30 PM', subject: 'DSA', faculty: 'Dr. Vikram Singh', room: 'Room 101', type: 'tutorial' },
    { time: '02:00 PM - 03:00 PM', subject: 'Android Development', faculty: 'Dr. Ravi Kumar', room: 'Lab 101', type: 'practical' },
  ],
  Thursday: [
    { time: '09:00 AM - 10:00 AM', subject: 'Python', faculty: 'Prof. Neha Gupta', room: 'Lab 201', type: 'lecture' },
    { time: '10:15 AM - 11:15 AM', subject: 'Computer Networks', faculty: 'Prof. Anjali Joshi', room: 'Room 301', type: 'lecture' },
    { time: '11:30 AM - 12:30 PM', subject: 'DBMS', faculty: 'Dr. Suresh Sharma', room: 'Lab 301', type: 'practical' },
    { time: '02:00 PM - 03:00 PM', subject: 'Web Programming', faculty: 'Ms. Priya Mehta', room: 'Room 205', type: 'tutorial' },
  ],
  Friday: [
    { time: '09:00 AM - 10:00 AM', subject: 'DSA', faculty: 'Dr. Vikram Singh', room: 'Room 101', type: 'lecture' },
    { time: '10:15 AM - 11:15 AM', subject: 'Android Development', faculty: 'Dr. Ravi Kumar', room: 'Lab 101', type: 'lecture' },
    { time: '11:30 AM - 12:30 PM', subject: 'Python', faculty: 'Prof. Neha Gupta', room: 'Lab 201', type: 'tutorial' },
    { time: '02:00 PM - 03:00 PM', subject: 'Computer Networks', faculty: 'Prof. Anjali Joshi', room: 'Room 301', type: 'discussion' },
  ]
};

const facultyTimetable = {
  Monday: [
    { time: '09:00 AM - 10:00 AM', subject: 'DSA', class: 'CS-A', room: 'Room 101', students: 30 },
    { time: '10:15 AM - 11:15 AM', subject: 'DSA', class: 'CS-B', room: 'Room 102', students: 28 },
    { time: '02:00 PM - 03:00 PM', subject: 'Python', class: 'CS-C', room: 'Room 201', students: 32 },
  ],
  Tuesday: [
    { time: '09:00 AM - 10:00 AM', subject: 'DSA', class: 'CS-A', room: 'Room 101', students: 30 },
    { time: '11:30 AM - 12:30 PM', subject: 'DBMS', class: 'CS-D', room: 'Room 301', students: 25 },
    { time: '02:00 PM - 03:00 PM', subject: 'DSA', class: 'CS-B', room: 'Room 102', students: 28 },
  ],
  Wednesday: [
    { time: '10:15 AM - 11:15 AM', subject: 'Python', class: 'CS-C', room: 'Room 201', students: 32 },
    { time: '11:30 AM - 12:30 PM', subject: 'DSA', class: 'CS-A', room: 'Room 101', students: 30 },
    { time: '02:00 PM - 03:00 PM', subject: 'DBMS', class: 'CS-D', room: 'Room 301', students: 25 },
  ],
  Thursday: [
    { time: '09:00 AM - 10:00 AM', subject: 'DSA', class: 'CS-B', room: 'Room 102', students: 28 },
    { time: '10:15 AM - 11:15 AM', subject: 'DBMS', class: 'CS-D', room: 'Room 301', students: 25 },
    { time: '02:00 PM - 03:00 PM', subject: 'Python', class: 'CS-C', room: 'Room 201', students: 32 },
  ],
  Friday: [
    { time: '09:00 AM - 10:00 AM', subject: 'DSA', class: 'CS-A', room: 'Room 101', students: 30 },
    { time: '11:30 AM - 12:30 PM', subject: 'DSA', class: 'CS-B', room: 'Room 102', students: 28 },
  ]
};

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:15 AM - 11:15 AM',
  '11:30 AM - 12:30 PM',
  '02:00 PM - 03:00 PM',
  '03:15 PM - 04:15 PM'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function TimetablePage({ userRole }: TimetablePageProps) {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [editMode, setEditMode] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'practical': return 'bg-orange-100 text-orange-800';
      case 'tutorial': return 'bg-purple-100 text-purple-800';
      case 'discussion': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadTimetablePDF = () => {
    const doc = new jsPDF('landscape');
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(47, 128, 237);
    doc.text('EduManage - Weekly Timetable', 14, 15);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Student: Jemin vadgama', 14, 22);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Prepare table data
    const tableData: any[] = [];
    
    timeSlots.forEach(timeSlot => {
      const row = [timeSlot];
      days.forEach(day => {
        const daySchedule = studentTimetable[day as keyof typeof studentTimetable] || [];
        const classItem = daySchedule.find(item => item.time === timeSlot);
        if (classItem) {
          row.push(`${classItem.subject}\n${classItem.faculty}\n${classItem.room}`);
        } else {
          row.push('Free');
        }
      });
      tableData.push(row);
    });
    
    // Generate table
    autoTable(doc, {
      startY: 35,
      head: [['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [47, 128, 237],
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
      },
    });
    
    // Save the PDF
    doc.save('EduManage_Timetable.pdf');
    toast.success('Timetable downloaded successfully!');
  };

  if (userRole === 'student') {
    return (
      <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#333333] mb-2">My Timetable</h1>
            <p className="text-[#6B7280]">Your weekly class schedule</p>
          </div>
          <Button 
            className="bg-[#2F80ED] hover:bg-[#2A73D4]"
            onClick={handleDownloadTimetablePDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Weekly Overview */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Your classes for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-4 min-w-[800px]">
                {/* Header */}
                <div className="font-medium text-[#333333] p-3 bg-gray-50 rounded-lg">Time</div>
                {days.map(day => (
                  <div key={day} className="font-medium text-[#333333] p-3 bg-gray-50 rounded-lg text-center">
                    {day}
                  </div>
                ))}

                {/* Time slots */}
                {timeSlots.map(timeSlot => (
                  <>
                    <div key={timeSlot} className="p-3 text-sm text-[#6B7280] font-medium bg-gray-50 rounded-lg">
                      {timeSlot}
                    </div>
                    {days.map(day => {
                      const daySchedule = studentTimetable[day as keyof typeof studentTimetable] || [];
                      const classItem = daySchedule.find(item => item.time === timeSlot);
                      
                      return (
                        <div key={`${day}-${timeSlot}`} className="p-2">
                          {classItem ? (
                            <div className="p-3 bg-gradient-to-r from-[#2F80ED]/10 to-[#27AE60]/10 border border-[#2F80ED]/20 rounded-lg">
                              <h4 className="font-medium text-[#333333] text-sm mb-1">{classItem.subject}</h4>
                              <p className="text-xs text-[#6B7280] mb-1">{classItem.faculty}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#6B7280]" />
                                  <span className="text-xs text-[#6B7280]">{classItem.room}</span>
                                </div>
                                <Badge className={`${getTypeColor(classItem.type)} text-xs`}>
                                  {classItem.type}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg text-center">
                              <span className="text-xs text-gray-400">Free</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Classes */}
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
              {studentTimetable.Monday.map((class_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-[#2F80ED] rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-[#333333]">{class_.subject}</h4>
                      <Badge className={`${getTypeColor(class_.type)} text-xs`}>
                        {class_.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6B7280]">{class_.faculty} • {class_.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#333333]">{class_.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'faculty') {
    return (
      <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#333333] mb-2">My Teaching Schedule</h1>
            <p className="text-[#6B7280]">Manage your classes and teaching hours</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditMode(!editMode)}>
              <Edit className="w-4 h-4 mr-2" />
              {editMode ? 'View Mode' : 'Edit Schedule'}
            </Button>
            <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]">
              <Download className="w-4 h-4 mr-2" />
              Export Schedule
            </Button>
          </div>
        </div>

        {/* Teaching Load Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">15</p>
                  <p className="text-sm text-[#6B7280]">Classes/Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">18</p>
                  <p className="text-sm text-[#6B7280]">Hours/Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">4</p>
                  <p className="text-sm text-[#6B7280]">Different Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">115</p>
                  <p className="text-sm text-[#6B7280]">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Teaching Schedule */}
        <Card className="rounded-xl shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Teaching Schedule
            </CardTitle>
            <CardDescription>Your weekly teaching timetable</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-4 min-w-[800px]">
                {/* Header */}
                <div className="font-medium text-[#333333] p-3 bg-gray-50 rounded-lg">Time</div>
                {days.map(day => (
                  <div key={day} className="font-medium text-[#333333] p-3 bg-gray-50 rounded-lg text-center">
                    {day}
                  </div>
                ))}

                {/* Time slots */}
                {timeSlots.map(timeSlot => (
                  <>
                    <div key={timeSlot} className="p-3 text-sm text-[#6B7280] font-medium bg-gray-50 rounded-lg">
                      {timeSlot}
                    </div>
                    {days.map(day => {
                      const daySchedule = facultyTimetable[day as keyof typeof facultyTimetable] || [];
                      const classItem = daySchedule.find(item => item.time === timeSlot);
                      
                      return (
                        <div key={`${day}-${timeSlot}`} className="p-2">
                          {classItem ? (
                            <div className="p-3 bg-gradient-to-r from-[#27AE60]/10 to-[#F2994A]/10 border border-[#27AE60]/20 rounded-lg relative group">
                              {editMode && (
                                <Button size="sm" variant="ghost" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
                                  <Edit className="w-3 h-3" />
                                </Button>
                              )}
                              <h4 className="font-medium text-[#333333] text-sm mb-1">{classItem.subject}</h4>
                              <p className="text-xs text-[#6B7280] mb-1">{classItem.class}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#6B7280]" />
                                  <span className="text-xs text-[#6B7280]">{classItem.room}</span>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  {classItem.students}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg text-center relative group">
                              <span className="text-xs text-gray-400">Free</span>
                              {editMode && (
                                <Button size="sm" variant="ghost" className="absolute inset-0 opacity-0 group-hover:opacity-100 h-full w-full">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin view
  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">Timetable Management</h1>
          <p className="text-[#6B7280]">Manage schedules for all classes and faculty</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
          <Button className="bg-[#2F80ED] hover:bg-[#2A73D4]">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle>View Schedule</CardTitle>
          <CardDescription>Select class or faculty to view specific timetables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10a">Grade 10-A</SelectItem>
                <SelectItem value="10b">Grade 10-B</SelectItem>
                <SelectItem value="11a">Grade 11-A</SelectItem>
                <SelectItem value="12a">Grade 12-A</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger>
                <SelectValue placeholder="Select Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="singh">Dr. Vikram Singh (DSA)</SelectItem>
                <SelectItem value="gupta">Prof. Neha Gupta (Python)</SelectItem>
                <SelectItem value="sharma">Dr. Suresh Sharma (DBMS)</SelectItem>
                <SelectItem value="mehta">Ms. Priya Mehta (Web Programming)</SelectItem>
                <SelectItem value="kumar">Dr. Ravi Kumar (Android Development)</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-[#27AE60] hover:bg-[#229954]">
              View Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Schedule Overview */}
      <Card className="rounded-xl shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Master Timetable
          </CardTitle>
          <CardDescription>Overview of all scheduled classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-4 min-w-[800px]">
              {/* Header */}
              <div className="font-medium text-[#333333] p-3 bg-gray-50 rounded-lg">Time</div>
              {days.map(day => (
                <div key={day} className="font-medium text-[#333333] p-3 bg-gray-50 rounded-lg text-center">
                  {day}
                </div>
              ))}

              {/* Time slots with multiple classes */}
              {timeSlots.map(timeSlot => (
                <>
                  <div key={timeSlot} className="p-3 text-sm text-[#6B7280] font-medium bg-gray-50 rounded-lg">
                    {timeSlot}
                  </div>
                  {days.map(day => (
                    <div key={`${day}-${timeSlot}`} className="p-2 space-y-2">
                      {/* Multiple classes can happen at the same time */}
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                        <div className="font-medium">Math - 10A</div>
                        <div className="text-gray-600">Room 101</div>
                      </div>
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <div className="font-medium">Physics - 11B</div>
                        <div className="text-gray-600">Lab 201</div>
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}