import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Settings, User, Bell, Shield, Palette, Globe, Database, Save, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SettingsPageProps {
  userRole: 'student' | 'faculty' | 'admin';
}

export function SettingsPage({ userRole }: SettingsPageProps) {
  const [profileData, setProfileData] = useState({
    name: userRole === 'student' ? 'John Smith' : userRole === 'faculty' ? 'Prof. Johnson' : 'Admin User',
    email: `${userRole}@example.com`,
    phone: '+1-234-567-8900',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    department: userRole === 'student' ? 'Computer Science' : 'Mathematics',
    designation: userRole === 'faculty' ? 'Associate Professor' : 'System Administrator'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    assignmentReminders: true,
    examAlerts: true,
    attendanceNotifications: true
  });

  const [systemSettings, setSystemSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    academicYear: '2024-2025'
  });

  const handleProfileUpdate = () => {
    // In a real app, this would make an API call
    console.log('Updating profile:', profileData);
  };

  const handleNotificationUpdate = () => {
    // In a real app, this would make an API call
    console.log('Updating notifications:', notificationSettings);
  };

  const handleSystemUpdate = () => {
    // In a real app, this would make an API call
    console.log('Updating system settings:', systemSettings);
  };

  return (
    <div className="p-6 space-y-6 bg-[#F9FAFB] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">Settings</h1>
        <p className="text-[#6B7280]">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`grid w-full ${userRole === 'student' ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          {userRole !== 'student' && (
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          )}
          {userRole !== 'student' && (
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
          )}
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={profileData.name} />
                  <AvatarFallback className="bg-gradient-to-r from-[#2F80ED] to-[#27AE60] text-white text-lg">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button className="bg-[#2F80ED] hover:bg-[#2A73D4] mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-[#6B7280]">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={profileData.department} onValueChange={(value) => setProfileData({...profileData, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {userRole === 'faculty' && (
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Select value={profileData.designation} onValueChange={(value) => setProfileData({...profileData, designation: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                        <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                        <SelectItem value="Lecturer">Lecturer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileUpdate} className="bg-[#27AE60] hover:bg-[#229954]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Security
              </CardTitle>
              <CardDescription>Update your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <div className="flex justify-end">
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#333333]">Email Notifications</p>
                    <p className="text-sm text-[#6B7280]">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#333333]">Push Notifications</p>
                    <p className="text-sm text-[#6B7280]">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#333333]">SMS Notifications</p>
                    <p className="text-sm text-[#6B7280]">Receive important alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                  />
                </div>

                <hr className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#333333]">Weekly Reports</p>
                    <p className="text-sm text-[#6B7280]">Receive weekly summary reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#333333]">Assignment Reminders</p>
                    <p className="text-sm text-[#6B7280]">Get reminded about upcoming assignments</p>
                  </div>
                  <Switch
                    checked={notificationSettings.assignmentReminders}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, assignmentReminders: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#333333]">Exam Alerts</p>
                    <p className="text-sm text-[#6B7280]">Receive notifications about exams</p>
                  </div>
                  <Switch
                    checked={notificationSettings.examAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, examAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-[#333333]">Attendance Notifications</p>
                    <p className="text-sm text-[#6B7280]">Get alerts about attendance updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.attendanceNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, attendanceNotifications: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNotificationUpdate} className="bg-[#27AE60] hover:bg-[#229954]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Appearance & Display
              </CardTitle>
              <CardDescription>Customize the look and feel of your interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={systemSettings.theme} onValueChange={(value) => setSystemSettings({...systemSettings, theme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Scheme Preview</Label>
                <div className="flex gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#2F80ED] to-[#27AE60] text-white">
                    <p className="font-medium">Primary Colors</p>
                    <p className="text-sm opacity-90">Blue to Green</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F2994A] text-white">
                    <p className="font-medium">Accent Color</p>
                    <p className="text-sm opacity-90">Orange</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSystemUpdate} className="bg-[#27AE60] hover:bg-[#229954]">
                  <Save className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                System Preferences
              </CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                      <SelectItem value="UTC-6">UTC-6 (Central Time)</SelectItem>
                      <SelectItem value="UTC-7">UTC-7 (Mountain Time)</SelectItem>
                      <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select value={systemSettings.academicYear} onValueChange={(value) => setSystemSettings({...systemSettings, academicYear: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {userRole === 'admin' && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-[#333333] flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    System Administration
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-16 border-2 rounded-xl hover:bg-gray-50">
                      <div className="text-center">
                        <Database className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm">Backup System</p>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="h-16 border-2 rounded-xl hover:bg-gray-50">
                      <div className="text-center">
                        <Settings className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm">System Logs</p>
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSystemUpdate} className="bg-[#27AE60] hover:bg-[#229954]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}