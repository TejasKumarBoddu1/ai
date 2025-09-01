import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Pause, Play, Volume2, VolumeX, Download, Loader2, AlertTriangle, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import InterviewAvatar from './InterviewAvatar';
import EnhancedCamera from './EnhancedCamera';

interface InterviewSimulationProps {
  interviewData: any;
  onComplete: (results: any) => void;
}

const InterviewSimulation: React.FC<InterviewSimulationProps> = ({ interviewData, onComplete }) => {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState<{role: "interviewer" | "user", text: string}[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(75);
  const [postureFeedback, setPostureFeedback] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [interviewTime, setInterviewTime] = useState(0);
  const [recordedVideoBlobs, setRecordedVideoBlobs] = useState<{index: number, blob: Blob, url: string}[]>([]);
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  
  // Sample interview questions
  const interviewQuestions = {
    "software-development": [
      "Walk me through your professional background and what specific skills you would bring to our development team.",
      "Describe a challenging technical problem you've solved. What was your approach and what tools did you utilize?",
      "How do you ensure code quality and maintainability in your projects?",
      "Tell me about your experience with agile development methodologies and how you've implemented them.",
      "Where do you see the future of software development heading, and how do you stay current with emerging technologies?",
    ],
    "data-science": [
      "Describe your experience with statistical modeling and machine learning algorithms.",
      "Walk me through your process for cleaning and preprocessing data for analysis.",
      "How do you validate the accuracy and reliability of your predictive models?",
      "Tell me about a data science project where your insights led to meaningful business impact.",
      "What tools and technologies do you use for data visualization, and how do you determine which is most appropriate for different scenarios?",
    ],
    "default": [
      "Describe your professional background and how it aligns with this position.",
      "What would you identify as your greatest professional strength, and how have you utilized it in your career?",
      "Tell me about a challenging situation you faced at work and how you resolved it.",
      "Why are you interested in joining our organization specifically?",
      "Where do you envision your career in the next three to five years?",
    ]
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setUserResponse(prev => prev + finalTranscript + " ");
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      toast({
        title: "Speech Recognition Error",
        description: "There was a problem with the speech recognition. Please try again.",
        variant: "destructive",
      });
    };
    
    if (isRecording) {
      recognition.start();
    }
    
    return () => {
      recognition.stop();
    };
  }, [isRecording, toast]);

  useEffect(() => {
    if (isInterviewActive && !timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setInterviewTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isInterviewActive]);

  const startInterview = () => {
    setIsInterviewActive(true);
    
    const category = interviewData?.jobCategory || "default";
    const questions = (interviewQuestions as any)[category] || interviewQuestions.default;
    setCurrentQuestion(questions[0]);
    
    setTranscript([{
      role: "interviewer",
      text: "Thank you for joining us today. I'll be conducting your interview. Let's begin with the first question."
    }, {
      role: "interviewer",
      text: questions[0]
    }]);
    
    setIsRecording(true);
    
    const greeting = `Hello, I'll be conducting your interview for the ${interviewData?.jobTitle || "position"} today. Please make sure your camera and microphone are enabled so I can provide comprehensive feedback on your performance.`;
    
    const utterance = new SpeechSynthesisUtterance(greeting);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = voices.filter(voice => 
      voice.name.includes("Google") || 
      voice.name.includes("Premium") || 
      voice.name.includes("Natural")
    );
    
    if (preferredVoices.length > 0) {
      utterance.voice = preferredVoices[0];
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setUserResponse("");
    }
  };

  const submitResponse = async () => {
    if (!userResponse.trim()) {
      toast({
        title: "No Response Detected",
        description: "Please provide your answer before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setIsRecording(false);
    
    try {
      const category = interviewData?.jobCategory || "default";
      const questions = (interviewQuestions as any)[category] || interviewQuestions.default;
      
      setTranscript(prev => [
        ...prev,
        { role: "user", text: userResponse }
      ]);
      
      setUserResponse("");
      
      const nextIndex = questionIndex + 1;
      
      if (nextIndex < questions.length) {
        setQuestionIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        
        setTranscript(prev => [
          ...prev,
          { role: "interviewer", text: questions[nextIndex] }
        ]);
        
        setConfidenceScore(prevScore => {
          const randomFactor = Math.floor(Math.random() * 15) - 8;
          return Math.min(95, Math.max(40, prevScore + randomFactor));
        });
        
        const postureFeedbacks = [
          "Maintain consistent eye contact with the interviewer.",
          "Consider sitting more upright to project confidence.",
          "Your non-verbal communication is appropriate, maintain this posture.",
          "Try to reduce hand movements when explaining complex points.",
          null
        ];
        setPostureFeedback(postureFeedbacks[Math.floor(Math.random() * postureFeedbacks.length)]);
        
        setTimeout(() => {
          setIsRecording(true);
        }, 500);
      } else {
        setTranscript(prev => [
          ...prev,
          { role: "interviewer", text: "Thank you for your time and thoughtful responses. This concludes our interview." }
        ]);
        
        setInterviewComplete(true);
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completeInterview = () => {
    const results = {
      technicalScore: Math.floor(Math.random() * 30) + 65,
      behavioralScore: Math.floor(Math.random() * 25) + 70,
      confidenceScore: confidenceScore,
      bodyLanguageScore: Math.floor(Math.random() * 20) + 70,
      overallScore: Math.floor(Math.random() * 15) + 75,
      transcript: transcript,
      interviewData: interviewData,
      timestamp: new Date().toISOString(),
      duration: interviewTime,
      recordedVideos: recordedVideoBlobs.map(item => ({
        questionIndex: item.index,
        videoUrl: item.url,
        questionText: (interviewQuestions as any)[interviewData?.jobCategory || "default"]?.[item.index] || 
                      interviewQuestions.default[item.index]
      })),
      feedback: [
        "Demonstrated appropriate professional communication throughout the interview.",
        "Could improve responses by providing more concrete examples from past experiences.",
        "Technical knowledge is solid but explanations could be more concise and focused.",
        "Showed good understanding of industry concepts and methodologies.",
        "Body language was generally professional with room for improvement in maintaining consistent eye contact."
      ]
    };
    
    onComplete(results);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!isInterviewActive ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <Card className="max-w-lg w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Premium Interview Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-slate-600 leading-relaxed">
                You're about to enter a virtual interview with our AI interviewer. Ensure your camera and microphone are ready, and find a quiet environment for the best experience.
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={startInterview} 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Begin Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen">
          {/* Main Interview Environment */}
          <div className="col-span-1 lg:col-span-2 relative bg-gradient-to-br from-slate-900 to-slate-800">
            <InterviewAvatar isActive={isInterviewActive} />
            
            {/* Enhanced Camera with Futuristic Tracking */}
            <div className="absolute bottom-6 right-6 w-80 h-60 rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl bg-black/20 backdrop-blur-sm">
              <EnhancedCamera isInterviewActive={true} />
            </div>
            
            {/* Interview Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 rounded-full text-white hover:text-white"
                onClick={() => setIsMicMuted(!isMicMuted)}
              >
                {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20 rounded-full text-white hover:text-white"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
              >
                {isAudioMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Current Question Display */}
            <div className="absolute top-6 left-6 right-6">
              <Card className="bg-black/30 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-cyan-400">Current Question:</h3>
                    <div className="flex items-center text-cyan-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTime(interviewTime)}
                    </div>
                  </div>
                  <p className="text-white font-medium leading-relaxed">{currentQuestion}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Analytics and Controls Panel */}
          <div className="col-span-1 bg-white border-l border-slate-200 flex flex-col">
            {/* Performance Metrics Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="font-semibold text-lg text-slate-800 mb-4">Performance Analytics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Interview Progress</span>
                  <span className="text-sm font-medium text-slate-800">
                    {questionIndex + 1}/{
                      ((interviewQuestions as any)[interviewData?.jobCategory || "default"] || interviewQuestions.default).length
                    }
                  </span>
                </div>
                <Progress 
                  value={(questionIndex + 1) / ((interviewQuestions as any)[interviewData?.jobCategory || "default"] || interviewQuestions.default).length * 100} 
                  className="h-2" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Performance Score</span>
                  <span className={`text-sm font-medium ${
                    confidenceScore > 80 ? "text-green-600" : 
                    confidenceScore > 60 ? "text-amber-600" : "text-red-600"
                  }`}>{confidenceScore}%</span>
                </div>
                <Progress value={confidenceScore} className="h-2" />
              </div>
            </div>

            {/* Voice Recognition Status */}
            <div className="p-6 border-b border-slate-200">
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <span className="font-medium text-sm mr-2">Voice Recognition:</span>
                      {isRecording ? (
                        <span className="text-green-600 text-sm flex items-center">
                          <span className="h-2 w-2 bg-green-600 rounded-full mr-1 animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm flex items-center">
                          <span className="h-2 w-2 bg-slate-400 rounded-full mr-1"></span>
                          Paused
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleRecording} 
                      className="h-7 text-xs"
                    >
                      {isRecording ? "Pause" : "Resume"}
                    </Button>
                  </div>
                  <div className="text-sm text-slate-700 max-h-20 overflow-y-auto bg-slate-50 p-2 rounded">
                    {userResponse || (isRecording ? "Listening for your response..." : "Voice recognition paused.")}
                  </div>
                </CardContent>
              </Card>
              
              {postureFeedback && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Feedback: </span>
                      {postureFeedback}
                    </span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Transcript */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-medium mb-4 text-slate-800">Interview Transcript</h3>
              <div className="space-y-4">
                {transcript.map((item, i) => (
                  <div key={i} className={`flex ${item.role === "interviewer" ? "" : "justify-end"}`}>
                    <div className={`rounded-lg px-4 py-3 max-w-[80%] ${
                      item.role === "interviewer" 
                        ? "bg-slate-100 text-left" 
                        : "bg-blue-50 text-left"
                    }`}>
                      <div className="text-xs text-slate-500 mb-1 font-medium">
                        {item.role === "interviewer" ? "Interviewer" : "You"}
                      </div>
                      <p className="text-sm text-slate-700">{item.text}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-3 bg-slate-100">
                      <div className="text-xs text-slate-500 mb-1 font-medium">Interviewer</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Button */}
            <div className="p-6 border-t border-slate-200">
              {interviewComplete ? (
                <Button 
                  onClick={completeInterview}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  View Performance Report
                </Button>
              ) : (
                <Button 
                  onClick={submitResponse}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Response...
                    </>
                  ) : (
                    "Submit Response"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSimulation;
