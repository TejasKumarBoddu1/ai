
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Plus, Filter, ChevronDown, Search, TrendingUp, Users, Calendar, Star, BarChart3, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select(`
            *,
            hr_members(first_name, last_name)
          `)
          .order('created_at', { ascending: false });

        if (jobsError) {
          console.error("Error fetching jobs:", jobsError);
        } else {
          const jobsWithApplicationCounts = await Promise.all(
            (jobsData || []).map(async (job) => {
              const { count } = await supabase
                .from('job_applications')
                .select('*', { count: 'exact', head: true })
                .eq('job_id', job.id);

              return {
                ...job,
                applications: { length: count || 0 }
              };
            })
          );

          setJobs(jobsWithApplicationCounts);
          setTotalJobs(jobsWithApplicationCounts?.length || 0);
          
          const active = jobsWithApplicationCounts?.filter(job => job.status === 'Open').length || 0;
          setActiveJobs(active);
        }
      } catch (error) {
        console.error("Error in fetching jobs data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const handleCreateJob = () => {
    navigate('/hr-dashboard/jobs/create');
  };

  const handleViewJob = (jobId) => {
    navigate(`/hr-dashboard/jobs/${jobId}`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Filled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <Briefcase className="h-6 w-6" />
                  </div>
                  Job Management Center
                </h1>
                <p className="text-xl text-slate-300">
                  Manage and monitor all job postings with advanced analytics
                </p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex items-center text-emerald-400">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Performance: Excellent</span>
                  </div>
                  <div className="flex items-center text-blue-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">High Applicant Interest</span>
                  </div>
                </div>
              </div>
              <Button 
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                onClick={handleCreateJob}
              >
                <Plus className="mr-2 h-5 w-5" /> 
                Create Premium Job
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 px-4">
          {/* Premium Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">Total Positions</CardTitle>
                    <p className="text-sm text-slate-600">All job postings</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{loading ? "..." : totalJobs}</p>
                    <div className="flex items-center text-emerald-600 text-sm font-semibold mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% vs last month
                    </div>
                  </div>
                  <div className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">Active Jobs</CardTitle>
                    <p className="text-sm text-slate-600">Currently recruiting</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-emerald-600">{loading ? "..." : activeJobs}</p>
                    <div className="flex items-center text-emerald-600 text-sm font-semibold mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8% vs last month
                    </div>
                  </div>
                  <div className="w-16 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">Avg. Applications</CardTitle>
                    <p className="text-sm text-slate-600">Per job posting</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-600">24</p>
                    <div className="flex items-center text-emerald-600 text-sm font-semibold mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15% vs last month
                    </div>
                  </div>
                  <div className="w-16 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Search & Filters */}
          <Card className="bg-white shadow-lg border-0 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search jobs by title, company, or department..."
                    className="pl-12 h-12 border-0 bg-slate-50 text-base font-medium rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-xl font-semibold">
                    <Filter className="mr-2 h-4 w-4" />
                    Advanced Filters
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-xl font-semibold">
                    Status: All
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Jobs Table */}
          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
              <CardTitle className="text-xl font-bold text-slate-900">Job Postings Overview</CardTitle>
              <p className="text-slate-600">Manage and track all your job postings</p>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-16">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Job Data</h3>
                  <p className="text-slate-500">Analyzing your job postings...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-700">Job Title</TableHead>
                        <TableHead className="font-semibold text-slate-700">Company</TableHead>
                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700">Applications</TableHead>
                        <TableHead className="font-semibold text-slate-700">Department</TableHead>
                        <TableHead className="font-semibold text-slate-700">Experience</TableHead>
                        <TableHead className="font-semibold text-slate-700">Type</TableHead>
                        <TableHead className="font-semibold text-slate-700">Posted</TableHead>
                        <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                        <TableRow key={job.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-semibold text-slate-900">{job.title}</TableCell>
                          <TableCell className="text-slate-700">{job.company_name || "N/A"}</TableCell>
                          <TableCell>
                            <Badge className={`font-medium border ${getStatusBadgeClass(job.status)}`}>
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-blue-600">{job.applications?.length || 0}</span>
                              <div className="flex items-center text-emerald-600 text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +5%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-700">{job.department || "N/A"}</TableCell>
                          <TableCell className="text-slate-700">{job.experience_level || "N/A"}</TableCell>
                          <TableCell className="text-slate-700">{job.employment_type || "N/A"}</TableCell>
                          <TableCell className="text-slate-700">{job.posted_date ? new Date(job.posted_date).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewJob(job.id)}
                              className="hover:bg-blue-50 hover:text-blue-600 font-semibold"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
                            <div className="flex flex-col items-center">
                              <Briefcase className="w-16 h-16 text-slate-400 mb-4" />
                              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Jobs Found</h3>
                              <p className="text-slate-500 mb-6">
                                {searchTerm ? "No jobs match your search criteria." : "Create a new job to get started."}
                              </p>
                              <Button onClick={handleCreateJob} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Job
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
