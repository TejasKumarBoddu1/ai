
import { StudentContext } from '@/types/aiQuestions';

export const collectStudentContext = (
  mediaMetrics: any,
  voiceMetrics: any,
  sessionData: any,
  userProfile: any
): StudentContext => {
  // Calculate confidence from multiple metrics
  const confidenceLevel = calculateOverallConfidence(mediaMetrics, voiceMetrics);
  
  return {
    // Real-time analysis data
    confidenceLevel,
    eyeContactScore: mediaMetrics?.eyeContactPercentage || 75,
    postureScore: mediaMetrics?.postureQuality || 80,
    speechPace: voiceMetrics?.wordsPerMinute || 150,
    fillerWordCount: voiceMetrics?.fillerWords || 0,
    
    // Historical performance
    averageAnswerScore: sessionData?.averageScore || 70,
    weakAreas: sessionData?.weakAreas || ['clarity', 'examples'],
    strongAreas: sessionData?.strongAreas || ['technical knowledge'],
    
    // User profile
    targetIndustry: userProfile?.industry || 'Technology',
    experienceLevel: userProfile?.experience || 'Mid-level',
    targetRole: userProfile?.jobRole || 'Software Engineer',
    
    // Current session
    currentSessionGoal: sessionData?.goal || 'practice',
    questionsAskedToday: sessionData?.questionCount || 0,
    sessionDuration: sessionData?.timeSpent || 0
  };
};

const calculateOverallConfidence = (mediaMetrics: any, voiceMetrics: any): number => {
  let confidence = 70; // Base confidence
  
  // Adjust based on posture
  if (mediaMetrics?.postureQuality > 80) confidence += 10;
  else if (mediaMetrics?.postureQuality < 60) confidence -= 15;
  
  // Adjust based on eye contact
  if (mediaMetrics?.eyeContactPercentage > 70) confidence += 10;
  else if (mediaMetrics?.eyeContactPercentage < 50) confidence -= 15;
  
  // Adjust based on speech
  if (voiceMetrics?.fillerWords < 3) confidence += 10;
  else if (voiceMetrics?.fillerWords > 8) confidence -= 15;
  
  return Math.max(0, Math.min(100, confidence));
};
