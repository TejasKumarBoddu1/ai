import React from "react";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Award, 
  ArrowRight, 
  Loader2, 
  TrendingUp, 
  Target, 
  Star, 
  Zap, 
  Brain,
  Trophy,
  Clock,
  Users,
  Globe,
  BookOpen,
  Sparkles,
  BarChart3,
  Eye,
  Heart,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { format } from "date-fns";

const StudentHome = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("overview");
  const { stats, loading: statsLoading } = useDashboardStats();
  const { activity, loading: activityLoading } = useRecentActivity();

  // Premium stats configuration with enhanced data
  const premiumStats = [
    { 
      title: "Career Score", 
      value: statsLoading ? "..." : `${stats.resumeScore}%`, 
      icon: Trophy,
      change: "+5.2%",
      gradient: "from-yellow-400 via-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    { 
      title: "Active Applications", 
      value: statsLoading ? "..." : stats.jobsApplied.toString(), 
      icon: Briefcase,
      change: "+12",
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    { 
      title: "Interview Rate", 
      value: statsLoading ? "..." : `${Math.round((stats.interviews / Math.max(stats.jobsApplied, 1)) * 100)}%`, 
      icon: Users,
      change: "+8.3%",
      gradient: "from-emerald-500 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    { 
      title: "Skill Certifications", 
      value: statsLoading ? "..." : stats.certifications.toString(), 
      icon: Award,
      change: "+2",
      gradient: "from-purple-500 via-purple-600 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50"
    },
  ];

  // Premium achievement cards
  const achievements = [
    {
      title: "Rising Star",
      description: "Completed 5+ applications this week",
      icon: Star,
      progress: 85,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Skill Master",
      description: "Earned 3 new certifications",
      icon: Brain,
      progress: 100,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Interview Pro",
      description: "95% interview success rate",
      icon: Target,
      progress: 95,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interview':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'offer':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-3xl mx-6 mt-6 mb-8">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                  Premium Student Dashboard
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Welcome back,
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {user?.name || 'Student'}
                  </span>
                </h1>
                
                <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                  Your personalized career journey continues. Track progress, discover opportunities, and accelerate your professional growth.
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex space-x-4">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                  <Link to="/builder">
                    <FileText className="h-4 w-4 mr-2" /> 
                    Resume Builder
                  </Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0" asChild>
                  <Link to="/apply">
                    <Briefcase className="h-4 w-4 mr-2" /> 
                    Find Opportunities
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-8">
          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumStats.map((stat, index) => (
              <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <h2 className="text-3xl font-bold text-slate-900">{stat.value}</h2>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={achievement.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${achievement.bgColor} flex items-center justify-center`}>
                      <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{achievement.title}</h3>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-semibold text-slate-900">{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Premium Tabs Section */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <TabsList className="grid grid-cols-4 w-full max-w-md bg-white shadow-lg border-0 rounded-xl p-1">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Applications</TabsTrigger>
                <TabsTrigger value="interviews" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Interviews</TabsTrigger>
                <TabsTrigger value="learning" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Learning</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Applications Premium Card */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Recent Applications
                    </CardTitle>
                    <CardDescription className="text-blue-100">Your latest job applications and their status</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {activityLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      </div>
                    ) : activity.applications.length > 0 ? (
                      <div className="space-y-4">
                        {activity.applications.slice(0, 3).map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                                {app.company[0]}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900">{app.job_title}</span>
                                <p className="text-sm text-slate-600">{app.company}</p>
                                <p className="text-xs text-slate-500">{formatDate(app.date_applied)}</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(app.status)} font-medium`}>
                              {app.status}
                            </Badge>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                          <Link to="/my-applications">
                            View all applications
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-slate-600 mb-4">No applications yet</p>
                        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                          <Link to="/apply">Start Applying</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Interview Preparation Premium Card */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Interview Pipeline
                    </CardTitle>
                    <CardDescription className="text-purple-100">Upcoming interviews and preparation</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {activityLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                      </div>
                    ) : activity.interviews.length > 0 ? (
                      <div className="space-y-4">
                        {activity.interviews.map((interview) => (
                          <div key={interview.id} className="p-4 bg-white rounded-xl border border-slate-100 hover:border-purple-200 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-slate-900">{interview.job_title}</h3>
                                <p className="text-sm text-slate-600">{interview.company}</p>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Interview Stage</Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                Schedule
                              </Button>
                              <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                                <Link to="/interview-coach">Practice</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-slate-600 mb-4">No interviews scheduled</p>
                        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                          <Link to="/interview-coach">Practice Interview Skills</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Actions Premium Grid */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-slate-300">Essential tools to accelerate your career</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center py-6 px-4 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group" 
                      asChild
                    >
                      <Link to="/builder">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">Resume Builder</span>
                        <span className="text-xs text-slate-500 mt-1">Create ATS-optimized resumes</span>
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center py-6 px-4 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group" 
                      asChild
                    >
                      <Link to="/apply">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Briefcase className="h-8 w-8 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">Job Search</span>
                        <span className="text-xs text-slate-500 mt-1">Find your dream position</span>
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex flex-col items-center justify-center py-6 px-4 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group" 
                      asChild
                    >
                      <Link to="/certification-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">Certifications</span>
                        <span className="text-xs text-slate-500 mt-1">Boost your credentials</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-4">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle>Application Tracker</CardTitle>
                  <CardDescription className="text-blue-100">Monitor your job application progress</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : activity.applications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Position</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Company</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Applied</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activity.applications.map((app, index) => (
                            <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900">{app.job_title}</td>
                              <td className="px-6 py-4 text-slate-700">{app.company}</td>
                              <td className="px-6 py-4 text-slate-600">{formatDate(app.date_applied)}</td>
                              <td className="px-6 py-4">
                                <Badge className={`${getStatusColor(app.status)} font-medium`}>
                                  {app.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h3>
                      <p className="text-slate-600 mb-6">Start your career journey by applying to your first job</p>
                      <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                        <Link to="/apply">Browse Jobs</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="interviews" className="mt-4">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle>Interview Center</CardTitle>
                  <CardDescription className="text-purple-100">Prepare and track your interviews</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {activityLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                  ) : activity.interviews.length > 0 ? (
                    <div className="space-y-6">
                      {activity.interviews.map((interview) => (
                        <div key={interview.id} className="border border-slate-200 rounded-xl p-6 bg-gradient-to-r from-white to-purple-50">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{interview.job_title}</h3>
                              <p className="text-slate-600">{interview.company}</p>
                              <p className="text-sm text-slate-500">Applied: {formatDate(interview.date_applied)}</p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Interview Stage</Badge>
                          </div>
                          <p className="text-sm text-slate-700 mb-4">Prepare for your interview with our AI-powered coaching system.</p>
                          <div className="flex gap-3">
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Schedule Interview
                            </Button>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" asChild>
                              <Link to="/interview-coach">Start AI Practice</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No Interviews Scheduled</h3>
                      <p className="text-slate-600 mb-6">Practice your interview skills to be ready when opportunities come</p>
                      <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                        <Link to="/interview-coach">Practice with AI Coach</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="learning" className="mt-4">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle>Learning & Development</CardTitle>
                  <CardDescription className="text-emerald-100">Track your skill development and certifications</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Certifications Section */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-emerald-600" />
                        Your Certifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-emerald-100 flex items-center">
                          <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mr-4">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">React Developer</p>
                            <p className="text-sm text-slate-600">Earned on Apr 15, 2025</p>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-emerald-100 flex items-center">
                          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">TypeScript Fundamentals</p>
                            <p className="text-sm text-slate-600">Earned on Mar 22, 2025</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50" asChild>
                        <Link to="/certification-center">
                          <Award className="w-4 h-4 mr-2" />
                          Explore More Certifications
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Learning Paths */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Active Learning Paths
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-slate-900">Full Stack Web Development</h4>
                            <span className="text-sm font-semibold text-blue-600">65%</span>
                          </div>
                          <Progress value={65} className="h-2 mb-2" />
                          <p className="text-sm text-slate-600">Master modern web development technologies</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-slate-900">UI/UX Design Fundamentals</h4>
                            <span className="text-sm font-semibold text-purple-600">40%</span>
                          </div>
                          <Progress value={40} className="h-2 mb-2" />
                          <p className="text-sm text-slate-600">Learn design principles and user experience</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentHome;
