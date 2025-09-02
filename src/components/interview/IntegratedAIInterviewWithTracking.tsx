import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Play, Clock, User, Briefcase, Bot, Volume2, VolumeX, StopCircle, Camera, Send, Scan, BarChart3, Target, History, Square, FileText, Code, Eye, Brain, Sparkles, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callUnifiedAI, type AIBackend } from '@/utils/ai/unifiedAIService';
import { EnterpriseSpeechManager, DEFAULT_SPEECH_CONFIG } from '@/utils/enterpriseSpeechSystem';
import ObservationCamera, { ObservationMetrics } from './ObservationCamera';
import CleanTrackingOverlay from './CleanTrackingOverlay';
import BehaviorMetricsPanel from './BehaviorMetricsPanel';
import LiveFeedbackSystem from './LiveFeedbackSystem';
import { useMetrics } from '@/context/MetricsContext';

import FaceApiEmotionOverlay from './FaceApiEmotionOverlay';
import DirectFaceApiCamera from './DirectFaceApiCamera';
import EmbeddedFaceApiCamera from './EmbeddedFaceApiCamera';
// import { ObjectDetectionCamera } from './ObjectDetectionCamera';
// import { SimpleObjectDetectionCamera } from './SimpleObjectDetectionCamera';
import { AutoObjectDetectionCamera } from './AutoObjectDetectionCamera';
import { interviewDataStorage } from '@/utils/interviewDataStorage';
import InterviewHistory from './InterviewHistory';
import DocumentSharing from './DocumentSharing';
import CodeEditor from './CodeEditor';
import { InterviewUpload } from './InterviewUpload';
import AvatarStage from './avatar3d/AvatarStage';
import NewTalkingHeadAvatar from './avatar3d/NewTalkingHeadAvatar';
import { createDetectionManager, type DetectionSnapshot } from '@/utils/unifiedDetectionManager';

/**
 * IMPROVEMENTS MADE TO PHONE DETECTION SYSTEM:
 * 
 * 1. ENHANCED WARNING LOGIC:
 *    - First warning: 10-second delay after phone detection
 *    - Subsequent warnings: 4-second intervals (with cooldown)
 *    - Maximum 4 warnings before interview termination
 *    - Cooldown periods to prevent spam warnings
 * 
 * 2. VISUAL INDICATORS:
 *    - Live Performance container beside AI Avatar (right side)
 *    - Phone detection status in Live Performance container
 *    - Phone detection indicator in Object Detection card header
 *    - Countdown timer for first warning
 *    - Color-coded warning levels (yellow -> orange -> red)
 * 
 * 3. IMPROVED MONITORING:
 *    - State-based phone detection tracking
 *    - Proper cleanup and reset functionality
 *    - Enhanced debugging and logging
 *    - Performance metrics display
 * 
 * 4. USER EXPERIENCE:
 *    - Clear warning progression (1/4, 2/4, 3/4, 4/4)
 *    - Real-time status updates
 *    - Automatic interview termination after 4 warnings
 *    - Proper state management and cleanup
 */

// Optional developer params for TTS/voice
const DEV_TTS_OPTIONS = {
  temperature: 0.7,
  voice: 'en-US-JennyNeural',
  emotion: 'cheerful',
  max_tokens: 200,
  rate: 0.95,
  pitch: 1.0,
  volume: 0.9
};

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

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visemeHint, setVisemeHint] = useState<string>('');
  const [reactionTick, setReactionTick] = useState<number>(0);
  const [speechRecognitionWorking, setSpeechRecognitionWorking] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(85);
  const [engagementScore, setEngagementScore] = useState(72);
  const [attentivenessScore, setAttentivenessScore] = useState(90);
  const [questionCount, setQuestionCount] = useState(0);
  const [resumeText, setResumeText] = useState('');

  const [showHistory, setShowHistory] = useState(false);
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
  
  // Multiple People Detection States
  const [multiplePeopleWarningCount, setMultiplePeopleWarningCount] = useState(0);
  const [isMultiplePeopleWarningActive, setIsMultiplePeopleWarningActive] = useState(false);
  const [lastMultiplePeopleWarningTime, setLastMultiplePeopleWarningTime] = useState<number>(0);
  const [lastDetectionHash, setLastDetectionHash] = useState<string>('');

  // Phone Detection Warning States
  const [phoneWarningCount, setPhoneWarningCount] = useState(0);
  const [isPhoneWarningActive, setIsPhoneWarningActive] = useState(false);
  const [lastPhoneWarningTime, setLastPhoneWarningTime] = useState<number>(0);

  // Global detection pause
  const [isDetectionPaused, setIsDetectionPaused] = useState(false);
  const detectionPauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Interview data storage session ID
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const speechManagerRef = useRef<EnterpriseSpeechManager | null>(null);
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const conversationHistoryRef = useRef<string>('');
  // Enhanced speech recognition handling
  const [confirmedResponse, setConfirmedResponse] = useState('');
  const [interimResponse, setInterimResponse] = useState('');
  const [lastTranscriptRef, setLastTranscriptRef] = useState('');
  const [isContinuousSpeaking, setIsContinuousSpeaking] = useState(false);
  const [speechTimeout, setSpeechTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  const { toast } = useToast();
  const { metrics } = useMetrics();
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Detection manager (scratch logic)
  const detectionManagerRef = useRef<ReturnType<typeof createDetectionManager> | null>(null);

  // Response time tracking for Live Performance
  const [lastResponseTime, setLastResponseTime] = useState<Date | null>(null);
  const [responseTimeout, setResponseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  
  // Performance optimization refs
  const lastPerformanceUpdateRef = useRef<number>(0);
  const emotionStorageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Document sharing and code editor features
  const [showDocumentSharing, setShowDocumentSharing] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [documentAnalysis, setDocumentAnalysis] = useState<string>('');
  const [codeAnalysis, setCodeAnalysis] = useState<string>('');

  // Track when AI asks a question and starts waiting for response
  const startWaitingForResponse = () => {
    setLastResponseTime(new Date());
    setIsWaitingForResponse(true);
    
    // Clear existing timeout
    if (responseTimeout) {
      clearTimeout(responseTimeout);
    }
    
    // Set timeout to decrease performance after 30 seconds of no response
    const timeout = setTimeout(() => {
      decreasePerformanceForNoResponse();
    }, 30000); // 30 seconds
    
    setResponseTimeout(timeout);
  };

  // Helper: start a global 5s detection pause (blocks monitorObjectDetection processing)
  const startDetectionPause = (ms: number = 5000) => {
    if (detectionPauseTimeoutRef.current) {
      clearTimeout(detectionPauseTimeoutRef.current);
      detectionPauseTimeoutRef.current = null;
    }
    setIsDetectionPaused(true);
    detectionPauseTimeoutRef.current = setTimeout(() => {
      setIsDetectionPaused(false);
      // Allow a fresh event after pause
      setLastDetectionHash('');
      detectionPauseTimeoutRef.current = null;
    }, ms);
  };

  // Decrease performance when no response for a while
  const decreasePerformanceForNoResponse = () => {
    setLivePerformance(prev => {
      const newPerformance = {
        confidence: Math.max(0, prev.confidence - 2),
        engagement: Math.max(0, prev.engagement - 3),
        attentiveness: Math.max(0, prev.attentiveness - 4)
      };
      
      // Update storage
      if (sessionId) {
        interviewDataStorage.updateScores({
          confidenceScore: newPerformance.confidence,
          engagementScore: newPerformance.engagement,
          attentivenessScore: newPerformance.attentiveness
        });
      }
      
      return newPerformance;
    });
    
    // Continue decreasing if still waiting
    if (isWaitingForResponse) {
      const timeout = setTimeout(() => {
        decreasePerformanceForNoResponse();
      }, 15000); // Decrease every 15 seconds after initial 30 seconds
      
      setResponseTimeout(timeout);
    }
  };

  // Stop waiting when user responds
  const stopWaitingForResponse = () => {
    setIsWaitingForResponse(false);
    if (responseTimeout) {
      clearTimeout(responseTimeout);
      setResponseTimeout(null);
    }
  };

  // Handle continuous speech without text duplication
  const handleContinuousSpeech = (transcript: string, isFinal: boolean) => {
    console.log('🎤 Processing speech:', { transcript, isFinal, length: transcript.length });
    
    // Prevent duplicate processing of the same transcript
    if (transcript === lastProcessedTranscript && isFinal) {
      console.log('🎤 Skipping duplicate transcript');
      return;
    }

    if (isFinal) {
      console.log('🎤 Processing final transcript');
      
      // For final results, replace the entire confirmed response
      // This handles long sentences better by not trying to merge partial results
      setConfirmedResponse(transcript);
      setInterimResponse('');
      setIsContinuousSpeaking(false);
      setLastTranscriptRef(transcript);
      setLastProcessedTranscript(transcript);
      
      console.log('🎤 Final transcript set:', transcript);
    } else {
      console.log('🎤 Processing interim transcript');
      
      // For interim results, show the current progress
      setInterimResponse(transcript);
      setIsContinuousSpeaking(true);
      
      // Clear existing timeout
      if (speechTimeout) {
        clearTimeout(speechTimeout);
      }
      
      // Set new timeout to handle speech pauses (longer for better long sentence support)
      const timeout = setTimeout(() => {
        if (isContinuousSpeaking) {
          console.log('🎤 Speech pause detected, clearing interim response');
          setInterimResponse('');
          setIsContinuousSpeaking(false);
        }
      }, 3000); // 3 second pause threshold for long sentences
      
      setSpeechTimeout(timeout);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    // init detection manager
    detectionManagerRef.current = createDetectionManager(
      {
        onWarning: (type, nextCount, message) => {
          // set overlay + pause handled below
          setIsWarningActive(true);
          setWarningMessage(message);
          if (type === 'phone') {
            setPhoneWarningCount(nextCount);
            setIsPhoneWarningActive(true);
          } else {
            setMultiplePeopleWarningCount(nextCount);
            setIsMultiplePeopleWarningActive(true);
          }
          // speak
          speechManagerRef.current?.speak(message.replace('⚠️','').trim(), { ...DEV_TTS_OPTIONS, voice: DEV_TTS_OPTIONS.voice });
          // global pause
          startDetectionPause(5000);
          // auto-hide overlay after 5s
          const t = setTimeout(() => {
            setIsWarningActive(false);
            setWarningMessage('');
            setIsPhoneWarningActive(false);
            setIsMultiplePeopleWarningActive(false);
          }, 5000);
          setWarningTimeout(t);
        },
        onResume: () => {
          // nothing special; detections resume automatically
        },
        onTerminate: (type, count, message) => {
          terminateInterview(message);
        }
      },
      { pauseMs: 5000 }
    );

    return () => {
      if (speechTimeout) {
        clearTimeout(speechTimeout);
      }
      if (detectionPauseTimeoutRef.current) {
        clearTimeout(detectionPauseTimeoutRef.current);
        detectionPauseTimeoutRef.current = null;
      }
    };
  }, [speechTimeout]);

  // Update the onTranscript handler
  const onTranscript = (result: import('@/utils/googleSpeechServices').SpeechRecognitionResult) => {
    const transcript = result.transcript.trim();
    handleContinuousSpeech(transcript, result.isFinal);
  };

  // Live Performance System
  const [livePerformance, setLivePerformance] = useState({
    confidence: 85,
    engagement: 72,
    attentiveness: 90
  });

  // Performance calculation weights
  const performanceWeights = {
    eyeContact: { confidence: 0.3, engagement: 0.2, attentiveness: 0.4 },
    handPositioning: { confidence: 0.2, engagement: 0.1, attentiveness: 0.1 },
    posture: { confidence: 0.3, engagement: 0.2, attentiveness: 0.2 },
    emotions: { confidence: 0.2, engagement: 0.5, attentiveness: 0.3 }
  };

  // Calculate live performance based on behavior and emotions
  const calculateLivePerformance = (behaviorData: any, emotionData: any) => {
    let confidenceChange = 0;
    let engagementChange = 0;
    let attentivenessChange = 0;

    // Eye contact analysis
    if (behaviorData.eyeContact === false) {
      confidenceChange -= 2;
      attentivenessChange -= 3;
    } else if (behaviorData.eyeContact === true) {
      confidenceChange += 1;
      attentivenessChange += 2;
    }

    // Hand positioning analysis
    if (behaviorData.handPresence === false) {
      confidenceChange -= 1;
      engagementChange -= 1;
    } else if (behaviorData.handPresence === true) {
      confidenceChange += 0.5;
      engagementChange += 0.5;
    }

    // Posture analysis
    if (behaviorData.posture === 'poor') {
      confidenceChange -= 2;
      engagementChange -= 1;
      attentivenessChange -= 1;
    } else if (behaviorData.posture === 'good') {
      confidenceChange += 1;
      engagementChange += 0.5;
      attentivenessChange += 0.5;
    }

    // Emotion analysis
    const dominantEmotion = emotionData.dominant;
    const confidence = emotionData.confidence;

    switch (dominantEmotion) {
      case 'happy':
        confidenceChange += 2;
        engagementChange += 3;
        attentivenessChange += 1;
        break;
      case 'neutral':
        confidenceChange += 0.5;
        engagementChange += 0.5;
        attentivenessChange += 0.5;
        break;
      case 'surprised':
        confidenceChange += 1;
        engagementChange += 2;
        attentivenessChange += 1;
        break;
      case 'sad':
        confidenceChange -= 3;
        engagementChange -= 2;
        attentivenessChange -= 1;
        break;
      case 'angry':
        confidenceChange -= 2;
        engagementChange -= 1;
        attentivenessChange -= 1;
        break;
      case 'fearful':
        confidenceChange -= 4;
        engagementChange -= 2;
        attentivenessChange -= 2;
        break;
      case 'disgusted':
        confidenceChange -= 1;
        engagementChange -= 1;
        attentivenessChange -= 0.5;
        break;
    }

    // Apply confidence multiplier
    const emotionMultiplier = confidence / 100;
    confidenceChange *= emotionMultiplier;
    engagementChange *= emotionMultiplier;
    attentivenessChange *= emotionMultiplier;

    // Update live performance with bounds
    setLivePerformance(prev => {
      const newPerformance = {
        confidence: Math.max(0, Math.min(100, prev.confidence + confidenceChange)),
        engagement: Math.max(0, Math.min(100, prev.engagement + engagementChange)),
        attentiveness: Math.max(0, Math.min(100, prev.attentiveness + attentivenessChange))
      };
      
      // Update storage with new performance scores
      if (sessionId) {
        interviewDataStorage.updateScores({
          confidenceScore: newPerformance.confidence,
          engagementScore: newPerformance.engagement,
          attentivenessScore: newPerformance.attentiveness
        });
      }
      
      return newPerformance;
    });
  };

  // Enhanced emotion detection with live performance update - optimized for performance
  const handleEmotionDetected = (emotions: any) => {
    // Handle both array and single object formats
    const emotionData = Array.isArray(emotions) ? emotions[0] : emotions;
    

    
    if (emotionData && emotionData.dominant) {
      // Update the UI state for emotion display immediately
      setFaceApiEmotions({
            dominant: emotionData.dominant,
            confidence: emotionData.confidence,
            scores: emotionData.scores,
            icon: emotionData.icon || getEmotionColor(emotionData.dominant),
            age: emotionData.age,
            gender: emotionData.gender
      });
      
      // Monitor face visibility - if we get emotion data, face is visible
      monitorFaceVisibility(true);
      
      // Add emotion to storage instantly
      if (sessionId) {
          interviewDataStorage.addEmotion({
            dominant: emotionData.dominant,
            confidence: emotionData.confidence,
            scores: emotionData.scores,
            icon: emotionData.icon || getEmotionColor(emotionData.dominant)
          });
      }

      // Update live performance instantly
        calculateLivePerformance(
          { eyeContact: true, handPresence: true, posture: 'good' }, // Default behavior
          emotionData
        );
    } else {
      // No emotion data means face might not be visible
      monitorFaceVisibility(false);
    }
  };

  // Enhanced behavior analysis with live performance update
  const handleBehaviorAnalysis = (behaviorData: any) => {
    // Add behavior to storage
    interviewDataStorage.addBehaviorAnalysis({
      handDetectionCounter: behaviorData.handDetectionCounter || 0,
      handDetectionDuration: behaviorData.handDetectionDuration || 0,
      notFacingCounter: behaviorData.notFacingCounter || 0,
      notFacingDuration: behaviorData.notFacingDuration || 0,
      badPostureDetectionCounter: behaviorData.badPostureDetectionCounter || 0,
      badPostureDuration: behaviorData.badPostureDuration || 0,
      handPresence: behaviorData.handPresence || true,
      eyeContact: behaviorData.eyeContact || true,
      posture: behaviorData.posture || 'good'
    });

    // Update live performance
    calculateLivePerformance(
      behaviorData,
      { dominant: 'neutral', confidence: 85 } // Default emotion
    );
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

  // Save behavior analysis data when observation metrics change
  useEffect(() => {
    if (observationMetrics && sessionId) {
      const behaviorData = {
        handDetectionCounter: observationMetrics.handDetectionCounter || 0,
        handDetectionDuration: observationMetrics.handDetectionDuration || 0,
        notFacingCounter: observationMetrics.notFacingCounter || 0,
        notFacingDuration: observationMetrics.notFacingDuration || 0,
        badPostureDetectionCounter: observationMetrics.badPostureDetectionCounter || 0,
        badPostureDuration: observationMetrics.badPostureDuration || 0,
        handPresence: observationMetrics.handPresence || false,
        eyeContact: observationMetrics ? !(observationMetrics.notFacingRef.current) : true,
        posture: observationMetrics?.hasBadPostureRef.current ? 'poor' : 'good'
      };

      // Update live performance based on behavior
      handleBehaviorAnalysis(behaviorData);
    }
  }, [observationMetrics, sessionId]);

  // Update scores in local storage when they change
  useEffect(() => {
    if (sessionId) {
      interviewDataStorage.updateScores({
        confidenceScore,
        engagementScore,
        attentivenessScore
      });
    }
  }, [confidenceScore, engagementScore, attentivenessScore, sessionId]);

  // Auto-scroll effect
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Show/hide scroll-to-bottom button
  useEffect(() => {
    const chatArea = document.getElementById('ava-chat-scroll-area');
    if (!chatArea) return;
    const handleScroll = () => {
      const atBottom = chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight < 10;
      setShowScrollButton(!atBottom);
    };
    chatArea.addEventListener('scroll', handleScroll);
    return () => chatArea.removeEventListener('scroll', handleScroll);
  }, []);

  // Enterprise speech services setup
  useEffect(() => {
    // Initialize enterprise speech manager
    const speechConfig = {
      ...DEFAULT_SPEECH_CONFIG,
      stt: {
        ...DEFAULT_SPEECH_CONFIG.stt,
        language: 'en-US'
      }
    };

    console.log('🎤 Initializing speech manager with config:', speechConfig);
    speechManagerRef.current = new EnterpriseSpeechManager(speechConfig);
    console.log('✅ Speech manager initialized successfully');

    // Setup event handlers
    speechManagerRef.current.on('interim', (result: any) => {
      console.log('🎤 Interim transcript:', result.transcript);
      setSpeechRecognitionWorking(true);
      handleContinuousSpeech(result.transcript, false);
    });

    speechManagerRef.current.on('final', (result: any) => {
      console.log('🎤 Final transcript:', result.transcript);
      setSpeechRecognitionWorking(true);
      handleContinuousSpeech(result.transcript, true);
    });

    speechManagerRef.current.on('error', (error: any) => {
      console.error('STT Error:', error);
      setIsListening(false);
      toast({
        title: "Microphone Error",
        description: error,
        variant: "destructive"
      });
    });

    speechManagerRef.current.on('speaking_start', () => {
      console.log('🗣️ AI speech started');
      setIsSpeaking(true);
    });

    speechManagerRef.current.on('speaking_end', () => {
      console.log('🗣️ AI speech ended');
      setIsSpeaking(false);
      // Trigger micro reaction (nod/tilt) on avatar when sentence finishes
      setReactionTick((v) => v + 1);
    });

    speechManagerRef.current.on('stt_start', () => {
      console.log('🎤 Enterprise speech recognition started');
      setSpeechRecognitionWorking(true);
    });

    speechManagerRef.current.on('stt_end', () => {
      console.log('🎤 Enterprise speech recognition ended');
      setSpeechRecognitionWorking(false);
    });
    // Lip-sync boundary events (approximate visemes)
    speechManagerRef.current.on('tts_boundary', (payload: any) => {
      console.log('🎯 TTS Boundary event received:', payload);
      if (payload?.viseme) {
        console.log('🎭 Setting viseme hint:', payload.viseme);
        setVisemeHint(payload.viseme);
      } else {
        console.log('⚠️ TTS Boundary event missing viseme data:', payload);
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
          // Don't speak empty string - just set the voice
          // window.speechSynthesis.speak(utterance);
          // window.speechSynthesis.cancel();
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
            // Don't speak empty string - just set the voice
            // window.speechSynthesis.speak(utterance);
            // window.speechSynthesis.cancel();
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
      speechManagerRef.current?.stopRecording();
      speechManagerRef.current?.stopSpeaking();
    };
      }, [isInterviewStarted, isInterviewComplete, toast, isLoading]);

  // Function to speak text using the speech manager (which handles avatar lip-sync)
  const speakText = async (text: string, onStart?: () => void, onEnd?: () => void) => {
    if (!speechManagerRef.current) {
      console.warn('Speech manager not available');
      return;
    }

    try {
      // Set speaking state for avatar
      if (onStart) onStart();
      
      // Use speech manager which will trigger avatar lip-sync
      await speechManagerRef.current.speak(text);
      
      if (onEnd) onEnd();
    } catch (error) {
      console.error('Error speaking text:', error);
      if (onEnd) onEnd();
    }
  };

  // User controls microphone manually - no automatic management

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const generateAvaPrompt = (isFirst: boolean, messageHistory: Message[] = []): string => {
    const aiModelName = aiBackend === 'gemini' ? 'Gemini' : aiBackend === 'chatgpt' ? 'ChatGPT' : 'Grok';
    const hasResume = !!resumeText.trim();
    const resumeSnippet = hasResume ? resumeText.trim().slice(0, 3000) : '';
    const remainingResumeVerification = hasResume ? Math.max(0, 3 - questionCount) : 0;
    
    if (isFirst) {
      return `You are Ava Taylor, a warm and charismatic AI HR interviewer powered by ${aiModelName}. You're conducting an interview for the ${jobTitle} position with ${candidateName}. 

Your personality traits:
- Genuinely warm and conversational, like talking to a friend
- Curious and engaging - you love learning about people
- Natural and spontaneous in your responses
- You adapt your conversation style based on their energy
- You use varied language and never sound scripted
- You show genuine interest with follow-ups like "Oh really? Tell me more about that!" or "That's fascinating, how did you handle that?"

HR interviewing guidelines:
- Be structured and fair; avoid bias and leading questions
- Prefer behavioral and situational prompts; use STAR guidance where helpful
- Probe for impact, scope, collaboration, trade-offs, and measurable outcomes
- Calibrate difficulty to ${jobTitle} level; mix soft skills, problem-solving, and role-specific depth
- Keep questions open‑ended, one at a time; ask clear, concise follow‑ups
- Maintain a supportive, professional tone while staying engaging

${hasResume ? `Candidate resume (for your reference; do not read verbatim):\n${resumeSnippet}\n\nFirst question requirement (resume validation): Start by referencing a concrete item from the resume (a project, achievement, certification, or technology). Ask an open‑ended question that validates the claim by eliciting specifics: context, the candidate's exact role, key decisions/trade‑offs, tools/stack, collaborators/stakeholders, measurable outcomes, and how success was verified (metrics, links, or customer impact). Keep it friendly and concise; one question only.` : `Start with something natural like: "Hi ${candidateName}! I'm Ava, so excited to chat with you today about the ${jobTitle} position. Before we dive into the formal stuff, I'd love to know - what's been the highlight of your week so far?"`}

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
${hasResume ? '\nReference the resume when relevant to deepen the discussion (projects, achievements, tools), but do not read or quote it verbatim.' : ''}

${remainingResumeVerification > 0 ? `\nResume validation phase (${3 - remainingResumeVerification + 1}-${3} of 3): For the next ${remainingResumeVerification} question${remainingResumeVerification > 1 ? 's' : ''}, prioritize verifying resume claims. Choose a different item each time (skills, projects, certifications, achievements), and ask one focused, open‑ended question that requires concrete evidence: exact role/responsibilities, architecture/approach, key decisions, trade‑offs, teammates/stakeholders, timelines, metrics (before/after), and links or artifacts if available. If something seems inconsistent, politely probe for clarification. Keep tone professional, supportive, and concise. When resume validation completes, continue with normal interview flow.` : ''}

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
    if (isListening) {
      console.log('🔇 Manual stop listening');
      if (speechManagerRef.current) {
        speechManagerRef.current.stopRecording();
      }
      setIsListening(false);
    } else {
      console.log('🎤 Manual start listening');
      
      // Try enterprise speech manager first
      if (speechManagerRef.current) {
        try {
          speechManagerRef.current.startRecording();
          setIsListening(true);
          console.log('✅ Enterprise recording started successfully');
        } catch (error) {
          console.error('Enterprise speech failed, trying fallback:', error);
          startFallbackSpeechRecognition();
        }
      } else {
        console.log('No enterprise speech manager, using fallback');
        startFallbackSpeechRecognition();
      }
    }
  };

  // Fallback speech recognition using Web Speech API directly
  const startFallbackSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        console.log('🎤 Fallback speech recognition started');
        setIsListening(true);
        setSpeechRecognitionWorking(true);
      };

      recognition.onresult = (event) => {
        const results = Array.from(event.results);
        const latestResult = results[results.length - 1];
        const transcript = latestResult[0].transcript.trim();
        
        console.log('🎤 Fallback speech result:', { transcript, isFinal: (latestResult as any).isFinal });
        setSpeechRecognitionWorking(true);
        handleContinuousSpeech(transcript, (latestResult as any).isFinal);
      };

      recognition.onerror = (event) => {
        console.error('Fallback speech error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        console.log('🎤 Fallback speech recognition ended');
        setIsListening(false);
        setSpeechRecognitionWorking(false);
      };

      recognition.start();
      console.log('✅ Fallback recording started successfully');
    } catch (error) {
      console.error('Failed to start fallback recording:', error);
      toast({
        title: "Microphone Error",
        description: "Failed to start microphone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(prevState => !prevState);
    if (!isMuted) {
      speechManagerRef.current?.stopSpeaking();
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

    // Reset all previous interview data and memory first
    resetInterview();

    setIsLoading(true);
    setQuestionCount(0);
    conversationHistoryRef.current = '';
    
    // Reset all monitoring counts for new interview
    setViolationCounts({
      faceNotVisibleCount: 0,
      phoneDetectedCount: 0,
      objectViolationCount: 0,
      personDetected: true
    });
    
    // Reset phone detection state
    setPhoneDetectionState({
      isCurrentlyDetected: false,
      firstDetectionTime: null,
      lastWarningTime: 0,
      warningCount: 0,
      cooldownActive: false
    });
    
    // Reset phone warning countdown
    setPhoneWarningCountdown(null);
    
    // Reset person detection timeout
    if (personDetectionTimeout) {
      clearTimeout(personDetectionTimeout);
      setPersonDetectionTimeout(null);
    }
    setLastPersonDetectionTime(Date.now());
    
    // Reset multiple people detection states
    setMultiplePeopleWarningCount(0);
    setIsMultiplePeopleWarningActive(false);
    setLastMultiplePeopleWarningTime(0);
    setLastDetectionHash('');
    
    // Reset phone detection states
    setPhoneWarningCount(0);
    setIsPhoneWarningActive(false);
    setLastPhoneWarningTime(0);
    
    // Reset global pause
    if (detectionPauseTimeoutRef.current) clearTimeout(detectionPauseTimeoutRef.current);
    setIsDetectionPaused(false);

    // Reset new detection manager counters if present
    if (detectionManagerRef.current) detectionManagerRef.current.reset();
    
    setWarningsIssued({
      faceWarning: false,
      phoneWarning: false
    });
    
    // Start new interview session in local storage
    const newSessionId = interviewDataStorage.startNewSession({
      candidateName: candidateName.trim(),
      jobTitle,
      duration,
      aiBackend
    });
    setSessionId(newSessionId);
    
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
      
      // Save first message to local storage
      interviewDataStorage.addMessage({
        role: 'hr',
        content: hrResponse,
        timestamp: new Date()
      });
      
      // Update conversation history
      conversationHistoryRef.current = `Ava: ${hrResponse}`;
      
      // Wait a moment before speaking to ensure UI is ready
      setTimeout(async () => {
        if (!isMuted && speechManagerRef.current) {
          console.log('🗣️ Starting TTS for interview introduction');
          await speechManagerRef.current.speak(hrResponse, {
            ...DEV_TTS_OPTIONS,
            voice: DEV_TTS_OPTIONS.voice
          });
        }
        
        // Start waiting for user response after initial message
        startWaitingForResponse();
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
    const currentResponse = (confirmedResponse + (interimResponse ? ' ' + interimResponse : '')).trim();
    if (!currentResponse) {
      return;
    }

    // Don't automatically turn off mic - let user control it

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
    
    // Save user message to local storage
    if (sessionId) {
      interviewDataStorage.addMessage({
        role: 'candidate',
        content: currentResponse,
        timestamp: new Date()
      });
    }
    
    // Update conversation history
    conversationHistoryRef.current += `\n${candidateName}: ${currentResponse}`;
    
    setConfirmedResponse('');
    setInterimResponse('');
    setLastTranscriptRef('');
    setLastProcessedTranscript('');
    setIsContinuousSpeaking(false);
    stopWaitingForResponse(); // Stop waiting for response

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
        
        // Save AI message to local storage
        if (sessionId) {
          interviewDataStorage.addMessage({
            role: 'hr',
            content: hrResponse,
            timestamp: new Date()
          });
        }
        
        // Update conversation history
        conversationHistoryRef.current += `\nAva: ${hrResponse}`;
        
        if (!isMuted && speechManagerRef.current) {
          await speechManagerRef.current.speak(hrResponse, {
            ...DEV_TTS_OPTIONS,
            voice: DEV_TTS_OPTIONS.voice
          });
        }
        
        // Start waiting for user response after AI speaks
        startWaitingForResponse();
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
    speechManagerRef.current?.stopSpeaking();
    setIsSpeaking(false);
    // Don't automatically stop recording - let user control it
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
    
    // Save closing message to local storage
    if (sessionId) {
      interviewDataStorage.addMessage({
        role: 'hr',
        content: closingMessage.content,
        timestamp: new Date()
      });
      
      // Complete the session in local storage
      const completedSession = interviewDataStorage.completeSession();
      if (completedSession) {
        console.log('✅ Interview session completed and saved:', completedSession.sessionId);
        toast({
          title: "Interview Complete",
          description: "Your interview data has been saved locally!",
        });
      }
    }
    
    if (!isMuted && speechManagerRef.current) {
      speechManagerRef.current.speak(closingMessage.content, {
        ...DEV_TTS_OPTIONS,
        voice: DEV_TTS_OPTIONS.voice
      });
    }
    
    toast({
      title: "Interview Complete",
      description: "Thank you for completing the AI interview! Redirecting to analysis...",
    });
    
    // Redirect to analysis page after a short delay
    setTimeout(() => {
      window.location.href = '/post-interview-analysis';
    }, 2000);
  };

  const resetInterview = () => {
    setIsInterviewStarted(false);
    setIsInterviewComplete(false);
    setMessages([]);
    setCurrentResponse('');
    setConfirmedResponse('');
    setInterimResponse('');
    setLastTranscriptRef('');
    setLastProcessedTranscript('');
    setIsContinuousSpeaking(false);
    setTimeRemaining(duration * 60);
    setConfidenceScore(85);
    setEngagementScore(72);
    setAttentivenessScore(90);
    setQuestionCount(0);
    conversationHistoryRef.current = '';
    speechManagerRef.current?.stopSpeaking();
    setIsSpeaking(false);
    setIsListening(false);
    setSpeechRecognitionWorking(false);
    
    // Reset live performance
    setLivePerformance({
      confidence: 85,
      engagement: 72,
      attentiveness: 90
    });
    
    // Reset face API emotions
    setFaceApiEmotions({
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
    
    // Reset object detections
    setObjectDetections([]);
    
    // Reset observation metrics
    setObservationMetrics(null);
    
    // Reset response tracking
    setLastResponseTime(null);
    setIsWaitingForResponse(false);
    
    // Reset document and code analysis
    setDocumentAnalysis('');
    setCodeAnalysis('');
    
    // Don't automatically stop recording - let user control it
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
    }
    
    if (responseTimeout) {
      clearTimeout(responseTimeout);
      setResponseTimeout(null);
    }
    
    if (speechTimeout) {
      clearTimeout(speechTimeout);
      setSpeechTimeout(null);
    }
    
    // Reset monitoring counts
    setViolationCounts({
      faceNotVisibleCount: 0,
      phoneDetectedCount: 0,
      objectViolationCount: 0,
      personDetected: true
    });
    
    setWarningsIssued({
      faceWarning: false,
      phoneWarning: false
    });
    
    // Reset phone detection state
    setPhoneDetectionState({
      isCurrentlyDetected: false,
      firstDetectionTime: null,
      lastWarningTime: 0,
      warningCount: 0,
      cooldownActive: false
    });
    
    // Reset phone warning countdown
    setPhoneWarningCountdown(null);
    
    // Clear warning states
    setIsWarningActive(false);
    setWarningMessage('');
    setIsPausedForWarning(false);
    setLastSpeakingPosition(0);
    
    // Clear warning timeout
    if (warningTimeout) {
      clearTimeout(warningTimeout);
      setWarningTimeout(null);
    }
    
    // Clear person detection timeout
    if (personDetectionTimeout) {
      clearTimeout(personDetectionTimeout);
      setPersonDetectionTimeout(null);
    }
    setLastPersonDetectionTime(Date.now());
    
    // Reset multiple people detection states
    setMultiplePeopleWarningCount(0);
    setIsMultiplePeopleWarningActive(false);
    setLastMultiplePeopleWarningTime(0);
    setLastDetectionHash('');
    
    // Reset phone detection states
    setPhoneWarningCount(0);
    setIsPhoneWarningActive(false);
    setLastPhoneWarningTime(0);
    
    // Reset global pause
    if (detectionPauseTimeoutRef.current) clearTimeout(detectionPauseTimeoutRef.current);
    setIsDetectionPaused(false);
    if (detectionManagerRef.current) detectionManagerRef.current.reset();
    
    // Clear current session from local storage
    if (sessionId) {
      interviewDataStorage.clearCurrentSession();
      setSessionId(null);
    }
    
    toast({
      title: "Ready for Next Interview",
      description: "You can start a new interview session.",
    });
  };

  // Interview Monitoring System
  const [violationCounts, setViolationCounts] = useState({
    faceNotVisibleCount: 0,
    phoneDetectedCount: 0,
    objectViolationCount: 0,
    personDetected: true
  });
  
  const [warningsIssued, setWarningsIssued] = useState({
    faceWarning: false,
    phoneWarning: false
  });

  // Enhanced phone detection monitoring with timing
  const [phoneDetectionState, setPhoneDetectionState] = useState({
    isCurrentlyDetected: false,
    firstDetectionTime: null as number | null,
    lastWarningTime: 0,
    warningCount: 0,
    cooldownActive: false
  });

  // Countdown timer for first phone warning
  const [phoneWarningCountdown, setPhoneWarningCountdown] = useState<number | null>(null);

  // State for warning system
  const [isWarningActive, setIsWarningActive] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningTimeout, setWarningTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastSpeakingPosition, setLastSpeakingPosition] = useState(0);
  const [isPausedForWarning, setIsPausedForWarning] = useState(false);

  // Cleanup warning timeout on unmount
  useEffect(() => {
    return () => {
      if (warningTimeout) {
        clearTimeout(warningTimeout);
      }
      if (emotionStorageTimeoutRef.current) {
        clearTimeout(emotionStorageTimeoutRef.current);
      }
      // Clear phone warning countdown
      setPhoneWarningCountdown(null);
      // Clear multiple people detection warning
      setIsMultiplePeopleWarningActive(false);
    };
  }, [warningTimeout]);

  // Interview termination function
  const terminateInterview = (reason: string) => {
    toast({
      title: "Interview Terminated",
      description: reason,
      variant: "destructive"
    });
    
    // Add termination message to chat
    const terminationMessage: Message = {
      role: 'hr',
      content: `Interview terminated: ${reason}. Please ensure proper interview environment and try again.`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, terminationMessage]);
    interviewDataStorage.addMessage(terminationMessage);
    
    // Complete the session
    interviewDataStorage.completeSession();
    
    // Stop all speaking but let user control recording
    if (speechManagerRef.current) {
      speechManagerRef.current.stopSpeaking();
    }
    
    setIsInterviewComplete(true);
    setIsInterviewStarted(false);
    setIsLoading(false);
  };

  // Issue warning with pause and resume functionality
  const issueWarning = (warningType: 'face' | 'phone' | 'object') => {
    let message = '';
    let voiceMessage = '';
    
    switch (warningType) {
      case 'face':
        if (!warningsIssued.faceWarning) {
          message = "⚠️ Face not visible. Please ensure your face is fully visible.";
          voiceMessage = "Please ensure your face is fully visible to continue the interview.";
          setWarningsIssued(prev => ({ ...prev, faceWarning: true }));
        } else {
          message = "⚠️ Face still not visible. This is your final warning.";
          voiceMessage = "Your face is still not visible. This is your final warning.";
        }
        break;
      case 'phone':
        const currentPhoneWarningCount = phoneDetectionState.warningCount + 1;
        if (currentPhoneWarningCount === 1) {
          message = "⚠️ Phone detected. Please remove your phone from the frame.";
          voiceMessage = "Kindly remove your phone from the frame. Continued detection will result in additional warnings.";
        } else if (currentPhoneWarningCount === 2) {
          message = "⚠️ Phone still detected. This is your second warning.";
          voiceMessage = "Your phone is still detected. This is your second warning.";
        } else if (currentPhoneWarningCount === 3) {
          message = "⚠️ Phone still detected. This is your third warning.";
          voiceMessage = "Your phone is still detected. This is your third warning.";
        } else if (currentPhoneWarningCount === 4) {
          message = "⚠️ Phone still detected. This is your final warning.";
          voiceMessage = "Your phone is still detected. This is your final warning. Continued detection will terminate the interview.";
        }
        break;
      case 'object':
        message = "⚠️ Object detected. Please remove any objects from the frame.";
        voiceMessage = "Please remove any objects from the frame to continue the interview.";
        break;
    }

    // Don't automatically stop microphone during warning - let user control it

    setIsPausedForWarning(true);
    setIsWarningActive(true);
    setWarningMessage(message);

    // Add warning to chat
    setMessages(prev => [...prev, {
      role: 'hr',
      content: message,
      timestamp: new Date()
    }]);

    // Speak warning message
    speechManagerRef.current?.speak(voiceMessage, {
      ...DEV_TTS_OPTIONS,
      voice: DEV_TTS_OPTIONS.voice
    });

    // After warning is spoken, wait 5 seconds then clear warning
    const timeout = setTimeout(() => {
      setIsWarningActive(false);
      setWarningMessage('');
      setIsPausedForWarning(false);
      
      // Don't automatically resume microphone - let user control it
    }, 5000);
    
    setWarningTimeout(timeout);

    toast({
      title: "Warning Issued",
      description: message,
      variant: "destructive"
    });
  };

  // (Removed legacy phone/multiple-people warning handlers in favor of unified detectionManager)

  // Monitor face visibility
  const monitorFaceVisibility = (isFaceVisible: boolean) => {
    if (!isFaceVisible) {
      setViolationCounts(prev => ({
        ...prev,
        faceNotVisibleCount: Math.min(2, prev.faceNotVisibleCount + 1)
      }));
      
      // Issue warning on first detection
      if (violationCounts.faceNotVisibleCount === 0) {
        issueWarning('face');
      }
      
      // Terminate after 2 violations
      if (violationCounts.faceNotVisibleCount >= 1) {
        terminateInterview("Face not visible - interview terminated due to repeated violations.");
      }
    } else {
      // Reset count when face becomes visible
      setViolationCounts(prev => ({
        ...prev,
        faceNotVisibleCount: 0
      }));
    }
  };

  // Add new state for phone and people detection
  const [phoneDetectionCount, setPhoneDetectionCount] = useState(0);
  const [phoneWarningActive, setPhoneWarningActive] = useState(false);
  const [phoneWarningTimeout, setPhoneWarningTimeout] = useState<NodeJS.Timeout | null>(null);
  const [phoneStillDetected, setPhoneStillDetected] = useState(false);

  // (Removed legacy phone state/grace logic and monitorPhoneDetection)

  // Monitor object detection with unified detection manager only
  const monitorObjectDetection = (detectedObjects: any[]) => {
    if (!detectionManagerRef.current) return;
    const phoneDetected = detectedObjects.some(obj => (
      obj.class === 'cell phone' || obj.class === 'mobile phone' || obj.class === 'phone' || obj.class === 'smartphone'
    ) && obj.score > 0.5);
    const peopleDetected = detectedObjects.filter(obj => {
      const isPerson = obj.class === 'person' || obj.class === 'human';
      const hasGoodConfidence = obj.score > 0.3;
      return isPerson && hasGoodConfidence;
    });
    const snap: DetectionSnapshot = {
      now: Date.now(),
      isInterviewStarted,
      phoneDetected,
      peopleCount: peopleDetected.length
    };
    detectionManagerRef.current.process(snap);
    detectionManagerRef.current.tick(snap.now);
  };

  // Monitor person detection with 7-second delay
  const [personDetectionTimeout, setPersonDetectionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastPersonDetectionTime, setLastPersonDetectionTime] = useState<number>(Date.now());

  const monitorPersonDetection = (isPersonDetected: boolean) => {
    const currentTime = Date.now();
    
    console.log('👤 Person detection monitoring:', {
      isPersonDetected,
      hasTimeout: !!personDetectionTimeout,
      timeSinceLastDetection: currentTime - lastPersonDetectionTime
    });
    
    setViolationCounts(prev => ({
      ...prev,
      personDetected: isPersonDetected
    }));
    
    if (!isPersonDetected) {
      // Clear any existing timeout
      if (personDetectionTimeout) {
        clearTimeout(personDetectionTimeout);
      }
      
      console.log('⚠️ Person not detected - starting 7-second countdown');
      
      // Set 7-second timeout before termination, cancel if person returns sooner
      const timeout = setTimeout(() => {
        // Only terminate if still absent
        if (!violationCounts.personDetected) {
          console.log('⚠️ No person detected for 7 seconds - terminating interview');
          terminateInterview("No person detected in frame for 7 seconds - interview terminated.");
        }
      }, 7000);
      
      setPersonDetectionTimeout(timeout);
    } else {
      // Person detected - clear timeout and update last detection time
      if (personDetectionTimeout) {
        console.log('✅ Person detected - clearing timeout');
        clearTimeout(personDetectionTimeout);
        setPersonDetectionTimeout(null);
      }
      setLastPersonDetectionTime(currentTime);
    }
  };

  // Document sharing and code editor handlers
  const handleDocumentReview = (document: any, analysis: string) => {
    setDocumentAnalysis(analysis);
    
    // Add document review to chat
    const message: Message = {
      role: 'hr',
      content: `📄 **Document Review: ${document.name}**\n\n${analysis}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    
    // Add to local storage
    if (sessionId) {
      interviewDataStorage.addMessage({
        role: 'hr',
        content: `Document Review: ${document.name}`,
        timestamp: new Date()
      });
    }
    
    toast({
      title: "Document Analysis Complete",
      description: `AI has analyzed ${document.name}`,
    });
  };

  const handleCodeReview = (code: string, analysis: string) => {
    setCodeAnalysis(analysis);
    
    // Add code review to chat
    const message: Message = {
      role: 'hr',
      content: `💻 **Code Review**\n\n${analysis}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    
    // Add to local storage
    if (sessionId) {
      interviewDataStorage.addMessage({
        role: 'hr',
        content: `Code Review Analysis`,
        timestamp: new Date()
      });
    }
    
    toast({
      title: "Code Analysis Complete",
      description: "AI has reviewed your code",
    });
  };

  // Setup phase
  if (!isInterviewStarted) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">AI Interview Coach</h1>
          <Button
            variant="outline"
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            View History
          </Button>
        </div>
        
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

            {/* Resume / Document Upload (Optional) */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Resume or Related Document (optional)</Label>
              <p className="text-xs text-slate-500">Upload or paste your resume so Ava can tailor the first question to your background.</p>
              <InterviewUpload
                resumeText={resumeText}
                onResumeTextChange={setResumeText}
              />
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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex flex-col items-center py-6">
      {/* Warning Overlay */}
      {(isWarningActive || isMultiplePeopleWarningActive || isPhoneWarningActive) && (
        <div className="fixed inset-0 bg-red-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border-4 border-red-500">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-700 mb-2">Interview Warning</h3>
            <p className="text-gray-700 mb-4">{warningMessage || (isMultiplePeopleWarningActive ? `Multiple people detected. This is warning ${multiplePeopleWarningCount}/3. Continued violation will result in interview termination.` : (isPhoneWarningActive ? `Phone detected. This is warning ${phoneWarningCount}/3. Continued violation will result in interview termination.` : ''))}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Resuming in 5 seconds...</span>
            </div>
          </div>
        </div>
      )}
              {/* Multiple People Warning Overlay */}
        {isMultiplePeopleWarningActive && (
          <div className="fixed inset-0 bg-orange-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border-4 border-orange-500">
              <div className="text-orange-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">Multiple People Warning</h3>
              <p className="text-gray-700 mb-4">
                Multiple people detected in camera view. This is warning {multiplePeopleWarningCount}/3.
              </p>
              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700 font-medium">
                  Warning {multiplePeopleWarningCount}/3 - Multiple people detected
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {multiplePeopleWarningCount >= 3 ? 'Interview will be terminated.' : 'Continued violation will result in interview termination.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Warning will auto-hide in 5 seconds...</span>
              </div>
            </div>
          </div>
        )}

        {/* Top row: 4 cards (moved Live Performance below Behavior Analysis) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4 w-full max-w-screen-xl px-3">
        {/* Observation */}
        <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-white to-blue-50/30 border border-blue-100/50 flex flex-col h-[270px] w-full">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Observation</CardTitle>
            </div>
            <Badge className="bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-1"></div>
              Active
            </Badge>
          </CardHeader>
          <CardContent className="p-2 flex items-center justify-center flex-1">
            <div className="w-full h-[193px] flex items-center justify-center rounded-lg overflow-hidden">
              <ObservationCamera onMetricsUpdate={setObservationMetrics} />
            </div>
          </CardContent>
        </Card>
        {/* Emotion Detection */}
        <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-white to-purple-50/30 border border-purple-100/50 flex flex-col h-[270px] w-full">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-base font-semibold">Emotion Detection</CardTitle>
            </div>
            <Badge className="bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse mr-1"></div>
              Real-time
            </Badge>
          </CardHeader>
          <CardContent className="p-2 flex items-center justify-center flex-1">
            <div className="w-full h-[193px] flex items-center justify-center rounded-lg overflow-hidden">
              <EmbeddedFaceApiCamera onEmotionDetected={handleEmotionDetected} />
            </div>
          </CardContent>
        </Card>
        {/* Object Detection */}
        <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-white to-green-50/30 border border-green-100/50 flex flex-col h-[270px] w-full">
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base font-semibold">Object Detection</CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Objects count */}
              <Badge variant="outline" className="text-[11px] bg-green-50 text-green-700 border-green-200">
                {objectDetections.length} objs
              </Badge>
              {/* Multiple people warning indicator */}
              {multiplePeopleWarningCount > 0 && isInterviewStarted && (
                <Badge variant="outline" className="text-[11px] bg-orange-50 text-orange-700 border-orange-200">
                  ⚠️ {multiplePeopleWarningCount}/3
                </Badge>
              )}
              {/* Multiple people cooldown indicator */}
              {isInterviewStarted && multiplePeopleWarningCount > 0 && (Date.now() - lastMultiplePeopleWarningTime) <= 10000 && (
                <Badge variant="outline" className="text-[11px] bg-yellow-50 text-yellow-700 border-yellow-200">
                  ⏸️ {Math.ceil((10000 - (Date.now() - lastMultiplePeopleWarningTime)) / 1000)}s
                </Badge>
              )}
              {/* Phone indicator (priority) */}
              {objectDetections.some(d => d.class === 'cell phone' || d.class === 'mobile phone' || d.class === 'phone' || d.class === 'smartphone') && (
                <Badge variant="outline" className="text-[11px] bg-red-50 text-red-700 border-red-200">
                  📱 Phone
                </Badge>
              )}
              {/* Phone Detection State badge */}
              {phoneDetectionState.isCurrentlyDetected && (
                <Badge className={`text-[11px] font-semibold border ${
                  phoneDetectionState.warningCount === 0 
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200' 
                    : phoneDetectionState.warningCount >= 3 
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : 'bg-orange-100 text-orange-700 border-orange-200'
                }`}>
                  {phoneDetectionState.warningCount === 0 
                    ? phoneWarningCountdown 
                      ? `${phoneWarningCountdown}s` 
                      : 'Phone Detected'
                    : `Phone ${phoneDetectionState.warningCount}/4`
                  }
                </Badge>
              )}

            </div>
          </CardHeader>
          <CardContent className="p-2 flex items-center justify-center flex-1">
            <div className="w-full h-[193px] flex items-center justify-center rounded-lg overflow-hidden">
              <AutoObjectDetectionCamera embedded onDetectionChange={(detections) => {
                setObjectDetections(detections);
                
                // Monitor for interview violations
                monitorObjectDetection(detections);
                
                // Enhanced person detection with debugging and tolerance
                const personDetected = detections.some(d => {
                  const isPerson = d.class === 'person' || d.class === 'human';
                  const hasGoodConfidence = d.score > 0.3; // Lower threshold for better detection
                  return isPerson && hasGoodConfidence;
                });
                
                // Add tolerance for brief detection gaps (person was detected recently)
                const timeSinceLastDetection = Date.now() - lastPersonDetectionTime;
                const isRecentlyDetected = timeSinceLastDetection < 2000; // 2 seconds tolerance
                const finalPersonDetected = personDetected || isRecentlyDetected;
                
                console.log('🎯 Person detection check:', {
                  detections: detections.map(d => ({ class: d.class, score: d.score })),
                  personDetected,
                  isRecentlyDetected,
                  finalPersonDetected,
                  timeSinceLastDetection,
                  personClasses: detections.filter(d => d.class === 'person' || d.class === 'human')
                });
                
                monitorPersonDetection(finalPersonDetected);
                
                // Save object detection data to local storage
                if (sessionId && detections.length > 0) {
                  detections.forEach(detection => {
                    interviewDataStorage.addObjectDetection({
                      class: detection.class,
                      score: detection.score,
                      bbox: detection.bbox || [0, 0, 0, 0]
                    });
                  });
                }
              }} />
            </div>
          </CardContent>
        </Card>
        
        {/* Devi (HR) */}
        <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-white to-pink-50/30 border border-pink-100/50 flex flex-col h-[270px] w-full">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-600" />
              <CardTitle className="text-base font-semibold">Devi (HR)</CardTitle>
            </div>
                          <Badge className="bg-pink-100 text-pink-700 text-xs font-semibold border border-pink-200">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse mr-1"></div>
              {isSpeaking ? 'Speaking' : 'Ready'}
            </Badge>
          </CardHeader>
          <CardContent className="p-2 flex flex-col items-center justify-center flex-1">
            <div className="w-full h-[193px] flex items-center justify-center rounded-lg overflow-hidden mb-2">
              {/* Minimal stage to show avatar */}
              <div className="w-full h-full">
                {/* @ts-ignore */}
                {/* eslint-disable-next-line */}
                <AvatarStage isSpeaking={isSpeaking} visemeHint={visemeHint} reactionTrigger={reactionTick} />
              </div>
            </div>
            {/* Test button for avatar */}
            <button
              onClick={() => {
                console.log('🧪 Testing new avatar lip sync...');
                if ((window as any).testNewTalkingHead) {
                  (window as any).testNewTalkingHead();
                } else {
                  console.warn('🧪 NewTalkingHead test function not available');
                }
              }}
              className="px-2 py-1 text-xs bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
            >
              Test Lip Sync
            </button>
            {/* Test morph targets directly */}
            <button
              onClick={() => {
                console.log('🧪 Testing morph targets directly...');
                if ((window as any).testMorphTargets) {
                  (window as any).testMorphTargets();
                } else {
                  console.warn('🧪 testMorphTargets function not available');
                }
              }}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-pink-700 transition-colors ml-2"
            >
              Test Morph Targets
            </button>
            {/* Test isSpeaking prop */}
            <button
              onClick={() => {
                console.log('🧪 Testing isSpeaking prop...');
                setIsSpeaking(true);
                setTimeout(() => {
                  console.log('🧪 Setting isSpeaking to false...');
                  setIsSpeaking(false);
                }, 3000);
              }}
              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors ml-2"
            >
              Test isSpeaking
            </button>
            {/* Test avatar directly */}
            <button
              onClick={() => {
                console.log('🧪 Testing avatar directly...');
                if ((window as any).newTalkingHeadSpeak) {
                  console.log('🧪 Calling newTalkingHeadSpeak directly...');
                  (window as any).newTalkingHeadSpeak('Hello, this is a direct test of the avatar!');
                } else {
                  console.warn('🧪 newTalkingHeadSpeak function not available');
                }
              }}
              className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors ml-2"
            >
              Test Avatar Direct
            </button>
          </CardContent>
        </Card>
      </div>
      {/* Main area: left column and chat area */}
      <div className="flex flex-col xl:flex-row gap-4 w-full max-w-screen-xl px-3">
        {/* Left column: Emotion Analysis, Behavior Analysis */}
        <div className="flex flex-col gap-4 w-full xl:w-[364px]">
          {/* Emotion Analytics (premium UI) */}
            <Card className="rounded-2xl shadow-xl bg-white/70 backdrop-blur-md flex flex-col border border-blue-100" style={{ width: 364, minHeight: 180, padding: 0 }}>
              <CardHeader className="pb-1 flex flex-row items-center gap-3 min-h-0">
                <span className="text-4xl drop-shadow-lg">{faceApiEmotions.icon}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-lg capitalize text-slate-800">{faceApiEmotions.dominant}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow">{Math.round(faceApiEmotions.confidence * 100)}% confidence</span>
                    {faceApiEmotions.age && faceApiEmotions.gender && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">~{Math.round(faceApiEmotions.age)} years, {faceApiEmotions.gender}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-xs font-semibold mb-2 text-slate-700">Emotion Analysis</div>
                <div className="space-y-1.5">
                  {Object.entries(faceApiEmotions.scores).map(([emotion, score]) => (
                    <div key={emotion} className="flex items-center gap-2">
                      <span className="capitalize w-16 text-xs text-slate-600 font-medium">{emotion}</span>
                      <div className="flex-1 h-2.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full overflow-hidden relative">
                        <div className="h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${Math.round(Number(score) * 100)}%` }}></div>
                      </div>
                      <span className={`${Number(score) > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'} text-xs w-8 text-right px-1 py-0.5 rounded-full font-semibold`}>{Math.round(Number(score) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          {/* Behavior Analysis (premium UI) */}
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
        {/* Main chat area */}
        <div className="flex flex-col gap-4" style={{ width: 1124, height: 600 }}>
          <Card className="rounded-2xl shadow bg-white/90 flex flex-col h-full max-h-[600px] overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Interview with Ava Taylor</CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  {jobTitle} • {candidateName || 'tejaskumarwgl@gmail.com'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocumentSharing(!showDocumentSharing)}
                  className="hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Documents
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCodeEditor(!showCodeEditor)}
                  className="hover:bg-slate-50"
                >
                  <Code className="h-4 w-4 mr-1" />
                  Code
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={completeInterview}
                  disabled={isInterviewComplete}
                  className="font-semibold"
                >
                  End Interview
                </Button>
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-xs">
                  <Clock className="h-3 w-3 text-blue-600" />
                  <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
                </Badge>
                <Button variant="outline" size="sm" onClick={toggleMute} className="hover:bg-slate-50 p-1">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                {isSpeaking && (
                  <Badge className="animate-pulse bg-green-100 text-green-700 border-green-200 text-xs">Ava Speaking</Badge>
                )}
                {isPausedForWarning && (
                  <Badge className="animate-pulse bg-red-100 text-red-700 border-red-200 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                    Paused for Warning
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col relative min-h-0">
              <ScrollArea id="ava-chat-scroll-area" className="flex-1 min-h-0">
                <div className="space-y-2 pb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'hr' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 break-words overflow-hidden ${
                          message.role === 'hr' 
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-green-100 text-green-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}
                                      <div ref={messagesEndRef} />
                  {isLoading && (
                      <div className="flex justify-start mt-2">
                        <div className="bg-blue-100 text-blue-900 rounded-lg px-3 py-2 max-w-[70%]">
                          <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                          </div>
                            <span className="text-xs">Ava is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
                {showScrollButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={scrollToBottom}
                  className="absolute right-4 bottom-4 z-10 shadow"
                >
                  Scroll to Bottom
                </Button>
              )}
            </CardContent>
            {/* Input Area */}
            <CardFooter className="p-3 border-t">
              <div className="flex flex-col w-full gap-2">
                <Textarea
                  placeholder="Type your response or speak..."
                  value={confirmedResponse + (interimResponse ? ' ' + interimResponse : '')}
                  onChange={(e) => setConfirmedResponse(e.target.value)}
                  className="min-h-[50px] max-h-[100px] resize-none"
                  disabled={isInterviewComplete}
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleListening}
        variant={isListening ? "destructive" : "outline"}
        size="sm"
                      disabled={isInterviewComplete}
        className="flex items-center gap-1"
      >
        {isListening ? (
          <>
            <Square className="h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Start Recording
          </>
        )}
                  </Button>
      {isListening && (
        <Badge variant="outline" className="animate-pulse bg-red-50 text-red-700 text-xs">
          Recording...
        </Badge>
      )}
      {speechRecognitionWorking && (
        <Badge variant="outline" className="animate-pulse bg-green-50 text-green-700 text-xs">
          Speech Detected ✓
        </Badge>
      )}
      {isContinuousSpeaking && (
        <Badge variant="outline" className="animate-pulse bg-yellow-50 text-yellow-700 text-xs">
          Processing Speech...
        </Badge>
      )}
      {!isListening && !isSpeaking && isInterviewStarted && (
        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
          AI Ready - Click to Speak
        </Badge>
      )}
      {isSpeaking && (
        <Badge variant="outline" className="animate-pulse bg-blue-50 text-blue-700 text-xs">
          AI Speaking...
        </Badge>
      )}
                  </div>
                  <Button 
                    onClick={submitResponse}
                      disabled={!confirmedResponse.trim() && !interimResponse.trim() || isInterviewComplete}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Send Response
                    </Button>
                  </div>
                </div>
              </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Document Sharing Panel */}
      {showDocumentSharing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Document Sharing & Review</h2>
              <Button variant="outline" onClick={() => setShowDocumentSharing(false)}>
                Close
              </Button>
            </div>
            <div className="h-full overflow-y-auto p-4">
              <DocumentSharing 
                onDocumentReview={handleDocumentReview}
                isInterviewActive={isInterviewStarted}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Code Editor Panel */}
      {showCodeEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Live Coding Challenges</h2>
              <Button variant="outline" onClick={() => setShowCodeEditor(false)}>
                Close
              </Button>
            </div>
            <div className="h-full overflow-y-auto p-4">
              <CodeEditor 
                onCodeReview={handleCodeReview}
                isInterviewActive={isInterviewStarted}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Interview History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Interview History</h2>
              <Button variant="outline" onClick={() => setShowHistory(false)}>
                Close
              </Button>
            </div>
            <div className="h-full overflow-y-auto">
              <InterviewHistory />
            </div>
          </div>
        </div>
      )}
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
