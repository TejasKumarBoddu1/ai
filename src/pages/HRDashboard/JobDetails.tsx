import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Loader2, 
  Briefcase, 
  MapPin, 
  Clock, 
  User, 
  Search, 
  Check, 
  X, 
  Eye, 
  Edit,
  Calendar,
  TrendingUp,
  Users,
  Filter,
  Download,
  Star,
  Brain,
  Target,
  Award
} from "lucide-react";
import { format } from "date-fns";

const JobDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select(`
            *,
            companies:company_id (*),
            hr_members:assigned_hr_id (first_name, last_name, email)
          `)
          .eq('id', id)
          .single();
          
        if (jobError) {
          console.error("Error fetching job:", jobError);
          toast({
            title: "Error",
            description: "Could not retrieve job details.",
            variant: "destructive"
          });
          navigate('/hr-dashboard/jobs');
          return;
        }
        
        setJob(jobData);
        
        // Fetch applications for this job
        fetchApplications();
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchJobDetails();
    }
  }, [id, navigate, toast]);
  
  const fetchApplications = async () => {
    setApplicationsLoading(true);
    try {
      // Get applications from job_applications table
      const { data: applicationsData, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', id)
        .order('date_applied', { ascending: false });
        
      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        // Get user profiles for each application
        const applicationsWithProfiles = await Promise.all(
          (applicationsData || []).map(async (app) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', app.user_id)
              .single();

            return {
              ...app,
              candidate_profile: profileData || {}
            };
          })
        );
        
        setApplications(applicationsWithProfiles);
      }
    } catch (error) {
      console.error("Error in fetching applications:", error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ application_status: status })
        .eq('id', applicationId);
        
      if (error) {
        console.error("Error updating application:", error);
        toast({
          title: "Error",
          description: "Could not update application status.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Status updated",
          description: `Application status updated to ${status}.`
        });
        
        // Update local state
        setApplications(prev => 
          prev.map(app => app.id === applicationId ? {...app, application_status: status} : app)
        );

        // Create notification for applicant
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          await supabase
            .from('notifications')
            .insert({
              user_id: application.user_id,
              title: 'Application Status Update',
              message: `Your application for ${application.job_title} has been ${status}`,
              type: status === 'accepted' ? 'success' : status === 'rejected' ? 'error' : 'info',
              related_application_id: applicationId
            });
        }
      }
    } catch (error) {
      console.error("Error in updating application:", error);
    }
  };

  const viewResume = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 60);

      if (error) {
        throw error;
      }

      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error("Error viewing resume:", error);
      toast({
        title: "Error",
        description: "Failed to open resume",
        variant: "destructive"
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.candidate_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.application_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const accepted = applications.filter(app => app.application_status === 'accepted').length;
    const rejected = applications.filter(app => app.application_status === 'rejected').length;
    const pending = applications.filter(app => app.application_status === 'pending').length;
    
    return { total, accepted, rejected, pending };
  };

  const getATSScoreDisplay = (score: number) => {
    // Always display score out of 100, not against the job's minimum threshold
    return `${score}/100`;
  };

  const getATSScoreStatus = (score: number, minimumScore: number) => {
    if (score >= minimumScore) {
      return { text: "Above Threshold", color: "text-green-600" };
    } else {
      return { text: "Below Threshold", color: "text-red-600" };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6 flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <p>Job not found.</p>
          <Button 
            onClick={() => navigate('/hr-dashboard/jobs')}
            className="mt-4"
          >
            Back to Jobs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const stats = getApplicationStats();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-4 mb-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/hr-dashboard/jobs')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  ← Back to Jobs
                </Button>
              </div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-blue-200 text-lg">
                {job.companies?.name || job.company_name} • Posted {format(new Date(job.posted_date), "MMMM dd, yyyy")}
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <Badge className={`${job.status === 'Open' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'} px-4 py-1`}>
                  {job.status}
                </Badge>
                <Badge className="bg-blue-500 text-white px-4 py-1 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  ATS Threshold: {job.ats_minimum_score}/100
                </Badge>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/hr-dashboard/jobs/edit/${id}`)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.accepted}</h3>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <h3 className="text-2xl font-bold text-red-600">{stats.rejected}</h3>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md bg-white shadow-lg border-0 rounded-xl p-1">
            <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Job Details</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Applications ({applications.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card className="border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        Job Description
                      </h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                      </div>
                    </div>
                    
                    {job.requirements && (
                      <div>
                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-600" />
                          Requirements
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.requirements}</p>
                        </div>
                      </div>
                    )}

                    {job.skills_required && job.skills_required.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-600" />
                          Required Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {job.skills_required.map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Award className="w-5 h-5 text-purple-600" />
                          Job Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <Briefcase className="h-5 w-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Job Type</p>
                              <p className="text-sm text-gray-600">{job.job_type || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          {job.location && (
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 mr-3 text-green-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Location</p>
                                <p className="text-sm text-gray-600">{job.location}</p>
                              </div>
                            </div>
                          )}
                          
                          {job.salary_range && (
                            <div className="flex items-start">
                              <TrendingUp className="h-5 w-5 mr-3 text-green-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Salary Range</p>
                                <p className="text-sm text-gray-600">{job.salary_range}</p>
                              </div>
                            </div>
                          )}
                          
                          {job.application_deadline && (
                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 mr-3 text-orange-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Application Deadline</p>
                                <p className="text-sm text-gray-600">
                                  {format(new Date(job.application_deadline), "MMMM dd, yyyy")}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start">
                            <User className="h-5 w-5 mr-3 text-purple-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Assigned Recruiter</p>
                              <p className="text-sm text-gray-600">
                                {job.hr_members ? 
                                  `${job.hr_members.first_name} ${job.hr_members.last_name}` : 
                                  'Not assigned'
                                }
                              </p>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-cyan-600" />
                              <p className="text-sm font-medium text-gray-900">ATS Configuration</p>
                            </div>
                            <p className="text-sm text-gray-600">Minimum Score: {job.ats_minimum_score}</p>
                            <p className="text-xs text-gray-500 mt-1">Applications below this score are auto-rejected</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Application Management
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Review and manage candidates for this position
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Enhanced Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search candidates by name or email..."
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === "all" ? "default" : "outline"}
                      onClick={() => setStatusFilter("all")}
                      className="h-12"
                    >
                      All ({stats.total})
                    </Button>
                    <Button
                      variant={statusFilter === "pending" ? "default" : "outline"}
                      onClick={() => setStatusFilter("pending")}
                      className="h-12"
                    >
                      Pending ({stats.pending})
                    </Button>
                    <Button
                      variant={statusFilter === "accepted" ? "default" : "outline"}
                      onClick={() => setStatusFilter("accepted")}
                      className="h-12"
                    >
                      Accepted ({stats.accepted})
                    </Button>
                  </div>
                </div>

                {applicationsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm || statusFilter !== "all" ? "No matching candidates" : "No applications yet"}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== "all" ? 
                        "Try adjusting your search or filter criteria." : 
                        "Applications will appear here as candidates apply for this position."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((app) => {
                      const atsStatus = getATSScoreStatus(app.rating || 0, job.ats_minimum_score);
                      return (
                        <Card key={app.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                    {app.candidate_profile?.full_name ? 
                                      app.candidate_profile.full_name.split(' ').map(n => n[0]).join('') : '??'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {app.candidate_profile?.full_name || 'Unknown Candidate'}
                                  </h3>
                                  <p className="text-sm text-gray-600">{app.candidate_profile?.email}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <p className="text-xs text-gray-500">
                                      Applied {format(new Date(app.date_applied), "MMM dd, yyyy")}
                                    </p>
                                    {app.rating && (
                                      <div className="flex items-center gap-1">
                                        <Brain className="w-3 h-3 text-blue-500" />
                                        <span className="text-xs font-medium text-blue-600">
                                          ATS: {getATSScoreDisplay(app.rating)}
                                        </span>
                                        <span className={`text-xs font-medium ${atsStatus.color}`}>
                                          ({atsStatus.text})
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Badge className={`${getStatusBadgeClass(app.application_status)} font-medium`}>
                                  {app.application_status || 'pending'}
                                </Badge>
                                
                                {app.resume_file_name && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => viewResume(app.resume_file_path)}
                                    className="text-blue-600 hover:text-blue-800 border-blue-200"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Resume
                                  </Button>
                                )}
                                
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                    className="text-green-600 hover:text-green-800 border-green-200 hover:bg-green-50"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                    className="text-red-600 hover:text-red-800 border-red-200 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default JobDetails;
