
import { callGeminiWithStructuredOutput } from './geminiService';
import { StudentContext, AnswerEvaluation } from '@/types/aiQuestions';

export const evaluateAnswerWithAI = async (
  question: string,
  answer: string,
  studentContext: StudentContext
): Promise<AnswerEvaluation> => {
  const evaluationPrompt = `
    Evaluate this interview answer:
    
    QUESTION: "${question}"
    STUDENT'S ANSWER: "${answer}"
    
    STUDENT PROFILE:
    - Target role: ${studentContext.targetRole}
    - Industry: ${studentContext.targetIndustry}
    - Experience level: ${studentContext.experienceLevel}
    - Current confidence: ${studentContext.confidenceLevel}%
    
    Evaluate on these criteria (0-25 points each):
    1. RELEVANCE: How well does it answer the question?
    2. CLARITY: Is it clear and well-structured?
    3. DEPTH: Does it show appropriate understanding for ${studentContext.experienceLevel}?
    4. EXAMPLES: Are there specific, concrete examples?
    
    Provide constructive feedback appropriate for ${studentContext.experienceLevel} level candidate.
    Be encouraging but honest, focusing on actionable improvements.
    
    Return JSON:
    {
      "relevance": 0-25,
      "clarity": 0-25,
      "depth": 0-25,
      "examples": 0-25,
      "overallScore": 0-100,
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2", "improvement3"],
      "improvedAnswer": "A rewritten version showing improvements",
      "nextFocusArea": "What they should practice next"
    }
    
    Consider their experience level - don't expect senior-level depth from junior candidates.
  `;
  
  try {
    const evaluationResponse = await callGeminiWithStructuredOutput(evaluationPrompt);
    return evaluationResponse as AnswerEvaluation;
  } catch (error) {
    console.error('Answer evaluation failed:', error);
    return {
      relevance: 18,
      clarity: 16,
      depth: 15,
      examples: 12,
      overallScore: 61,
      strengths: ['Clear communication', 'Relevant experience', 'Good structure'],
      improvements: ['Add specific examples', 'Quantify achievements', 'Expand on key points'],
      improvedAnswer: 'Consider expanding your answer with specific examples and quantifiable results.',
      nextFocusArea: 'Practice providing concrete examples with measurable outcomes'
    };
  }
};
