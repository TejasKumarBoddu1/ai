
import { callGeminiWithStructuredOutput } from './geminiService';
import { StudentContext, AIAnalysis } from '@/types/aiQuestions';

export const analyzeStudentWithAI = async (studentContext: StudentContext): Promise<AIAnalysis> => {
  const analysisPrompt = `
    Analyze this student's interview performance data:
    
    CONFIDENCE METRICS:
    - Current confidence level: ${studentContext.confidenceLevel}%
    - Eye contact score: ${studentContext.eyeContactScore}%
    - Posture quality: ${studentContext.postureScore}%
    - Speech pace: ${studentContext.speechPace} WPM (ideal: 140-160)
    - Filler words in last session: ${studentContext.fillerWordCount}
    
    PERFORMANCE HISTORY:
    - Average answer score: ${studentContext.averageAnswerScore}/100
    - Identified weak areas: ${studentContext.weakAreas.join(', ')}
    - Strong areas: ${studentContext.strongAreas.join(', ')}
    
    STUDENT PROFILE:
    - Target industry: ${studentContext.targetIndustry}
    - Experience level: ${studentContext.experienceLevel}
    - Target role: ${studentContext.targetRole}
    
    CURRENT SESSION:
    - Session goal: ${studentContext.currentSessionGoal}
    - Questions answered today: ${studentContext.questionsAskedToday}
    - Time spent: ${studentContext.sessionDuration} minutes
    
    Based on this analysis, provide a JSON response with:
    {
      "readinessLevel": 1-10,
      "currentNeed": "confidence boost" | "skill challenge" | "practice",
      "recommendedDifficulty": "easy" | "medium" | "hard",
      "bestCategory": "behavioral" | "technical" | "situational" | "motivational",
      "focusArea": "communication" | "technical skills" | "problem-solving"
    }
    
    Rules:
    - If confidence < 50 or average score < 60: need "confidence boost", use "easy" difficulty
    - If confidence 50-80 and score 60-80: need "practice", use "medium" difficulty  
    - If confidence > 80 and score > 80: need "skill challenge", use "hard" difficulty
    - Focus on weak areas from the student's history
  `;
  
  try {
    const analysis = await callGeminiWithStructuredOutput(analysisPrompt);
    return analysis as AIAnalysis;
  } catch (error) {
    console.error('AI analysis failed:', error);
    // Return fallback analysis
    return {
      readinessLevel: 5,
      currentNeed: 'practice',
      recommendedDifficulty: 'medium',
      bestCategory: 'behavioral',
      focusArea: 'communication'
    };
  }
};
