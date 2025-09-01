
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Book, 
  CheckCircle, 
  GraduationCap, 
  Lightbulb, 
  MapPin, 
  Search, 
  Star, 
  TrendingUp 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { LearningPathVisualizer } from "./LearningPathVisualizer";
import { generateSkillGapAnalysis } from "@/utils/skillGapAnalyzer";

export function SkillGapAnalyzer() {
  const { toast } = useToast();
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetJob, setTargetJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("analysis");

  const handleAnalyze = async () => {
    if (!currentSkills || !targetJob) {
      toast({
        title: "Missing information",
        description: "Please provide both your current skills and target job role.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateSkillGapAnalysis(currentSkills, targetJob);
      setAnalysis(result);
      setActiveTab("analysis");
      toast({
        title: "Analysis complete",
        description: "Your skill gap analysis and learning path are ready.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error generating your skill gap analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Skill Gap Analyzer</h1>
          <p className="text-muted-foreground">Analyze your skills and get a personalized learning path to your dream job</p>
        </div>
        <Badge 
          variant="outline" 
          className="bg-modern-blue-500/10 text-modern-blue-500 border-modern-blue-500/30 px-3 py-1"
        >
          <GraduationCap className="w-4 h-4 mr-1" /> QwixLearn
        </Badge>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Input Your Information</CardTitle>
          <CardDescription>
            Tell us about your current skills and the job role you're targeting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Current Skills</label>
            <Textarea 
              placeholder="List your current skills, separated by commas (e.g., JavaScript, React, TypeScript, Project Management...)"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              className="min-h-24"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include both technical and soft skills for better results
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Target Job Role</label>
            <Input 
              placeholder="Enter your target job role (e.g., Senior Frontend Developer)"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleAnalyze} 
            disabled={loading || !currentSkills || !targetJob}
            className="w-full"
          >
            {loading ? (
              <>
                <span className="mr-2">Analyzing...</span>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Skill Gap
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {analysis && (
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="analysis" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="analysis">Skill Gap Analysis</TabsTrigger>
            <TabsTrigger value="path">Learning Path</TabsTrigger>
            <TabsTrigger value="visualization">Visual Roadmap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-modern-blue-500" />
                  Skill Gap Analysis for {targetJob}
                </CardTitle>
                <CardDescription>
                  Based on your current skills and the requirements for your target role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Your Strengths
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.strengths.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-amber-500" />
                      Skills to Develop
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.gapSkills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
                      Career Insights
                    </h3>
                    <p className="text-sm text-muted-foreground">{analysis.analysis}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="path" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  Your Learning Path to {targetJob}
                </CardTitle>
                <CardDescription>
                  A structured learning path to acquire the skills needed for your target role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {analysis.learningPath.map((step: any, index: number) => (
                    <div key={index} className="relative pl-8 pb-8 border-l-2 border-gray-200 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className="absolute left-[-9px] top-0 bg-white dark:bg-slate-950 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center w-4 h-4">
                        <div className="w-2 h-2 rounded-full bg-modern-blue-500"></div>
                      </div>
                      <div className="mb-1 flex items-center">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <Badge className="ml-2 bg-modern-blue-500">{step.timeframe}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <div className="space-y-2">
                        {step.resources.map((resource: any, rIndex: number) => (
                          <a 
                            key={rIndex}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Book className="h-4 w-4 mr-2 text-modern-blue-500" />
                            <div>
                              <p className="text-sm font-medium">{resource.name}</p>
                              <p className="text-xs text-muted-foreground">{resource.type}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visualization">
            <Card>
              <CardHeader>
                <CardTitle>Visual Learning Path Roadmap</CardTitle>
                <CardDescription>
                  A visual representation of your learning journey to {targetJob}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <LearningPathVisualizer data={analysis.learningPath} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
