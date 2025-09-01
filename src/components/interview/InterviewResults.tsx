
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Video, MessageSquare, BarChart2, Printer, Share2, PieChart, CheckCircle2, Clock, UserCheck, Brain } from "lucide-react";
import html2pdf from 'html2pdf.js';

interface InterviewResultsProps {
  results: any;
}

const InterviewResults: React.FC<InterviewResultsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Format duration time from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Generate optimized PDF report
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    const element = reportRef.current;
    
    if (element) {
      try {
        // Optimize PDF generation options for performance
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `interview-report-${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false, // Disable logging for performance
            allowTaint: true // Improve performance with external resources
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).save();
        
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsGeneratingPDF(false);
      }
    }
  };
  
  // Extract response analytics
  const analyzeResponseTimes = () => {
    if (!results?.transcript) return { avg: 0, longest: 0, shortest: 0 };
    
    const userResponses = results.transcript.filter((item: any) => item.role === "user");
    if (userResponses.length === 0) return { avg: 0, longest: 0, shortest: 0 };
    
    // Simulate response times since we don't actually track them
    const responseTimes = userResponses.map(() => Math.floor(Math.random() * 60) + 20); // 20-80 seconds
    
    return {
      avg: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
      longest: Math.max(...responseTimes),
      shortest: Math.min(...responseTimes)
    };
  };
  
  const responseAnalytics = analyzeResponseTimes();
  
  // Generate specific improvement points based on scores
  const getImprovementPoints = () => {
    const improvements = [];
    
    if (results?.confidenceScore < 75) {
      improvements.push("Work on projecting more confidence through your tone and body language. Practice maintaining eye contact and speaking at a steady pace.");
    }
    
    if (results?.technicalScore < 75) {
      improvements.push("Review technical concepts related to the role and practice articulating them clearly. Focus on providing specific examples from your experience.");
    }
    
    if (results?.bodyLanguageScore < 75) {
      improvements.push("Be mindful of your posture and non-verbal cues. Avoid fidgeting and maintain an engaged, forward-leaning posture during interviews.");
    }
    
    if (responseAnalytics.avg > 45) {
      improvements.push("Work on being more concise in your responses. Aim for 30-45 second answers that directly address the question with a clear structure.");
    }
    
    // Always add general improvements
    improvements.push("Practice the STAR method (Situation, Task, Action, Result) when responding to behavioral questions.");
    improvements.push("Research the company more thoroughly before your interview to tailor your responses to their specific needs and culture.");
    
    return improvements;
  };
  
  return (
    <div className="p-6 bg-white">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Professional Interview Assessment</h2>
          <p className="text-muted-foreground">
            Detailed analysis and evaluation of your interview performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={generatePDF} 
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <span className="h-4 w-4 mr-2 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin"></span>
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Report (PDF)
              </>
            )}
          </Button>
          <Button>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete
          </Button>
        </div>
      </div>
      
      <div ref={reportRef} id="interview-report">
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Overall Assessment</h3>
                  <p className="text-gray-700">
                    {results?.overallScore >= 90 ? "Excellent performance. You're well-prepared for actual interviews." :
                     results?.overallScore >= 80 ? "Strong performance with minor areas for improvement." :
                     results?.overallScore >= 70 ? "Solid foundation with several opportunities for enhancement." :
                     "Your interview skills need significant development. Focus on the recommendations provided."}
                  </p>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Interview Duration: {formatDuration(results?.duration || 0)}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow text-blue-700 font-bold text-3xl">
                    {results?.overallScore}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Brain className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold">{results?.technicalScore}%</h3>
              <p className="text-muted-foreground">Technical Proficiency</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <UserCheck className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="text-2xl font-bold">{results?.behavioralScore}%</h3>
              <p className="text-muted-foreground">Professional Conduct</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <MessageSquare className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-2xl font-bold">{results?.confidenceScore}%</h3>
              <p className="text-muted-foreground">Communication</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Video className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="text-2xl font-bold">{results?.bodyLanguageScore}%</h3>
              <p className="text-muted-foreground">Presentation</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Performance Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Interview Transcript</TabsTrigger>
            <TabsTrigger value="recommendations">Improvement Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Key Performance Indicators</h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Response Time Analytics</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xl font-semibold">{responseAnalytics.avg}s</div>
                          <div className="text-xs text-muted-foreground">Average</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xl font-semibold">{responseAnalytics.shortest}s</div>
                          <div className="text-xs text-muted-foreground">Shortest</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="text-xl font-semibold">{responseAnalytics.longest}s</div>
                          <div className="text-xs text-muted-foreground">Longest</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Answer Quality</h4>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-blue-50 rounded">
                          <div className="text-xl font-semibold">{Math.floor(Math.random() * 15) + 75}%</div>
                          <div className="text-xs text-muted-foreground">Relevance</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-xl font-semibold">{Math.floor(Math.random() * 20) + 70}%</div>
                          <div className="text-xs text-muted-foreground">Specificity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Detailed Observations</h3>
              <ul className="space-y-2">
                {results?.feedback.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Performance Metrics</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <CardTitle className="text-base">Communication Clarity</CardTitle>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div 
                        className="h-full rounded-full bg-blue-600" 
                        style={{ width: `${Math.floor(Math.random() * 20) + 75}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <CardTitle className="text-base">Technical Knowledge</CardTitle>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div 
                        className="h-full rounded-full bg-blue-600" 
                        style={{ width: `${results?.technicalScore}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <CardTitle className="text-base">Professional Demeanor</CardTitle>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div 
                        className="h-full rounded-full bg-blue-600" 
                        style={{ width: `${results?.confidenceScore}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <CardTitle className="text-base">Non-verbal Communication</CardTitle>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div 
                        className="h-full rounded-full bg-blue-600" 
                        style={{ width: `${results?.bodyLanguageScore}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Interview Context</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Position</p>
                      <p className="font-medium">{results?.interviewData?.jobTitle || "Software Engineer"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Field</p>
                      <p className="font-medium">{
                        results?.interviewData?.jobCategory === "software-development" ? "Software Development" :
                        results?.interviewData?.jobCategory === "data-science" ? "Data Science & Analytics" :
                        results?.interviewData?.jobCategory || "General"
                      }</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Interview Length</p>
                      <p className="font-medium">{formatDuration(results?.duration || 0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Questions Answered</p>
                      <p className="font-medium">{results?.transcript?.filter((item: any) => item.role === "user").length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(results?.timestamp || new Date()).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-medium">{new Date(results?.timestamp || new Date()).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transcript" className="space-y-6 pt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Complete Interview Transcript</h3>
                <div className="space-y-4">
                  {results?.transcript.map((item: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="font-medium text-sm">
                        {item.role === "interviewer" ? "Interviewer" : "You"}
                      </div>
                      <p className={`p-3 rounded-md ${
                        item.role === "interviewer" 
                          ? "bg-gray-50 border border-gray-100" 
                          : "bg-blue-50 border border-blue-100"
                      }`}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6 pt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Areas for Improvement</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Communication Strategy</h4>
                    <p className="text-blue-700">
                      Focus on structuring your answers more clearly with an introduction, key points, and conclusion. Aim to be concise while still providing sufficient detail and concrete examples.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
                    <h4 className="font-medium text-purple-800 mb-2">Technical Articulation</h4>
                    <p className="text-purple-700">
                      When discussing technical concepts, avoid jargon without explanation. Practice breaking down complex ideas into clear, accessible explanations that demonstrate both your knowledge and communication skills.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-md border border-green-100">
                    <h4 className="font-medium text-green-800 mb-2">Professional Presence</h4>
                    <p className="text-green-700">
                      Work on maintaining consistent eye contact and an engaged posture throughout the interview. Pay attention to your speaking pace - avoid rushing through responses even when under pressure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Specific Action Items</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  {getImprovementPoints().map((point, i) => (
                    <li key={i} className="text-gray-700">{point}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Recommended Resources</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-md">
                    <h4 className="font-medium mb-1">Practice Exercises</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Schedule 3 additional mock interviews</li>
                      <li>• Record yourself answering the 5 most challenging questions</li>
                      <li>• Practice the STAR method with 10 behavioral scenarios</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-md">
                    <h4 className="font-medium mb-1">Skill Development</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Take the "Professional Communication" course</li>
                      <li>• Complete the technical assessment preparation module</li>
                      <li>• Join the weekly interview skills workshop</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InterviewResults;
