
import { callGeminiWithStructuredOutput } from './geminiService';
import { StudentContext, FollowUpQuestion } from '@/types/aiQuestions';

export const generateFollowUpQuestion = async (
  originalQuestion: string,
  studentAnswer: string,
  studentContext: StudentContext
): Promise<FollowUpQuestion> => {
  const followUpPrompt = `
    Generate a natural follow-up question based on the student's answer:
    
    ORIGINAL QUESTION: "${originalQuestion}"
    STUDENT'S ANSWER: "${studentAnswer}"
    
    STUDENT CONTEXT:
    - Industry: ${studentContext.targetIndustry}
    - Experience: ${studentContext.experienceLevel}
    - Current confidence: ${studentContext.confidenceLevel}%
    - Target role: ${studentContext.targetRole}
    
    ANSWER ANALYSIS:
    - Answer length: ${studentAnswer.length} characters
    - Contains specific examples: ${hasExamples(studentAnswer)}
    - Mentions metrics/results: ${hasQuantifiableResults(studentAnswer)}
    - Shows problem-solving: ${showsProblemSolving(studentAnswer)}
    
    Generate a follow-up that:
    1. Feels natural and conversational
    2. Digs deeper into their answer
    3. Tests their knowledge appropriately for ${studentContext.experienceLevel}
    4. Helps them provide more specific details
    5. Is relevant to ${studentContext.targetRole} role
    
    Rules:
    - If answer was vague: Ask for specific examples
    - If they mentioned interesting points: Explore those deeper
    - If they showed problem-solving: Ask about challenges or results
    - If answer was too brief: Encourage elaboration
    
    Return JSON:
    {
      "followUpQuestion": "Your natural follow-up question here",
      "purpose": "Why you're asking this follow-up",
      "expectedImprovement": "What this helps them practice"
    }
  `;
  
  try {
    const followUpResponse = await callGeminiWithStructuredOutput(followUpPrompt);
    return followUpResponse as FollowUpQuestion;
  } catch (error) {
    console.error('Follow-up generation failed:', error);
    return {
      followUpQuestion: "Can you provide a specific example to illustrate your point?",
      purpose: "Get more concrete details",
      expectedImprovement: "Practice providing specific examples"
    };
  }
};

const hasExamples = (answer: string): boolean => {
  const exampleKeywords = ['example', 'instance', 'time when', 'situation', 'project', 'experience'];
  return exampleKeywords.some(keyword => answer.toLowerCase().includes(keyword));
};

const hasQuantifiableResults = (answer: string): boolean => {
  const resultKeywords = ['%', 'percent', 'increased', 'decreased', 'improved', 'reduced', 'saved', 'grew'];
  return resultKeywords.some(keyword => answer.toLowerCase().includes(keyword));
};

const showsProblemSolving = (answer: string): boolean => {
  const problemKeywords = ['problem', 'challenge', 'solution', 'solved', 'approach', 'strategy'];
  return problemKeywords.some(keyword => answer.toLowerCase().includes(keyword));
};
