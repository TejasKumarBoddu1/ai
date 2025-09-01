
import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Hand, AlertTriangle, CheckCircle2 } from "lucide-react";

interface LiveFeedbackSystemProps {
  eyeContact: boolean;
  posture: 'good' | 'poor';
  handPresence: boolean;
  isInterviewActive: boolean;
}

const LiveFeedbackSystem: React.FC<LiveFeedbackSystemProps> = ({
  eyeContact,
  posture,
  handPresence,
  isInterviewActive
}) => {
  const [feedbackQueue, setFeedbackQueue] = useState<string[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Timing states for delayed feedback
  const [poorPostureStartTime, setPoorPostureStartTime] = useState<number | null>(null);
  const [poorEyeContactStartTime, setPoorEyeContactStartTime] = useState<number | null>(null);
  const [handPresenceStartTime, setHandPresenceStartTime] = useState<number | null>(null);
  
  // Feedback given flags to prevent repetition
  const poorPostureFeedbackGiven = useRef(false);
  const poorEyeContactFeedbackGiven = useRef(false);
  const handPresenceFeedbackGiven = useRef(false);
  
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor posture changes
  useEffect(() => {
    if (!isInterviewActive) return;

    if (posture === 'poor') {
      if (!poorPostureStartTime) {
        setPoorPostureStartTime(Date.now());
        poorPostureFeedbackGiven.current = false;
      } else {
        // Check if poor posture has persisted for 8 seconds
        const elapsed = Date.now() - poorPostureStartTime;
        if (elapsed > 8000 && !poorPostureFeedbackGiven.current) {
          addFeedback("Please maintain good posture during the interview. Sit up straight and keep your shoulders back.");
          poorPostureFeedbackGiven.current = true;
        }
      }
    } else {
      // Reset when posture improves
      if (poorPostureStartTime) {
        setPoorPostureStartTime(null);
        poorPostureFeedbackGiven.current = false;
      }
    }
  }, [posture, poorPostureStartTime, isInterviewActive]);

  // Monitor eye contact changes
  useEffect(() => {
    if (!isInterviewActive) return;

    if (!eyeContact) {
      if (!poorEyeContactStartTime) {
        setPoorEyeContactStartTime(Date.now());
        poorEyeContactFeedbackGiven.current = false;
      } else {
        // Check if poor eye contact has persisted for 6 seconds
        const elapsed = Date.now() - poorEyeContactStartTime;
        if (elapsed > 6000 && !poorEyeContactFeedbackGiven.current) {
          addFeedback("Remember to maintain eye contact by looking at the camera. This shows confidence and engagement.");
          poorEyeContactFeedbackGiven.current = true;
        }
      }
    } else {
      // Reset when eye contact improves
      if (poorEyeContactStartTime) {
        setPoorEyeContactStartTime(null);
        poorEyeContactFeedbackGiven.current = false;
      }
    }
  }, [eyeContact, poorEyeContactStartTime, isInterviewActive]);

  // Monitor hand presence (excessive gesturing)
  useEffect(() => {
    if (!isInterviewActive) return;

    if (handPresence) {
      if (!handPresenceStartTime) {
        setHandPresenceStartTime(Date.now());
        handPresenceFeedbackGiven.current = false;
      } else {
        // Check if hands have been visible for 10 seconds (excessive gesturing)
        const elapsed = Date.now() - handPresenceStartTime;
        if (elapsed > 10000 && !handPresenceFeedbackGiven.current) {
          addFeedback("Try to keep your hand gestures natural and not too frequent. Calm, measured gestures work best.");
          handPresenceFeedbackGiven.current = true;
        }
      }
    } else {
      // Reset when hands are not visible
      if (handPresenceStartTime) {
        setHandPresenceStartTime(null);
        handPresenceFeedbackGiven.current = false;
      }
    }
  }, [handPresence, handPresenceStartTime, isInterviewActive]);

  const addFeedback = (message: string) => {
    console.log('📢 Adding live feedback:', message);
    setFeedbackQueue(prev => [...prev, message]);
  };

  // Process feedback queue
  useEffect(() => {
    if (feedbackQueue.length > 0 && !showFeedback) {
      const nextFeedback = feedbackQueue[0];
      setCurrentFeedback(nextFeedback);
      setShowFeedback(true);
      setFeedbackQueue(prev => prev.slice(1));

      // Auto-hide feedback after 5 seconds
      feedbackTimeoutRef.current = setTimeout(() => {
        setShowFeedback(false);
        setCurrentFeedback('');
      }, 5000);
    }
  }, [feedbackQueue, showFeedback]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  if (!isInterviewActive) return null;

  return (
    <div className="space-y-4">
      {/* Live Status Indicators */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={eyeContact ? "default" : "destructive"}
          className={`flex items-center gap-1 ${
            eyeContact ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          <Eye className="h-3 w-3" />
          Eye Contact: {eyeContact ? "Good" : "Poor"}
        </Badge>

        <Badge 
          variant={posture === 'good' ? "default" : "destructive"}
          className={`flex items-center gap-1 ${
            posture === 'good' ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          <User className="h-3 w-3" />
          Posture: {posture === 'good' ? "Good" : "Poor"}
        </Badge>

        <Badge 
          variant={handPresence ? "secondary" : "default"}
          className={`flex items-center gap-1 ${
            handPresence ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-blue-100 text-blue-800 border-blue-300"
          }`}
        >
          <Hand className="h-3 w-3" />
          Gestures: {handPresence ? "Active" : "Calm"}
        </Badge>
      </div>

      {/* Live Feedback Alert */}
      {showFeedback && currentFeedback && (
        <Alert className="border-orange-200 bg-orange-50 animate-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 font-medium">
            <div className="flex items-center justify-between">
              <span>{currentFeedback}</span>
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setCurrentFeedback('');
                  if (feedbackTimeoutRef.current) {
                    clearTimeout(feedbackTimeoutRef.current);
                  }
                }}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                ✕
              </button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Feedback Queue Indicator */}
      {feedbackQueue.length > 0 && (
        <div className="text-xs text-slate-500 text-center">
          {feedbackQueue.length} feedback message{feedbackQueue.length > 1 ? 's' : ''} pending
        </div>
      )}
    </div>
  );
};

export default LiveFeedbackSystem;
