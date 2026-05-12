import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  CheckCircle
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'student' | 'faculty' | 'admin', credentials: any) => void;
  isLoggingIn?: boolean;
}

export function LoginPage({ onLogin, isLoggingIn = false }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'admin' | ''>('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    role?: string;
  }>({});

  // Quick fill demo credentials
  const quickFillCredentials = (role: 'student' | 'faculty' | 'admin') => {
    setSelectedRole(role);
    setCredentials({
      email: `${role}@demo.com`,
      password: 'password123'
    });
    setError('');
    setValidationErrors({});
  };

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
      case 'role':
        if (!value) {
          errors.role = 'Please select your role';
        } else {
          delete errors.role;
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    const isEmailValid = validateField('email', credentials.email);
    const isPasswordValid = validateField('password', credentials.password);
    const isRoleValid = validateField('role', selectedRole);
    
    if (!isEmailValid || !isPasswordValid || !isRoleValid) {
      setError('Please fix the errors above');
      return;
    }
    
    try {
      await onLogin(selectedRole as 'student' | 'faculty' | 'admin', credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  // Auto-clear validation errors after 3 seconds
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const timer = setTimeout(() => {
        setValidationErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validationErrors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2F80ED] via-[#27AE60] to-[#F2994A] flex items-center justify-center p-4 relative animate-gradient">
      {isLoggingIn && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <div>
                <p className="text-lg font-medium text-[#333333]">Signing you in...</p>
                <p className="text-sm text-[#6B7280]">Please wait a moment</p>
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 opacity-0" />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#2F80ED] to-[#27AE60] rounded-full flex items-center justify-center mx-auto animate-float shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="mb-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#2F80ED] via-[#27AE60] to-[#F2994A] bg-clip-text text-transparent animate-gradient">
                EduManage
              </h1>
              <div className="h-1 w-32 mx-auto mt-3 bg-gradient-to-r from-[#2F80ED] via-[#27AE60] to-[#F2994A] rounded-full shadow-lg animate-gradient"></div>
              <p className="text-sm text-[#6B7280] mt-2 font-medium">Smart Learning • Smarter Management</p>
            </div>
            <CardTitle className="text-xl font-medium text-[#333333]">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-[#6B7280]">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={selectedRole} onValueChange={(value) => {
                  setSelectedRole(value as any);
                  validateField('role', value);
                  setError('');
                }}>
                  <SelectTrigger className={`w-full h-12 border-2 rounded-xl transition-colors ${
                    validationErrors.role 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#2F80ED]'
                  }`}>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="faculty">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Faculty
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.role && (
                  <p className="text-sm text-red-600">{validationErrors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`h-12 border-2 rounded-xl transition-colors ${
                    validationErrors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#2F80ED]'
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`h-12 border-2 rounded-xl pr-12 transition-colors ${
                      validationErrors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-[#2F80ED]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isLoggingIn || Object.keys(validationErrors).length > 0}
                className="w-full h-12 bg-gradient-to-r from-[#2F80ED] to-[#27AE60] hover:from-[#2A73D4] hover:to-[#229954] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
              <p className="text-xs text-gray-600 text-center mb-3 font-medium">Quick Demo Access:</p>
              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillCredentials('student')}
                  className="flex items-center gap-2 text-xs h-8"
                  disabled={isLoggingIn}
                >
                  <GraduationCap className="w-3 h-3" />
                  Student Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillCredentials('faculty')}
                  className="flex items-center gap-2 text-xs h-8"
                  disabled={isLoggingIn}
                >
                  <Users className="w-3 h-3" />
                  Faculty Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillCredentials('admin')}
                  className="flex items-center gap-2 text-xs h-8"
                  disabled={isLoggingIn}
                >
                  <ShieldCheck className="w-3 h-3" />
                  Admin Demo
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button className="text-sm text-[#6B7280] hover:text-[#2F80ED] transition-colors">
                Need help? Contact support
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}