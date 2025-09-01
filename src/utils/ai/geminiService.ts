
import { GoogleGenerativeAI } from "@google/generative-ai";
import { apiKeys } from "../apiKeys";

export const callGeminiAI = async (prompt: string, apiKey?: string) => {
  try {
    const key = apiKey || apiKeys.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    // Use gemini-2.0-flash-exp for the latest model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    const response = await result.response;
    return response;
  } catch (error) {
    console.error('Gemini AI call failed:', error);
    // Fallback to gemini-2.0-flash if experimental fails
    try {
      const key = apiKey || apiKeys.GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });
      
      const response = await result.response;
      return response;
    } catch (fallbackError) {
      console.error('Gemini AI fallback also failed:', fallbackError);
      throw fallbackError;
    }
  }
};

export const callGeminiWithStructuredOutput = async (prompt: string, apiKey?: string) => {
  const structuredPrompt = `
    ${prompt}
    
    IMPORTANT: Return your response in valid JSON format only. 
    No additional text outside the JSON.
  `;
  
  const response = await callGeminiAI(structuredPrompt, apiKey);
  return JSON.parse(response.text());
};
