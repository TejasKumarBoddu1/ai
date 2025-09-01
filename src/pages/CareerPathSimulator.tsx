
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Download, Info, Box, Brain, ArrowRight } from "lucide-react";
import { generateCareerPaths } from "@/utils/careerPathGenerator";
import { CareerPathVisualization } from "@/components/career/CareerPathVisualization";
import { toast } from "@/components/ui/use-toast";
import { CareerNode, CareerPath } from "@/types/career";
import { RoleDetails } from "@/components/career/RoleDetails";
import { HackathonBadge } from "@/components/career/HackathonBadge";

const CareerPathSimulator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobRole, setJobRole] = useState<string>("");
  const [careerPaths, setCareerPaths] = useState<CareerPath[] | null>(null);
  const [activePathIndex, setActivePathIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<CareerNode | null>(null);
  const navigate = useNavigate();

  // Generate career paths based on job role
  const generatePaths = async () => {
    if (!jobRole.trim()) {
      toast({
        title: "Job role required",
        description: "Please enter a job role to generate career paths.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a simple mock data structure based on the job role
      const mockResumeData = {
        currentRole: jobRole,
        yearsOfExperience: 2, // Default to entry-level
        skills: ["Communication", "Problem Solving", "Teamwork"],
        softSkills: ["Adaptability", "Time Management", "Critical Thinking"],
        education: ["Bachelor's Degree"],
        certifications: []
      };
      
      const paths = await generateCareerPaths(mockResumeData);
      setCareerPaths(paths);
      setActivePathIndex(0);
      setSelectedRole(null);
      
      toast({
        title: "Career paths generated",
        description: "Your personalized career roadmap is ready to explore.",
      });
    } catch (error) {
      console.error("Error generating career paths:", error);
      toast({
        title: "Error generating career paths",
        description: "There was an issue creating your career paths. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: CareerNode) => {
    setSelectedRole(role);
  };

  // Download career path as PDF
  const downloadCareerPath = () => {
    toast({
      title: "Downloading career path",
      description: "Your career path roadmap is being downloaded as a PDF.",
    });
    // In a real implementation, this would generate and download a PDF
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        {/* Header with hackathon badge */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                Career Path Simulator™
                <Sparkles className="ml-2 h-6 w-6 text-blue-500" />
              </h1>
              <HackathonBadge />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl">
              Visualize your potential career paths based on your desired job role, powered by AI.
            </p>
          </div>
        </div>

        {/* Job Role Input Card */}
        <Card className="border border-blue-100 shadow-lg bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="text-blue-800">Enter Your Desired Job Role</CardTitle>
            <CardDescription className="text-blue-600">
              Specify the job role you're interested in to generate personalized career path options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label htmlFor="jobRole" className="text-blue-700 font-medium">Job Role</Label>
              <div className="flex gap-4 mt-1.5">
                <Input
                  id="jobRole"
                  placeholder="e.g., Software Developer, Data Scientist, UX Designer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
                <Button 
                  onClick={generatePaths} 
                  disabled={isLoading || !jobRole.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Career Paths
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Path Visualization */}
        <Card className="border border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle className="text-blue-800">Your Career Path Options</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={generatePaths} disabled={isLoading || !jobRole.trim()} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Regenerate Paths
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCareerPath} disabled={!careerPaths} className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  <Download className="mr-2 h-4 w-4" />
                  Save Roadmap
                </Button>
              </div>
            </div>
            <CardDescription className="text-blue-600">
              Explore three potential career paths based on your desired job role
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center">
                <div className="h-16 w-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-600">Analyzing your career options...</p>
              </div>
            ) : careerPaths ? (
              <>
                <Tabs defaultValue="ambitious" className="w-full" onValueChange={(value) => {
                  setActivePathIndex(value === "ambitious" ? 0 : value === "skills" ? 1 : 2);
                  setSelectedRole(null);
                }}>
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-blue-50">
                    <TabsTrigger value="ambitious" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <Box className="h-4 w-4" />
                      <span className="hidden sm:inline">Leadership Track</span>
                      <span className="sm:hidden">Leadership</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <Brain className="h-4 w-4" />
                      <span className="hidden sm:inline">Technical Path</span>
                      <span className="sm:hidden">Technical</span>
                    </TabsTrigger>
                    <TabsTrigger value="balanced" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">Balanced Growth</span>
                      <span className="sm:hidden">Balanced</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="ambitious" className="m-0">
                    <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm text-blue-700">
                        {careerPaths[0].description}
                      </p>
                    </div>
                    <div className="h-[400px] lg:h-[500px] mb-4 border border-blue-200 rounded-md overflow-hidden bg-gradient-to-b from-blue-50 to-white">
                      <CareerPathVisualization 
                        path={careerPaths[0]} 
                        onRoleSelect={handleRoleSelect}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="skills" className="m-0">
                    <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm text-blue-700">
                        {careerPaths[1].description}
                      </p>
                    </div>
                    <div className="h-[400px] lg:h-[500px] mb-4 border border-blue-200 rounded-md overflow-hidden bg-gradient-to-b from-blue-50 to-white">
                      <CareerPathVisualization 
                        path={careerPaths[1]} 
                        onRoleSelect={handleRoleSelect}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="balanced" className="m-0">
                    <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm text-blue-700">
                        {careerPaths[2].description}
                      </p>
                    </div>
                    <div className="h-[400px] lg:h-[500px] mb-4 border border-blue-200 rounded-md overflow-hidden bg-gradient-to-b from-blue-50 to-white">
                      <CareerPathVisualization 
                        path={careerPaths[2]} 
                        onRoleSelect={handleRoleSelect}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center">
                <Info className="h-12 w-12 text-blue-400 mb-4" />
                <p className="text-blue-600">Enter a job role and generate career paths</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Details Card - shown when a role is selected */}
        {selectedRole && (
          <RoleDetails role={selectedRole} />
        )}

        {/* Feature Information */}
        <Card className="border border-blue-100 shadow-lg bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="text-lg text-blue-800">About Career Path Simulator™</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-blue-600">
              This AI-powered feature analyzes your desired job role to predict potential career trajectories. 
              It generates three different paths: an ambitious leadership route, a skills-focused technical path, 
              and a balanced path that prioritizes steady growth with work-life balance.
            </p>
          </CardContent>
          <CardFooter className="border-t border-blue-100 pt-4 flex justify-between flex-wrap gap-4">
            <p className="text-xs text-blue-500">
              <Info className="h-3 w-3 inline mr-1" />
              Results are based on current market trends and may vary based on industry changes
            </p>
            <Button variant="link" size="sm" onClick={() => navigate("/builder")} className="p-0 text-purple-600 hover:text-purple-700">
              Create a resume to apply for these roles
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default CareerPathSimulator;
