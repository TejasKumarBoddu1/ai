
import { callGeminiWithStructuredOutput } from './geminiService';
import { StudentContext, AIAnalysis, AIGeneratedQuestion } from '@/types/aiQuestions';

export const selectOptimalQuestion = async (
  aiAnalysis: AIAnalysis, 
  studentContext: StudentContext
): Promise<AIGeneratedQuestion> => {
  const questionSelectionPrompt = `
    Generate a personalized interview question based on this analysis:
    
    STUDENT NEEDS:
    - Readiness level: ${aiAnalysis.readinessLevel}/10
    - Current need: ${aiAnalysis.currentNeed}
    - Recommended difficulty: ${aiAnalysis.recommendedDifficulty}
    - Best category: ${aiAnalysis.bestCategory}
    - Focus area: ${aiAnalysis.focusArea}
    
    STUDENT CONTEXT:
    - Industry: ${studentContext.targetIndustry}
    - Role: ${studentContext.targetRole}
    - Experience: ${studentContext.experienceLevel}
    - Weak areas to address: ${studentContext.weakAreas.join(', ')}
    - Strong areas: ${studentContext.strongAreas.join(', ')}
    - Questions asked today: ${studentContext.questionsAskedToday}
    
    QUESTION GENERATION RULES:
    1. For ${studentContext.targetIndustry} industry and ${studentContext.targetRole} role
    2. Match ${aiAnalysis.recommendedDifficulty} difficulty level
    3. Address weak areas: ${studentContext.weakAreas.join(', ')}
    4. Build on strong areas when appropriate
    5. If readiness < 6: Make encouraging and confidence-building
    6. If readiness > 8: Make challenging and comprehensive
    
    Return JSON format:
    {
      "question": "Specific personalized question here",
      "category": "${aiAnalysis.bestCategory}",
      "difficulty": "${aiAnalysis.recommendedDifficulty}",
      "expectedAnswerLength": "30-60 seconds" | "1-2 minutes" | "2-3 minutes",
      "evaluationCriteria": ["criterion1", "criterion2", "criterion3"]
    }
    
    Make the question highly relevant to their target role and industry.
  `;
  
  try {
    const questionResponse = await callGeminiWithStructuredOutput(questionSelectionPrompt);
    return questionResponse as AIGeneratedQuestion;
  } catch (error) {
    console.error('Question selection failed:', error);
    // Return fallback question
    return {
      question: `Tell me about your experience with ${studentContext.targetRole} responsibilities and what interests you most about this field.`,
      category: 'behavioral',
      difficulty: 'medium',
      expectedAnswerLength: '1-2 minutes',
      evaluationCriteria: ['relevance', 'specific examples', 'enthusiasm']
    };
  }
};
