import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2, Plus, X, Briefcase, Building, MapPin, Users, DollarSign, Calendar, Mail, Phone, Award, GraduationCap, Star, Sparkles, Target, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CreateJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  
  const [jobData, setJobData] = useState({
    company_name: "",
    title: "",
    description: "",
    skills_required: [] as string[],
    experience_level: "",
    employment_type: "",
    work_location: "",
    department: "",
    job_category: "",
    salary_min: "",
    salary_max: "",
    currency: "USD",
    application_deadline: "",
    start_date: "",
    contact_email: "",
    contact_phone: "",
    benefits: "",
    requirements: "",
    education_requirements: "",
    location: "",
    job_type: "Full-time" as const,
    ats_minimum_score: "70" // Default ATS score
  });

  const handleChange = (field: string, value: any) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      setJobData(prev => ({ ...prev, skills_required: newSkills }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    setJobData(prev => ({ ...prev, skills_required: newSkills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!jobData.company_name || !jobData.title || !jobData.description || 
        !jobData.experience_level || !jobData.employment_type || !jobData.work_location ||
        !jobData.department || !jobData.job_category || !jobData.application_deadline ||
        !jobData.contact_email || skills.length === 0) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields including at least one skill.",
        variant: "destructive"
      });
      return;
    }

    // Validate ATS score
    const atsScore = parseInt(jobData.ats_minimum_score);
    if (isNaN(atsScore) || atsScore < 0 || atsScore > 100) {
      toast({
        title: "Invalid ATS Score",
        description: "ATS minimum score must be between 0 and 100.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a job.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Try to get HR member profile, but don't fail if it doesn't exist
      const { data: hrMember, error: hrError } = await supabase
        .from('hr_members')
        .select('id, company_id')
        .eq('user_profile_id', user.id)
        .maybeSingle();
      
      // If no HR member profile exists, create a default company and HR member
      let companyId = hrMember?.company_id;
      let hrMemberId = hrMember?.id;
      
      if (!hrMember) {
        console.log("No HR member profile found, creating default records");
        
        // Create a default company first
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: jobData.company_name || "Default Company",
            industry: "Technology"
          })
          .select()
          .single();
          
        if (companyError) {
          console.error("Error creating company:", companyError);
          toast({
            title: "Error",
            description: "Could not create company profile. Please contact support.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        companyId = newCompany.id;
        
        // Get user profile to get email and name
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', user.id)
          .single();
        
        // Create HR member profile
        const { data: newHrMember, error: hrMemberError } = await supabase
          .from('hr_members')
          .insert({
            user_profile_id: user.id,
            company_id: companyId,
            first_name: userProfile?.full_name?.split(' ')[0] || "HR",
            last_name: userProfile?.full_name?.split(' ').slice(1).join(' ') || "Manager",
            email: userProfile?.email || user.email || "",
            role: "HR Manager",
            department: "Human Resources",
            status: "Active"
          })
          .select()
          .single();
          
        if (hrMemberError) {
          console.error("Error creating HR member:", hrMemberError);
          toast({
            title: "Error",
            description: "Could not create HR profile. Please contact support.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        hrMemberId = newHrMember.id;
      }
      
      const { data: newJob, error: jobError } = await supabase
        .from('jobs')
        .insert({
          company_name: jobData.company_name,
          title: jobData.title,
          description: jobData.description,
          skills_required: jobData.skills_required,
          experience_level: jobData.experience_level,
          employment_type: jobData.employment_type,
          work_location: jobData.work_location,
          department: jobData.department,
          job_category: jobData.job_category,
          salary_min: jobData.salary_min ? parseInt(jobData.salary_min) : null,
          salary_max: jobData.salary_max ? parseInt(jobData.salary_max) : null,
          currency: jobData.currency,
          application_deadline: jobData.application_deadline,
          start_date: jobData.start_date || null,
          contact_email: jobData.contact_email,
          contact_phone: jobData.contact_phone || null,
          benefits: jobData.benefits || null,
          requirements: jobData.requirements || null,
          education_requirements: jobData.education_requirements || null,
          location: jobData.work_location,
          job_type: jobData.employment_type as any,
          salary_range: jobData.salary_min && jobData.salary_max 
            ? `${jobData.currency} ${jobData.salary_min} - ${jobData.salary_max}` 
            : null,
          company_id: companyId,
          assigned_hr_id: hrMemberId,
          status: 'Open',
          ats_minimum_score: parseInt(jobData.ats_minimum_score)
        })
        .select()
        .single();
      
      if (jobError) {
        console.error("Error creating job:", jobError);
        toast({
          title: "Error",
          description: "Could not create the job posting.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Job created",
          description: "The job has been created successfully with ATS integration enabled."
        });
        navigate(`/hr-dashboard/jobs/${newJob.id}`);
      }
    } catch (error) {
      console.error("Error in job creation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Premium Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white mb-8 rounded-2xl mx-4 mt-4">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  Create Premium Job Posting
                </h1>
                <p className="text-xl text-slate-300">
                  Design exceptional opportunities with our advanced job creation suite
                </p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex items-center text-emerald-400">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Enterprise-Grade Quality</span>
                  </div>
                  <div className="flex items-center text-blue-400">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">AI-Enhanced Optimization</span>
                  </div>
                  <div className="flex items-center text-purple-400">
                    <Brain className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">ATS Integration Enabled</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/hr-dashboard/jobs')}
                className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold"
              >
                ← Back to Jobs
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Basic Information Section */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">Essential Job Information</CardTitle>
                      <CardDescription className="text-slate-600">Define the core details of your opportunity</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="company_name" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Company Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="company_name"
                        placeholder="e.g. Tech Innovation Corp"
                        value={jobData.company_name}
                        onChange={(e) => handleChange('company_name', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Job Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g. Senior Software Engineer"
                        value={jobData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold text-slate-700">
                      Job Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Craft a compelling description that attracts top talent..."
                      value={jobData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={6}
                      className="border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Required Skills <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Add a skill and press the + button"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      />
                      <Button 
                        type="button" 
                        onClick={addSkill} 
                        className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-semibold"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {skills.map((skill, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-md transition-all">
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-red-600 transition-colors" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employment Details Section */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">Employment Specifications</CardTitle>
                      <CardDescription className="text-slate-600">Define role requirements and working arrangements</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold text-slate-700">Experience Level <span className="text-red-500">*</span></Label>
                      <Select value={jobData.experience_level} onValueChange={(value) => handleChange('experience_level', value)}>
                        <SelectTrigger className="h-12 border-2 border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-2xl">
                          <SelectItem value="Entry Level">Entry Level</SelectItem>
                          <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold text-slate-700">Department <span className="text-red-500">*</span></Label>
                      <Select value={jobData.department} onValueChange={(value) => handleChange('department', value)}>
                        <SelectTrigger className="h-12 border-2 border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-2xl">
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-700">Employment Type <span className="text-red-500">*</span></Label>
                    <RadioGroup 
                      value={jobData.employment_type} 
                      onValueChange={(value) => handleChange('employment_type', value)}
                      className="grid grid-cols-2 md:grid-cols-5 gap-4"
                    >
                      {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map((type) => (
                        <div key={type} className="flex items-center space-x-3 bg-white/50 border-2 border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                          <RadioGroupItem value={type} id={type} className="text-blue-600" />
                          <Label htmlFor={type} className="font-medium text-slate-700 cursor-pointer">{type}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="work_location" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Work Location <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="work_location"
                        placeholder="e.g. Remote, New York, Hybrid"
                        value={jobData.work_location}
                        onChange={(e) => handleChange('work_location', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="job_category" className="text-base font-semibold text-slate-700">Job Category <span className="text-red-500">*</span></Label>
                      <Select value={jobData.job_category} onValueChange={(value) => handleChange('job_category', value)}>
                        <SelectTrigger className="h-12 border-2 border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm">
                          <SelectValue placeholder="Select job category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-2xl">
                          <SelectItem value="Software Development">Software Development</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Product Management">Product Management</SelectItem>
                          <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="Project Management">Project Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compensation & Timeline Section */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">Compensation & Timeline</CardTitle>
                      <CardDescription className="text-slate-600">Set competitive salary ranges and important dates</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="salary_min" className="text-base font-semibold text-slate-700">Minimum Salary</Label>
                      <Input
                        id="salary_min"
                        type="number"
                        placeholder="50,000"
                        value={jobData.salary_min}
                        onChange={(e) => handleChange('salary_min', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="salary_max" className="text-base font-semibold text-slate-700">Maximum Salary</Label>
                      <Input
                        id="salary_max"
                        type="number"
                        placeholder="80,000"
                        value={jobData.salary_max}
                        onChange={(e) => handleChange('salary_max', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="currency" className="text-base font-semibold text-slate-700">Currency</Label>
                      <Select value={jobData.currency} onValueChange={(value) => handleChange('currency', value)}>
                        <SelectTrigger className="h-12 border-2 border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-2xl">
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="application_deadline" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Application Deadline <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="application_deadline"
                        type="date"
                        value={jobData.application_deadline}
                        onChange={(e) => handleChange('application_deadline', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="start_date" className="text-base font-semibold text-slate-700">Expected Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={jobData.start_date}
                        onChange={(e) => handleChange('start_date', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* NEW ATS Configuration Section */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">ATS Integration Settings</CardTitle>
                      <CardDescription className="text-slate-600">Configure automated application screening and filtering</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Automated Application Screening</h4>
                        <p className="text-slate-700 mb-4">
                          Our AI-powered ATS system will automatically scan and score every resume submitted for this position. 
                          Applications that don't meet your minimum score requirement will be automatically filtered out.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="ats_minimum_score" className="text-base font-semibold text-slate-700 flex items-center gap-2 mb-3">
                              <Award className="w-4 h-4" />
                              Minimum ATS Score Required <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-4">
                              <Input
                                id="ats_minimum_score"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="70"
                                value={jobData.ats_minimum_score}
                                onChange={(e) => handleChange('ats_minimum_score', e.target.value)}
                                className="h-12 w-32 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white/70 backdrop-blur-sm text-center font-semibold text-lg"
                                required
                              />
                              <div className="flex-1">
                                <div className="text-sm text-slate-600 space-y-1">
                                  <p><strong>Scoring Guide:</strong></p>
                                  <p>• 90-100: Exceptional match</p>
                                  <p>• 80-89: Strong candidate</p>
                                  <p>• 70-79: Good fit</p>
                                  <p>• 60-69: Moderate match</p>
                                  <p>• Below 60: Poor fit</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                              Recommended: 70 for general positions, 80+ for senior roles
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/50 border border-slate-200 rounded-xl p-4 text-center">
                      <Brain className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                      <h5 className="font-semibold text-slate-900">AI Resume Analysis</h5>
                      <p className="text-sm text-slate-600">Automated content evaluation</p>
                    </div>
                    <div className="bg-white/50 border border-slate-200 rounded-xl p-4 text-center">
                      <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h5 className="font-semibold text-slate-900">Skill Matching</h5>
                      <p className="text-sm text-slate-600">Compare against job requirements</p>
                    </div>
                    <div className="bg-white/50 border border-slate-200 rounded-xl p-4 text-center">
                      <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h5 className="font-semibold text-slate-900">Auto Filtering</h5>
                      <p className="text-sm text-slate-600">Streamlined candidate selection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Additional Information Section */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">Contact & Additional Details</CardTitle>
                      <CardDescription className="text-slate-600">Provide contact information and enhance your job posting</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="contact_email" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Contact Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contact_email"
                        type="email"
                        placeholder="hr@company.com"
                        value={jobData.contact_email}
                        onChange={(e) => handleChange('contact_email', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="contact_phone" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Phone
                      </Label>
                      <Input
                        id="contact_phone"
                        placeholder="+1 (555) 123-4567"
                        value={jobData.contact_phone}
                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                        className="h-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="benefits" className="text-base font-semibold text-slate-700">Benefits & Perks</Label>
                    <Textarea
                      id="benefits"
                      placeholder="Health insurance, 401k, flexible hours, remote work options..."
                      value={jobData.benefits}
                      onChange={(e) => handleChange('benefits', e.target.value)}
                      rows={4}
                      className="border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="education_requirements" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Education & Certification Requirements
                    </Label>
                    <Textarea
                      id="education_requirements"
                      placeholder="Bachelor's degree in Computer Science or equivalent experience..."
                      value={jobData.education_requirements}
                      onChange={(e) => handleChange('education_requirements', e.target.value)}
                      rows={4}
                      className="border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-sm resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="bg-gradient-to-r from-slate-50 to-blue-50 shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardFooter className="p-8 flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => navigate('/hr-dashboard/jobs')}
                    className="px-8 py-3 h-12 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="px-12 py-3 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Premium Job...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Create Premium Job
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;
