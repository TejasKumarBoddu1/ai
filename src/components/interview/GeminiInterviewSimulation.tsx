
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mic, MicOff, Play, Clock, User, Briefcase, MessageSquare, CheckCircle, Bot, Volume2, VolumeX, SkipForward, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callGeminiAI } from '@/utils/ai/geminiService';

interface InterviewMessage {
  role: 'hr' | 'candidate';
  content: string;
  timestamp: Date;
}

const GeminiInterviewSimulation: React.FC = () => {
  const [candidateName, setCandidateName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [duration, setDuration] = useState(15);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer effect for elapsed time and time remaining
  useEffect(() => {
    if (isInterviewStarted && !isInterviewComplete && interviewStartTime) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - interviewStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        const remaining = Math.max(0, (duration * 60) - elapsed);
        setTimeRemaining(remaining);
        
        // Auto-complete interview when duration is reached
        if (remaining <= 0) {
          completeInterview();
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isInterviewStarted, isInterviewComplete, interviewStartTime, duration]);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentResponse(prev => prev + finalTranscript + ' ');
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "There was an issue with speech recognition. Please type your response.",
          variant: "destructive"
        });
      };
    }
  }, [toast]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateHRPrompt = (isFirst: boolean, messageHistory: InterviewMessage[] = []): string => {
    const conversationHistory = messageHistory
      .map(msg => `${msg.role === 'hr' ? 'HR Interviewer' : 'Candidate'}: ${msg.content}`)
      .join('\n');

    if (isFirst) {
      return `You are simulating an HR interviewer for a job interview. The candidate's name is ${candidateName}, they applied for the position of ${jobTitle}, and the interview will last approximately ${duration} minutes.

Your goal is to behave like a professional, realistic HR representative conducting a behavioral and situational interview.

This is the start of the interview. Please:
1. Greet the candidate politely and confirm their name and the position they applied for
2. Mention that the interview will begin shortly
3. Start with a short icebreaker question to help them feel comfortable

Keep your response natural, professional, and friendly. Do not reveal you are an AI. Stay in character as an HR interviewer at all times.

Respond as the HR interviewer would speak directly to the candidate.`;
    } else {
      return `You are continuing an HR interview. Here's the conversation so far:

${conversationHistory}

The candidate just responded. As the HR interviewer for the ${jobTitle} position, provide a brief, natural response and then ask the next appropriate question. 

Ask a mix of:
- Behavioral questions (e.g., "Tell me about a time you faced a challenge at work.")
- Situational questions (e.g., "How would you handle a conflict between team members?")
- Role-specific questions tailored to ${jobTitle}
- Questions about teamwork, leadership, communication, and culture fit

Keep responses brief and professional. Wait for the candidate to respond after each question. If you've asked about ${questionCount + 1} questions and the interview is progressing well, you can start to wrap up by asking if they have questions for you.

Respond naturally as an HR interviewer would.`;
    }
  };

  const startInterview = async () => {
    if (!candidateName.trim() || !jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and select a job title.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting interview with API call...');
      const prompt = generateHRPrompt(true);
      console.log('Generated prompt:', prompt);
      
      const response = await callGeminiAI(prompt);
      console.log('Received response:', response);
      
      const hrResponse = response.text();
      console.log('HR response text:', hrResponse);
      
      const firstMessage: InterviewMessage = {
        role: 'hr',
        content: hrResponse,
        timestamp: new Date()
      };
      
      setMessages([firstMessage]);
      setIsInterviewStarted(true);
      setInterviewStartTime(new Date());
      setTimeRemaining(duration * 60);
      setQuestionCount(1);
      
      toast({
        title: "Interview Started",
        description: "Your AI-powered interview has begun. Good luck!",
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Error",
        description: `Failed to start the interview: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const submitResponse = async () => {
    if (!currentResponse.trim()) {
      toast({
        title: "No Response",
        description: "Please provide your response before submitting.",
        variant: "destructive"
      });
      return;
    }

    const candidateMessage: InterviewMessage = {
      role: 'candidate',
      content: currentResponse.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, candidateMessage];
    setMessages(updatedMessages);
    setCurrentResponse('');
    setIsLoading(true);

    try {
      const prompt = generateHRPrompt(false, updatedMessages);
      const response = await callGeminiAI(prompt);
      const hrResponse = response.text();
      
      const hrMessage: InterviewMessage = {
        role: 'hr',
        content: hrResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, hrMessage]);
      setQuestionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error getting HR response:', error);
      toast({
        title: "Error",
        description: "Failed to get interviewer response. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const completeInterview = async () => {
    setIsLoading(true);
    try {
      const wrapUpPrompt = `The interview is now ending. As the HR interviewer, please:
1. Thank the candidate for their time
2. Ask if they have any questions for you
3. Mention that you'll be in touch
4. End on a professional, positive note

Keep it brief and natural.`;
      
      const response = await callGeminiAI(wrapUpPrompt);
      const hrResponse = response.text();
      
      const finalMessage: InterviewMessage = {
        role: 'hr',
        content: hrResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, finalMessage]);
      setIsInterviewComplete(true);
      
      toast({
        title: "Interview Complete",
        description: "Thank you for participating in the interview simulation!",
      });
    } catch (error) {
      console.error('Error completing interview:', error);
      setIsInterviewComplete(true);
    }
    setIsLoading(false);
  };

  const resetInterview = () => {
    setIsInterviewStarted(false);
    setIsInterviewComplete(false);
    setMessages([]);
    setCurrentResponse('');
    setElapsedTime(0);
    setTimeRemaining(0);
    setQuestionCount(0);
    setInterviewStartTime(null);
    setCandidateName('');
    setJobTitle('');
  };

  const progressPercentage = timeRemaining > 0 ? ((duration * 60 - timeRemaining) / (duration * 60)) * 100 : 100;

  // Setup phase
  if (!isInterviewStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              AI-Powered Interview Simulation
            </CardTitle>
            <CardDescription>
              Practice your interview skills with our AI HR interviewer powered by Google Gemini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="job-title">Job Title *</Label>
                <Select value={jobTitle} onValueChange={setJobTitle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the position you're applying for" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                    <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                    <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Customer Success Manager">Customer Success Manager</SelectItem>
                    <SelectItem value="HR Specialist">HR Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Interview Duration</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                  <SelectTrigger>
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

            <Button 
              onClick={startInterview} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Starting Interview..."
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Interview
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Interview simulation phase
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-screen">
        {/* Main Interview Area */}
        <div className="col-span-1 lg:col-span-3 flex flex-col">
          {/* Header with progress */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">{jobTitle} Interview</h2>
                <p className="text-sm text-muted-foreground">
                  Candidate: {candidateName} • Duration: {duration} minutes
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(timeRemaining)} remaining
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress: {Math.round(progressPercentage)}%</span>
                <span>Questions: {questionCount}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'candidate' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className={message.role === 'hr' ? 'bg-blue-100' : 'bg-green-100'}>
                    <AvatarFallback>
                      {message.role === 'hr' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg px-4 py-3 ${
                    message.role === 'hr' 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="text-xs text-muted-foreground mb-1">
                      {message.role === 'hr' ? 'HR Interviewer' : 'You'} • {message.timestamp.toLocaleTimeString()}
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <div className="text-xs text-muted-foreground mb-1">HR Interviewer</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!isInterviewComplete && (
            <div className="bg-white border-t p-6 space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your response here or use voice input..."
                  value={currentResponse}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  className="flex-1 min-h-20"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleListening}
                    className={isListening ? "bg-red-50 border-red-200" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={completeInterview}
                    size="sm"
                  >
                    <StopCircle className="h-4 w-4 mr-1" />
                    End Interview
                  </Button>
                </div>
                
                <Button 
                  onClick={submitResponse}
                  disabled={isLoading || !currentResponse.trim()}
                  className="px-6"
                >
                  {isLoading ? "Processing..." : "Submit Response"}
                </Button>
              </div>
            </div>
          )}

          {isInterviewComplete && (
            <div className="bg-white border-t p-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Interview Complete!</span>
              </div>
              <p className="text-muted-foreground">
                Thank you for completing the interview simulation. You can review the conversation above.
              </p>
              <Button onClick={resetInterview}>
                Start New Interview
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="col-span-1 bg-white border-l p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Interview Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Time Elapsed:</span>
                <span className="font-mono">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Time Remaining:</span>
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Questions Asked:</span>
                <span>{questionCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant={isInterviewComplete ? "default" : "secondary"}>
                  {isInterviewComplete ? 'Complete' : 'In Progress'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Interview Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Be specific with examples</li>
              <li>• Use the STAR method</li>
              <li>• Ask thoughtful questions</li>
              <li>• Show enthusiasm</li>
              <li>• Be honest about experiences</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Voice Controls</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleListening}
                disabled={isInterviewComplete}
                className="w-full"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-1" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-1" />
                    Start Voice Input
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="w-full"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-1" />
                    Unmute Audio
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-1" />
                    Mute Audio
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiInterviewSimulation;
