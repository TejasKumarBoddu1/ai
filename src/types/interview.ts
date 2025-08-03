
export interface InterviewQuestion {
  type: 'Technical' | 'Behavioral' | 'HR';
  question: string;
}

export interface InterviewFeedback {
  strengths: string;
  improvements: string;
  suggestions: string;
  scores: {
    relevance: number;
    clarity: number;
    depth: number;
  };
  technical?: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  communication?: {
    score: number;
    voice: VoiceAnalysis;
    clarity: number;
    structure: number;
    suggestions: string[];
  };
  presentation?: {
    score: number;
    posture: PostureAnalysis;
    confidence: number;
    professionalism: number;
    suggestions: string[];
  };
  overall?: {
    score: number;
    strengths: string[];
    improvementAreas: string[];
    nextSteps: string[];
  };
}

export interface InterviewMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface InterviewState {
  questions: string[];
  currentQuestionIndex: number;
  messages: InterviewMessage[];
  isLoading: boolean;
  isFinished: boolean;
  summary: any | null;
}

export interface InterviewSettings {
  jobTitle: string;
  jobLevel?: string;
  targetCompany?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  interviewType?: 'technical' | 'behavioral' | 'mixed';
  yearsOfExperience?: string;
  duration?: number;
  enableRealTimeFeedback?: boolean;
  resumeText?: string;
}

export interface ResumeParserResponse {
  skills: string[];
  education: {
    institution: string;
    degree: string;
    field: string;
    date: string;
  }[];
  workExperience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  certifications: string[];
  name: string;
  email: string;
  phone?: string;
}

export interface VoiceAnalysis {
  paceScore: number;
  toneScore: number;
  fillerWordCount: number;
  fillerWords: string[];
  suggestions: string[];
}

export interface PostureAnalysis {
  posture: string;
  eyeContact: string;
  gestures: string;
  dressCode: string;
  suggestions: string[];
}

export interface InterviewReport {
  id: string;
  date: Date;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  targetCompany: string;
  yearsOfExperience: string;
  overallScore: number;
  questions: {
    question: string;
    answer: string;
    feedback: string;
    confidenceScore: number;
    contentScore: number;
    keyPointsCovered: string[];
  }[];
  skillsAnalysis: {
    matched: string[];
    missing: string[];
  };
  performanceMetrics: {
    communication: number;
    technicalKnowledge: number;
    problemSolving: number;
    cultureFit: number;
    confidence: number;
  };
  suggestedImprovements: string[];
  interviewTranscript: string;
}
