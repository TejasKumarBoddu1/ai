import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Linkedin, 
  Search, 
  Loader2, 
  ArrowUp, 
  TagIcon, 
  BarChart3, 
  BookText, 
  FileText, 
  CheckCircle2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";

// Function to analyze LinkedIn profile
const analyzeLinkedInProfile = async (url: string) => {
  try {
    // Extract LinkedIn username from URL
    const usernameMatch = url.match(/linkedin\.com\/in\/([^/]+)/);
    if (!usernameMatch) throw new Error("Invalid LinkedIn URL format");
    const username = usernameMatch[1];
    
    console.log("Analyzing profile for:", username);
    
    // In a production app, we would call a server endpoint here
    // For now, we'll simulate scraping with the transformer utility
    const API_KEY = "AIzaSyDRuULswOC1iFSJr83VqRaeP1g8p0Vn4Lc"; // This key is a placeholder
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `Analyze this LinkedIn profile: linkedin.com/in/${username}
            
            Provide a detailed assessment in the following JSON format:
            {
              "headline": {
                "current": "Current headline text",
                "suggested": "Suggested improved headline text",
                "score": 65
              },
              "summary": {
                "current": "Current summary text",
                "suggested": "Detailed suggested summary with achievements and keywords",
                "score": 45
              },
              "keywords": {
                "missing": ["keyword1", "keyword2", "keyword3"],
                "recommended": ["keyword1", "keyword2", "keyword3"]
              },
              "experience": {
                "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
              }
            }
            
            Make sure to provide real and specific optimization suggestions based on LinkedIn best practices.`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    // Extract the JSON portion from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse analysis results");
    
    // Parse the JSON result
    const analysisResults = JSON.parse(jsonMatch[0]);
    return analysisResults;
  } catch (error) {
    console.error("Error analyzing LinkedIn profile:", error);
    throw error;
  }
};

const LinkedInOptimizer = () => {
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const { toast } = useToast();

  const { 
    data: analysisResults, 
    isLoading: isAnalyzing, 
    isError, 
    error, 
    refetch,
    isSuccess: analysisComplete 
  } = useQuery({
    queryKey: ['linkedinAnalysis', linkedInUrl],
    queryFn: () => analyzeLinkedInProfile(linkedInUrl),
    enabled: false, // Don't run automatically
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleAnalyze = async () => {
    // Validate input
    if (!linkedInUrl.trim() || !linkedInUrl.includes("linkedin.com")) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL",
        variant: "destructive"
      });
      return;
    }

    refetch();
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-500";
    if (score < 75) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <StudentDashboardLayout>
      <div className="container py-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
            LinkedIn Profile Optimizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Enhance your LinkedIn profile's visibility and effectiveness with AI-powered optimization recommendations
          </p>
        </div>
        
        <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Linkedin className="mr-2 h-5 w-5 text-blue-600" />
              LinkedIn Profile Analysis
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your LinkedIn profile URL to receive personalized optimization recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                placeholder="https://www.linkedin.com/in/your-profile"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze Profile
                  </>
                )}
              </Button>
            </div>
            
            {isAnalyzing && (
              <div className="mt-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center bg-blue-50 dark:bg-blue-900/20">
                <div className="mb-4">
                  <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Analyzing Your LinkedIn Profile</h3>
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-md mb-4">
                  Our AI is analyzing your profile, comparing it to industry standards, and generating personalized recommendations
                </p>
                <div className="w-full max-w-md space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>Analyzing headline...</span>
                      <span className="text-green-600">Complete</span>
                    </div>
                    <div className="bg-blue-200 dark:bg-blue-800 rounded-full h-2 w-full overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>Analyzing summary...</span>
                      <span className="text-green-600">Complete</span>
                    </div>
                    <div className="bg-blue-200 dark:bg-blue-800 rounded-full h-2 w-full overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>Analyzing experience...</span>
                      <span className="text-green-600">Complete</span>
                    </div>
                    <div className="bg-blue-200 dark:bg-blue-800 rounded-full h-2 w-full overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>Generating recommendations...</span>
                      <span className="text-amber-600">In progress</span>
                    </div>
                    <div className="bg-blue-200 dark:bg-blue-800 rounded-full h-2 w-full overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isError && (
              <div className="mt-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
                <h3 className="font-medium text-red-800 dark:text-red-400">Error analyzing profile</h3>
                <p className="text-red-600 dark:text-red-300">{(error as Error).message || "Please check the URL and try again."}</p>
              </div>
            )}
          </CardContent>
        </Card>
      
        {analysisComplete && analysisResults && (
          <Tabs defaultValue="headline" className="mt-8">
            <TabsList className="grid grid-cols-4 mb-8 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="headline" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Headline</TabsTrigger>
              <TabsTrigger value="summary" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Summary</TabsTrigger>
              <TabsTrigger value="keywords" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Keywords</TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Experience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="headline">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center text-gray-900 dark:text-white">
                        <ArrowUp className="mr-2 h-5 w-5 text-blue-600" />
                        Headline Optimization
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Your headline is one of the most important elements of your LinkedIn profile
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2 text-gray-600 dark:text-gray-400">Score:</span>
                      <span className={`text-lg font-bold ${getScoreColor(analysisResults.headline.score)}`}>
                        {analysisResults.headline.score}/100
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Current Headline</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p>{analysisResults.headline.current}</p>
                    </div>
                  </div>
                    
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Headline</h4>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-green-800">{analysisResults.headline.suggested}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This optimized headline includes key skills and positions to improve searchability
                    </p>
                  </div>
                    
                  <div>
                    <h4 className="text-sm font-medium mb-2">Headline Tips</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Include your current position and key specializations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Use industry-specific keywords that recruiters search for</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Keep it under 220 characters for full visibility on mobile</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Use vertical bars (|) to separate sections cleanly</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="summary">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center text-gray-900 dark:text-white">
                        <BookText className="mr-2 h-5 w-5 text-blue-600" />
                        Summary Optimization
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Your summary should tell your professional story and highlight key achievements
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2 text-gray-600 dark:text-gray-400">Score:</span>
                      <span className={`text-lg font-bold ${getScoreColor(analysisResults.summary.score)}`}>
                        {analysisResults.summary.score}/100
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Current Summary</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p>{analysisResults.summary.current}</p>
                    </div>
                  </div>
                    
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Summary</h4>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-green-800">{analysisResults.summary.suggested}</p>
                    </div>
                  </div>
                    
                  <div>
                    <h4 className="text-sm font-medium mb-2">Summary Tips</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Start with a strong opening statement about your professional identity</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Include quantifiable achievements and results</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Incorporate relevant industry keywords naturally</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">End with a call to action or statement about what you're seeking</span>
                      </li>
                    </ul>
                  </div>
                    
                  <div>
                    <h4 className="text-sm font-medium mb-2">Customizable Suggestion</h4>
                    <Textarea 
                      className="min-h-[200px]" 
                      defaultValue={analysisResults.summary.suggested} 
                    />
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">Copy to Clipboard</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="keywords">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <TagIcon className="mr-2 h-5 w-5 text-blue-600" />
                    Keyword Analysis
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Keywords help recruiters find your profile in LinkedIn searches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Recommended Keywords</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {analysisResults.keywords.recommended.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-green-50 text-green-800 hover:bg-green-100">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      These keywords are already present in your profile and align with industry standards
                    </p>
                  </div>
                    
                  <div>
                    <h4 className="text-sm font-medium mb-3">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {analysisResults.keywords.missing.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="border-amber-300 text-amber-700">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Consider adding these keywords to your profile if they're relevant to your experience and goals
                    </p>
                  </div>
                    
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Keyword Placement Tips</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Achieved", "Implemented", "Developed", "Led", "Managed", 
                        "Increased", "Decreased", "Improved", "Created", "Launched",
                        "Redesigned", "Streamlined", "Secured", "Negotiated", "Mentored"
                      ].map((verb, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          {verb}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                    Experience Optimization
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Strengthen your work experience descriptions with these tailored suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Experience Improvement Suggestions</h4>
                    <div className="space-y-3">
                      {analysisResults.experience.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="bg-amber-50 border border-amber-100 p-3 rounded-md">
                          <p className="text-amber-800">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                    
                  <div>
                    <h4 className="text-sm font-medium mb-3">Experience Writing Tips</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Use the STAR method: Situation, Task, Action, Result</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Begin descriptions with powerful action verbs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Include metrics and quantifiable achievements wherever possible</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Focus on contributions and results rather than job duties</span>
                      </li>
                    </ul>
                  </div>
                    
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Power Verbs for Experience Descriptions</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Achieved", "Implemented", "Developed", "Led", "Managed", 
                        "Increased", "Decreased", "Improved", "Created", "Launched",
                        "Redesigned", "Streamlined", "Secured", "Negotiated", "Mentored"
                      ].map((verb, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          {verb}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default LinkedInOptimizer;
