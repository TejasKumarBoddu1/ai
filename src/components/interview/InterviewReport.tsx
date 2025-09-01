
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Video, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import VideoRecorder from './VideoRecorder';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement,
  RadialLinearScale,
  Tooltip as ChartTooltip, 
  Legend 
} from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  ArcElement,
  RadialLinearScale,
  ChartTooltip, 
  Legend
);

interface InterviewReportProps {
  data: {
    jobRole: string;
    company: string;
    difficulty: string;
    duration: number;
    questions: string[];
    answers: string[];
    recordedVideos?: {
      questionIndex: number;
      videoUrl: string;
    }[];
    scores: {
      confidence: number;
      eyeContact: number;
      voiceClarity: number;
      tonePacing: number;
      contentRelevance: number;
      bodyLanguage: number;
      accent: number;
      consistency: number;
      overall: number;
    };
    improvements: string[];
    strengths: string[];
  };
}

const InterviewReport: React.FC<InterviewReportProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  
  // Format duration from seconds to minutes:seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Generate chart data for metrics
  const scoreChartData = useMemo(() => {
    return {
      labels: ['Confidence', 'Eye Contact', 'Voice Clarity', 'Tone & Pacing', 'Content Relevance', 'Body Language', 'Accent', 'Consistency', 'Overall'],
      datasets: [
        {
          label: 'Your Performance',
          data: [
            data.scores.confidence,
            data.scores.eyeContact,
            data.scores.voiceClarity,
            data.scores.tonePacing,
            data.scores.contentRelevance || 75,
            data.scores.bodyLanguage || 70,
            data.scores.accent || 80,
            data.scores.consistency || 85,
            data.scores.overall
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 205, 235, 0.6)',
            'rgba(155, 99, 132, 0.6)',
            'rgba(255, 99, 164, 0.6)',
            'rgba(45, 210, 142, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 205, 235, 1)',
            'rgba(155, 99, 132, 1)',
            'rgba(255, 99, 164, 1)',
            'rgba(45, 210, 142, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [data.scores]);
  
  // Generate pie chart data for overall skill breakdown
  const pieChartData = useMemo(() => {
    return {
      labels: ['Confidence', 'Eye Contact', 'Voice Clarity', 'Tone & Pacing', 'Content Relevance', 'Body Language'],
      datasets: [
        {
          data: [
            data.scores.confidence,
            data.scores.eyeContact,
            data.scores.voiceClarity,
            data.scores.tonePacing,
            data.scores.contentRelevance || 75,
            data.scores.bodyLanguage || 70
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 205, 235, 0.6)',
            'rgba(155, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 205, 235, 1)',
            'rgba(155, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [data.scores]);
  
  // Generate radar chart data
  const radarChartData = useMemo(() => {
    return {
      labels: ['Communication', 'Confidence', 'Body Language', 'Content Relevance', 'Voice Clarity', 'Consistency', 'Eye Contact', 'Overall Impression'],
      datasets: [
        {
          label: 'Performance',
          data: [
            (data.scores.voiceClarity + data.scores.tonePacing) / 2,
            data.scores.confidence,
            data.scores.bodyLanguage || 70,
            data.scores.contentRelevance || 75,
            data.scores.voiceClarity,
            data.scores.consistency || 85,
            data.scores.eyeContact,
            data.scores.overall
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }
      ]
    };
  }, [data.scores]);
  
  // Get score rating text
  const getScoreRating = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Satisfactory";
    if (score >= 50) return "Fair";
    return "Needs Improvement";
  };
  
  // Get color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  
  // Generate PDF report
  const generatePDF = () => {
    // In a real implementation, this would use a library like jsPDF to generate a PDF
    alert("In a real implementation, this would download a PDF report of your interview results");
  };

  // Get video for specific question
  const getVideoForQuestion = (questionIndex: number) => {
    if (!data.recordedVideos) return null;
    return data.recordedVideos.find(v => v.questionIndex === questionIndex);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-primary-foreground border-0 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div>
              <CardTitle className="text-2xl">Interview Performance Report</CardTitle>
              <CardDescription className="text-base">
                {data.jobRole} position at {data.company}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {data.difficulty === 'easy' ? 'Introductory' : data.difficulty === 'hard' ? 'Advanced' : 'Standard'} Interview
              </Badge>
              <Badge variant="outline">Duration: {formatDuration(data.duration)}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full">
              <BarChart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Overall Score: {data.scores.overall}%</h3>
              <p className={`font-medium ${getScoreColorClass(data.scores.overall)}`}>
                {getScoreRating(data.scores.overall)}
              </p>
            </div>
            <div className="ml-auto">
              <Button onClick={generatePDF}>
                Download Report PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="recordings">Video Recordings</TabsTrigger>
          <TabsTrigger value="questions">Questions & Answers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Confidence</span>
                    <span className={getScoreColorClass(data.scores.confidence)}>
                      {data.scores.confidence}% ({getScoreRating(data.scores.confidence)})
                    </span>
                  </div>
                  <Progress value={data.scores.confidence} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Eye Contact</span>
                    <span className={getScoreColorClass(data.scores.eyeContact)}>
                      {data.scores.eyeContact}% ({getScoreRating(data.scores.eyeContact)})
                    </span>
                  </div>
                  <Progress value={data.scores.eyeContact} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Voice Clarity</span>
                    <span className={getScoreColorClass(data.scores.voiceClarity)}>
                      {data.scores.voiceClarity}% ({getScoreRating(data.scores.voiceClarity)})
                    </span>
                  </div>
                  <Progress value={data.scores.voiceClarity} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Tone & Pacing</span>
                    <span className={getScoreColorClass(data.scores.tonePacing)}>
                      {data.scores.tonePacing}% ({getScoreRating(data.scores.tonePacing)})
                    </span>
                  </div>
                  <Progress value={data.scores.tonePacing} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Content Relevance</span>
                    <span className={getScoreColorClass(data.scores.contentRelevance || 75)}>
                      {data.scores.contentRelevance || 75}% ({getScoreRating(data.scores.contentRelevance || 75)})
                    </span>
                  </div>
                  <Progress value={data.scores.contentRelevance || 75} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Body Language</span>
                    <span className={getScoreColorClass(data.scores.bodyLanguage || 70)}>
                      {data.scores.bodyLanguage || 70}% ({getScoreRating(data.scores.bodyLanguage || 70)})
                    </span>
                  </div>
                  <Progress value={data.scores.bodyLanguage || 70} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skill Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div style={{ width: '100%', height: 250 }}>
                  <Pie 
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Radar</CardTitle>
              <CardDescription>Comprehensive view of your interview performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <Radar 
                  data={radarChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.improvements.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-red-500 dark:text-red-400">•</span> 
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.strengths.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-green-500 dark:text-green-400">•</span> 
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>
                Comprehensive analysis of your interview performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar 
                  data={scoreChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="font-semibold mb-4">Confidence Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <p>Your confidence level was measured at {data.scores.confidence}%, which is {getScoreRating(data.scores.confidence).toLowerCase()}. This is based on analysis of your posture, voice steadiness, and answer delivery.</p>
                    
                    <h4 className="font-medium mt-3">Tips to Improve:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Practice power posing before interviews</li>
                      <li>Maintain good posture throughout the conversation</li>
                      <li>Use deliberate pauses instead of filler words</li>
                      <li>Record yourself answering common questions</li>
                      <li>Focus on speaking at a measured pace</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Communication Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <p>Your voice clarity scored {data.scores.voiceClarity}% and tone/pacing at {data.scores.tonePacing}%. This evaluation is based on speech clarity, word choice, pacing, and vocal variety.</p>
                    
                    <h4 className="font-medium mt-3">Tips to Improve:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Vary your tone to emphasize key points</li>
                      <li>Practice enunciating clearly, especially technical terms</li>
                      <li>Record yourself and listen for filler words</li>
                      <li>Slow down when explaining complex concepts</li>
                      <li>Use strategic pauses to gather thoughts</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Eye Contact Analysis</h3>
                <div className="space-y-2 text-sm">
                  <p>Your eye contact score was {data.scores.eyeContact}%, which is {getScoreRating(data.scores.eyeContact).toLowerCase()}. Consistent eye contact with the camera demonstrates confidence and engagement during a video interview.</p>
                  
                  <h4 className="font-medium mt-3">Tips to Improve:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Place a small sticker near your webcam as a reminder</li>
                    <li>Position your camera at eye level</li>
                    <li>Practice looking directly at the camera during mock interviews</li>
                    <li>Reduce distractions in your environment</li>
                    <li>Take brief notes rather than reading from a script</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Content Relevance Analysis</h3>
                <div className="space-y-2 text-sm">
                  <p>Your content relevance score was {data.scores.contentRelevance || 75}%. This measures how well your answers addressed the specific questions asked and provided relevant examples.</p>
                  
                  <h4 className="font-medium mt-3">Tips to Improve:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Listen carefully to the full question before answering</li>
                    <li>Structure answers using the STAR method (Situation, Task, Action, Result)</li>
                    <li>Prepare examples that demonstrate relevant skills</li>
                    <li>Connect your experiences directly to the job requirements</li>
                    <li>Practice concise, focused responses that address the core question</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recordings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Video Recordings</CardTitle>
              <CardDescription>
                Review your recorded interview responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.recordedVideos && data.recordedVideos.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {data.recordedVideos.map((recording, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="p-3 bg-muted flex justify-between items-center">
                          <h4 className="font-medium">Response {recording.questionIndex + 1}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedVideoIndex(recording.questionIndex)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-medium mb-2">Question:</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            {data.questions[recording.questionIndex]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedVideoIndex !== null && (
                    <div className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Your Response to Question {selectedVideoIndex + 1}
                          </CardTitle>
                          <CardDescription>
                            {data.questions[selectedVideoIndex]}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[400px] bg-gray-100 rounded-md overflow-hidden">
                            <VideoRecorder
                              isActive={false}
                              onVideoRecorded={() => {}}
                              videoURL={getVideoForQuestion(selectedVideoIndex)?.videoUrl}
                              isPlaybackOnly={true}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No video recordings available for this interview session.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Questions & Answers</CardTitle>
              <CardDescription>
                Review all interview questions and your responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-md flex items-center gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      {question}
                    </h3>
                    <div className="pl-8">
                      <p className="text-sm text-muted-foreground">Your answer:</p>
                      <div className="bg-muted p-3 rounded mt-1">
                        {data.answers[index] ? (
                          <p className="text-sm">{data.answers[index]}</p>
                        ) : (
                          <p className="text-sm italic">No recorded answer</p>
                        )}
                      </div>
                      
                      <div className="mt-3 p-3 border rounded-md">
                        <p className="text-sm font-medium">AI Feedback:</p>
                        <p className="text-sm mt-1">
                          {index % 2 === 0 ? 
                            "Good structure and clear points. Consider adding more specific examples to strengthen your answer." :
                            "Well articulated response. Try to be more concise and focus on measurable results from your experiences."
                          }
                        </p>
                      </div>

                      {getVideoForQuestion(index) && (
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center"
                            onClick={() => setSelectedVideoIndex(index)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            View Video Response
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {index < data.questions.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Start New Interview
        </Button>
        <Button onClick={generatePDF}>
          Download Full Report (PDF)
        </Button>
      </div>
    </div>
  );
};

export default InterviewReport;
