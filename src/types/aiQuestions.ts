
export interface StudentContext {
  confidenceLevel: number;
  eyeContactScore: number;
  postureScore: number;
  speechPace: number;
  fillerWordCount: number;
  averageAnswerScore: number;
  weakAreas: string[];
  strongAreas: string[];
  targetIndustry: string;
  experienceLevel: string;
  targetRole: string;
  currentSessionGoal: 'practice' | 'assessment' | 'improvement';
  questionsAskedToday: number;
  sessionDuration: number;
}

export interface AIAnalysis {
  readinessLevel: number;
  currentNeed: 'confidence boost' | 'skill challenge' | 'practice';
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
  bestCategory: 'behavioral' | 'technical' | 'situational' | 'motivational';
  focusArea: 'communication' | 'technical skills' | 'problem-solving';
}

export interface AIGeneratedQuestion {
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'motivational' | 'problem-solving';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswerLength: string;
  evaluationCriteria: string[];
}

export interface FollowUpQuestion {
  followUpQuestion: string;
  purpose: string;
  expectedImprovement: string;
}

export interface AnswerEvaluation {
  relevance: number;
  clarity: number;
  depth: number;
  examples: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  improvedAnswer: string;
  nextFocusArea: string;
}
