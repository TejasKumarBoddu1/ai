
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/components/ui/use-toast';
import { Mic, MicOff, Volume2, VolumeX, Clock, AlertCircle, User, Bot, Loader2 } from 'lucide-react';
import { 
  InterviewMessage, InterviewState, InterviewSettings, InterviewFeedback, InterviewReport
} from '@/types/interview';
import { v4 as uuidv4 } from 'uuid';
import { 
  speakText, stopSpeaking, initSpeechRecognition, analyzeSpeech
} from '@/utils/speechUtils';
import { generateInterviewQuestions } from '@/utils/interviewApiService';

interface AdvancedInterviewSimulationProps {
  settings: InterviewSettings;
  onComplete: (report: InterviewReport) => void;
  onCancel: () => void;
}

const AdvancedInterviewSimulation: React.FC<AdvancedInterviewSimulationProps> = ({ 
  settings, 
  onComplete,
  onCancel
}) => {
  // Interview state
  const [state, setState] = useState<InterviewState>({
    questions: [],
    currentQuestionIndex: 0,
    messages: [],
    isLoading: true,
    isFinished: false,
    summary: null
  });
  
  // Audio controls
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(settings.duration * 60); // in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Feedback state
  const [currentFeedback, setCurrentFeedback] = useState<{
    confidence: number;
    keyWords: string[];
    warning?: string;
  } | null>(null);
  
  // References
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const interviewStartTimeRef = useRef<Date | null>(null);
  const { toast } = useToast();
  
  // Set up interview questions
  useEffect(() => {
    const initializeInterview = async () => {
      try {
        // Generate questions based on resume and job details
        const mockResumeData = {
          skills: ['JavaScript', 'React', 'Node.js'],
          education: [{
            institution: 'University',
            degree: 'Bachelor',
            field: 'Computer Science',
            date: '2020'
          }],
          workExperience: [{
            company: 'Previous Company',
            position: 'Developer',
            duration: '2 years',
            description: settings.resumeText.substring(0, 100)
          }],
          certifications: ['Certification'],
          name: 'Candidate',
          email: 'candidate@example.com'
        };
        
        // For development, use mock generation without API call
        const questions = await generateInterviewQuestions(mockResumeData, settings);
        
        setState(prev => ({
          ...prev,
          questions,
          isLoading: false
        }));
        
        // Add intro message
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            role: 'assistant',
            content: getIntroMessage(),
            timestamp: new Date()
          });
          
          // Start the interview timer
          interviewStartTimeRef.current = new Date();
          setIsTimerRunning(true);
          
          // Ask first question after intro
          setTimeout(() => askQuestion(0), 1000);
        }, 500);
        
      } catch (error) {
        console.error('Error initializing interview:', error);
        toast({
          title: "Interview Setup Failed",
          description: "There was a problem setting up your interview. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    initializeInterview();
    
    // Initialize speech recognition
    speechRecognition.current = initSpeechRecognition();
    if (speechRecognition.current) {
      speechRecognition.current.onstart = () => setIsListening(true);
      speechRecognition.current.onend = () => setIsListening(false);
      
      speechRecognition.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = transcript;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptSegment;
          } else {
            interimTranscript += transcriptSegment;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        // Update real-time feedback if enabled
        if (settings.enableRealTimeFeedback && finalTranscript) {
          updateRealtimeFeedback(finalTranscript);
        }
      };
      
      speechRecognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
    
    // Cleanup
    return () => {
      stopSpeaking();
      if (speechRecognition.current && isListening) {
        speechRecognition.current.stop();
      }
    };
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);
  
  // Interview timer
  useEffect(() => {
    if (!isTimerRunning) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        // When timer runs out
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          
          // If the interview isn't already finished, end it
          if (!state.isFinished) {
            finishInterview();
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTimerRunning]);
  
  // Submit transcript when user stops speaking
  useEffect(() => {
    if (!isListening && transcript && !state.isLoading && !state.isFinished) {
      const timeoutId = setTimeout(() => {
        if (transcript) {
          handleUserResponse(transcript);
          setTranscript('');
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isListening, transcript, state.isLoading, state.isFinished]);
  
  // Get a personalized intro message based on settings
  const getIntroMessage = (): string => {
    const { jobTitle, targetCompany, difficulty } = settings;
    
    if (difficulty === 'hard') {
      return `Welcome to this interview for the ${jobTitle} position at ${targetCompany || 'our company'}. This will be a challenging session to thoroughly evaluate your qualifications. Please provide concise, well-structured responses that demonstrate your expertise. Let's begin.`;
    } else if (difficulty === 'easy') {
      return `Hi there! Welcome to this practice interview for the ${jobTitle} role at ${targetCompany || 'our company'}. This will be a friendly conversation to help you prepare. Feel free to take your time with answers, and I'll provide helpful feedback throughout. Let's start with an easy question.`;
    } else {
      return `Hello! I'll be conducting your interview for the ${jobTitle} position at ${targetCompany || 'our company'}. I'll ask you several questions based on your resume and the job requirements. Please speak clearly and provide detailed responses. Let's begin with the first question.`;
    }
  };
  
  // Scroll to bottom of message list
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Add a message to the conversation
  const addMessage = (message: InterviewMessage) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  };
  
  // Ask a question
  const askQuestion = (index: number) => {
    if (index >= state.questions.length) {
      finishInterview();
      return;
    }
    
    const question = state.questions[index];
    
    const message: InterviewMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: question,
      timestamp: new Date()
    };
    
    addMessage(message);
    setState(prev => ({ ...prev, currentQuestionIndex: index }));
    
    // Read the question aloud if not muted
    if (!isMuted) {
      speakText(
        question,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          // Start listening after a short pause
          setTimeout(() => startListening(), 500);
        }
      );
    } else {
      // If muted, start listening after a short pause
      setTimeout(() => startListening(), 500);
    }
  };
  
  // Handle user's spoken response
  const handleUserResponse = (response: string) => {
    if (state.isLoading || state.isFinished) return;
    
    // Add user message
    const userMessage: InterviewMessage = {
      id: uuidv4(),
      role: 'user',
      content: response,
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Show thinking indicator
      const thinkingId = uuidv4();
      addMessage({
        id: thinkingId,
        role: 'assistant',
        content: 'Analyzing your response...',
        timestamp: new Date(),
        isThinking: true
      });
      
      // Analyze the response
      const analysisResult = analyzeSpeech(response);
      
      // Generate feedback based on analysis
      setTimeout(() => {
        // Remove thinking message
        setState(prev => ({
          ...prev,
          messages: prev.messages.filter(msg => msg.id !== thinkingId),
          isLoading: false
        }));
        
        const feedback = generateFeedback(
          state.questions[state.currentQuestionIndex],
          response,
          analysisResult,
          settings.difficulty || 'medium'
        );
        
        // Add feedback message
        addMessage({
          id: uuidv4(),
          role: 'assistant',
          content: feedback,
          timestamp: new Date()
        });
        
        // Speak feedback if not muted
        if (!isMuted) {
          speakText(
            feedback.replace(/\*\*/g, ''), // Remove markdown formatting
            () => setIsSpeaking(true),
            () => {
              setIsSpeaking(false);
              // Move to next question after a delay
              setTimeout(() => {
                moveToNextQuestion();
              }, 1000);
            }
          );
        } else {
          // If muted, move to next question after a delay
          setTimeout(() => {
            moveToNextQuestion();
          }, 2000);
        }
      }, 1500);
    } catch (error) {
      console.error('Error processing response:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Processing Error",
        description: "There was an error analyzing your response. Moving to the next question.",
        variant: "destructive"
      });
      
      moveToNextQuestion();
    }
  };
  
  // Generate feedback for a response
  const generateFeedback = (
    question: string,
    answer: string,
    analysis: ReturnType<typeof analyzeSpeech>,
    difficulty: InterviewSettings['difficulty']
  ): string => {
    // Extract key details from question
    const questionLower = question.toLowerCase();
    const answerLower = answer.toLowerCase();
    
    // Keywords we would expect in the answer based on question type
    const keywordsForQuestion: string[] = [];
    
    // Check for question types and add expected keywords
    if (questionLower.includes('experience')) {
      keywordsForQuestion.push('worked', 'project', 'role', 'team', 'responsible');
    }
    if (questionLower.includes('challenge') || questionLower.includes('difficult')) {
      keywordsForQuestion.push('problem', 'solution', 'resolve', 'overcome', 'approach');
    }
    if (questionLower.includes('strength') || questionLower.includes('weakness')) {
      keywordsForQuestion.push('skill', 'improve', 'learning', 'growth');
    }
    if (questionLower.includes('why')) {
      keywordsForQuestion.push('interested', 'passion', 'value', 'mission', 'align');
    }
    
    // Check how many expected keywords are in the answer
    const keywordMatches = keywordsForQuestion.filter(kw => answerLower.includes(kw));
    const keywordCoverage = keywordsForQuestion.length > 0 
      ? Math.round((keywordMatches.length / keywordsForQuestion.length) * 100)
      : 75; // Default if no keywords identified
    
    // Assess answer length
    const wordCount = answer.split(/\s+/).length;
    const isAnswerTooShort = wordCount < 30;
    const isAnswerTooLong = wordCount > 200;
    
    // Personalization based on the question
    let personalization = '';
    if (questionLower.includes('experience')) {
      personalization = 'Your experience seems relevant, but consider using the STAR method (Situation, Task, Action, Result) to structure your response more clearly.';
    } else if (questionLower.includes('challenge')) {
      personalization = 'When discussing challenges, remember to emphasize not just the problem but also your solution and the positive outcome.';
    } else if (questionLower.includes('strength')) {
      personalization = 'When highlighting strengths, it\'s good to provide specific examples that demonstrate these qualities in action.';
    } else if (questionLower.includes('why')) {
      personalization = 'When explaining your motivations, try to connect them specifically to the company\'s values or mission.';
    }
    
    // Adjust feedback tone based on difficulty setting
    let feedbackTone = '';
    let confidenceComment = '';
    
    if (difficulty === 'hard') {
      feedbackTone = analysis.toneScore < 70 
        ? 'Your response lacks the confidence expected at this level. Be more assertive in your delivery.'
        : 'Your confidence is appropriate for this role.';
        
      if (isAnswerTooShort) {
        confidenceComment = 'Your answer was too brief and lacks the depth required for this position.';
      } else if (isAnswerTooLong) {
        confidenceComment = 'Your answer was overly verbose. In a professional setting, conciseness is valued.';
      }
    } else if (difficulty === 'easy') {
      feedbackTone = analysis.toneScore < 70 
        ? 'Try to speak with a bit more confidence, but you\'re doing well!'
        : 'Good job showing confidence in your response!';
        
      if (isAnswerTooShort) {
        confidenceComment = 'Consider providing a bit more detail in your answer, but you\'re on the right track.';
      } else if (isAnswerTooLong) {
        confidenceComment = 'Your answer was comprehensive, though you might want to be slightly more concise.';
      }
    } else {
      feedbackTone = analysis.toneScore < 70 
        ? 'Your response could benefit from more confident delivery.'
        : 'You demonstrated good confidence in your response.';
        
      if (isAnswerTooShort) {
        confidenceComment = 'Your answer was somewhat brief. Consider elaborating more on key points.';
      } else if (isAnswerTooLong) {
        confidenceComment = 'Your answer was detailed, though focusing on the most relevant points would improve conciseness.';
      }
    }
    
    // Voice-specific feedback
    let voiceFeedback = '';
    if (analysis.fillerWordCount > 5) {
      voiceFeedback = `I noticed frequent use of filler words like ${analysis.fillerWords.slice(0, 2).join(', ')}. Reducing these would strengthen your delivery.`;
    } else if (analysis.paceScore < 70) {
      voiceFeedback = 'Try to vary your speaking pace to emphasize key points and maintain the interviewer\'s engagement.';
    }
    
    // Build the final feedback
    let feedback = '';
    
    if (difficulty === 'hard') {
      feedback = `**Feedback on your response:**\n\n${feedbackTone} ${confidenceComment}\n\n${personalization}\n\n${voiceFeedback}`;
    } else if (difficulty === 'easy') {
      feedback = `**Here's some helpful feedback:**\n\nYou did well explaining ${keywordMatches[0] || 'your points'}. ${feedbackTone} ${confidenceComment}\n\n${personalization}\n\n${voiceFeedback ? 'Tip: ' + voiceFeedback : ''}`;
    } else {
      feedback = `**Feedback:**\n\n${feedbackTone} ${confidenceComment}\n\n${personalization}\n\n${voiceFeedback}`;
    }
    
    return feedback;
  };
  
  // Update real-time feedback during user's response
  const updateRealtimeFeedback = (text: string) => {
    // Only analyze if we have enough text
    if (text.split(' ').length < 5) return;
    
    // Quick analysis for real-time feedback
    const quickAnalysis = analyzeSpeech(text);
    
    // Extract keywords from the current question
    const questionLower = (state.questions[state.currentQuestionIndex] || '').toLowerCase();
    const keyWords: string[] = [];
    
    // Check for certain question types and their expected keywords
    if (questionLower.includes('experience')) {
      const foundKeywords = ['worked', 'project', 'role', 'team', 'responsible']
        .filter(kw => text.toLowerCase().includes(kw));
      keyWords.push(...foundKeywords);
    }
    
    // Set real-time feedback
    setCurrentFeedback({
      confidence: quickAnalysis.toneScore,
      keyWords,
      warning: quickAnalysis.fillerWordCount > 3 ? 'Watch filler words' : undefined
    });
  };
  
  // Move to next question
  const moveToNextQuestion = () => {
    const nextIndex = state.currentQuestionIndex + 1;
    
    // Reset feedback
    setCurrentFeedback(null);
    
    // Check if we've reached the end
    if (nextIndex >= state.questions.length) {
      finishInterview();
    } else {
      // Ask the next question
      askQuestion(nextIndex);
    }
  };
  
  // Finish the interview
  const finishInterview = () => {
    setState(prev => ({
      ...prev,
      isFinished: true,
      isLoading: true
    }));
    
    // Stop the timer
    setIsTimerRunning(false);
    
    // Add finishing message
    const finishingMessage: InterviewMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: "That concludes our interview. I'm now preparing your comprehensive performance report.",
      timestamp: new Date()
    };
    
    addMessage(finishingMessage);
    
    // Speak finishing message if not muted
    if (!isMuted) {
      speakText(
        finishingMessage.content,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
    
    // Generate report
    setTimeout(() => {
      // Create mock report for demo
      const mockReport: InterviewReport = {
        id: uuidv4(),
        date: new Date(),
        candidateName: "Candidate",
        candidateEmail: "candidate@example.com",
        jobTitle: settings.jobTitle,
        targetCompany: settings.targetCompany || 'Target Company',
        yearsOfExperience: settings.yearsOfExperience || '1-3',
        overallScore: Math.floor(Math.random() * 20) + 70, // Random score between 70-90
        questions: state.messages
          .filter((m, i, arr) => 
            m.role === 'assistant' && 
            !m.isThinking && 
            i < arr.length - 1 && // Skip the last message (conclusion)
            !m.content.includes('Feedback') && 
            !m.content.includes('Welcome')
          )
          .map((question, index) => {
            // Find the user's response that follows this question
            const userResponse = state.messages.find((m, i) => 
              state.messages[i-1]?.id === question.id && m.role === 'user'
            );
            
            // Find the feedback that follows the user's response
            const feedback = state.messages.find((m, i) => 
              state.messages[i-1]?.id === userResponse?.id && m.role === 'assistant'
            );
            
            return {
              question: question.content,
              answer: userResponse?.content || "No answer provided",
              feedback: feedback?.content || "No feedback available",
              confidenceScore: Math.floor(Math.random() * 20) + 65, // Random score
              contentScore: Math.floor(Math.random() * 30) + 60, // Random score
              keyPointsCovered: ["Communication", "Problem-solving", "Teamwork"].sort(() => Math.random() - 0.5).slice(0, 2)
            };
          }),
        skillsAnalysis: {
          matched: ["Communication", "Problem-solving", "Teamwork", "Adaptability"].sort(() => Math.random() - 0.5),
          missing: ["Leadership", "Technical expertise", "Time management"].sort(() => Math.random() - 0.5).slice(0, 2)
        },
        performanceMetrics: {
          communication: Math.floor(Math.random() * 20) + 70,
          technicalKnowledge: Math.floor(Math.random() * 20) + 65,
          problemSolving: Math.floor(Math.random() * 20) + 60,
          cultureFit: Math.floor(Math.random() * 20) + 75,
          confidence: Math.floor(Math.random() * 20) + 70
        },
        suggestedImprovements: [
          "Practice more concise answers using the STAR method",
          "Work on reducing filler words like 'um' and 'actually'",
          "Prepare more specific examples that demonstrate your skills",
          "Research the company more thoroughly before the interview"
        ].sort(() => Math.random() - 0.5).slice(0, 3),
        interviewTranscript: state.messages
          .map(m => `${m.role.toUpperCase()} (${m.timestamp.toLocaleTimeString()}): ${m.content}`)
          .join('\n\n')
      };
      
      setState(prev => ({ ...prev, isLoading: false }));
      onComplete(mockReport);
      
    }, 3000); // Simulate report generation time
  };
  
  // Start speech recognition
  const startListening = () => {
    if (!speechRecognition.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use a different browser.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      speechRecognition.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Microphone Error",
        description: "There was an error accessing your microphone.",
        variant: "destructive"
      });
    }
  };
  
  // Stop speech recognition
  const stopListening = () => {
    if (speechRecognition.current && isListening) {
      speechRecognition.current.stop();
    }
  };
  
  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (isSpeaking) {
      stopSpeaking();
    }
  };
  
  // Format time remaining
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render message bubble
  const renderMessage = (message: InterviewMessage) => {
    const isAssistant = message.role === 'assistant';
    
    // Render thinking indicator
    if (message.isThinking) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm italic mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{message.content}</span>
        </div>
      );
    }
    
    return (
      <div 
        className={`flex gap-3 mb-4 ${isAssistant ? '' : 'flex-row-reverse'}`}
        key={message.id}
      >
        <Avatar className={isAssistant ? 'bg-blue-100' : 'bg-green-100'}>
          {isAssistant ? (
            <Bot className="h-5 w-5 text-blue-700" />
          ) : (
            <User className="h-5 w-5 text-green-700" />
          )}
          <AvatarFallback>{isAssistant ? 'AI' : 'You'}</AvatarFallback>
        </Avatar>
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div 
            className={`px-4 py-3 rounded-lg max-w-[85%] ${
              isAssistant 
                ? 'bg-blue-50 text-gray-800 border border-blue-100' 
                : 'bg-green-50 text-gray-800 border border-green-100'
            }`}
          >
            <div className="prose prose-sm whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return state.questions.length > 0 
      ? Math.min(100, Math.round(((state.currentQuestionIndex) / state.questions.length) * 100))
      : 0;
  }, [state.currentQuestionIndex, state.questions.length]);
  
  return (
    <div className="h-full flex flex-col">
      {/* Header with progress */}
      <div className="px-4 py-3 border-b flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-medium text-lg">
              {settings.jobTitle} Interview
            </h2>
            <p className="text-sm text-muted-foreground">
              {settings.targetCompany ? `${settings.targetCompany} • ` : ''}
              {settings.difficulty?.charAt(0).toUpperCase() + settings.difficulty?.slice(1) || 'Medium'} Difficulty
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 bg-blue-50"
            >
              <Clock className="h-3.5 w-3.5 mr-1" />
              {formatTime(timeRemaining)}
            </Badge>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>Question {state.currentQuestionIndex + 1} of {state.questions.length}</span>
            <span>{progressPercentage}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          {state.isLoading && state.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Preparing your interview...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {state.messages.map(renderMessage)}
              <div ref={messagesEndRef} />
              
              {/* Transcript display while listening */}
              {isListening && transcript && (
                <div className="flex justify-end items-center mt-2">
                  <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm italic max-w-[85%]">
                    {transcript}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        {/* Realtime feedback bar (if enabled) */}
        {settings.enableRealTimeFeedback && currentFeedback && (
          <div className="px-4 py-2 bg-muted/30 border-t">
            <div className="flex justify-between items-center mb-1 text-xs">
              <div className="flex items-center">
                <span className="font-medium mr-2">Confidence:</span>
                <span>{currentFeedback.confidence}%</span>
              </div>
              
              {currentFeedback.warning && (
                <div className="flex items-center text-amber-500">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  <span>{currentFeedback.warning}</span>
                </div>
              )}
            </div>
            
            <Progress 
              value={currentFeedback.confidence} 
              className="h-1.5"
              color={
                currentFeedback.confidence > 80 ? "bg-green-500" :
                currentFeedback.confidence > 60 ? "bg-amber-500" :
                "bg-red-500"
              }
            />
            
            {currentFeedback.keyWords.length > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span>Keywords detected:</span>
                {currentFeedback.keyWords.map((word, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0 h-4">
                    {word}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Controls area */}
        <div className="p-3 border-t bg-muted/10 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-xs"
            disabled={state.isFinished}
          >
            End Interview
          </Button>
          
          <div className="flex items-center gap-2">
            {isListening ? (
              <Button
                onClick={stopListening}
                variant="destructive"
                size="sm"
                className="rounded-full px-3 flex items-center gap-1"
                disabled={!isListening || state.isFinished}
              >
                <MicOff className="h-4 w-4 mr-1" />
                Stop Speaking
              </Button>
            ) : (
              <Button
                onClick={startListening}
                variant="default"
                size="sm"
                className="rounded-full px-3 flex items-center gap-1"
                disabled={isListening || isSpeaking || state.isLoading || state.isFinished}
              >
                <Mic className="h-4 w-4 mr-1" />
                {transcript ? 'Continue Speaking' : 'Start Speaking'}
              </Button>
            )}
          </div>
          
          {state.isFinished ? (
            <Button
              variant="default"
              size="sm"
              className="text-xs"
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Finishing..."
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              disabled={state.currentQuestionIndex === state.questions.length - 1}
              onClick={() => {
                stopSpeaking();
                stopListening();
                moveToNextQuestion();
              }}
            >
              Skip Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedInterviewSimulation;
