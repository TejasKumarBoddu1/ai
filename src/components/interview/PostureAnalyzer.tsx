
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PostureAnalysis } from '@/types/interview';
import { Camera, CameraOff, Eye, EyeOff, AlertTriangle, CheckCircle, ThumbsUp, ArrowUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PostureAnalyzerProps {
  enabled: boolean;
  onAnalysisUpdate: (analysis: PostureAnalysis) => void;
}

// Mock implementation of posture analysis
// In a real app, this would use computer vision libraries like TensorFlow.js or MediaPipe
const PostureAnalyzer: React.FC<PostureAnalyzerProps> = ({ enabled, onAnalysisUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PostureAnalysis | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'posture' | 'eye' | 'gestures' | 'appearance'>('posture');
  const [feedbackSeverity, setFeedbackSeverity] = useState<'success' | 'warning' | 'error'>('warning');
  const analysisInterval = useRef<number | null>(null);
  const { toast } = useToast();

  // Request camera permissions and initialize video
  useEffect(() => {
    if (enabled && permission === 'prompt') {
      requestCameraPermission();
    }
  }, [enabled, permission]);

  // Start/stop video based on enabled prop
  useEffect(() => {
    if (enabled && permission === 'granted') {
      startVideo();
    } else {
      stopVideo();
    }

    return () => {
      stopVideo();
    };
  }, [enabled, permission]);

  // Start/stop analysis based on video status
  useEffect(() => {
    if (isVideoActive) {
      startAnalysis();
    } else {
      stopAnalysis();
    }

    return () => {
      stopAnalysis();
    };
  }, [isVideoActive]);

  // Show visual overlays when analysis changes
  useEffect(() => {
    if (currentAnalysis) {
      // Show feedback for poor posture, eye contact, etc.
      if (currentAnalysis.posture === 'poor') {
        showPostureFeedback('posture', 'Sit up straight to appear more confident', 'error');
      } else if (currentAnalysis.eyeContact === 'poor') {
        showPostureFeedback('eye', 'Look at the camera to maintain eye contact', 'warning');
      } else if (currentAnalysis.gestures === 'excessive') {
        showPostureFeedback('gestures', 'Reduce hand movements, they may be distracting', 'warning');
      } else if (currentAnalysis.dressCode === 'inappropriate' || currentAnalysis.dressCode === 'casual') {
        showPostureFeedback('appearance', currentAnalysis.dressCode === 'inappropriate' 
          ? 'Your attire appears too casual for an interview' 
          : 'Consider more formal attire for professional interviews', 
          currentAnalysis.dressCode === 'inappropriate' ? 'error' : 'warning');
      } else if (Math.random() > 0.7) {
        // Occasionally show positive feedback
        showPostureFeedback('posture', 'Great posture and presentation!', 'success');
      }
    }
  }, [currentAnalysis]);

  const showPostureFeedback = (type: 'posture' | 'eye' | 'gestures' | 'appearance', message: string, severity: 'success' | 'warning' | 'error') => {
    setFeedbackType(type);
    setFeedbackMessage(message);
    setFeedbackSeverity(severity);
    setShowFeedback(true);
    
    // Hide feedback after 5 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermission('granted');
      toast({
        title: "Camera access granted",
        description: "Your posture and presentation will be analyzed during the interview.",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermission('denied');
      toast({
        title: "Camera access denied",
        description: "Posture and presentation analysis will be disabled.",
        variant: "destructive"
      });
    }
  };

  const startVideo = async () => {
    if (!videoRef.current || isVideoActive) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });
      
      videoRef.current.srcObject = stream;
      setIsVideoActive(true);
    } catch (error) {
      console.error('Error starting video:', error);
      setIsVideoActive(false);
    }
  };

  const stopVideo = () => {
    if (!videoRef.current || !isVideoActive) return;

    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsVideoActive(false);
  };

  const toggleVideo = () => {
    if (isVideoActive) {
      stopVideo();
    } else {
      startVideo();
    }
  };

  // Mock analysis function - in a real app, this would use ML models
  const analyzePosture = () => {
    if (!isVideoActive || !videoRef.current) return;

    // Simulate posture analysis with random values
    // In a real app, this would use computer vision to analyze posture, eye contact, etc.
    setIsAnalyzing(true);
    
    const randomChoice = <T extends string>(options: T[]): T => {
      return options[Math.floor(Math.random() * options.length)];
    };

    setTimeout(() => {
      const analysis: PostureAnalysis = {
        posture: randomChoice(['good', 'poor', 'neutral']),
        eyeContact: randomChoice(['good', 'poor', 'neutral']),
        gestures: randomChoice(['appropriate', 'excessive', 'limited']),
        dressCode: randomChoice(['formal', 'business-casual', 'casual', 'inappropriate']),
        suggestions: []
      };

      // Generate feedback based on analysis
      if (analysis.posture === 'poor') {
        analysis.suggestions.push('Try to sit up straighter to project confidence.');
      }
      
      if (analysis.eyeContact === 'poor') {
        analysis.suggestions.push('Maintain eye contact with the camera to appear engaged.');
      }
      
      if (analysis.gestures === 'excessive') {
        analysis.suggestions.push('Reduce hand movements as they may be distracting.');
      } else if (analysis.gestures === 'limited') {
        analysis.suggestions.push('Use appropriate hand gestures to emphasize key points.');
      }
      
      if (analysis.dressCode === 'casual' || analysis.dressCode === 'inappropriate') {
        analysis.suggestions.push('Consider more formal attire for professional interviews.');
      }

      setCurrentAnalysis(analysis);
      onAnalysisUpdate(analysis);
      setIsAnalyzing(false);
    }, 1000);
  };

  const startAnalysis = () => {
    if (analysisInterval.current) return;

    // Run analysis every 10 seconds
    analyzePosture();
    analysisInterval.current = window.setInterval(analyzePosture, 10000);
  };

  const stopAnalysis = () => {
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
      analysisInterval.current = null;
    }
    setIsAnalyzing(false);
  };

  // Calculate overall presentation score
  const calculatePresentationScore = (analysis: PostureAnalysis | null): number => {
    if (!analysis) return 0;
    
    let score = 75; // Start with a base score
    
    if (analysis.posture === 'good') score += 10;
    if (analysis.posture === 'poor') score -= 10;
    
    if (analysis.eyeContact === 'good') score += 10;
    if (analysis.eyeContact === 'poor') score -= 10;
    
    if (analysis.gestures === 'appropriate') score += 5;
    if (analysis.gestures === 'excessive') score -= 5;
    if (analysis.gestures === 'limited') score -= 2;
    
    if (analysis.dressCode === 'formal') score += 10;
    if (analysis.dressCode === 'business-casual') score += 5;
    if (analysis.dressCode === 'casual') score -= 5;
    if (analysis.dressCode === 'inappropriate') score -= 15;
    
    return Math.min(100, Math.max(0, score));
  };

  if (!enabled) {
    return (
      <Card className="mt-3">
        <CardContent className="p-3 text-sm text-muted-foreground flex items-center">
          <CameraOff className="h-4 w-4 mr-2" />
          Posture and presentation analysis is disabled
        </CardContent>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card className="mt-3">
        <CardContent className="p-3">
          <div className="flex items-center text-amber-600 mb-2">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="font-medium text-sm">Camera access denied</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Please enable camera access to receive posture and presentation feedback.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Visual feedback overlay */}
      {showFeedback && (
        <div className={`fixed top-24 left-4 z-50 max-w-md p-3 rounded-lg shadow-lg border animate-fade-in ${
          feedbackSeverity === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          feedbackSeverity === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex items-start gap-2">
            {feedbackSeverity === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
            {feedbackSeverity === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
            {feedbackSeverity === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="font-medium mb-1 flex items-center">
                {feedbackType === 'posture' && 'Posture'}
                {feedbackType === 'eye' && 'Eye Contact'}
                {feedbackType === 'gestures' && 'Gestures'}
                {feedbackType === 'appearance' && 'Appearance'}
              </p>
              <p className="text-sm">{feedbackMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video and posture analysis display */}
      <Card className="mt-3">
        <CardContent className="p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Presentation Analysis</h3>
            <div className="flex items-center gap-2">
              {isVideoActive && currentAnalysis && (
                <Badge variant="outline" className={`
                  ${calculatePresentationScore(currentAnalysis) > 80 ? 'bg-green-100 text-green-800' : 
                    calculatePresentationScore(currentAnalysis) > 60 ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800'}
                `}>
                  <span className="mr-1">{calculatePresentationScore(currentAnalysis)}%</span>
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={toggleVideo}
              >
                {isVideoActive ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {isVideoActive && (
            <>
              <div className="relative mb-3" ref={videoContainerRef}>
                <video 
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-32 object-cover rounded-md"
                />
                
                {/* Video overlay for posture guidance */}
                {currentAnalysis && currentAnalysis.posture === 'poor' && (
                  <div className="absolute inset-0 border-2 border-red-500 rounded-md flex items-center justify-center bg-black/10">
                    <div className="bg-red-100 text-red-800 p-1.5 rounded-md text-sm flex items-center shadow-md">
                      <ArrowUp className="h-4 w-4 mr-1.5" />
                      Sit up straight
                    </div>
                  </div>
                )}
              </div>
              
              {currentAnalysis && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Overall Presentation</span>
                      <span className={`font-medium ${
                        calculatePresentationScore(currentAnalysis) > 80 ? "text-green-600" : 
                        calculatePresentationScore(currentAnalysis) > 60 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {calculatePresentationScore(currentAnalysis)}%
                      </span>
                    </div>
                    <Progress 
                      value={calculatePresentationScore(currentAnalysis)} 
                      className={`h-1.5 ${
                        calculatePresentationScore(currentAnalysis) > 80 ? "bg-green-600" : 
                        calculatePresentationScore(currentAnalysis) > 60 ? "bg-amber-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Posture:</span>{' '}
                      <span className={
                        currentAnalysis.posture === 'good' ? "text-green-600" :
                        currentAnalysis.posture === 'poor' ? "text-red-600" : ""
                      }>
                        {currentAnalysis.posture.charAt(0).toUpperCase() + currentAnalysis.posture.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Eye Contact:</span>{' '}
                      <span className={
                        currentAnalysis.eyeContact === 'good' ? "text-green-600" :
                        currentAnalysis.eyeContact === 'poor' ? "text-red-600" : ""
                      }>
                        {currentAnalysis.eyeContact.charAt(0).toUpperCase() + currentAnalysis.eyeContact.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Gestures:</span>{' '}
                      <span className={
                        currentAnalysis.gestures === 'appropriate' ? "text-green-600" :
                        currentAnalysis.gestures === 'excessive' ? "text-amber-600" :
                        "text-amber-600"
                      }>
                        {currentAnalysis.gestures.charAt(0).toUpperCase() + currentAnalysis.gestures.slice(1)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Attire:</span>{' '}
                      <span className={
                        currentAnalysis.dressCode === 'formal' ? "text-green-600" :
                        currentAnalysis.dressCode === 'business-casual' ? "text-green-600" :
                        currentAnalysis.dressCode === 'casual' ? "text-amber-600" :
                        "text-red-600"
                      }>
                        {currentAnalysis.dressCode.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>
                  </div>
                  
                  {currentAnalysis.suggestions.length > 0 && (
                    <div className="text-xs bg-blue-50 p-2 rounded-md">
                      <div className="flex gap-1.5 text-blue-600">
                        <ThumbsUp className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Presentation Tip:</strong> {currentAnalysis.suggestions[0]}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!currentAnalysis && isAnalyzing && (
                <div className="text-xs text-center py-2 text-muted-foreground">
                  Analyzing your presentation...
                </div>
              )}
            </>
          )}
          
          {!isVideoActive && (
            <div className="flex items-center justify-center py-3 text-sm text-muted-foreground">
              <Camera className="h-4 w-4 mr-2" />
              Click the eye icon to enable camera for posture analysis
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PostureAnalyzer;
