import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileTextIcon, 
  LinkedinIcon, 
  GithubIcon, 
  SparklesIcon, 
  HeartIcon, 
  BriefcaseIcon,
  SaveIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AlertTriangleIcon
} from "lucide-react";
import { generateQwiXProContent, getLayoffToolkitMockData } from "@/utils/qwixProApi";
import { toast } from "@/components/ui/use-toast";

interface ReadinessResult {
  emergencyResume: {
    professionalSummary: string;
    keyAchievements: string[];
    skillsHighlight: string[];
  };
  highDemandRoles: {
    title: string;
    relevanceScore: number;
    description: string;
  }[];
  linkedinImprovements: string[];
  githubImprovements: string[];
  motivationalMessage: string;
}

const AILayoffReadinessToolkit = () => {
  const [currentRole, setCurrentRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReadinessResult | null>(null);

  const generateReadinessKit = async () => {
    if (!currentRole || !skills) {
      toast({
        title: "Missing information",
        description: "Please enter your current role and skills",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `
        Create an "AI Layoff Readiness Toolkit" for someone with the following details:
        - Current role: ${currentRole}
        - Skills: ${skills}
        - Professional experience: ${experience}
        
        Format your response as a JSON object with the following structure:
        {
          "emergencyResume": {
            "professionalSummary": "A concise professional summary highlighting transferable skills and core value proposition",
            "keyAchievements": ["Achievement 1", "Achievement 2", ...],
            "skillsHighlight": ["Skill 1", "Skill 2", ...]
          },
          "highDemandRoles": [
            {
              "title": "Job title 1",
              "relevanceScore": (number from 1-100),
              "description": "Brief description of how current skills align with this role"
            },
            ... (4 more roles)
          ],
          "linkedinImprovements": ["Improvement 1", "Improvement 2", ...],
          "githubImprovements": ["Improvement 1", "Improvement 2", ...],
          "motivationalMessage": "A personalized motivational message"
        }
        
        Make it practical, actionable, and genuinely helpful for someone who needs to quickly pivot after an unexpected layoff.
      `;

      try {
        // Try to use the API with the layoff-specific API key
        const response = await generateQwiXProContent(prompt, 'layoff');
        
        // Extract the JSON object from the response
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                          response.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const cleanedJson = jsonMatch[0].replace(/```json|```/g, '').trim();
          const parsedResult = JSON.parse(cleanedJson);
          setResult(parsedResult);
        } else {
          throw new Error("Could not parse the response");
        }
      } catch (error) {
        console.error("API call failed, using mock data instead:", error);
        
        // Use mock data as fallback
        toast({
          title: "Using toolkit fallback",
          description: "We couldn't connect to our AI service, so we're showing you a simulated example.",
          variant: "default"
        });
        
        // Get mock data and parse it
        const mockDataJson = getLayoffToolkitMockData(currentRole, skills);
        const parsedResult = JSON.parse(mockDataJson);
        setResult(parsedResult);
      }
    } catch (error) {
      console.error("Error generating readiness toolkit:", error);
      toast({
        title: "Error",
        description: "Failed to generate layoff readiness toolkit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-modern-blue-500 to-soft-purple">
            AI Layoff Readiness Toolkit
          </span>
        </h1>
        <p className="text-gray-600 mb-8">
          Be prepared for unexpected career transitions with AI-powered guidance
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Build Your Toolkit</CardTitle>
              <CardDescription>
                Enter your professional information to generate your personalized layoff readiness kit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Current Role*
                </label>
                <Input 
                  placeholder="e.g. Software Engineer, Marketing Manager" 
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Key Skills*
                </label>
                <Textarea 
                  placeholder="List your most important technical and soft skills" 
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Professional Experience (Optional)
                </label>
                <Textarea 
                  placeholder="Brief summary of your work experience" 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={generateReadinessKit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">○</span> 
                    Generating Toolkit...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="mr-2 h-4 w-4" /> 
                    Generate Readiness Kit
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Readiness Kit Results */}
          <div className="md:col-span-2">
            {result ? (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Your Layoff Readiness Toolkit</CardTitle>
                  <CardDescription>
                    Use these resources to quickly pivot and land on your feet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="resume">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="resume">
                        <FileTextIcon className="h-4 w-4 mr-2" /> Emergency Resume
                      </TabsTrigger>
                      <TabsTrigger value="jobs">
                        <BriefcaseIcon className="h-4 w-4 mr-2" /> High-Demand Jobs
                      </TabsTrigger>
                      <TabsTrigger value="profiles">
                        <LinkedinIcon className="h-4 w-4 mr-2" /> Profile Improvements
                      </TabsTrigger>
                      <TabsTrigger value="motivation">
                        <HeartIcon className="h-4 w-4 mr-2" /> Motivation
                      </TabsTrigger>
                    </TabsList>
                  
                    <TabsContent value="resume" className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-modern-blue-600">
                            <FileTextIcon className="h-5 w-5 mr-2" />
                            <h3 className="font-medium">Professional Summary</h3>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8">
                            <SaveIcon className="h-4 w-4 mr-1" /> Save
                          </Button>
                        </div>
                        
                        <p className="text-gray-700">{result.emergencyResume.professionalSummary}</p>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center text-modern-blue-600 mb-2">
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">Key Achievements</h3>
                        </div>
                        
                        <ul className="space-y-2 mt-2">
                          {result.emergencyResume.keyAchievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-gray-700">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center text-modern-blue-600 mb-3">
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">Skills Highlight</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {result.emergencyResume.skillsHighlight.map((skill, i) => (
                            <span 
                              key={i} 
                              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="jobs">
                      <div className="space-y-4">
                        {result.highDemandRoles.map((role, i) => (
                          <div key={i} className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{role.title}</h3>
                              <span className="text-xs bg-modern-blue-100 text-modern-blue-800 px-2 py-1 rounded-full">
                                {role.relevanceScore}% Match
                              </span>
                            </div>
                            
                            <Progress 
                              value={role.relevanceScore} 
                              className="h-1.5 mb-3" 
                            />
                            
                            <p className="text-gray-600 text-sm">{role.description}</p>
                            
                            <div className="mt-3 text-right">
                              <Button variant="link" size="sm" className="h-8 p-0">
                                Find openings <ArrowRightIcon className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="profiles" className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex items-center text-modern-blue-600 mb-2">
                          <LinkedinIcon className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">LinkedIn Improvements</h3>
                        </div>
                        
                        <ul className="space-y-2 mt-3">
                          {result.linkedinImprovements.map((improvement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-modern-blue-500 shrink-0 mt-0.5" />
                              <span className="text-gray-700">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center text-modern-blue-600 mb-2">
                          <GithubIcon className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">GitHub Improvements</h3>
                        </div>
                        
                        <ul className="space-y-2 mt-3">
                          {result.githubImprovements.map((improvement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                              <span className="text-gray-700">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="motivation">
                      <div className="border rounded-md p-6">
                        <div className="flex justify-center mb-6">
                          <HeartIcon className="h-16 w-16 text-red-400" />
                        </div>
                        
                        <blockquote className="text-lg text-center italic text-gray-700 mb-6">
                          {result.motivationalMessage}
                        </blockquote>
                        
                        <div className="flex justify-center gap-4 mt-8">
                          <Button variant="outline">
                            <SaveIcon className="h-4 w-4 mr-2" /> Save Message
                          </Button>
                          <Button>
                            Download Complete Kit
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <BriefcaseIcon className="h-12 w-12 mb-4 mx-auto text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Prepare for the Unexpected</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Build your emergency toolkit to quickly pivot your career in case of an unexpected layoff.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setCurrentRole("Software Engineer");
                      setSkills("JavaScript, React, Node.js, TypeScript, Team Leadership");
                    }}
                  >
                    Try "Software Engineer" <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AILayoffReadinessToolkit;
