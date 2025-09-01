import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("lastThreeMonths");
  const [loading, setLoading] = useState(true);
  const [recruitmentData, setRecruitmentData] = useState({
    applicationsOverTime: [],
    hiringStatuses: [],
    sourceEffectiveness: [],
    timeToHire: [],
    departmentHiring: []
  });
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    async function fetchAnalyticsData() {
      setLoading(true);
      try {
        // Fetch jobs data
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select(`
            id,
            title,
            status,
            location
          `);

        // Fetch applications data separately
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            application_date,
            pipeline_stage,
            job_id
          `);

        if (jobsError) {
          console.error("Error fetching jobs for analytics:", jobsError);
        } else if (applicationsError) {
          console.error("Error fetching applications for analytics:", applicationsError);
        } else {
          // Generate applications over time data
          const now = new Date();
          const applicationsMap = new Map();
          const statusMap = new Map([
            ['Applied', 0],
            ['Screening', 0], 
            ['Assessment', 0], 
            ['Interview', 0],
            ['Offer', 0],
            ['Hired', 0],
            ['Rejected', 0]
          ]);
          
          // Track departments based on job locations for department hiring chart
          const departmentMap = new Map();
          
          // Create empty months for the chart (last 3 months)
          for (let i = 0; i < 3; i++) {
            const monthDate = subMonths(now, i);
            const monthKey = format(monthDate, "MMM yyyy");
            applicationsMap.set(monthKey, 0);
          }

          // Process jobs for department data (using location as a proxy for department)
          jobsData?.forEach(job => {
            // Count by location (as a proxy for department)
            const dept = job.location || 'Unspecified';
            departmentMap.set(dept, (departmentMap.get(dept) || 0) + 1);
          });
          
          // Process applications
          applicationsData?.forEach(app => {
            // Count application statuses
            if (app.pipeline_stage) {
              statusMap.set(app.pipeline_stage, (statusMap.get(app.pipeline_stage) || 0) + 1);
            }
            
            // Count applications by month
            if (app.application_date) {
              const monthKey = format(new Date(app.application_date), "MMM yyyy");
              if (applicationsMap.has(monthKey)) {
                applicationsMap.set(monthKey, applicationsMap.get(monthKey) + 1);
              }
            }
          });
          
          // Convert applications by month to array for chart
          const applicationsOverTimeData = Array.from(applicationsMap.entries())
            .map(([month, count]) => ({ 
              month, 
              applications: count 
            }))
            .reverse(); // Most recent month last
          
          // Convert status counts to array for chart
          const hiringStatusesData = Array.from(statusMap.entries())
            .map(([stage, count]) => ({
              name: stage,
              value: count
            }));
            
          // Convert department counts to array for chart
          const departmentHiringData = Array.from(departmentMap.entries())
            .map(([department, count]) => ({
              name: department,
              jobs: count
            }));
          
          // Generate some time to hire data (mock)
          const timeToHireData = [
            { department: "Engineering", days: 38 },
            { department: "Sales", days: 25 },
            { department: "Marketing", days: 30 },
            { department: "Product", days: 42 },
            { department: "Design", days: 28 },
            { department: "HR", days: 21 }
          ];
          
          // Generate some source effectiveness data (mock)
          const sourceEffectivenessData = [
            { name: "Job Boards", applicants: 130, hires: 12 },
            { name: "Employee Referrals", applicants: 85, hires: 24 },
            { name: "LinkedIn", applicants: 110, hires: 18 },
            { name: "Company Website", applicants: 65, hires: 8 },
            { name: "Recruitment Agencies", applicants: 40, hires: 6 }
          ];
          
          setRecruitmentData({
            applicationsOverTime: applicationsOverTimeData,
            hiringStatuses: hiringStatusesData,
            sourceEffectiveness: sourceEffectivenessData,
            timeToHire: timeToHireData,
            departmentHiring: departmentHiringData
          });
        }
      } catch (error) {
        console.error("Error in fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, [timeframe]);

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">HR Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor recruitment metrics and hiring performance
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

        <Tabs defaultValue="recruitment">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="hiring">Hiring Funnel</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </TabsList>

          <TabsContent value="recruitment" className="space-y-6">
            {/* Applications Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>Total number of applications received per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={recruitmentData.applicationsOverTime}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorApplications)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Department Hiring */}
            <Card>
              <CardHeader>
                <CardTitle>Hiring by Department</CardTitle>
                <CardDescription>Number of open positions in each department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={recruitmentData.departmentHiring}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="jobs" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hiring" className="space-y-6">
            {/* Hiring Funnel / Pipeline Stages */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Pipeline Distribution</CardTitle>
                <CardDescription>Current candidates by pipeline stage</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row justify-center items-center">
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={recruitmentData.hiringStatuses}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {recruitmentData.hiringStatuses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} candidates`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Source Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Channel Effectiveness</CardTitle>
                <CardDescription>Performance of different recruitment channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={recruitmentData.sourceEffectiveness}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="applicants" fill="#8884d8" />
                      <Bar dataKey="hires" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-6">
            {/* Time to Hire by Department */}
            <Card>
              <CardHeader>
                <CardTitle>Time to Hire by Department</CardTitle>
                <CardDescription>Average days from job posting to offer acceptance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={recruitmentData.timeToHire}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="department" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="days" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cost per Hire */}
            <Card>
              <CardHeader>
                <CardTitle>Hiring Cost Analysis</CardTitle>
                <CardDescription>Breakdown of hiring costs by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      Detailed cost data will be available in the next update.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
