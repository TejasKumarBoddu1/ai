
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Award, Settings, Play, Clipboard, BookOpen, 
  Plus, Edit, Trash, Users, Download, Mail, Share2, Eye,
  BarChart2, Clock, UserPlus, Trash2, Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExamTemplate {
  id: string;
  title: string;
  category: string;
  questions: number;
  duration: number;
  passingScore: number;
  created: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'completed' | 'expired';
  score?: number;
  completion?: string;
  sent: string;
}

const AptitudeExams = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [showNewExam, setShowNewExam] = useState(false);
  const { toast } = useToast();

  // Mock exam templates
  const examTemplates: ExamTemplate[] = [
    {
      id: 'exam-1',
      title: 'Frontend Developer Aptitude Test',
      category: 'Technical',
      questions: 25,
      duration: 45,
      passingScore: 70,
      created: '2023-06-15'
    },
    {
      id: 'exam-2',
      title: 'General Aptitude Assessment',
      category: 'General',
      questions: 30,
      duration: 60,
      passingScore: 65,
      created: '2023-05-22'
    },
    {
      id: 'exam-3',
      title: 'Logical Reasoning Test',
      category: 'Reasoning',
      questions: 20,
      duration: 30,
      passingScore: 60,
      created: '2023-07-10'
    },
    {
      id: 'exam-4',
      title: 'Backend Developer Technical Assessment',
      category: 'Technical',
      questions: 35,
      duration: 60,
      passingScore: 75,
      created: '2023-08-05'
    }
  ];

  // Mock candidates
  const candidates: Candidate[] = [
    {
      id: 'cand-1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      status: 'completed',
      score: 82,
      completion: '2023-09-15',
      sent: '2023-09-10'
    },
    {
      id: 'cand-2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      status: 'pending',
      sent: '2023-09-14'
    },
    {
      id: 'cand-3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      status: 'completed',
      score: 68,
      completion: '2023-09-13',
      sent: '2023-09-10'
    },
    {
      id: 'cand-4',
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      status: 'expired',
      sent: '2023-08-15'
    },
    {
      id: 'cand-5',
      name: 'David Wilson',
      email: 'david.w@example.com',
      status: 'completed',
      score: 91,
      completion: '2023-09-12',
      sent: '2023-09-08'
    }
  ];

  // Exam form state
  const [examForm, setExamForm] = useState({
    title: '',
    category: 'Technical',
    questions: 20,
    duration: 30,
    passingScore: 70,
    description: ''
  });

  const handleExamFormChange = (field: string, value: any) => {
    setExamForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createExam = () => {
    toast({
      title: "Exam Created",
      description: "Your aptitude exam has been created successfully",
    });
    
    setShowNewExam(false);
    setActiveTab('exams');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-red-500 border-red-500">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aptitude Exams</h1>
          <p className="text-muted-foreground">Create and manage aptitude tests for candidates</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      {showNewExam ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Aptitude Exam</CardTitle>
            <CardDescription>
              Set up a new aptitude exam for assessing candidates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="examTitle">Exam Title</Label>
              <Input 
                id="examTitle" 
                placeholder="e.g. Frontend Developer Aptitude Test"
                value={examForm.title}
                onChange={(e) => handleExamFormChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={examForm.category}
                  onChange={(e) => handleExamFormChange('category', e.target.value)}
                >
                  <option value="Technical">Technical</option>
                  <option value="General">General Aptitude</option>
                  <option value="Reasoning">Logical Reasoning</option>
                  <option value="Verbal">Verbal Skills</option>
                  <option value="Quantitative">Quantitative Skills</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="passingScore" 
                    type="number" 
                    min="0" 
                    max="100"
                    value={examForm.passingScore}
                    onChange={(e) => handleExamFormChange('passingScore', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-muted-foreground w-32">
                    ({examForm.passingScore}% to pass)
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="questions">Number of Questions</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="questions" 
                    type="number" 
                    min="5" 
                    max="100"
                    value={examForm.questions}
                    onChange={(e) => handleExamFormChange('questions', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-muted-foreground w-32">
                    ({examForm.questions} questions)
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="duration" 
                    type="number" 
                    min="10" 
                    max="180"
                    value={examForm.duration}
                    onChange={(e) => handleExamFormChange('duration', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-muted-foreground w-32">
                    ({examForm.duration} minutes)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Exam Description</Label>
              <Textarea 
                id="description"
                placeholder="Provide a brief description of the exam and its purpose"
                rows={3}
                value={examForm.description}
                onChange={(e) => handleExamFormChange('description', e.target.value)}
              />
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Question Categories</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Allocate how many questions per category will be included
                </p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <Label className="text-xs">Category</Label>
                    </div>
                    <div className="col-span-1">
                      <Label className="text-xs">Questions</Label>
                    </div>
                    <div className="col-span-1">
                      <Label className="text-xs">Weight</Label>
                    </div>
                  </div>
                  
                  {["Technical Knowledge", "Logical Reasoning", "Problem Solving", "Communication"].map((category, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <Input value={category} readOnly />
                      </div>
                      <div className="col-span-1">
                        <Input type="number" defaultValue={i === 0 ? 10 : i === 1 ? 5 : i === 2 ? 3 : 2} min={0} />
                      </div>
                      <div className="col-span-1">
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                          <option value="1">1x</option>
                          <option value="1.5">1.5x</option>
                          <option value="2" selected={i === 0}>2x</option>
                          <option value="3">3x</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Exam Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 flex items-center gap-3">
                  <input type="checkbox" id="randomize" className="h-4 w-4" defaultChecked={true} />
                  <div>
                    <Label htmlFor="randomize" className="font-medium">Randomize Questions</Label>
                    <p className="text-sm text-muted-foreground">Display questions in random order</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 flex items-center gap-3">
                  <input type="checkbox" id="timeLimit" className="h-4 w-4" defaultChecked={true} />
                  <div>
                    <Label htmlFor="timeLimit" className="font-medium">Enforce Time Limit</Label>
                    <p className="text-sm text-muted-foreground">Auto-submit when time expires</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 flex items-center gap-3">
                  <input type="checkbox" id="results" className="h-4 w-4" defaultChecked={true} />
                  <div>
                    <Label htmlFor="results" className="font-medium">Show Results</Label>
                    <p className="text-sm text-muted-foreground">Show score upon completion</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 flex items-center gap-3">
                  <input type="checkbox" id="notification" className="h-4 w-4" defaultChecked={true} />
                  <div>
                    <Label htmlFor="notification" className="font-medium">Email Notification</Label>
                    <p className="text-sm text-muted-foreground">Get notified when candidate completes</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowNewExam(false)}>
              Cancel
            </Button>
            <Button onClick={createExam}>
              Create Exam
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="exams">
                <Clipboard className="h-4 w-4 mr-2" />
                Exam Library
              </TabsTrigger>
              <TabsTrigger value="candidates">
                <Users className="h-4 w-4 mr-2" />
                Candidates
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart2 className="h-4 w-4 mr-2" />
                Results & Analytics
              </TabsTrigger>
            </TabsList>
            
            <div>
              {activeTab === 'exams' ? (
                <Button onClick={() => setShowNewExam(true)}>
                  <Play className="h-4 w-4 mr-2" />
                  Create Exam
                </Button>
              ) : activeTab === 'candidates' ? (
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              ) : (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              )}
            </div>
          </div>
          
          <TabsContent value="exams" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Aptitude Exam Library</CardTitle>
                    <CardDescription>
                      Available aptitude exams for candidate assessment
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search exams..." className="w-64" />
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Passing Score</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examTemplates.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.category}</TableCell>
                        <TableCell>{exam.questions}</TableCell>
                        <TableCell>{exam.duration} min</TableCell>
                        <TableCell>{exam.passingScore}%</TableCell>
                        <TableCell>{new Date(exam.created).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover-scale border-dashed cursor-pointer" onClick={() => setShowNewExam(true)}>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <div className="rounded-full border-2 border-primary p-4 mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Create New Exam</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a custom aptitude test with your own questions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-scale cursor-pointer" onClick={() => {
                toast({
                  title: "Exam library",
                  description: "Browsing pre-built exam templates"
                });
              }}>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Template Library</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse ready-made exam templates for various roles
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-scale cursor-pointer" onClick={() => {
                toast({
                  title: "Exam settings",
                  description: "Configure global exam settings"
                });
              }}>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Global Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure branding, evaluation criteria, and notification preferences
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="candidates" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Candidate Management</CardTitle>
                      <div className="flex items-center gap-2">
                        <Input placeholder="Search candidates..." className="w-64" />
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Sent Date</TableHead>
                          <TableHead>Completion</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {candidates.map((candidate) => (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                            <TableCell>
                              {candidate.status === 'completed' ? (
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={candidate.score}
                                    className="h-2 w-16"
                                    indicatorClassName={
                                      candidate.score && candidate.score >= 80 
                                        ? "bg-green-500" 
                                        : candidate.score && candidate.score >= 60 
                                        ? "bg-amber-500" 
                                        : "bg-red-500"
                                    }
                                  />
                                  <span>{candidate.score}%</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>{new Date(candidate.sent).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {candidate.completion ? new Date(candidate.completion).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Send Exam Invitation</CardTitle>
                  <CardDescription>
                    Invite candidates to take an aptitude test
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidateName">Candidate Name</Label>
                    <Input id="candidateName" placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="candidateEmail">Email Address</Label>
                    <Input id="candidateEmail" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examSelect">Select Exam</Label>
                    <select className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                      <option disabled>Choose an exam</option>
                      {examTemplates.map(exam => (
                        <option key={exam.id} value={exam.id}>
                          {exam.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Exam Expiry</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input id="expiry" type="date" />
                      <select className="rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                        <option>3 days</option>
                        <option>5 days</option>
                        <option>7 days</option>
                        <option>14 days</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Optional Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Add a personal message to the invitation email"
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => {
                    toast({
                      title: "Invitation sent",
                      description: "The exam invitation has been sent to the candidate"
                    });
                  }}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tests Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold">53</div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clipboard className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">+8 from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold">72%</div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">+2.5% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold">85%</div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">-3% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Exam Performance Overview</CardTitle>
                <CardDescription>
                  Detailed breakdown of candidate performance by exam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {examTemplates.slice(0, 3).map(exam => (
                    <div key={exam.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{exam.title}</h3>
                        <Badge variant="outline">{exam.category}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Score</span>
                          <span className="font-medium">
                            {Math.round(65 + Math.random() * 15)}%
                          </span>
                        </div>
                        <Progress value={Math.round(65 + Math.random() * 15)} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="border rounded-md p-3">
                          <p className="text-sm text-muted-foreground">Candidates</p>
                          <p className="font-medium">{Math.round(5 + Math.random() * 20)}</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-sm text-muted-foreground">Pass Rate</p>
                          <p className="font-medium">{Math.round(70 + Math.random() * 20)}%</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-sm text-muted-foreground">Avg. Time</p>
                          <p className="font-medium">{Math.round(exam.duration * 0.7)} min</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <p className="text-sm text-muted-foreground">Difficulty</p>
                          <p className="font-medium">
                            {Math.random() > 0.5 ? "Medium" : "Hard"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>
                  Candidates with highest aptitude test scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Time Taken</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates
                      .filter(c => c.status === 'completed' && c.score && c.score > 70)
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .map(candidate => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{candidate.name}</p>
                              <p className="text-sm text-muted-foreground">{candidate.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {examTemplates[Math.floor(Math.random() * examTemplates.length)].title}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={candidate.score}
                                className="h-2 w-16"
                                indicatorClassName={
                                  candidate.score && candidate.score >= 80 
                                    ? "bg-green-500" 
                                    : candidate.score && candidate.score >= 60 
                                    ? "bg-amber-500" 
                                    : "bg-red-500"
                                }
                              />
                              <span className="font-medium">{candidate.score}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {Math.floor(Math.random() * 40) + 10} min
                          </TableCell>
                          <TableCell>
                            {candidate.completion ? new Date(candidate.completion).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AptitudeExams;
