
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateQwiXProContent } from "@/utils/qwixProApi";
import {
  Code,
  Rocket,
  FileCode,
  Download,
  FilePlus2,
  Clock,
  Server,
  ArrowDownToLine,
  FileText,
  BookOpen,
  CheckCircle2,
  Loader2,
  Globe,
  Database,
  FolderTree,
  Archive
} from "lucide-react";
import { motion } from "framer-motion";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";

type Framework = "react" | "html-css" | "vue";
type Backend = "nodejs" | "flask" | "none";
type ProjectStatus = "idle" | "generating" | "complete" | "error";

interface ProjectHistory {
  id: string;
  name: string;
  description: string;
  framework: Framework;
  backend: Backend;
  timestamp: number;
}

const QwiXProBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"builder" | "history">("builder");
  const [projectPrompt, setProjectPrompt] = useState("");
  const [projectName, setProjectName] = useState("");
  const [framework, setFramework] = useState<Framework>("react");
  const [backend, setBackend] = useState<Backend>("nodejs");
  const [generating, setGenerating] = useState<ProjectStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>(() => {
    const saved = localStorage.getItem("qwixpro-history");
    return saved ? JSON.parse(saved) : [];
  });

  const handleGenerate = async () => {
    if (!projectPrompt || !projectName) {
      toast({
        title: "Missing information",
        description: "Please provide both a project name and description.",
        variant: "destructive",
      });
      return;
    }

    setGenerating("generating");
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 800);

    try {
      // This would be replaced with actual API call to generate project
      const prompt = `
        Generate a ${framework} project with ${backend !== "none" ? backend + " backend" : "no backend"} that:
        ${projectPrompt}
        
        Please provide:
        1. Folder structure
        2. Key file contents
        3. Package.json dependencies
        4. Setup instructions
      `;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // In a real implementation, this would call the API
      // const result = await generateQwiXProContent(prompt);
      
      clearInterval(progressInterval);
      setProgress(100);
      setGenerating("complete");
      
      // Save to history
      const newProject: ProjectHistory = {
        id: Date.now().toString(),
        name: projectName,
        description: projectPrompt,
        framework,
        backend,
        timestamp: Date.now()
      };
      
      const updatedHistory = [newProject, ...projectHistory].slice(0, 10); // Keep last 10 projects
      setProjectHistory(updatedHistory);
      localStorage.setItem("qwixpro-history", JSON.stringify(updatedHistory));
      
      toast({
        title: "Project generated successfully!",
        description: "Your project is ready for download.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating project:", error);
      clearInterval(progressInterval);
      setGenerating("error");
      toast({
        title: "Generation failed",
        description: "There was an error generating your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would create and download a zip file
    toast({
      title: "Download started",
      description: "Your project files are being prepared for download.",
    });
  };
  
  const resetForm = () => {
    setProjectPrompt("");
    setProjectName("");
    setGenerating("idle");
    setProgress(0);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-modern-blue-600 to-soft-purple bg-clip-text text-transparent">
            AI Builder
          </h1>
          <p className="text-gray-600 mt-2">
            Generate complete code projects from natural language descriptions using AI.
          </p>
        </motion.div>

        <Tabs defaultValue="builder" value={activeTab} onValueChange={(value) => setActiveTab(value as "builder" | "history")} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 w-full max-w-md">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              <span>Project Builder</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Project History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card className="border-t-4 border-t-modern-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FilePlus2 className="h-5 w-5 text-modern-blue-600" />
                  Create New Project
                </CardTitle>
                <CardDescription>
                  Describe your desired application and our AI will generate all the necessary code.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input 
                    id="projectName" 
                    placeholder="E.g., Task Manager, Portfolio Website, etc."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={generating !== "idle"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectPrompt">Project Description</Label>
                  <Textarea 
                    id="projectPrompt" 
                    placeholder="Describe your project in detail. For example: 'Build me a task management app with dark/light mode, local storage, and the ability to categorize tasks.'"
                    rows={5}
                    value={projectPrompt}
                    onChange={(e) => setProjectPrompt(e.target.value)}
                    disabled={generating !== "idle"}
                    className="resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="framework">Frontend Framework</Label>
                    <Select 
                      value={framework} 
                      onValueChange={(value) => setFramework(value as Framework)}
                      disabled={generating !== "idle"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Frameworks</SelectLabel>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="html-css">HTML & CSS</SelectItem>
                          <SelectItem value="vue">Vue</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backend">Backend</Label>
                    <Select 
                      value={backend} 
                      onValueChange={(value) => setBackend(value as Backend)}
                      disabled={generating !== "idle"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select backend" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Backends</SelectLabel>
                          <SelectItem value="nodejs">Node.js</SelectItem>
                          <SelectItem value="flask">Flask (Python)</SelectItem>
                          <SelectItem value="none">No Backend</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              
              <Separator className="my-2" />
              
              <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
                {generating === "idle" ? (
                  <Button 
                    onClick={handleGenerate} 
                    className="w-full sm:w-auto bg-gradient-to-r from-modern-blue-600 to-soft-purple hover:opacity-90"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Generate Project
                  </Button>
                ) : generating === "generating" ? (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Generating project...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <div className="flex justify-between items-center text-xs text-gray-400 italic">
                      <span>This may take a minute</span>
                      <Loader2 className="animate-spin h-4 w-4" />
                    </div>
                  </div>
                ) : generating === "complete" ? (
                  <div className="w-full flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={handleDownload} 
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download as ZIP
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={resetForm} 
                      className="w-full sm:w-auto"
                    >
                      Create Another
                    </Button>
                  </div>
                ) : (
                  <div className="w-full flex gap-3">
                    <Button 
                      variant="destructive" 
                      onClick={resetForm} 
                      className="w-full sm:w-auto"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>

            {generating === "complete" && (
              <Card className="overflow-hidden border-t-4 border-t-green-600">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Project Generated: {projectName}
                  </CardTitle>
                  <CardDescription>
                    Your project is ready! Here's what's included:
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Globe className="h-5 w-5 text-modern-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Frontend</h3>
                          <p className="text-sm text-gray-500">
                            Complete {framework.toUpperCase()} implementation with responsive design, 
                            components, and required styling.
                          </p>
                        </div>
                      </div>
                      
                      {backend !== "none" && (
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <Server className="h-5 w-5 text-modern-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Backend</h3>
                            <p className="text-sm text-gray-500">
                              {backend === "nodejs" ? "Node.js/Express API" : "Flask Python API"} with 
                              routes, controllers, and data models.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Database className="h-5 w-5 text-modern-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Data Management</h3>
                          <p className="text-sm text-gray-500">
                            Local storage implementation and/or database connectivity with proper data handling.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <FolderTree className="h-5 w-5 text-modern-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Project Structure</h3>
                          <p className="text-sm text-gray-500">
                            Organized file structure with separate modules for maintainability and scalability.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <FileText className="h-5 w-5 text-modern-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Documentation</h3>
                          <p className="text-sm text-gray-500">
                            README with setup instructions, API documentation, and usage examples.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <BookOpen className="h-5 w-5 text-modern-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Code Comments</h3>
                          <p className="text-sm text-gray-500">
                            Well-commented code for easy understanding and future modification.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border mt-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      Download Contents
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Your download will include the following structure:
                    </p>
                    
                    <div className="bg-gray-900 text-gray-200 p-3 rounded-md text-xs font-mono overflow-x-auto">
                      <pre>
{`${projectName}/
├── README.md
├── package.json
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── index.js
├── public/
${backend !== "none" ? `├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── index.js
` : ''}└── .env.example`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 flex justify-end">
                  <Button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Download Project
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-modern-blue-600" />
                  Project History
                </CardTitle>
                <CardDescription>
                  Access your previously generated projects
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {projectHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <FileCode className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No projects yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Create your first project to see it here
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("builder")}
                    >
                      Create a Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectHistory.map((project) => (
                      <div key={project.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <Badge variant={project.framework === "react" ? "default" : project.framework === "vue" ? "outline" : "secondary"}>
                              {project.framework}
                            </Badge>
                            {project.backend !== "none" && (
                              <Badge variant={project.backend === "nodejs" ? "default" : "destructive"}>
                                {project.backend}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium mt-2">{project.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created on {formatDate(project.timestamp)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileCode className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          <Button size="sm">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default QwiXProBuilder;
