import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Briefcase, Building, MapPin, Search, DollarSign, Calendar, Clock, Filter, Users, TrendingUp, Star, Globe, Award, Target, Zap, Brain, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useJobListings } from "@/hooks/useJobListings";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";
import ResumeDropzone from "@/components/ui/ResumeDropzone";
import { generateATSScore } from "@/utils/atsScoreApi";

const ApplyJobs = () => {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [selectedResumes, setSelectedResumes] = useState<Record<string, { path: string; name: string }>>({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [processingApplications, setProcessingApplications] = useState<Record<string, boolean>>({});
  const [atsResults, setAtsResults] = useState<Record<string, any>>({});
  const { jobListings, loading, refetch } = useJobListings();
  const { user } = useAuth();
  
  // Filter jobs based on search criteria
  const filteredJobs = jobListings.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(jobTitle.toLowerCase());
    const locationMatch = !location || (job.location && job.location.toLowerCase().includes(location.toLowerCase()));
    return titleMatch && locationMatch;
  });

  // Categorize jobs
  const categorizeJobs = (jobs: any[]) => {
    const categories = {
      all: jobs,
      technology: jobs.filter(job => 
        job.title.toLowerCase().includes('developer') || 
        job.title.toLowerCase().includes('engineer') || 
        job.title.toLowerCase().includes('programmer') ||
        job.department?.toLowerCase().includes('tech') ||
        job.department?.toLowerCase().includes('engineering')
      ),
      design: jobs.filter(job => 
        job.title.toLowerCase().includes('designer') || 
        job.title.toLowerCase().includes('ui') || 
        job.title.toLowerCase().includes('ux') ||
        job.department?.toLowerCase().includes('design')
      ),
      marketing: jobs.filter(job => 
        job.title.toLowerCase().includes('marketing') || 
        job.title.toLowerCase().includes('growth') || 
        job.title.toLowerCase().includes('content') ||
        job.department?.toLowerCase().includes('marketing')
      ),
      sales: jobs.filter(job => 
        job.title.toLowerCase().includes('sales') || 
        job.title.toLowerCase().includes('business development') ||
        job.department?.toLowerCase().includes('sales')
      ),
      hr: jobs.filter(job => 
        job.title.toLowerCase().includes('hr') || 
        job.title.toLowerCase().includes('human resources') || 
        job.title.toLowerCase().includes('recruiter') ||
        job.department?.toLowerCase().includes('hr')
      ),
      finance: jobs.filter(job => 
        job.title.toLowerCase().includes('finance') || 
        job.title.toLowerCase().includes('accounting') || 
        job.title.toLowerCase().includes('analyst') ||
        job.department?.toLowerCase().includes('finance')
      )
    };
    return categories;
  };

  const categorizedJobs = categorizeJobs(filteredJobs);
  const currentJobs = categorizedJobs[activeCategory as keyof typeof categorizedJobs] || [];

  const categories = [
    { id: "all", name: "All Positions", icon: Globe, count: categorizedJobs.all.length, gradient: "from-slate-600 to-slate-800" },
    { id: "technology", name: "Technology", icon: Zap, count: categorizedJobs.technology.length, gradient: "from-blue-600 to-indigo-700" },
    { id: "design", name: "Design", icon: Star, count: categorizedJobs.design.length, gradient: "from-purple-600 to-pink-600" },
    { id: "marketing", name: "Marketing", icon: TrendingUp, count: categorizedJobs.marketing.length, gradient: "from-green-600 to-emerald-700" },
    { id: "sales", name: "Sales", icon: Target, count: categorizedJobs.sales.length, gradient: "from-orange-600 to-red-600" },
    { id: "hr", name: "Human Resources", icon: Users, count: categorizedJobs.hr.length, gradient: "from-teal-600 to-cyan-700" },
    { id: "finance", name: "Finance", icon: DollarSign, count: categorizedJobs.finance.length, gradient: "from-yellow-600 to-amber-700" }
  ];

  const handleSearch = () => {
    toast({
      title: "Search initiated",
      description: `Searching for "${jobTitle}" jobs in "${location || 'all locations'}"`,
    });
    refetch();
  };

  const handleResumeUpload = (jobId: string, filePath: string, fileName: string) => {
    if (filePath && fileName) {
      setSelectedResumes(prev => ({
        ...prev,
        [jobId]: { path: filePath, name: fileName }
      }));
      
      // Clear any previous ATS results for this job
      setAtsResults(prev => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });
    } else {
      setSelectedResumes(prev => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });
      
      setAtsResults(prev => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });
    }
  };

  const performATSScanning = async (jobId: string, resumeData: any, job: any) => {
    try {
      console.log("Starting ATS scan for job:", jobId);
      
      // Mock resume data structure for ATS scanning
      const mockResumeData = {
        personalInfo: {
          firstName: "Candidate",
          lastName: "Name",
          jobTitle: "Professional",
          email: "candidate@email.com",
          phone: "+1-234-567-8900",
          location: "City, State",
          linkedinUrl: "",
          githubUrl: ""
        },
        education: [{
          degree: "Bachelor's Degree",
          school: "University",
          graduationDate: "2020",
          score: ""
        }],
        experience: [{
          jobTitle: "Previous Role",
          companyName: "Previous Company", 
          startDate: "2020",
          endDate: "2023",
          description: "Professional experience in relevant field with key responsibilities and achievements."
        }],
        skills: {
          professional: job.skills_required?.slice(0, 3).join(", ") || "Professional skills",
          technical: job.skills_required?.slice(3, 6).join(", ") || "Technical skills", 
          soft: "Communication, Leadership, Problem-solving"
        },
        objective: `Seeking ${job.title} position at ${job.company_name || 'a leading company'}`
      };

      const atsResult = await generateATSScore(mockResumeData);
      
      // Ensure the overall score is calculated out of 100
      const normalizedScore = Math.min(100, Math.max(0, Math.round(atsResult.overallScore)));
      
      const normalizedResult = {
        ...atsResult,
        overallScore: normalizedScore,
        keywordScore: Math.min(100, Math.max(0, Math.round(atsResult.keywordScore))),
        formatScore: Math.min(100, Math.max(0, Math.round(atsResult.formatScore))),
        contentScore: Math.min(100, Math.max(0, Math.round(atsResult.contentScore)))
      };
      
      console.log("ATS scan completed:", normalizedResult);
      
      // Store ATS results
      setAtsResults(prev => ({
        ...prev,
        [jobId]: normalizedResult
      }));

      return normalizedResult;
    } catch (error) {
      console.error("Error during ATS scanning:", error);
      throw error;
    }
  };

  const handleApply = async (jobId: string) => {
    const selectedResume = selectedResumes[jobId];
    
    if (!selectedResume) {
      toast({
        title: "Resume required",
        description: "Please upload a resume to apply",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Login required", 
        description: "Please log in to apply for jobs",
        variant: "destructive"
      });
      return;
    }

    const job = jobListings.find(j => j.id === jobId);
    if (!job) {
      toast({
        title: "Error",
        description: "Job not found",
        variant: "destructive"
      });
      return;
    }

    setProcessingApplications(prev => ({ ...prev, [jobId]: true }));

    try {
      // Step 1: Perform ATS scanning
      console.log("Starting ATS scanning process...");
      toast({
        title: "Processing Application",
        description: "Running ATS scan on your resume...",
      });

      const atsResult = await performATSScanning(jobId, selectedResume, job);
      
      // Step 2: Check if ATS score meets minimum threshold (score >= minimum required)
      const minimumScore = job.ats_minimum_score || 70;
      const candidateScore = atsResult.overallScore;
      const passesATSCheck = candidateScore >= minimumScore;
      
      console.log(`ATS Score: ${candidateScore}/100, Minimum Required: ${minimumScore}/100, Passes: ${passesATSCheck}`);

      // Step 3: Determine application status based on ATS score
      const applicationStatus = passesATSCheck ? 'approved' : 'rejected';
      const status = passesATSCheck ? 'ATS Approved' : 'ATS Rejected';
      const progress = passesATSCheck ? 40 : 10;

      // Step 4: Submit application to database
      const { data: applicationData, error: applicationError } = await supabase
        .from('job_applications')
        .insert([
          {
            user_id: user.id,
            job_id: jobId,
            job_title: job.title,
            company: job.company_name || 'Unknown Company',
            location: job.location,
            status: status,
            progress: progress,
            resume_file_path: selectedResume.path,
            resume_file_name: selectedResume.name,
            application_status: applicationStatus,
            rating: candidateScore
          }
        ])
        .select()
        .single();
        
      if (applicationError) {
        console.error("Error submitting application:", applicationError);
        toast({
          title: "Application failed",
          description: applicationError.message,
          variant: "destructive"
        });
        return;
      }

      // Step 5: Store ATS scan results
      const { error: atsError } = await supabase
        .from('ats_scan_results')
        .insert([
          {
            user_id: user.id,
            file_name: selectedResume.name,
            overall_score: candidateScore,
            keyword_score: atsResult.keywordScore,
            format_score: atsResult.formatScore,
            content_score: atsResult.contentScore,
            suggestions: atsResult.suggestions,
            job_match: atsResult.jobMatch,
            file_size: 0
          }
        ]);

      if (atsError) {
        console.error("Error storing ATS results:", atsError);
      }

      // Step 6: Notify HR members if application is approved
      if (passesATSCheck) {
        const { data: hrMembers } = await supabase
          .from('hr_members')
          .select('user_profile_id')
          .eq('company_id', job.company_id);

        if (hrMembers && hrMembers.length > 0) {
          const notifications = hrMembers.map(hr => ({
            user_id: hr.user_profile_id,
            title: 'New Qualified Application',
            message: `New application received for ${job.title} position (ATS Score: ${candidateScore}/100)`,
            type: 'info' as const,
            related_application_id: applicationData.id
          }));

          await supabase
            .from('notifications')
            .insert(notifications);
        }
      }
      
      // Step 7: Show appropriate success/rejection message
      if (passesATSCheck) {
        toast({
          title: "Application submitted successfully!",
          description: `Your application for ${job.title} passed ATS screening (Score: ${candidateScore}/100, Required: ${minimumScore}/100) and has been forwarded to HR.`,
        });
      } else {
        toast({
          title: "Application processed",
          description: `Your application for ${job.title} did not meet the minimum ATS score requirement (${candidateScore}/100, Required: ${minimumScore}/100). Consider improving your resume based on the suggestions.`,
          variant: "destructive"
        });
      }

      // Clear the selected resume
      setSelectedResumes(prev => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });

    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Application failed",
        description: "An unexpected error occurred during ATS processing",
        variant: "destructive"
      });
    } finally {
      setProcessingApplications(prev => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium">
                <Award className="w-4 h-4 mr-2 text-yellow-400" />
                Premium Job Opportunities
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Next Career
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Access exclusive opportunities from top companies worldwide. Join thousands of professionals who have advanced their careers through our premium platform.
              </p>
              
              {/* Advanced Search Interface */}
              <div className="max-w-5xl mx-auto mt-12">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5 space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                        Job Title or Keywords
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          placeholder="Software Engineer, Product Manager..."
                          className="pl-12 h-14 border-0 bg-slate-50 text-lg font-medium rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-4 space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-green-600" />
                        Location
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          placeholder="San Francisco, Remote, Global..."
                          className="pl-12 h-14 border-0 bg-slate-50 text-lg font-medium rounded-xl focus:ring-2 focus:ring-green-500 transition-all"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-3">
                      <Button 
                        onClick={handleSearch}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Search Jobs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Categories Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Explore by Category</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find opportunities tailored to your expertise across various industries
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative p-6 rounded-2xl transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-br ' + category.gradient + ' text-white shadow-2xl'
                      : 'bg-white hover:bg-slate-50 text-slate-700 shadow-lg hover:shadow-xl border border-slate-200'
                  }`}
                >
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-white/20 backdrop-blur-sm'
                        : 'bg-slate-100 group-hover:bg-slate-200'
                    }`}>
                      <IconComponent className={`w-8 h-8 transition-all duration-300 ${
                        activeCategory === category.id ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'
                      }`} />
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-sm mb-2">{category.name}</h3>
                      <Badge 
                        className={`transition-all duration-300 ${
                          activeCategory === category.id
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-slate-200'
                        }`}
                      >
                        {category.count} jobs
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Premium Job Listings */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {categories.find(c => c.id === activeCategory)?.name} Opportunities
              </h2>
              <p className="text-slate-600 mt-2">{currentJobs.length} premium positions available</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                {currentJobs.filter(job => job.status === 'Open').length} Active
              </Badge>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-700">Finding Perfect Opportunities</h3>
                <p className="text-slate-500">Searching through thousands of premium positions...</p>
              </div>
            </div>
          ) : currentJobs.length > 0 ? (
            <div className="space-y-8">
              {currentJobs.map((job) => {
                const isProcessing = processingApplications[job.id];
                const atsResult = atsResults[job.id];
                const minimumScore = job.ats_minimum_score || 70;
                
                return (
                  <Card key={job.id} className="group bg-white hover:bg-slate-50/50 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden transform hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 p-8">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                              {job.company_name?.[0] || 'C'}
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </CardTitle>
                              <CardDescription className="flex items-center mt-2 text-lg">
                                <Building className="w-5 h-5 mr-2 text-blue-500" /> 
                                <span className="font-semibold text-slate-700">{job.company_name || 'Premium Company'}</span>
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-4 py-2">
                            {job.experience_level || 'All Levels'}
                          </Badge>
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-4 py-2">
                            {job.employment_type || 'Full-time'}
                          </Badge>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 flex items-center gap-2">
                            <Brain className="w-3 h-3" />
                            ATS Min: {minimumScore}
                          </Badge>
                          {job.salary_range && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-2">
                              {job.salary_range}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-8">
                      <div className="space-y-8">
                        {/* Job Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {job.location && (
                            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Location</p>
                                <p className="font-bold text-slate-800">{job.location}</p>
                              </div>
                            </div>
                          )}
                          
                          {job.department && (
                            <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                                <Briefcase className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Department</p>
                                <p className="font-bold text-slate-800">{job.department}</p>
                              </div>
                            </div>
                          )}
                          
                          {job.application_deadline && (
                            <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Deadline</p>
                                <p className="font-bold text-slate-800">{new Date(job.application_deadline).toLocaleDateString()}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                              <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Posted</p>
                              <p className="font-bold text-slate-800">{job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recently'}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Job Description */}
                        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-6 rounded-2xl border border-slate-100">
                          <h4 className="font-bold text-lg text-slate-900 mb-3">Position Overview</h4>
                          <p className="text-slate-700 leading-relaxed text-lg">{job.description}</p>
                        </div>
                        
                        {/* Skills */}
                        {job.skills_required && job.skills_required.length > 0 && (
                          <div>
                            <h4 className="font-bold text-lg text-slate-900 mb-4">Required Expertise</h4>
                            <div className="flex flex-wrap gap-3">
                              {job.skills_required.slice(0, 8).map((skill, index) => (
                                <Badge 
                                  key={index} 
                                  className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300 hover:from-slate-200 hover:to-slate-300 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills_required.length > 8 && (
                                <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200 px-4 py-2">
                                  +{job.skills_required.length - 8} more skills
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* ATS Results Display */}
                        {atsResult && (
                          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">ATS Scan Results</h4>
                                <p className="text-sm text-slate-600">AI-powered resume analysis completed</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-700">{atsResult.overallScore}/100</div>
                                <div className="text-xs text-slate-600">Overall Score</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-700">{atsResult.keywordScore}/100</div>
                                <div className="text-xs text-slate-600">Keywords</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-700">{atsResult.formatScore}/100</div>
                                <div className="text-xs text-slate-600">Format</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-700">{atsResult.contentScore}/100</div>
                                <div className="text-xs text-slate-600">Content</div>
                              </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 p-3 rounded-xl ${
                              atsResult.overallScore >= minimumScore 
                                ? 'bg-green-100 border border-green-200' 
                                : 'bg-red-100 border border-red-200'
                            }`}>
                              {atsResult.overallScore >= minimumScore ? (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="font-semibold text-green-800">
                                    Meets ATS Requirements ({atsResult.overallScore}/100, Required: {minimumScore}/100)
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5 text-red-600" />
                                  <span className="font-semibold text-red-800">
                                    Below ATS Threshold ({atsResult.overallScore}/100, Required: {minimumScore}/100)
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Resume Upload Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl p-8">
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Award className="w-8 h-8 text-white" />
                            </div>
                            <Label className="text-xl font-bold text-slate-900 mb-2 block">
                              Submit Your Application
                            </Label>
                            <p className="text-slate-600">Upload your resume for automatic ATS screening</p>
                            <div className="mt-2 text-sm text-slate-500">
                              Minimum ATS score required: <strong>{minimumScore}/100</strong>
                            </div>
                          </div>
                          <ResumeDropzone
                            onFileUploaded={(filePath, fileName) => handleResumeUpload(job.id, filePath, fileName)}
                            selectedFile={selectedResumes[job.id] || null}
                          />
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="bg-slate-50 border-t border-slate-100 px-8 py-6">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1 flex items-center gap-2">
                            <Brain className="w-3 h-3" />
                            ATS Enabled
                          </Badge>
                          <span className="text-sm text-slate-500 flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            High demand position
                          </span>
                        </div>
                        
                        <div className="flex space-x-4">
                          <Button 
                            variant="outline" 
                            className="border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                          >
                            View Details
                            <ArrowUpRight className="ml-2 w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => handleApply(job.id)}
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Processing...
                              </>
                            ) : (
                              "Apply with ATS"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-20 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 rounded-3xl">
              <CardContent>
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Briefcase className="w-16 h-16 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">No Opportunities Found</h3>
                <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
                  {jobTitle || location ? 
                    "We couldn't find any positions matching your criteria. Try adjusting your search or explore other categories." :
                    "No opportunities are currently available in this category. New premium positions are added daily."
                  }
                </p>
                {(jobTitle || location) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setJobTitle("");
                      setLocation("");
                      setActiveCategory("all");
                      refetch();
                    }}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold"
                  >
                    Clear Search & View All Opportunities
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default ApplyJobs;
