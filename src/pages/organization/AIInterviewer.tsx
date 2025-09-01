import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, Settings, Play, Clipboard, MessageSquare, 
  UserPlus, Edit, Trash, Send, Download, List, Video, 
  UserCheck, Mail, Calendar, BarChart2 as BarChart 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InterviewTemplate {
  id: string;
  name: string;
  role: string;
  level: string;
  questions: number;
  duration: number;
  created: string;
}

interface InterviewCandidate {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'completed' | 'expired';
  score?: number;
  completionDate?: string;
  sentDate: string;
}

const AIInterviewer = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const { toast } = useToast();

  // Mock interview templates
  const interviewTemplates: InterviewTemplate[] = [
    {
      id: 'template-1',
      name: 'Frontend Developer Interview',
      role: 'Frontend Developer',
      level: 'Mid-Senior',
      questions: 15,
      duration: 30,
      created: '2023-05-15'
    },
    {
      id: 'template-2',
      name: 'Product Manager Assessment',
      role: 'Product Manager',
      level: 'Senior',
      questions: 12,
      duration: 25,
      created: '2023-06-22'
    },
    {
      id: 'template-3',
      name: 'UX Designer Evaluation',
      role: 'UX Designer',
      level: 'Mid',
      questions: 10,
      duration: 20,
      created: '2023-07-10'
    },
    {
      id: 'template-4',
      name: 'Backend Developer Technical',
      role: 'Backend Developer',
      level: 'Junior-Mid',
      questions: 18,
      duration: 40,
      created: '2023-08-05'
    }
  ];

  // Mock interview candidates
  const interviewCandidates: InterviewCandidate[] = [
    {
      id: 'candidate-1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Frontend Developer',
      status: 'completed',
      score: 85,
      completionDate: '2023-09-10',
      sentDate: '2023-09-08'
    },
    {
      id: 'candidate-2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'UX Designer',
      status: 'pending',
      sentDate: '2023-09-12'
    },
    {
      id: 'candidate-3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      role: 'Product Manager',
      status: 'completed',
      score: 92,
      completionDate: '2023-09-11',
      sentDate: '2023-09-09'
    },
    {
      id: 'candidate-4',
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      role: 'Frontend Developer',
      status: 'expired',
      sentDate: '2023-08-15'
    },
    {
      id: 'candidate-5',
      name: 'David Wilson',
      email: 'david.w@example.com',
      role: 'Backend Developer',
      status: 'completed',
      score: 78,
      completionDate: '2023-09-14',
      sentDate: '2023-09-10'
    }
  ];

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    role: '',
    level: 'Mid',
    questions: 10,
    duration: 20,
    jobDescription: '',
    skills: []
  });

  // Candidate form state
  const [candidateForm, setcandidateForm] = useState({
    name: '',
    email: '',
    role: '',
    templateId: ''
  });

  const handleTemplateFormChange = (field: string, value: any) => {
    setTemplateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createTemplate = () => {
    toast({
      title: "Template Created",
      description: "Your AI interview template has been created successfully",
    });
    
    setShowNewTemplate(false);
    setActiveTab('templates');
  };

  const sendInterview = () => {
    toast({
      title: "Interview Sent",
      description: "The AI interview has been sent to the candidate",
    });
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
          <h1 className="text-3xl font-bold tracking-tight">AI Interviewer</h1>
          <p className="text-muted-foreground">Create and manage automated AI interviews for candidates</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      {showNewTemplate ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Interview Template</CardTitle>
            <CardDescription>
              Set up a new AI interview template for screening candidates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input 
                id="templateName" 
                placeholder="e.g. Frontend Developer Interview"
                value={templateForm.name}
                onChange={(e) => handleTemplateFormChange('name', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Job Role</Label>
                <Input 
                  id="role" 
                  placeholder="e.g. Frontend Developer"
                  value={templateForm.role}
                  onChange={(e) => handleTemplateFormChange('role', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Experience Level</Label>
                <select 
                  id="level"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={templateForm.level}
                  onChange={(e) => handleTemplateFormChange('level', e.target.value)}
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead/Manager</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="questions">Number of Questions</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="questions" 
                    type="number" 
                    min="5" 
                    max="30"
                    value={templateForm.questions}
                    onChange={(e) => handleTemplateFormChange('questions', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-muted-foreground w-32">
                    ({templateForm.questions} questions)
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="duration" 
                    type="number" 
                    min="10" 
                    max="60"
                    value={templateForm.duration}
                    onChange={(e) => handleTemplateFormChange('duration', parseInt(e.target.value))}
                  />
                  <span className="text-sm text-muted-foreground w-32">
                    ({templateForm.duration} minutes)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea 
                id="jobDescription"
                placeholder="Paste the job description here to help the AI generate relevant questions"
                rows={5}
                value={templateForm.jobDescription}
                onChange={(e) => handleTemplateFormChange('jobDescription', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The AI will analyze the job description to create role-specific interview questions.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills to Assess</Label>
              <Textarea 
                id="skills"
                placeholder="E.g. React, JavaScript, CSS, Responsive Design"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Enter skills separated by commas. The AI will focus questions on assessing these skills.
              </p>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Interview Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 flex items-center gap-3">
                  <input type="checkbox" id="video" className="h-4 w-4" defaultChecked={true} />
                  <div>
                    <Label htmlFor="video" className="font-medium">Video Response</Label>
                    <p className="text-sm text-muted-foreground">Record candidate's video responses</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 flex items-center gap-3">
                  <input type="checkbox" id="text" className="h-4 w-4" defaultChecked={true} />
                  <div>
                    <Label htmlFor="text" className="font-medium">Text Response</Label>
                    <p className="text-sm text-muted-foreground">Allow typed answers for technical questions</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 flex items-center gap-3">
                  <input type="checkbox" id="personality" className="h-4 w-4" defaultChecked={true} />
                  <div>
                    <Label htmlFor="personality" className="font-medium">Personality Assessment</Label>
                    <p className="text-sm text-muted-foreground">Include questions that assess cultural fit</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 flex items-center gap-3">
                  <input type="checkbox" id="coding" className="h-4 w-4" />
                  <div>
                    <Label htmlFor="coding" className="font-medium">Coding Challenge</Label>
                    <p className="text-sm text-muted-foreground">Include practical coding exercise</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowNewTemplate(false)}>
              Cancel
            </Button>
            <Button onClick={createTemplate}>
              Create Template
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="templates">
                <Clipboard className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="candidates">
                <Users className="h-4 w-4 mr-2" />
                Candidates
              </TabsTrigger>
              <TabsTrigger value="reports">
                <MessageSquare className="h-4 w-4 mr-2" />
                Interview Reports
              </TabsTrigger>
            </TabsList>
            
            <div>
              {activeTab === 'templates' ? (
                <Button onClick={() => setShowNewTemplate(true)}>
                  <Play className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              ) : activeTab === 'candidates' ? (
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              ) : (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
              )}
            </div>
          </div>
          
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Interview Templates</CardTitle>
                    <CardDescription>
                      Pre-configured AI interview templates for different roles
                    </CardDescription>
                  </div>
                  <Input placeholder="Search templates..." className="max-w-xs" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interviewTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.role}</TableCell>
                        <TableCell>{template.level}</TableCell>
                        <TableCell>{template.questions}</TableCell>
                        <TableCell>{template.duration} min</TableCell>
                        <TableCell>{new Date(template.created).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
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
              <Card className="hover-scale border-dashed cursor-pointer" onClick={() => setShowNewTemplate(true)}>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <div className="rounded-full border-2 border-primary p-4 mb-4">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Create New Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up a custom AI interview template for your specific requirements
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-scale cursor-pointer" onClick={() => {
                toast({
                  title: "Template library",
                  description: "Browsing pre-built AI interview templates"
                });
              }}>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <List className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Template Library</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse ready-made templates for common job roles and positions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-scale cursor-pointer" onClick={() => {
                toast({
                  title: "Template settings",
                  description: "Configure global AI interview settings"
                });
              }}>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Global Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure branding, evaluation criteria, and AI behavior settings
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
                      <CardTitle>Interview Candidates</CardTitle>
                      <Input placeholder="Search candidates..." className="max-w-xs" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Sent Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {interviewCandidates.map((candidate) => (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{candidate.role}</TableCell>
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
                            <TableCell>{new Date(candidate.sentDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Video className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Mail className="h-4 w-4" />
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
                  <CardTitle>Send New Interview</CardTitle>
                  <CardDescription>
                    Schedule an AI interview for a candidate
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
                    <Label htmlFor="role">Position/Role</Label>
                    <Input id="role" placeholder="e.g. Frontend Developer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="templateSelect">Interview Template</Label>
                    <select className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                      <option disabled>Select a template</option>
                      {interviewTemplates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Interview Expiry</Label>
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
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={sendInterview}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Interview
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Candidates Interviewed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold">42</div>
                    <div className="rounded-full bg-green-100 text-green-600 p-2">
                      <UserCheck className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Avg. Interview Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold">76%</div>
                    <div className="rounded-full bg-blue-100 text-blue-600 p-2">
                      <BarChart className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">+3% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold">89%</div>
                    <div className="rounded-full bg-amber-100 text-amber-600 p-2">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">-2% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Interview Reports</CardTitle>
                <CardDescription>
                  Review candidate performance and interview results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Technical</TableHead>
                      <TableHead>Communication</TableHead>
                      <TableHead>Culture Fit</TableHead>
                      <TableHead>Date Completed</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interviewCandidates
                      .filter(candidate => candidate.status === 'completed')
                      .map(candidate => {
                        const technicalScore = Math.floor(65 + Math.random() * 30);
                        const communicationScore = Math.floor(65 + Math.random() * 30);
                        const cultureScore = Math.floor(65 + Math.random() * 30);
                        
                        return (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{candidate.role}</TableCell>
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
                                <span>{candidate.score}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={technicalScore}
                                  className="h-2 w-12"
                                  indicatorClassName={
                                    technicalScore >= 80 
                                      ? "bg-green-500" 
                                      : technicalScore >= 60 
                                      ? "bg-amber-500" 
                                      : "bg-red-500"
                                  }
                                />
                                <span>{technicalScore}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={communicationScore}
                                  className="h-2 w-12"
                                  indicatorClassName={
                                    communicationScore >= 80 
                                      ? "bg-green-500" 
                                      : communicationScore >= 60 
                                      ? "bg-amber-500" 
                                      : "bg-red-500"
                                  }
                                />
                                <span>{communicationScore}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={cultureScore}
                                  className="h-2 w-12"
                                  indicatorClassName={
                                    cultureScore >= 80 
                                      ? "bg-green-500" 
                                      : cultureScore >= 60 
                                      ? "bg-amber-500" 
                                      : "bg-red-500"
                                  }
                                />
                                <span>{cultureScore}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {candidate.completionDate ? new Date(candidate.completionDate).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View Report
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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

export default AIInterviewer;
