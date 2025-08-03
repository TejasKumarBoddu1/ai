import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Mic, MicOff, Play, Clock, User, Briefcase, Bot, Volume2, VolumeX, StopCircle, Camera, Send, Sparkles, Settings, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callUnifiedAI, type AIBackend } from '@/utils/ai/unifiedAIService';
import { EnhancedMicrophoneManager, EnhancedTextToSpeech, type GoogleSpeechConfig } from '@/utils/googleSpeechServices';
import ObservationCamera, { ObservationMetrics } from './ObservationCamera';
import CleanTrackingOverlay from './CleanTrackingOverlay';
import BehaviorMetricsPanel from './BehaviorMetricsPanel';
import LiveFeedbackSystem from './LiveFeedbackSystem';
import { useMetrics } from '@/context/MetricsContext';
import { useFaceApiEmotionDetection } from '@/hooks/useFaceApiEmotionDetection';
import FaceApiEmotionOverlay from './FaceApiEmotionOverlay';
import DirectFaceApiCamera from './DirectFaceApiCamera';
import EmbeddedFaceApiCamera from './EmbeddedFaceApiCamera';
// import { ObjectDetectionCamera } from './ObjectDetectionCamera';
// import { SimpleObjectDetectionCamera } from './SimpleObjectDetectionCamera';
import { AutoObjectDetectionCamera } from './AutoObjectDetectionCamera';

interface Message {
  role: 'hr' | 'candidate';
  content: string;
  timestamp: Date;
}

const IntegratedAIInterviewWithTracking: React.FC = () => {
  const [candidateName, setCandidateName] = useState('');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [duration, setDuration] = useState(15);
  const [aiBackend, setAiBackend] = useState<AIBackend>('gemini');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(85);
  const [engagementScore, setEngagementScore] = useState(72);
  const [attentivenessScore, setAttentivenessScore] = useState(90);
  const [questionCount, setQuestionCount] = useState(0);
  const [useFaceApi, setUseFaceApi] = useState(true); // Toggle for Face-API
  const [faceApiEmotions, setFaceApiEmotions] = useState<any>({
    dominant: 'neutral',
    confidence: 0,
    scores: {
      happy: 0,
      sad: 0,
      surprised: 0,
      neutral: 1,
      disgusted: 0,
      angry: 0,
      fearful: 0
    },
    icon: '😐'
  });
  const [objectDetections, setObjectDetections] = useState<any[]>([]);
  const [observationMetrics, setObservationMetrics] = useState<ObservationMetrics | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const microphoneManagerRef = useRef<EnhancedMicrophoneManager | null>(null);
  const textToSpeechRef = useRef<EnhancedTextToSpeech | null>(null);
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const conversationHistoryRef = useRef<string>('');
  const { toast } = useToast();
  const { metrics } = useMetrics();

  // Handle emotion detection from FaceApiCamera
  const handleEmotionDetected = (emotions: any) => {
    console.log('Emotions detected:', emotions);
    setFaceApiEmotions(emotions);
  };

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isInterviewStarted && timeRemaining > 0 && !isInterviewComplete) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isInterviewStarted && !isInterviewComplete) {
      completeInterview();
    }

    return () => clearInterval(intervalId);
  }, [isInterviewStarted, timeRemaining, isInterviewComplete]);

  // Auto-scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced speech services setup
  useEffect(() => {
    // Initialize speech recognition and TTS
    const speechConfig: GoogleSpeechConfig = {
      apiKey: googleApiKey || '',
      language: 'en-US',
      useEnhanced: true,
      profanityFilter: false,
      enableWordTimeOffsets: true,
      enableWordConfidence: true,
      model: 'latest_long',
      maxAlternatives: 3,
      alternativeLanguages: ['en-GB', 'en-AU']
    };

    // Initialize enhanced microphone manager
    microphoneManagerRef.current = new EnhancedMicrophoneManager(speechConfig, {
      onTranscript: (result) => {
        // Only process if confidence is high and we're not in a loading state
        if (result.isFinal && result.transcript.trim() && result.confidence > 0.7 && !isLoading) {
          console.log('🎤 High-confidence transcript:', result.transcript, 'Confidence:', result.confidence);
          setCurrentResponse(result.transcript);
          
          if (isInterviewStarted && !isInterviewComplete && !isSpeaking) {
            submitResponse();
          }
        } else if (!result.isFinal && result.confidence > 0.8) {
          // Show interim results only for very high confidence
          setCurrentResponse(result.transcript);
        }
      },
      onError: (error) => {
        console.error('Enhanced microphone error:', error);
        setIsListening(false);
        toast({
          title: "Microphone Error",
          description: error,
          variant: "destructive"
        });
      }
    });

    // Initialize enhanced text-to-speech
    textToSpeechRef.current = new EnhancedTextToSpeech(speechConfig, {
      onSpeechStart: () => {
        console.log('🗣️ AI speech started - muting microphone');
        setIsSpeaking(true);
        // Immediately mute microphone when AI starts speaking
        if (microphoneManagerRef.current) {
          microphoneManagerRef.current.muteForAIResponse();
        }
        setIsListening(false);
      },
      onSpeechEnd: () => {
        console.log('🗣️ AI speech ended - resuming microphone');
        setIsSpeaking(false);
        // Wait even longer before resuming microphone to prevent echo
        setTimeout(() => {
          if (microphoneManagerRef.current && isInterviewStarted && !isInterviewComplete) {
            console.log('🎤 Attempting to resume microphone after AI speech');
            microphoneManagerRef.current.resumeAfterAIResponse();
            setIsListening(true);
          }
        }, 3000); // Increased delay for more natural conversation flow
      }
    });
    
    // Force initialization of female voice
    const initializeVoice = () => {
      if (window.speechSynthesis) {
        // Create a temporary utterance to initialize the speech synthesis
        const utterance = new SpeechSynthesisUtterance('');
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        
        // Look specifically for Google UK English Female
        const ukFemaleVoice = voices.find(voice => 
          voice.name === 'Google UK English Female' || 
          voice.name.includes('Google UK English Female')
        );
        
        if (ukFemaleVoice) {
          console.log('Setting default voice to Google UK English Female');
          utterance.voice = ukFemaleVoice;
          // Speak an empty string to initialize the voice
          window.speechSynthesis.speak(utterance);
          window.speechSynthesis.cancel();
        } else {
          // Fallback to any female voice
          const femaleVoice = voices.find(voice => 
            (voice.name.includes('Female') || 
             voice.name.includes('female') || 
             voice.name === 'Samantha' || 
             voice.name === 'Victoria' || 
             voice.name === 'Karen') && 
            voice.lang.includes('en')
          );
          
          if (femaleVoice) {
            console.log('Google UK English Female not found. Using fallback:', femaleVoice.name);
            utterance.voice = femaleVoice;
            // Speak an empty string to initialize the voice
            window.speechSynthesis.speak(utterance);
            window.speechSynthesis.cancel();
          }
        }
      }
    };
    
    // Initialize voice when voices are available
    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length > 0) {
        initializeVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = initializeVoice;
      }
    }

    return () => {
      microphoneManagerRef.current?.stopRecording();
      textToSpeechRef.current?.stop();
    };
  }, [googleApiKey, isInterviewStarted, isInterviewComplete, toast, isLoading]);

  // Enhanced speech state management
  useEffect(() => {
    if (microphoneManagerRef.current) {
      microphoneManagerRef.current.setAISpeakingState(isSpeaking);
    }
  }, [isSpeaking]);

  // Check Face-API.js availability
  useEffect(() => {
    const checkFaceAPI = async () => {
      try {
        // Check if Face-API is loaded
        if ((window as any).faceapi) {
          console.log('Face-API.js is available');
          
          // Preload models
          try {
            const faceapi = (window as any).faceapi;
            console.log('Preloading Face-API models...');
            await Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
              faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
              faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
              faceapi.nets.faceExpressionNet.loadFromUri('/models'),
              faceapi.nets.ageGenderNet.loadFromUri('/models'),
            ]);
            console.log('Face-API models preloaded successfully');
          } catch (modelError) {
            console.error('Error preloading Face-API models:', modelError);
          }
        } else {
          console.error('Face-API.js not found! Emotion detection will not work.');
        }
      } catch (error) {
        console.error('Error checking Face-API.js:', error);
      }
    };

    checkFaceAPI();
    
    // Log all available voices for debugging
    const logAvailableVoices = () => {
      if (window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
        voices.forEach(voice => {
          console.log(`Voice: ${voice.name}, Lang: ${voice.lang}, Default: ${voice.default}, Female: ${!voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('female')}`);
        });
      }
    };
    
    // Wait for voices to be loaded
    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length > 0) {
        logAvailableVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = logAvailableVoices;
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const generateAvaPrompt = (isFirst: boolean, messageHistory: Message[] = []): string => {
    const aiModelName = aiBackend === 'gemini' ? 'Gemini' : aiBackend === 'chatgpt' ? 'ChatGPT' : 'Grok';
    
    if (isFirst) {
      return `You are Ava Taylor, a warm and charismatic AI HR interviewer powered by ${aiModelName}. You're conducting an interview for the ${jobTitle} position with ${candidateName}. 

Your personality traits:
- Genuinely warm and conversational, like talking to a friend
- Curious and engaging - you love learning about people
- Natural and spontaneous in your responses
- You adapt your conversation style based on their energy
- You use varied language and never sound scripted
- You show genuine interest with follow-ups like "Oh really? Tell me more about that!" or "That's fascinating, how did you handle that?"

Start with something natural like: "Hi ${candidateName}! I'm Ava, so excited to chat with you today about the ${jobTitle} position. Before we dive into the formal stuff, I'd love to know - what's been the highlight of your week so far?"

Remember:
- This is a FULL ${duration}-minute interview, so pace yourself naturally
- Ask follow-up questions and dive deep into their stories
- Don't rush through topics - let conversations flow naturally
- If asked about your AI model, mention you're powered by ${aiModelName}
- Be conversational, not robotic or scripted
- Use varied question styles and approaches

You have the full time to really get to know ${candidateName}!`;
    } else {
      // Build conversation context for natural flow
      const recentHistory = messageHistory.slice(-4).map(msg => 
        `${msg.role === 'hr' ? 'Ava' : candidateName}: ${msg.content}`
      ).join('\n');

      const timeLeft = Math.floor(timeRemaining / 60);
      
      return `Continue as Ava Taylor, the engaging AI interviewer powered by ${aiModelName}. 

Recent conversation:
${recentHistory}

You have ${timeLeft} minutes remaining in this ${duration}-minute interview. Based on ${candidateName}'s response:

- If they gave a brief answer, ask follow-up questions to dive deeper
- If they shared something interesting, explore it further with genuine curiosity  
- If you've covered one topic thoroughly, naturally transition to explore their background, motivations, or experiences
- Keep the conversation flowing naturally - you're having a real chat, not following a script
- Use varied language and conversational phrases
- Show genuine interest and react to what they share

Pacing guidelines:
- ${timeLeft > 10 ? 'You have plenty of time - explore topics deeply and ask follow-ups' : ''}
- ${timeLeft <= 10 && timeLeft > 5 ? 'Start transitioning to wrap up topics and get final insights' : ''}
- ${timeLeft <= 5 ? 'Begin naturally concluding the interview, maybe ask about questions they have' : ''}

If asked about your AI model, mention you're powered by ${aiModelName}.

Keep it conversational and natural!`;
    }
  };

  const progressPercentage = isInterviewStarted ? ((duration * 60 - timeRemaining) / (duration * 60)) * 100 : 0;

  const toggleListening = () => {
    if (!microphoneManagerRef.current) {
      toast({
        title: "Not Supported",
        description: "Enhanced speech recognition is not available.",
        variant: "destructive"
      });
      return;
    }

    if (isSpeaking) {
      toast({
        title: "AI is Speaking",
        description: "Please wait for the AI to finish speaking before using the microphone.",
        variant: "default"
      });
      return;
    }

    if (isListening) {
      console.log('🔇 Manual stop listening');
      microphoneManagerRef.current.stopRecording();
      setIsListening(false);
    } else {
      console.log('🎤 Manual start listening');
      microphoneManagerRef.current.startRecording();
      setIsListening(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(prevState => !prevState);
    if (!isMuted) {
      textToSpeechRef.current?.stop();
      setIsSpeaking(false);
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
    setQuestionCount(0);
    conversationHistoryRef.current = '';
    
    try {
      const prompt = generateAvaPrompt(true);
      const response = await callUnifiedAI(prompt, aiBackend);
      const hrResponse = response.text();
      
      const firstMessage: Message = {
        role: 'hr',
        content: hrResponse,
        timestamp: new Date()
      };
      
      setMessages([firstMessage]);
      setIsInterviewStarted(true);
      setTimeRemaining(duration * 60);
      setQuestionCount(1);
      
      // Update conversation history
      conversationHistoryRef.current = `Ava: ${hrResponse}`;
      
      // Wait a moment before speaking to ensure UI is ready
      setTimeout(async () => {
        if (!isMuted && textToSpeechRef.current) {
          console.log('🗣️ Starting TTS for interview introduction');
          await textToSpeechRef.current.speak(hrResponse, {
            voice: 'Google UK English Female',
            voiceGender: 'FEMALE'
          });
        }
      }, 500);
      
      toast({
        title: "Interview Started",
        description: "Your AI interview session has begun!",
      });
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast({
        title: "Error",
        description: "Failed to start the interview. Please try again.",
        variant: "destructive"
      });
      setIsInterviewStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!currentResponse.trim()) {
      return;
    }

    // Clear auto-submit timeout
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
      autoSubmitTimeoutRef.current = null;
    }

    setIsLoading(true);
    const userMessage: Message = {
      role: 'candidate',
      content: currentResponse,
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Update conversation history
    conversationHistoryRef.current += `\n${candidateName}: ${currentResponse}`;
    
    setCurrentResponse('');

    try {
      // Only wrap up when time is actually running out
      if (timeRemaining < 60) { // Only 1 minute remaining
        completeInterview();
        return;
      }

      const prompt = generateAvaPrompt(false, updatedMessages);
      const aiResponse = await callUnifiedAI(prompt, aiBackend);
      const hrResponse = aiResponse.text();
      
      if (hrResponse) {
        const aiMessage: Message = {
          role: 'hr',
          content: hrResponse,
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        setQuestionCount(prev => prev + 1);
        
        // Update conversation history
        conversationHistoryRef.current += `\nAva: ${hrResponse}`;
        
        if (!isMuted && textToSpeechRef.current) {
          await textToSpeechRef.current.speak(hrResponse, {
            voice: 'Google UK English Female',
            voiceGender: 'FEMALE'
          });
        }
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeInterview = () => {
    setIsInterviewComplete(true);
    setIsInterviewStarted(false);
    textToSpeechRef.current?.stop();
    setIsSpeaking(false);
    if (isListening) {
      microphoneManagerRef.current?.stopRecording();
      setIsListening(false);
    }
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
    }
    
    // Add closing message from Ava
    const closingMessage: Message = {
      role: 'hr',
      content: `Thank you, ${candidateName}, for taking the time to speak with me today. Your responses have been insightful and I've enjoyed our conversation. The next steps will be communicated to you soon. Have a wonderful day!`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, closingMessage]);
    
    if (!isMuted && textToSpeechRef.current) {
      textToSpeechRef.current.speak(closingMessage.content, {
        voice: 'Google UK English Female',
        voiceGender: 'FEMALE'
      });
    }
    
    toast({
      title: "Interview Complete",
      description: "Thank you for completing the AI interview!",
    });
  };

  const resetInterview = () => {
    setIsInterviewStarted(false);
    setIsInterviewComplete(false);
    setMessages([]);
    setCurrentResponse('');
    setTimeRemaining(duration * 60);
    setConfidenceScore(85);
    setEngagementScore(72);
    setAttentivenessScore(90);
    setQuestionCount(0);
    conversationHistoryRef.current = '';
    textToSpeechRef.current?.stop();
    setIsSpeaking(false);
    if (isListening) {
      microphoneManagerRef.current?.stopRecording();
      setIsListening(false);
    }
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
    }
    toast({
      title: "Ready for Next Interview",
      description: "You can start a new interview session.",
    });
  };

  // Setup phase
  if (!isInterviewStarted) {
    return (
      <div className="p-8">
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interview Setup
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 mt-2">
              Configure your AI interview session with Ava Taylor
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-title" className="text-sm font-semibold text-slate-700">Position *</Label>
                <Select value={jobTitle} onValueChange={setJobTitle}>
                  <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                    <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                    <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ai-backend" className="text-sm font-semibold text-slate-700">AI Interviewer</Label>
                <Select value={aiBackend} onValueChange={(value: AIBackend) => setAiBackend(value)}>
                  <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <Bot className="h-4 w-4 mr-2" />
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
                <Label htmlFor="duration" className="text-sm font-semibold text-slate-700">Duration</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                  <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
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
              <Label htmlFor="google-api-key" className="text-sm font-semibold text-slate-700">
                Google API Key (Optional)
                <span className="text-xs text-slate-500 font-normal ml-2">
                  For enhanced speech recognition and voice quality
                </span>
              </Label>
              <Input
                id="google-api-key"
                type="password"
                placeholder="Enter your Google Cloud API key (optional)"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <p className="text-xs text-slate-500">
                <Settings className="h-3 w-3 inline mr-1" />
                Without API key: Uses browser's built-in speech services. With API key: Enhanced Google Speech-to-Text and Text-to-Speech.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="face-api-toggle" className="text-sm font-semibold text-slate-700">
                  Face-API Emotion Detection
                  <span className="text-xs text-slate-500 font-normal ml-2">
                    Detect emotions during interview
                  </span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="face-api-toggle"
                    checked={useFaceApi}
                    onCheckedChange={setUseFaceApi}
                  />
                  <Label htmlFor="face-api-toggle" className="text-sm text-slate-600">
                    {useFaceApi ? "Enabled" : "Disabled"}
                  </Label>
                </div>
                <p className="text-xs text-slate-500">
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  Analyzes facial expressions to detect emotions and provides real-time feedback
                </p>
              </div>
            </div>

            <Button
              onClick={startInterview}
              disabled={isLoading || !candidateName.trim() || !jobTitle}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Starting Interview...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Start Interview with Ava
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main interview interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Left Sidebar - Camera and Metrics */}
        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Camera className="h-4 w-4 text-blue-600" />
                Observation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100">
                <ObservationCamera onMetricsUpdate={setObservationMetrics} />
                <CleanTrackingOverlay
                  metrics={{
                    handPresence: metrics?.handPresence || false,
                    facePresence: metrics?.facePresence || false,
                    posePresence: metrics?.posePresence || false,
                    eyeContact: !(metrics?.notFacingCounter > 0),
                    posture: (metrics?.badPostureDetectionCounter || 0) > 0 ? 'poor' : 'good',
                    confidence: confidenceScore
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Face-API Emotion Detection Camera */}
          {useFaceApi && (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Emotion Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="face-detection-container relative w-full aspect-video">
                  <EmbeddedFaceApiCamera onEmotionDetected={handleEmotionDetected} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Object Detection Camera */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Scan className="h-4 w-4 text-blue-600" />
                Object Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="object-detection-container relative w-full aspect-video">
                <AutoObjectDetectionCamera onDetectionChange={setObjectDetections} />
              </div>
            </CardContent>
          </Card>

          {/* Emotion Detection Analytics Card */}
          {useFaceApi && (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Emotion Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {/* Emotion Display */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
                  <span className="text-4xl">{faceApiEmotions.icon}</span>
                  <div>
                    <div className="font-medium capitalize text-lg">{faceApiEmotions.dominant}</div>
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        try {
                          return `${Math.round(Number(faceApiEmotions.confidence) * 100)}%`;
                        } catch (e) {
                          return '0%';
                        }
                      })()} confidence
                    </div>
                    {faceApiEmotions.age && faceApiEmotions.gender && (
                      <div className="text-sm text-muted-foreground">
                        ~{(() => {
                          try {
                            return Math.round(Number(faceApiEmotions.age));
                          } catch (e) {
                            return 0;
                          }
                        })()} years, {faceApiEmotions.gender}
                      </div>
                    )}
                  </div>
                </div>

                {/* Emotion Scores Bar Chart */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium mb-2">Emotion Analysis</h4>
                  {Object.entries(faceApiEmotions.scores).map(([emotion, score]) => (
                    <div key={emotion} className="grid grid-cols-6 items-center gap-2">
                      <span className="text-xs font-medium capitalize col-span-2">{emotion}</span>
                      <div className="col-span-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className={`h-full ${getEmotionColor(emotion)}`} 
                          style={{ width: `${(() => {
                            try {
                              return Math.round(Number(score) * 100);
                            } catch (e) {
                              return 0;
                            }
                          })()}%` }}
                        />
                      </div>
                      <span className="text-xs text-right">
                        {(() => {
                          try {
                            return Math.round(Number(score) * 100);
                          } catch (e) {
                            return 0;
                          }
                        })()}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <BehaviorMetricsPanel 
            metrics={{
              handDetectionCounter: observationMetrics?.handDetectionCounter || 0,
              handDetectionDuration: observationMetrics?.handDetectionDuration || 0,
              notFacingCounter: observationMetrics?.notFacingCounter || 0,
              notFacingDuration: observationMetrics?.notFacingDuration || 0,
              badPostureDetectionCounter: observationMetrics?.badPostureDetectionCounter || 0,
              badPostureDuration: observationMetrics?.badPostureDuration || 0,
              handPresence: observationMetrics?.handPresence || false,
              eyeContact: observationMetrics ? !(observationMetrics.notFacingRef.current) : true,
              posture: observationMetrics?.hasBadPostureRef.current ? 'poor' : 'good'
            }}
            confidenceScore={confidenceScore}
            engagementScore={engagementScore}
            attentivenessScore={attentivenessScore}
            objectDetections={objectDetections}
          />
        </div>

        {/* Main Interview Area */}
        <div className="lg:col-span-3 flex flex-col space-y-6 h-screen">
          {/* Header */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">Interview with Ava Taylor</CardTitle>
                  <CardDescription className="text-base text-slate-600">
                    {jobTitle} • {candidateName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-slate-50">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                    className="hover:bg-slate-50"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  {isSpeaking && (
                    <Badge className="animate-pulse bg-green-100 text-green-700 border-green-200">
                      Ava Speaking
                    </Badge>
                  )}
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 mt-4 bg-slate-100" />
            </CardHeader>
          </Card>

          {/* Enhanced Live Feedback */}
          {metrics && (
            <LiveFeedbackSystem
              eyeContact={!(metrics.notFacingCounter > 5)} // More tolerance for eye contact
              posture={(metrics.badPostureDetectionCounter || 0) > 3 ? 'poor' : 'good'} // More tolerance for posture
              handPresence={metrics.handPresence || false}
              isInterviewActive={isInterviewStarted && !isInterviewComplete}
            />
          )}

          {/* Messages Area */}
          <Card className="flex-1 bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <ScrollArea className="h-[400px] p-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-4 ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-4 max-w-[85%] ${message.role === 'candidate' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className={`${message.role === 'hr' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'} border-2 border-white shadow-md`}>
                        <AvatarFallback className="text-white">
                          {message.role === 'hr' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-2xl px-6 py-4 shadow-md ${
                        message.role === 'hr' 
                          ? 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200' 
                          : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
                      }`}>
                        <div className="text-xs font-medium text-slate-500 mb-2">
                          {message.role === 'hr' ? 'Ava Taylor' : candidateName} • {message.timestamp.toLocaleTimeString()}
                        </div>
                        <p className="text-slate-800 leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-4">
                      <Avatar className="bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-white shadow-md">
                        <AvatarFallback className="text-white">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl px-6 py-4 shadow-md">
                        <div className="text-xs font-medium text-slate-500 mb-2">Ava Taylor</div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            {!isInterviewComplete && (
              <CardContent className="border-t border-slate-100 p-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Share your response here or use voice input..."
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      className="flex-1 min-h-[100px] border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          e.preventDefault();
                          submitResponse();
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleListening}
                        className={`h-12 w-12 ${isListening ? "bg-red-50 border-red-300 text-red-600" : "hover:bg-slate-50"}`}
                      >
                        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={completeInterview}
                        size="sm"
                        className="text-slate-600 hover:bg-slate-50"
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        End Interview
                      </Button>
                      {isListening && (
                        <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                          Listening...
                        </Badge>
                      )}
                      {autoSubmitTimeoutRef.current && (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                          Auto-submit in 3s...
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      onClick={submitResponse}
                      disabled={isLoading || !currentResponse.trim() || isSpeaking}
                      className="px-8 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Submit
                        </div>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 text-center">Auto-submit after 3 seconds • Press Ctrl+Enter to submit quickly</p>
                </div>
              </CardContent>
            )}

            {/* Completion Screen */}
            {isInterviewComplete && (
              <CardContent className="border-t border-slate-100 p-8 text-center">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Interview Complete!</h3>
                    <p className="text-slate-600">
                      Thank you for interviewing with Ava Taylor. Here's your performance summary.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600">{confidenceScore}%</div>
                      <div className="text-sm font-medium text-slate-600">Confidence</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                      <div className="text-3xl font-bold text-emerald-600">{engagementScore}%</div>
                      <div className="text-sm font-medium text-slate-600">Engagement</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="text-3xl font-bold text-purple-600">{attentivenessScore}%</div>
                      <div className="text-sm font-medium text-slate-600">Attentiveness</div>
                    </div>
                  </div>
                  <Button 
                    onClick={resetInterview}
                    className="px-8 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Start New Interview
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntegratedAIInterviewWithTracking;

// Helper function to get color for each emotion
const getEmotionColor = (emotion: string): string => {
  switch (emotion) {
    case 'happy':
      return 'bg-green-500';
    case 'sad':
      return 'bg-blue-500';
    case 'surprised':
      return 'bg-yellow-500';
    case 'neutral':
      return 'bg-gray-500';
    case 'disgusted':
      return 'bg-purple-500';
    case 'angry':
      return 'bg-red-500';
    case 'fearful':
      return 'bg-orange-500';
    default:
      return 'bg-slate-500';
  }
};
