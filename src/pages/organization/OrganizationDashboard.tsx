
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { FileText, Users, Calendar, Award, Briefcase, CheckCircle, Database, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const OrganizationDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const stats = [
    { title: "Active Job Postings", value: "12", icon: Briefcase },
    { title: "Total Applicants", value: "164", icon: Users },
    { title: "Screening Interviews", value: "48", icon: Calendar },
    { title: "Offer Letters Sent", value: "8", icon: FileText },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'Organization Admin'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-scale">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h2 className="text-3xl font-bold">{stat.value}</h2>
              </div>
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest candidates who applied for open positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['John Doe', 'Sarah Smith', 'Michael Johnson', 'Emily Brown'].map(name => (
                    <div key={name} className="flex items-center justify-between border-b pb-2">
                      <span>{name}</span>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Scheduled interviews for this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Wed, 10:00 AM - Front-end Developer', 
                    'Thu, 2:30 PM - UX Designer', 
                    'Fri, 11:00 AM - Project Manager',
                    'Fri, 3:00 PM - Backend Developer'].map(interview => (
                    <div key={interview} className="flex items-center justify-between border-b pb-2">
                      <span>{interview}</span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recruitment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-scale cursor-pointer" onClick={() => navigate('/organization/resume-parser')}>
              <CardHeader className="pb-2">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Resume Parser</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Upload and analyze multiple resumes with AI scoring and ranking.</p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale cursor-pointer" onClick={() => navigate('/organization/job-postings')}>
              <CardHeader className="pb-2">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage job postings and track applicants for each position.</p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale cursor-pointer" onClick={() => navigate('/organization/offer-letters')}>
              <CardHeader className="pb-2">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Offer Letters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Generate and manage offer letters and appointment documents.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Document Verification</CardTitle>
              <CardDescription>Verify candidate documents using blockchain technology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <Database className="h-16 w-16 text-primary" />
                <h3 className="text-xl font-bold">Secure Verification System</h3>
                <p className="max-w-md text-muted-foreground">
                  Upload and verify education certificates, previous employment records, 
                  and other important documents using our secure blockchain system.
                </p>
                <Button onClick={() => navigate('/organization/blockchain-verification')}>
                  Access Verification System
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Interview System</CardTitle>
              <CardDescription>Automated interview tools for candidate screening</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 hover-scale cursor-pointer" onClick={() => navigate('/organization/ai-interviewer')}>
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-medium mb-2">AI Interviewer</h3>
                  <p className="text-sm text-muted-foreground">
                    Create automated AI interviews for initial candidate screening with detailed reports.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6 hover-scale cursor-pointer" onClick={() => navigate('/organization/interview-scheduling')}>
                  <Calendar className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-medium mb-2">Interview Scheduler</h3>
                  <p className="text-sm text-muted-foreground">
                    Schedule and manage interview sessions with automated reminders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Platform</CardTitle>
              <CardDescription>Create and manage candidate assessment tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 hover-scale cursor-pointer" onClick={() => navigate('/organization/aptitude-exams')}>
                  <Award className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aptitude Exams</h3>
                  <p className="text-sm text-muted-foreground">
                    Create MCQ-based aptitude tests with automated scoring and analytics.
                  </p>
                </div>
                
                <div className="border rounded-lg p-6 hover-scale cursor-pointer" onClick={() => navigate('/organization/coding-tests')}>
                  <Code className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-medium mb-2">Coding Tests</h3>
                  <p className="text-sm text-muted-foreground">
                    Create coding challenges with automated evaluation and real-time monitoring.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Create and manage HR documents securely</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-6 hover-scale cursor-pointer" onClick={() => navigate('/organization/document-generator')}>
                  <div className="flex justify-between items-start">
                    <div>
                      <FileText className="h-10 w-10 text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-2">Document Generator</h3>
                      <p className="text-sm text-muted-foreground">
                        Generate offer letters, appointment letters, and other HR documents with automated templates.
                      </p>
                    </div>
                    <Button size="sm">Create</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-2">Recent Documents</h3>
                  <div className="space-y-2">
                    {['Offer Letter - Senior Developer.pdf', 
                      'Appointment Letter - UX Designer.pdf', 
                      'Employment Contract - Marketing Manager.pdf'].map(doc => (
                      <div key={doc} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
