
import React, { useEffect, useState } from 'react';
import InterviewFeedbackIndicator from './InterviewFeedbackIndicator';
import { PostureAnalysis, VoiceAnalysis } from '@/types/interview';

interface RealtimeFeedbackOverlayProps {
  postureAnalysis: PostureAnalysis | null;
  voiceAnalysis: VoiceAnalysis | null;
  isActive: boolean;
}

const RealtimeFeedbackOverlay: React.FC<RealtimeFeedbackOverlayProps> = ({
  postureAnalysis,
  voiceAnalysis,
  isActive
}) => {
  const [feedbackItems, setFeedbackItems] = useState<Array<{
    id: string;
    type: 'posture' | 'voice' | 'appearance' | 'filler' | 'info';
    message: string;
    severity: 'error' | 'warning' | 'success' | 'info';
    expiresAt: number;
  }>>([]);
  
  // Process posture analysis changes
  useEffect(() => {
    if (!isActive || !postureAnalysis) return;
    
    const newFeedbackItems = [];
    
    // Posture feedback
    if (postureAnalysis.posture === 'poor') {
      newFeedbackItems.push({
        id: `posture-${Date.now()}`,
        type: 'posture',
        message: 'Sit up straight to project confidence',
        severity: 'warning',
        expiresAt: Date.now() + 10000 // Show for 10 seconds
      });
    }
    
    // Eye contact feedback
    if (postureAnalysis.eyeContact === 'poor') {
      newFeedbackItems.push({
        id: `eye-${Date.now()}`,
        type: 'posture',
        message: 'Maintain eye contact with the camera',
        severity: 'warning',
        expiresAt: Date.now() + 10000
      });
    }
    
    // Gesture feedback
    if (postureAnalysis.gestures === 'excessive') {
      newFeedbackItems.push({
        id: `gesture-${Date.now()}`,
        type: 'posture',
        message: 'Reduce excessive hand movements',
        severity: 'warning',
        expiresAt: Date.now() + 10000
      });
    } else if (postureAnalysis.gestures === 'limited') {
      newFeedbackItems.push({
        id: `gesture-${Date.now()}`,
        type: 'posture',
        message: 'Use some hand gestures to emphasize points',
        severity: 'info',
        expiresAt: Date.now() + 10000
      });
    }
    
    // Appearance feedback
    if (postureAnalysis.dressCode === 'casual' || postureAnalysis.dressCode === 'inappropriate') {
      newFeedbackItems.push({
        id: `dress-${Date.now()}`,
        type: 'appearance',
        message: postureAnalysis.dressCode === 'inappropriate' 
          ? 'Your attire appears too casual for a professional interview'
          : 'Consider more formal attire for professional interviews',
        severity: postureAnalysis.dressCode === 'inappropriate' ? 'error' : 'warning',
        expiresAt: Date.now() + 15000
      });
    }
    
    // Add the new feedback items
    if (newFeedbackItems.length > 0) {
      setFeedbackItems(prev => [...prev, ...newFeedbackItems]);
    }
  }, [postureAnalysis, isActive]);
  
  // Process voice analysis changes
  useEffect(() => {
    if (!isActive || !voiceAnalysis) return;
    
    const newFeedbackItems = [];
    
    // Voice pace feedback
    if (voiceAnalysis.paceScore < 60) {
      newFeedbackItems.push({
        id: `pace-${Date.now()}`,
        type: 'voice',
        message: voiceAnalysis.paceScore < 40 
          ? 'Your speaking pace is very irregular - try to maintain a steady rhythm'
          : 'Try to maintain a more consistent speaking pace',
        severity: voiceAnalysis.paceScore < 40 ? 'error' : 'warning',
        expiresAt: Date.now() + 10000
      });
    }
    
    // Voice tone feedback
    if (voiceAnalysis.toneScore < 60) {
      newFeedbackItems.push({
        id: `tone-${Date.now()}`,
        type: 'voice',
        message: voiceAnalysis.toneScore < 40 
          ? 'Your tone lacks confidence - speak with more authority'
          : 'Try to sound more confident in your responses',
        severity: voiceAnalysis.toneScore < 40 ? 'error' : 'warning',
        expiresAt: Date.now() + 10000
      });
    }
    
    // Filler words feedback
    if (voiceAnalysis.fillerWordCount > 3) {
      newFeedbackItems.push({
        id: `filler-${Date.now()}`,
        type: 'filler',
        message: voiceAnalysis.fillerWordCount > 7 
          ? `You're using too many filler words (${voiceAnalysis.fillerWordCount})`
          : `Try to reduce filler words like ${voiceAnalysis.fillerWords.slice(0, 2).join(', ')}`,
        severity: voiceAnalysis.fillerWordCount > 7 ? 'error' : 'warning',
        expiresAt: Date.now() + 10000
      });
    }
    
    // Add the new feedback items
    if (newFeedbackItems.length > 0) {
      setFeedbackItems(prev => [...prev, ...newFeedbackItems]);
    }
  }, [voiceAnalysis, isActive]);
  
  // Clear expired feedback items
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFeedbackItems(prev => prev.filter(item => item.expiresAt > now));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isActive || feedbackItems.length === 0) return null;
  
  return (
    <div className="fixed top-24 right-4 z-50 w-80 space-y-2">
      {feedbackItems.map(item => (
        <InterviewFeedbackIndicator
          key={item.id}
          type={item.type}
          message={item.message}
          severity={item.severity}
          isVisible={true}
        />
      ))}
    </div>
  );
};

export default RealtimeFeedbackOverlay;
