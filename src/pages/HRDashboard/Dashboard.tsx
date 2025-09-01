
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, Users, Calendar, FileText, TrendingUp, Award, Clock, Target, Zap, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { title: "Active Job Postings", value: "0", icon: Briefcase, gradient: "from-blue-600 to-indigo-700", change: "+12%" },
    { title: "Total Applicants", value: "0", icon: Users, gradient: "from-emerald-600 to-teal-700", change: "+8%" },
    { title: "Scheduled Interviews", value: "0", icon: Calendar, gradient: "from-purple-600 to-pink-600", change: "+15%" },
    { title: "Offer Letters Sent", value: "0", icon: FileText, gradient: "from-orange-600 to-amber-700", change: "+5%" },
  ]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const { count: jobCount, error: jobError } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Open');

        if (jobError) console.error("Error fetching jobs:", jobError);

        const { count: applicantCount, error: applicantError } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact', head: true });

        if (applicantError) console.error("Error fetching applicants:", applicantError);

        const { count: interviewCount, error: interviewError } = await supabase
          .from('interviews')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Scheduled');

        if (interviewError) console.error("Error fetching interviews:", interviewError);

        setStats([
          { title: "Active Job Postings", value: jobCount?.toString() || "0", icon: Briefcase, gradient: "from-blue-600 to-indigo-700", change: "+12%" },
          { title: "Total Applicants", value: applicantCount?.toString() || "0", icon: Users, gradient: "from-emerald-600 to-teal-700", change: "+8%" },
          { title: "Scheduled Interviews", value: interviewCount?.toString() || "0", icon: Calendar, gradient: "from-purple-600 to-pink-600", change: "+15%" },
          { title: "Offer Letters Sent", value: "8", icon: FileText, gradient: "from-orange-600 to-amber-700", change: "+5%" },
        ]);

        const { data: applications, error: applicationsError } = await supabase
          .from('job_applications')
          .select(`
            id,
            date_applied,
            job_title,
            user_id
          `)
          .order('date_applied', { ascending: false })
          .limit(4);

        if (applicationsError) {
          console.error("Error fetching recent applications:", applicationsError);
        } else {
          const applicationsWithProfiles = await Promise.all(
            (applications || []).map(async (app) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', app.user_id)
                .single();

              return {
                ...app,
                candidate_name: profileData?.full_name || 'Unknown Candidate'
              };
            })
          );
          
          setRecentApplications(applicationsWithProfiles);
        }
      } catch (error) {
        console.error("Error in fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative container mx-auto py-12 px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">HR Command Center</h1>
              <p className="text-xl text-slate-300">Welcome back, {user?.name || 'HR Manager'}</p>
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center text-emerald-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Performance: Excellent</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Monthly Goal: 85% Complete</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-slate-300">Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-6 -mt-6 relative z-10">
        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl transform hover:-translate-y-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-emerald-600 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                    <p className="text-xs text-slate-500">vs last month</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">{stat.title}</p>
                  <h2 className="text-3xl font-bold text-slate-900">{loading ? "..." : stat.value}</h2>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border-0 p-2">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-slate-50 rounded-xl p-1">
              <TabsTrigger value="overview" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="recruitment" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                <Briefcase className="w-4 h-4 mr-2" />
                Recruitment
              </TabsTrigger>
              <TabsTrigger value="interviews" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                <Calendar className="w-4 h-4 mr-2" />
                Interviews
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Recent Applications</CardTitle>
                      <CardDescription className="text-slate-600">Latest candidates who applied for open positions</CardDescription>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-slate-500">Loading recent applications...</p>
                    </div>
                  ) : recentApplications.length > 0 ? (
                    <div className="space-y-4">
                      {recentApplications.map((app: any) => (
                        <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                              {app.candidate_name[0]}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900">{app.candidate_name}</span>
                              <p className="text-sm text-slate-600">{app.job_title}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                              {new Date(app.date_applied).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">No recent applications found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Performance Metrics</CardTitle>
                      <CardDescription className="text-slate-600">Key performance indicators</CardDescription>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">Hiring Success Rate</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-600">92%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">Avg. Time to Hire</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">18 days</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">Quality Score</span>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recruitment" className="space-y-4">
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl font-bold text-slate-900">Job Postings Management</CardTitle>
                <CardDescription className="text-slate-600">Manage your active job postings</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Job Posting Center</h3>
                  <p className="text-slate-500">Your job postings management interface will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="interviews" className="space-y-4">
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-xl font-bold text-slate-900">Interview Scheduler</CardTitle>
                <CardDescription className="text-slate-600">Scheduled interviews for this week</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Interview Management</h3>
                  <p className="text-slate-500">Your scheduled interviews will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-xl font-bold text-slate-900">Document Center</CardTitle>
                <CardDescription className="text-slate-600">Manage HR documents securely</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Document Management</h3>
                  <p className="text-slate-500">Your document management system will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
