
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InterviewQuestion, InterviewFeedback } from "@/types/interview";

interface InterviewResultsModalProps {
  jobRole: string;
  questions: InterviewQuestion[];
  answers: string[];
  feedback: (InterviewFeedback | null)[];
  onClose: () => void;
  onDownloadReport: () => void;
}

export const InterviewResultsModal = ({
  jobRole,
  questions,
  answers,
  feedback,
  onClose,
  onDownloadReport
}: InterviewResultsModalProps) => {
  const [downloading, setDownloading] = useState(false);
  
  // Calculate overall scores
  const calculateOverallScore = (scoreType: keyof InterviewFeedback['scores']) => {
    const validFeedback = feedback.filter((f): f is InterviewFeedback => f !== null);
    if (validFeedback.length === 0) return 0;
    
    const sum = validFeedback.reduce((total, fb) => total + fb.scores[scoreType], 0);
    return Math.round(sum / validFeedback.length);
  };
  
  const overallScores = {
    relevance: calculateOverallScore('relevance'),
    clarity: calculateOverallScore('clarity'),
    depth: calculateOverallScore('depth')
  };
  
  const totalScore = Math.round((overallScores.relevance + overallScores.clarity + overallScores.depth) / 3);
  
  // Function to get strengths and areas to improve
  const getHighlights = () => {
    const validFeedback = feedback.filter((f): f is InterviewFeedback => f !== null);
    let strengths = new Set<string>();
    let improvements = new Set<string>();
    
    validFeedback.forEach(fb => {
      fb.strengths.split('. ').filter(s => s).forEach(s => strengths.add(s));
      fb.improvements.split('. ').filter(s => s).forEach(s => improvements.add(s));
    });
    
    return {
      strengths: Array.from(strengths).slice(0, 5),
      improvements: Array.from(improvements).slice(0, 5)
    };
  };
  
  const highlights = getHighlights();
  
  // Handle download
  const handleDownload = async () => {
    setDownloading(true);
    await onDownloadReport();
    setDownloading(false);
  };
  
  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Interview Results</DialogTitle>
          <DialogDescription>
            Your {jobRole} interview performance analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="summary">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="summary" className="flex-1">Performance Summary</TabsTrigger>
              <TabsTrigger value="questions" className="flex-1">Q&A Review</TabsTrigger>
            </TabsList>
            
            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6">
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">{totalScore}%</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 dark:text-gray-700"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className={`${totalScore >= 80 ? 'text-green-500' : totalScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                      strokeWidth="8"
                      strokeDasharray={`${totalScore * 2.64} ${(100 - totalScore) * 2.64}`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Relevance</p>
                  <p className={`text-xl font-bold ${getScoreColor(overallScores.relevance)}`}>
                    {overallScores.relevance}%
                  </p>
                  <Progress value={overallScores.relevance} className="h-1 mt-2" />
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Clarity</p>
                  <p className={`text-xl font-bold ${getScoreColor(overallScores.clarity)}`}>
                    {overallScores.clarity}%
                  </p>
                  <Progress value={overallScores.clarity} className="h-1 mt-2" />
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Technical Depth</p>
                  <p className={`text-xl font-bold ${getScoreColor(overallScores.depth)}`}>
                    {overallScores.depth}%
                  </p>
                  <Progress value={overallScores.depth} className="h-1 mt-2" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Strengths</h3>
                  <ul className="space-y-2">
                    {highlights.strengths.map((strength, index) => (
                      <li key={`strength-${index}`} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    {highlights.improvements.map((improvement, index) => (
                      <li key={`improvement-${index}`} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">⚠</span>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            {/* Question Review Tab */}
            <TabsContent value="questions" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {questions.map((question, index) => (
                  <AccordionItem key={`question-${index}`} value={`question-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div>
                        <span className="font-medium">{question.type}</span>
                        <p className="text-sm text-muted-foreground">{question.question}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Your Answer:</h4>
                        <p className="text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded">
                          {answers[index] || 'No answer provided'}
                        </p>
                      </div>
                      
                      {feedback[index] && (
                        <div className="border-t pt-3">
                          <h4 className="text-sm font-medium mb-2">Feedback:</h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium text-green-600">Strengths:</span>{" "}
                              {feedback[index]?.strengths}
                            </p>
                            <p>
                              <span className="font-medium text-red-600">Improvements:</span>{" "}
                              {feedback[index]?.improvements}
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                              <span>Relevance: {feedback[index]?.scores.relevance}%</span>
                              <span>Clarity: {feedback[index]?.scores.clarity}%</span>
                              <span>Depth: {feedback[index]?.scores.depth}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
