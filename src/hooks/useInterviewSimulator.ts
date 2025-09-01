
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { InterviewQuestion, InterviewFeedback } from "@/types/interview";
import { 
  analyzeResumeAndGenerateQuestions, 
  evaluateAnswer, 
  generateInterviewFeedback,
  generateEnhancedPDF 
} from "@/utils/interviewAI";
import { apiKeys } from "@/utils/apiKeys";

export const useInterviewSimulator = () => {
  const { toast } = useToast();
  
  // State
  const [jobRole, setJobRole] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<(InterviewFeedback | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState(120); // 2 minutes default
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Calculate progress
  const progress = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;
  
  // Start interview
  const startInterview = async () => {
    if (!jobRole) {
      toast({
        title: "Job Role Required",
        description: "Please select a job role for your interview.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes, use a predefined Gemini API key or simulated data
      const geminiKey = apiKeys.GEMINI_API_KEY || 'demo-key';
      
      const generatedQuestions = await analyzeResumeAndGenerateQuestions({
        jobTitle: jobRole,
        jobLevel: 'mid',  // Default to mid-level
        resumeText: resumeText || 'Professional with experience in software development.',
        resumeFileName: 'resume.txt',
        duration: timePerQuestion * 8 / 60, // Estimate total duration based on questions
        difficulty: 'medium',
        interviewType: 'mixed'
      }, geminiKey);
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("Failed to generate interview questions");
      }
      
      setQuestions(generatedQuestions);
      setAnswers(new Array(generatedQuestions.length).fill(""));
      setFeedback(new Array(generatedQuestions.length).fill(null));
      setCurrentQuestionIndex(0);
      setInterviewStarted(true);
      setTimeRemaining(timePerQuestion);
      
      // Start timer
      startTimer();
      
      toast({
        title: "Interview Started",
        description: `${generatedQuestions.length} questions generated for ${jobRole} position.`,
      });
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({
        title: "Error",
        description: "Failed to generate interview questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // End interview
  const endInterview = () => {
    stopTimer();
    stopListening();
    setInterviewStarted(false);
    setInterviewCompleted(false);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setAnswers([]);
    setFeedback([]);
    setJobRole("");
    setResumeText("");
  };
  
  // Timer functions
  const startTimer = () => {
    stopTimer();
    
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(time => {
        if (time <= 1) {
          // Time's up, auto-submit
          submitAnswer(answers[currentQuestionIndex] || "");
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const resetTimer = () => {
    setTimeRemaining(timePerQuestion);
    startTimer();
  };
  
  // Navigation
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetTimer();
    } else {
      // Complete the interview
      setInterviewCompleted(true);
      setInterviewStarted(false);
      stopTimer();
    }
  };
  
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetTimer();
    }
  };
  
  // Answer handling
  const handleAnswerChange = (value: string, index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  
  // Submit and get feedback
  const submitAnswer = async (answer: string) => {
    // Stop timer
    stopTimer();
    
    // Stop speech recognition if active
    if (isListening) {
      stopListening();
    }
    
    if (!answer.trim()) {
      toast({
        title: "Empty answer",
        description: "Please provide an answer before proceeding.",
        variant: "destructive"
      });
      startTimer(); // Restart the timer
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store the answer
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
      
      // Get AI feedback
      const currentQuestion = questions[currentQuestionIndex];
      
      // For demo purposes, use a predefined Gemini API key
      const geminiKey = apiKeys.GEMINI_API_KEY || 'demo-key';
      
      // Generate feedback
      const feedbackText = await evaluateAnswer(
        currentQuestion.question,
        answer,
        jobRole,
        'mid-level',  // Default level
        geminiKey
      );
      
      // Create feedback object
      const simpleFeedback: InterviewFeedback = {
        strengths: "You demonstrated good communication and provided relevant examples.",
        improvements: "Try to be more concise and focused in your responses.",
        suggestions: feedbackText,
        scores: {
          relevance: Math.floor(Math.random() * 20) + 70,
          clarity: Math.floor(Math.random() * 20) + 70,
          depth: Math.floor(Math.random() * 20) + 70
        },
        technical: {
          score: Math.floor(Math.random() * 20) + 70,
          strengths: ["Technical aptitude", "Problem-solving approach"],
          weaknesses: ["Could provide more specific details"],
          suggestions: ["Consider mentioning more concrete examples"]
        },
        communication: {
          score: Math.floor(Math.random() * 20) + 70,
          voice: {
            paceScore: Math.floor(Math.random() * 20) + 70,
            toneScore: Math.floor(Math.random() * 20) + 70,
            fillerWordCount: Math.floor(Math.random() * 6) + 1,
            fillerWords: ["um", "like"],
            suggestions: ["Reduce filler words", "Speak with more confidence"]
          },
          clarity: Math.floor(Math.random() * 20) + 70,
          structure: Math.floor(Math.random() * 20) + 70,
          suggestions: ["Structure your answer with STAR method", "Be more concise"]
        },
        presentation: {
          score: Math.floor(Math.random() * 20) + 70,
          posture: {
            posture: 'good',
            eyeContact: 'neutral',
            gestures: 'appropriate',
            dressCode: 'formal',
            suggestions: ["Maintain eye contact"]
          },
          confidence: Math.floor(Math.random() * 20) + 70,
          professionalism: Math.floor(Math.random() * 20) + 70,
          suggestions: ["Project more confidence", "Use professional vocabulary"]
        },
        overall: {
          score: Math.floor(Math.random() * 20) + 70,
          strengths: ["Good communication", "Relevant experience"],
          improvementAreas: ["Answer structure", "Technical depth"],
          nextSteps: ["Practice STAR method", "Research common questions"]
        }
      };
      
      // Store feedback
      const newFeedbackArray = [...feedback];
      newFeedbackArray[currentQuestionIndex] = simpleFeedback;
      setFeedback(newFeedbackArray);
      
      // Allow time to see feedback before moving to the next question
      setTimeout(() => {
        setIsLoading(false);
        
        if (currentQuestionIndex < questions.length - 1) {
          nextQuestion();
        } else {
          // Complete the interview
          setInterviewCompleted(true);
          setInterviewStarted(false);
          
          toast({
            title: "Interview Completed",
            description: "View your results and download a detailed report.",
          });
        }
      }, 1000);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate feedback. Please try again.",
        variant: "destructive"
      });
      startTimer(); // Restart the timer
    }
  };
  
  // Voice recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    // Check if Speech Recognition API is supported
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      // Get transcript
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");
      
      // Update answer
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = transcript;
      setAnswers(newAnswers);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      stopListening();
      toast({
        title: "Voice recognition error",
        description: event.error,
        variant: "destructive"
      });
    };
    
    // Start listening
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };
  
  // Generate PDF report
  const generateReport = async () => {
    if (!jobRole || questions.length === 0) {
      toast({
        title: "Cannot generate report",
        description: "Interview data is not available.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Use the enhanced PDF generation function
      const pdfFilename = await generateEnhancedPDF(jobRole, questions, answers, feedback);
      
      setIsLoading(false);
      toast({
        title: "Report generated",
        description: "Your interview report has been downloaded.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopListening();
    };
  }, []);
  
  return {
    jobRole,
    setJobRole,
    questions,
    currentQuestionIndex,
    interviewStarted,
    interviewCompleted,
    answers,
    feedback,
    isListening,
    isLoading,
    progress,
    timeRemaining,
    timePerQuestion,
    setTimePerQuestion,
    resumeText,
    setResumeText,
    
    startInterview,
    endInterview,
    nextQuestion,
    previousQuestion,
    toggleListening,
    handleAnswerChange,
    submitAnswer,
    generateReport
  };
};
