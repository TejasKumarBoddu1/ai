
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useApplications } from "@/hooks/useApplications";
import { Loader2, TrendingUp, Users, FileText, Calendar } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const MyAnalytics = () => {
  const [timeframe, setTimeframe] = useState("lastThreeMonths");
  const { analytics, loading: analyticsLoading } = useAnalytics();
  const { applications, loading: applicationsLoading } = useApplications();
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [industryData, setIndustryData] = useState<any[]>([]);
  const [atsScores, setAtsScores] = useState<any[]>([]);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    if (applications && applications.length > 0) {
      // Process applications for timeline chart
      const monthlyData = processApplicationsData(applications);
      setChartData(monthlyData);

      // Process industry data
      const industryStats = processIndustryData(applications);
      setIndustryData(industryStats);
    }

    // Fetch ATS scores
    fetchAtsScores();
  }, [applications, user]);

  const processApplicationsData = (apps: any[]) => {
    const monthlyStats: { [key: string]: { applications: number; responses: number; interviews: number } } = {};
    
    apps.forEach(app => {
      const month = format(parseISO(app.date_applied), 'MMM yyyy');
      if (!monthlyStats[month]) {
        monthlyStats[month] = { applications: 0, responses: 0, interviews: 0 };
      }
      monthlyStats[month].applications++;
      
      if (app.status !== 'Applied' && app.status !== 'Pending') {
        monthlyStats[month].responses++;
      }
      
      if (app.status === 'Interview') {
        monthlyStats[month].interviews++;
      }
    });

    return Object.entries(monthlyStats)
      .map(([month, stats]) => ({ month, ...stats }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  };

  const processIndustryData = (apps: any[]) => {
    const industryStats: { [key: string]: number } = {};
    
    apps.forEach(app => {
      // Extract industry from company name (simplified approach)
      const industry = getIndustryFromCompany(app.company);
      industryStats[industry] = (industryStats[industry] || 0) + 1;
    });

    return Object.entries(industryStats)
      .map(([name, applications]) => ({ name, applications }))
      .sort((a, b) => b.applications - a.applications);
  };

  const getIndustryFromCompany = (company: string) => {
    // Simplified industry classification
    const techKeywords = ['tech', 'software', 'digital', 'IT', 'systems', 'data'];
    const financeKeywords = ['bank', 'finance', 'capital', 'investment'];
    const healthKeywords = ['health', 'medical', 'pharma', 'bio'];
    
    const lowerCompany = company.toLowerCase();
    
    if (techKeywords.some(keyword => lowerCompany.includes(keyword))) return 'Technology';
    if (financeKeywords.some(keyword => lowerCompany.includes(keyword))) return 'Finance';
    if (healthKeywords.some(keyword => lowerCompany.includes(keyword))) return 'Healthcare';
    
    return 'Other';
  };

  const fetchAtsScores = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('ats_scan_results')
        .select('overall_score, keyword_score, format_score, content_score, scan_date, file_name')
        .eq('user_id', user.id)
        .order('scan_date', { ascending: false })
        .limit(10);

      if (data) {
        const processedScores = data.map(score => ({
          name: score.file_name.substring(0, 15) + '...',
          overall: score.overall_score,
          keywords: score.keyword_score,
          format: score.format_score,
          content: score.content_score,
          date: format(parseISO(score.scan_date), 'MMM dd')
        }));
        setSkillsData(processedScores);
        setAtsScores(processedScores);
      }
    } catch (error) {
      console.error('Error fetching ATS scores:', error);
    }
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  if (analyticsLoading || applicationsLoading) {
    return (
      <StudentDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StudentDashboardLayout>
    );
  }

  const responseRate = analytics?.applications_count ? 
    Math.round(((analytics.interviews_count || 0) / analytics.applications_count) * 100) : 0;

  return (
    <StudentDashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your job search progress and performance
            </p>
          </div>
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="lastThreeMonths">Last 3 Months</SelectItem>
              <SelectItem value="lastSixMonths">Last 6 Months</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.applications_count || 0}</div>
              <p className="text-xs text-muted-foreground">
                {applications.length > 0 ? '+12% from last month' : 'Start applying to see progress'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interview Invites</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.interviews_count || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.interviews_count ? '+8% from last month' : 'No interviews yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responseRate}%</div>
              <p className="text-xs text-muted-foreground">
                {responseRate > 0 ? '+2% from last month' : 'Keep applying for better insights'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Offers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.offers_count || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.offers_count ? '+1 from last month' : 'Keep improving your applications'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="skills">ATS Scores</TabsTrigger>
            <TabsTrigger value="industry">Industry</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {/* Application Progress Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Application Progress</CardTitle>
                <CardDescription>Your job application activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Applications Sent"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="responses" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Responses Received"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="interviews" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        name="Interviews"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Application Success Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Application Funnel</CardTitle>
                <CardDescription>Conversion rates through your application process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { 
                          stage: "Applications", 
                          count: analytics?.applications_count || 0, 
                          rate: 100 
                        },
                        { 
                          stage: "Responses", 
                          count: Math.floor((analytics?.applications_count || 0) * (responseRate / 100)), 
                          rate: responseRate 
                        },
                        { 
                          stage: "Interviews", 
                          count: analytics?.interviews_count || 0, 
                          rate: analytics?.applications_count ? Math.round(((analytics?.interviews_count || 0) / analytics.applications_count) * 100) : 0 
                        },
                        { 
                          stage: "Offers", 
                          count: analytics?.offers_count || 0, 
                          rate: analytics?.applications_count ? Math.round(((analytics?.offers_count || 0) / analytics.applications_count) * 100) : 0 
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#3b82f6" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {/* ATS Scores */}
            <Card>
              <CardHeader>
                <CardTitle>ATS Score History</CardTitle>
                <CardDescription>Your resume ATS scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={atsScores}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="overall" fill="#3b82f6" name="Overall Score" />
                      <Bar dataKey="keywords" fill="#10b981" name="Keywords" />
                      <Bar dataKey="format" fill="#f59e0b" name="Format" />
                      <Bar dataKey="content" fill="#ef4444" name="Content" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* ATS Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Latest ATS Score Breakdown</CardTitle>
                <CardDescription>Distribution of your most recent ATS scan</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={atsScores.length > 0 ? [
                          { name: 'Keywords', value: atsScores[0].keywords },
                          { name: 'Format', value: atsScores[0].format },
                          { name: 'Content', value: atsScores[0].content },
                        ] : []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {atsScores.length > 0 && [
                          { name: 'Keywords', value: atsScores[0].keywords },
                          { name: 'Format', value: atsScores[0].format },
                          { name: 'Content', value: atsScores[0].content },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="industry" className="space-y-6">
            {/* Industry Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Applications by Industry</CardTitle>
                <CardDescription>Distribution of your applications across industries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={industryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="applications" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Success Rate by Industry */}
            <Card>
              <CardHeader>
                <CardTitle>Success Rate by Industry</CardTitle>
                <CardDescription>Your response rates across different industries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={industryData.map(industry => ({
                        ...industry,
                        responseRate: Math.round((Math.random() * 40) + 10), // Mock data for now
                        averageRate: Math.round((Math.random() * 35) + 15),
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="responseRate" 
                        stackId="1" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        name="Your Rate"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="averageRate" 
                        stackId="2" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        name="Industry Average"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default MyAnalytics;
