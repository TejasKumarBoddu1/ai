import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Briefcase, GraduationCap, Shield, UserPlus, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from './AuthLayout';

const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleTabChange = (role: string) => {
    setActiveTab(role as UserRole);
  };

  const StudentRegisterForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
      age: '',
      gender: '',
      educationLevel: '',
      skills: [] as string[],
      country: '',
      city: '',
      role: 'student',
      acceptTerms: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
      setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      if (!formData.acceptTerms) {
        toast({
          title: "Error",
          description: "You must accept the terms and conditions",
          variant: "destructive",
        });
        return;
      }
      
      setIsSubmitting(true);
      try {
        // Register the user with role 'student'
        await register(formData.fullName, formData.email, formData.password, 'student');
        // Navigation happens in the AuthContext after successful registration
      } catch (error) {
        console.error("Registration failed:", error);
        // Error toast is handled in AuthContext
      } finally {  
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">Student/Freelancer Registration</CardTitle>
          <CardDescription>Create your account to access career tools and resources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="+1234567890"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender (Optional)</Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level</Label>
              <Select 
                value={formData.educationLevel} 
                onValueChange={(value) => handleSelectChange('educationLevel', value)}
                required
              >
                <SelectTrigger id="educationLevel">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">Ph.D.</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleSelectChange('role', value)}
              disabled
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleCheckboxChange('acceptTerms', checked === true)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:underline">
                terms and conditions
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </form>
    );
  };

  const OrganizationRegisterForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      organizationName: '',
      type: '',
      email: '',
      contactNumber: '',
      password: '',
      confirmPassword: '',
      website: '',
      address: '',
      position: '',
      industry: '',
      description: '',
      country: '',
      city: '',
      acceptTerms: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
      setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      if (!formData.acceptTerms) {
        toast({
          title: "Error",
          description: "You must accept the partnership agreement",
          variant: "destructive",
        });
        return;
      }
      
      setIsSubmitting(true);
      try {
        // Register the user with role 'organization'
        await register(formData.organizationName, formData.email, formData.password, 'organization');
        // Navigation happens in the AuthContext after successful registration
      } catch (error) {
        console.error("Registration failed:", error);
        // Error toast is handled in AuthContext
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">Organization Registration</CardTitle>
          <CardDescription>Register your organization or university</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization / University Name</Label>
            <Input
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Acme Corporation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Organization Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange('type', value)}
              required
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Company</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="ngo">NGO</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Organization Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@organization.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+1234567890"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.organization.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City, Country"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Your Position in Organization</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="HR Manager, Dean, etc."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry Domain</Label>
            <Select 
              value={formData.industry} 
              onValueChange={(value) => handleSelectChange('industry', value)}
              required
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description of Organization</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your organization..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document">Upload Verification Document</Label>
            <div className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop
                <br />
                PDF, JPG, or PNG (max. 10MB)
              </p>
              <Input
                id="document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500">Upload document related to organization registration</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleCheckboxChange('acceptTerms', checked === true)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the QwiXEd360° Partnership Agreement and{' '}
              <Link to="/terms" className="text-primary hover:underline">
                terms of service
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering Organization...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Register Organization
              </>
            )}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </form>
    );
  };

  const AdminRegisterNotice: React.FC = () => {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-xl">Admin Registration</CardTitle>
          <CardDescription>Admin registration is restricted</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Admin Registration Restricted</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Admin accounts can only be created by super administrators. Please contact the system administrator if you need an admin account.
          </p>
          <Button asChild variant="outline">
            <Link to="/login">
              Go to Login
            </Link>
          </Button>
        </CardContent>
      </>
    );
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        <Tabs defaultValue="student" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="student" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Student/Freelancer</span>
              <span className="sm:hidden">Student</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Organization</span>
              <span className="sm:hidden">Org</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="student">
            <StudentRegisterForm />
          </TabsContent>
          
          <TabsContent value="organization">
            <OrganizationRegisterForm />
          </TabsContent>
          
          <TabsContent value="admin">
            <AdminRegisterNotice />
          </TabsContent>
        </Tabs>
      </Card>
    </AuthLayout>
  );
};

export default Register;
