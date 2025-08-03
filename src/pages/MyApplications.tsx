
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, MapPin, Building, Eye, FileText, TrendingUp, Clock, Target, Star, Briefcase, Award, Users } from "lucide-react";
import { useApplications } from "@/hooks/useApplications";
import { useNotifications } from "@/hooks/useNotifications";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MyApplications = () => {
  const { applications, loading } = useApplications();
  const { notifications, unreadCount } = useNotifications();
  const { toast } = useToast();

  const viewResume = async (filePath: string) => {
    if (!filePath) return;
    
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

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-semibold">Pending Review</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold">Under Review</Badge>;
      case 'accepted':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="font-semibold">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="font-semibold">{status}</Badge>;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 25;
      case 'reviewed': return 50;
      case 'accepted': return 100;
      case 'rejected': return 0;
      default: return 20;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewed': return 'bg-blue-500';
      case 'accepted': return 'bg-emerald-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const pendingCount = applications.filter(app => app.application_status?.toLowerCase() === 'pending' || app.status?.toLowerCase() === 'pending').length;
  const reviewedCount = applications.filter(app => app.application_status?.toLowerCase() === 'reviewed' || app.status?.toLowerCase() === 'reviewed').length;
  const acceptedCount = applications.filter(app => app.application_status?.toLowerCase() === 'accepted' || app.status?.toLowerCase() === 'accepted').length;

  return (
    <StudentDashboardLayout>
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
                    <FileText className="h-6 w-6" />
                  </div>
                  My Applications
                </h1>
                <p className="text-xl text-slate-300">
                  Track your job applications and career progress
                </p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex items-center text-emerald-400">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Application Success Rate: 78%</span>
                  </div>
                  <div className="flex items-center text-blue-400">
                    <Target className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Response Rate: 85%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {unreadCount > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">{unreadCount} New Updates</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 px-4">
          {/* Premium Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-emerald-600 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </div>
                    <p className="text-xs text-slate-500">vs last month</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Total Applications</p>
                  <h2 className="text-3xl font-bold text-slate-900">{applications.length}</h2>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-orange-700 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center shadow-lg">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-emerald-600 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8%
                    </div>
                    <p className="text-xs text-slate-500">vs last month</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Pending Review</p>
                  <h2 className="text-3xl font-bold text-slate-900">{pendingCount}</h2>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-emerald-600 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15%
                    </div>
                    <p className="text-xs text-slate-500">vs last month</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Under Review</p>
                  <h2 className="text-3xl font-bold text-slate-900">{reviewedCount}</h2>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-emerald-600 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +25%
                    </div>
                    <p className="text-xs text-slate-500">vs last month</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Accepted</p>
                  <h2 className="text-3xl font-bold text-slate-900">{acceptedCount}</h2>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Notifications */}
          {notifications.length > 0 && (
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Recent Updates</CardTitle>
                    <CardDescription className="text-slate-600">Latest notifications about your applications</CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                        notification.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-200 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 mb-1">{notification.title}</p>
                          <p className="text-slate-600 leading-relaxed">{notification.message}</p>
                        </div>
                        <Badge
                          className={`ml-4 font-medium ${
                            notification.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                            notification.type === 'error' ? 'bg-red-100 text-red-800 border-red-200' : 
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-3 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Applications List */}
          <div className="space-y-6">
            {loading ? (
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700">Loading Your Applications</h3>
                    <p className="text-slate-500">Fetching your career progress...</p>
                  </div>
                </CardContent>
              </Card>
            ) : applications.length > 0 ? (
              applications.map((application) => (
                <Card key={application.id} className="group bg-white hover:bg-slate-50/50 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden transform hover:-translate-y-1">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                            {application.company?.[0] || 'C'}
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {application.job_title}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-2 text-lg">
                              <Building className="w-5 h-5 mr-2 text-blue-500" /> 
                              <span className="font-semibold text-slate-700">{application.company}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3 items-end">
                        {getStatusBadge(application.application_status || application.status)}
                        <div className="text-sm text-slate-500 flex items-center bg-slate-100 px-3 py-1 rounded-full">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          Applied {new Date(application.date_applied).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Progress Bar */}
                      <div className="bg-slate-50 rounded-xl p-6">
                        <div className="flex justify-between text-sm mb-3">
                          <span className="font-semibold text-slate-700">Application Progress</span>
                          <span className="font-bold text-slate-900">{getProgressValue(application.application_status || application.status)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getProgressColor(application.application_status || application.status)} transition-all duration-500`}
                            style={{ width: `${getProgressValue(application.application_status || application.status)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {application.location && (
                          <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Location</p>
                              <p className="font-bold text-slate-800">{application.location}</p>
                            </div>
                          </div>
                        )}
                        
                        {application.resume_file_name && (
                          <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-4">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Resume</p>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => viewResume(application.resume_file_path)}
                                className="p-0 h-auto text-slate-800 hover:text-emerald-600 font-bold"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                {application.resume_file_name}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* HR Notes */}
                      {application.hr_notes && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <p className="font-bold text-purple-700">HR Notes</p>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{application.hr_notes}</p>
                        </div>
                      )}

                      {/* Rating */}
                      {application.rating && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <Star className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-bold text-yellow-700">HR Rating</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                      star <= application.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-bold text-slate-900">({application.rating}/5)</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Next Steps */}
                      {application.next_step && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                              <Target className="w-4 h-4 text-white" />
                            </div>
                            <p className="font-bold text-blue-700">Next Steps</p>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{application.next_step}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardContent className="text-center py-20">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Briefcase className="w-16 h-16 text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Start Your Career Journey</h3>
                  <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
                    You haven't submitted any job applications yet. Explore amazing opportunities and take the first step towards your dream career!
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Browse Premium Jobs
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default MyApplications;
