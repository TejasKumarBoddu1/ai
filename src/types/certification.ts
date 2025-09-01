
// Import the Certificate type from blockchain types
export type { Certificate } from './blockchain';

export interface CertificationTest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number; // minutes
  skillsGained: string[];
  image: string;
  questions: number;
  passingScore: number;
}

export interface TestInfo {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questionCount: number;
  topics: string[];
  passingScore: number;
  category: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  correctAnswer?: string; // Adding this to fix compatibility issues with existing code
}

export interface BlockchainTransaction {
  hash: string;
  blockId: number;
  confirmations: number;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export type VerificationMethod = 'certHash' | 'txHash' | 'blockId' | 'uniqueId' | 'file';
