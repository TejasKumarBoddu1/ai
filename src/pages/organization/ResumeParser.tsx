
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, X, Download, CheckCircle, Filter, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParsedCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  experience: number;
  skills: string[];
  education: string;
  atsScore: number;
  jdMatch: number;
  lastPosition: string;
  source: string;
}

const ResumeParser = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedCandidates, setParsedCandidates] = useState<ParsedCandidate[]>([]);
  const [selectedJobRole, setSelectedJobRole] = useState("frontend-developer");
  const { toast } = useToast();
  
  // Mock job roles
  const jobRoles = [
    { id: "frontend-developer", title: "Frontend Developer" },
    { id: "backend-developer", title: "Backend Developer" },
    { id: "ui-designer", title: "UI Designer" },
    { id: "product-manager", title: "Product Manager" },
    { id: "data-scientist", title: "Data Scientist" },
  ];
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Filter for only PDF and Word documents
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    );
    
    if (validFiles.length < files.length) {
      toast({
        title: "Invalid files",
        description: "Some files were skipped. Only PDF and Word documents are supported.",
        variant: "warning"
      });
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          simulateParsing();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const simulateParsing = () => {
    setIsUploading(false);
    setIsParsing(true);
    
    // Mock parsed data after delay to simulate processing
    setTimeout(() => {
      const mockCandidates: ParsedCandidate[] = uploadedFiles.map((file, index) => ({
        id: `cand-${Date.now()}-${index}`,
        name: `Candidate ${index + 1}`,
        email: `candidate${index + 1}@example.com`,
        phone: `+1 555-${Math.floor(1000 + Math.random() * 9000)}`,
        experience: Math.floor(1 + Math.random() * 10),
        skills: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript'].slice(0, Math.floor(2 + Math.random() * 3)),
        education: Math.random() > 0.5 ? "Bachelor's in Computer Science" : "Master's in IT",
        atsScore: Math.floor(65 + Math.random() * 35),
        jdMatch: Math.floor(60 + Math.random() * 40),
        lastPosition: ['Software Engineer', 'Frontend Developer', 'Web Developer', 'UI Engineer'][Math.floor(Math.random() * 4)],
        source: file.name
      }));
      
      setParsedCandidates(mockCandidates);
      setIsParsing(false);
      
      toast({
        title: "Parsing complete",
        description: `Successfully parsed ${mockCandidates.length} resumes`,
      });
    }, 2000);
  };

  const clearAll = () => {
    setUploadedFiles([]);
    setParsedCandidates([]);
    setUploadProgress(0);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Parser</h1>
          <p className="text-muted-foreground">Upload and analyze multiple resumes with AI scoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </div>

      {parsedCandidates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Resume Upload</CardTitle>
            <CardDescription>Upload multiple resumes for AI analysis and matching</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Drag and drop resumes</h3>
                  <p className="text-sm text-muted-foreground">
                    Drop your files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF and Word documents
                  </p>
                </div>
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Select Files
                </Button>
                <input 
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Selected Files ({uploadedFiles.length})</h3>
                  <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>
                </div>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isUploading && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Uploading...</p>
                  <p className="text-sm">{uploadProgress}%</p>
                </div>
                <Progress value={uploadProgress} className="w-full h-2" />
              </div>
            )}
            
            {isParsing && (
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="text-sm font-medium">Analyzing resumes with AI...</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={clearAll} disabled={isUploading || isParsing}>
              Cancel
            </Button>
            <Button 
              onClick={processFiles} 
              disabled={uploadedFiles.length === 0 || isUploading || isParsing}
            >
              Process {uploadedFiles.length} {uploadedFiles.length === 1 ? 'Resume' : 'Resumes'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs defaultValue="candidates">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearAll}>
                New Upload
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Analyzed Resumes</CardTitle>
                    <CardDescription>Select a job role to match candidates</CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Match for:</label>
                    <select 
                      className="border rounded p-1 text-sm"
                      value={selectedJobRole}
                      onChange={(e) => setSelectedJobRole(e.target.value)}
                    >
                      {jobRoles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>ATS Score</TableHead>
                      <TableHead>JD Match %</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedCandidates.sort((a, b) => b.jdMatch - a.jdMatch).map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.experience} years</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={candidate.atsScore}
                              className="h-2 w-16"
                              indicatorClassName={
                                candidate.atsScore >= 80 
                                  ? "bg-green-500" 
                                  : candidate.atsScore >= 60 
                                  ? "bg-amber-500" 
                                  : "bg-red-500"
                              }
                            />
                            <span>{candidate.atsScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={candidate.jdMatch}
                              className="h-2 w-16"
                              indicatorClassName={
                                candidate.jdMatch >= 80 
                                  ? "bg-green-500" 
                                  : candidate.jdMatch >= 60 
                                  ? "bg-amber-500" 
                                  : "bg-red-500"
                              }
                            />
                            <span>{candidate.jdMatch}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {candidate.source}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Resume Analysis Summary</CardTitle>
                <CardDescription>
                  AI-powered insights from {parsedCandidates.length} parsed resumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-6 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Average Experience</p>
                      <p className="text-3xl font-bold">
                        {(parsedCandidates.reduce((sum, c) => sum + c.experience, 0) / parsedCandidates.length).toFixed(1)} years
                      </p>
                    </div>
                    <div className="bg-muted p-6 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Average ATS Score</p>
                      <p className="text-3xl font-bold">
                        {Math.round(parsedCandidates.reduce((sum, c) => sum + c.atsScore, 0) / parsedCandidates.length)}%
                      </p>
                    </div>
                    <div className="bg-muted p-6 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Average JD Match</p>
                      <p className="text-3xl font-bold">
                        {Math.round(parsedCandidates.reduce((sum, c) => sum + c.jdMatch, 0) / parsedCandidates.length)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Top Skills Found</h3>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML', 'Node.js'].map(skill => (
                        <div key={skill} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Candidate Recommendations</h3>
                    <div className="space-y-2">
                      {parsedCandidates
                        .filter(c => c.jdMatch >= 80)
                        .slice(0, 3)
                        .map(candidate => (
                          <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {candidate.experience} years • {candidate.jdMatch}% match
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-500">Top Match</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ResumeParser;
