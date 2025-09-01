
import { callGeminiAI } from './geminiService';
import { callChatGPTAI } from './chatgptService';
import { callGrokAI } from './grokService';

export type AIBackend = 'gemini' | 'chatgpt' | 'grok';

export interface AIResponse {
  text: () => string;
}

export const callUnifiedAI = async (
  prompt: string, 
  backend: AIBackend = 'gemini',
  apiKey?: string
): Promise<AIResponse> => {
  try {
    switch (backend) {
      case 'chatgpt':
        return await callChatGPTAI(prompt, apiKey);
      case 'grok':
        return await callGrokAI(prompt, apiKey);
      case 'gemini':
      default:
        return await callGeminiAI(prompt, apiKey);
    }
  } catch (error) {
    console.error(`${backend} AI call failed:`, error);
    
    // Fallback to Gemini if other services fail
    if (backend !== 'gemini') {
      console.log('Falling back to Gemini service');
      return await callGeminiAI(prompt, apiKey);
    }
    
    throw error;
  }
};

export const callUnifiedAIWithStructuredOutput = async (
  prompt: string,
  backend: AIBackend = 'gemini',
  apiKey?: string
) => {
  const structuredPrompt = `
    ${prompt}
    
    IMPORTANT: Return your response in valid JSON format only. 
    No additional text outside the JSON.
  `;
  
  const response = await callUnifiedAI(structuredPrompt, backend, apiKey);
  return JSON.parse(response.text());
};
