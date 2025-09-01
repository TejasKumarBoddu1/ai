
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ClipboardCheck, Timer, Camera, Brain, Bot } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ResumeUploader from './ResumeUploader';

export type JobLevel = 'entry' | 'mid' | 'senior' | 'executive';
export type InterviewDifficulty = 'easy' | 'medium' | 'hard';
export type InterviewType = 'technical' | 'behavioral' | 'mixed';
export type AIBackend = 'gemini' | 'chatgpt' | 'grok';

export interface InterviewSettings {
  jobTitle: string;
  jobLevel: JobLevel;
  resumeText: string;
  resumeFileName: string;
  duration: number;
  useCamera?: boolean;
  difficulty?: InterviewDifficulty;
  interviewType?: InterviewType;
  aiBackend?: AIBackend;
}

interface InterviewSetupProps {
  onStartInterview: (settings: InterviewSettings) => void;
  isProcessing: boolean;
}

const InterviewSetup = ({ onStartInterview, isProcessing }: InterviewSetupProps) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobLevel, setJobLevel] = useState<JobLevel>('mid');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [duration, setDuration] = useState(15);
  const [useCamera, setUseCamera] = useState(false);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('medium');
  const [interviewType, setInterviewType] = useState<InterviewType>('mixed');
  const [aiBackend, setAiBackend] = useState<AIBackend>('gemini');
  
  const handleResumeProcessed = (text: string, fileName: string) => {
    setResumeText(text);
    setResumeFileName(fileName);
  };
  
  const handleStartInterview = () => {
    onStartInterview({
      jobTitle,
      jobLevel,
      resumeText,
      resumeFileName,
      duration,
      useCamera,
      difficulty,
      interviewType,
      aiBackend
    });
  };
  
  const isValid = jobTitle.trim() !== '' && resumeText !== '';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 text-primary mr-2" />
          Advanced Interview Setup
        </CardTitle>
        <CardDescription>
          Upload your resume and specify the job details to get started
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-title">Job Title</Label>
            <Input 
              id="job-title" 
              placeholder="e.g. Software Engineer, Project Manager, UX Designer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="job-level">Experience Level</Label>
            <Select 
              value={jobLevel} 
              onValueChange={(value: JobLevel) => setJobLevel(value)}
              disabled={isProcessing}
            >
              <SelectTrigger id="job-level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid-Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-backend">AI Interviewer</Label>
            <Select 
              value={aiBackend} 
              onValueChange={(value: AIBackend) => setAiBackend(value)}
              disabled={isProcessing}
            >
              <SelectTrigger id="ai-backend" className="flex gap-2">
                <Bot className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Ava (Gemini) - Balanced & Professional</SelectItem>
                <SelectItem value="chatgpt">Ava (ChatGPT) - Conversational & Detailed</SelectItem>
                <SelectItem value="grok">Ava (Grok) - Direct & Analytical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Interview Duration</Label>
            <div className="flex items-center gap-2">
              <Select 
                value={duration.toString()} 
                onValueChange={(value) => setDuration(parseInt(value))}
                disabled={isProcessing}
              >
                <SelectTrigger id="duration" className="flex gap-2">
                  <Timer className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Interview Difficulty</Label>
            <Select 
              value={difficulty} 
              onValueChange={(value: InterviewDifficulty) => setDifficulty(value)}
              disabled={isProcessing}
            >
              <SelectTrigger id="difficulty" className="flex gap-2">
                <Brain className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy - Friendly Interview</SelectItem>
                <SelectItem value="medium">Medium - Standard Interview</SelectItem>
                <SelectItem value="hard">Hard - Challenging Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Interview Type</Label>
            <Select 
              value={interviewType} 
              onValueChange={(value: InterviewType) => setInterviewType(value)}
              disabled={isProcessing}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="mixed">Mixed (Technical & Behavioral)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="use-camera">Enable Camera Analysis</Label>
                <p className="text-xs text-muted-foreground">
                  Analyze posture, eye contact, and attire
                </p>
              </div>
              <Switch
                id="use-camera"
                checked={useCamera}
                onCheckedChange={setUseCamera}
                disabled={isProcessing}
              />
            </div>
            
            {useCamera && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-blue-700 text-xs flex items-start">
                  <Camera className="h-4 w-4 mr-1.5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Enhanced Analysis Enabled:</strong> You'll receive real-time feedback on posture, eye contact, gestures, and professional appearance during the interview.
                  </span>
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="block mb-2">Resume</Label>
            <ResumeUploader 
              onResumeProcessed={handleResumeProcessed} 
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleStartInterview} 
          disabled={!isValid || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Start Advanced Interview
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewSetup;
