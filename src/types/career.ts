
// Define types for career paths and nodes

export interface SkillRequirement {
  name: string;
  level: number; // 1-5 scale
}

export interface SkillGap {
  skill: string;
  suggestion: string;
  resourceUrl?: string; // Optional link to learning resource
}

export interface CareerNode {
  title: string;
  yearsFromNow: number; // Years from current position
  salaryRange: string;
  description: string;
  stage: string;
  requiredSkills: {
    name: string;
    level: number; // 1-5
  }[];
  skillGaps?: {
    skill: string;
    suggestion: string;
    resourceUrl?: string;
  }[];
}

export interface CareerPath {
  id?: string;
  name: string;
  type: "ambitious" | "balanced" | "skills";
  description: string;
  nodes: CareerNode[];
  title?: string; // Optional title property
}

// New types for mindprint assessment
export interface PersonalityTrait {
  trait: string;
  score: number; // 0-100
  description: string;
}

export interface MindprintProfile {
  id: string;
  timestamp: string;
  thinkingStyle: {
    primary: string;
    secondary: string;
    description: string;
  };
  personalityTraits: PersonalityTrait[];
  decisionMaking: {
    style: string;
    strengths: string[];
    considerations: string[];
  };
  careerRecommendations: CareerRecommendation[];
}

export interface CareerRecommendation {
  title: string;
  matchScore: number; // 0-100
  description: string;
  traits: {
    trait: string;
    score: number;
  }[];
  keyStrengths: string[];
}

// Types for LinkedIn optimization
export interface LinkedInProfile {
  url: string;
  headline: {
    current: string;
    suggested: string;
    score: number; // 0-100
  };
  summary: {
    current: string;
    suggested: string;
    score: number; // 0-100
  };
  keywords: {
    missing: string[];
    recommended: string[];
  };
  experience: {
    suggestions: string[];
  };
}
