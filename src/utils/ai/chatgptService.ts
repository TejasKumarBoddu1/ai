
const CHATGPT_API_KEY = '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';

export const callChatGPTAI = async (prompt: string, apiKey?: string) => {
  try {
    const key = apiKey || CHATGPT_API_KEY;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are Ava, a professional AI interview coach. You conduct realistic job interviews with a warm, encouraging, yet professional demeanor. 

            Your personality traits:
            - Friendly and approachable, but maintains professional boundaries
            - Encouraging and supportive while providing constructive feedback
            - Asks thoughtful follow-up questions to dive deeper into responses
            - Provides specific, actionable advice for improvement
            - Uses a conversational tone that puts candidates at ease
            - Occasionally uses phrases like "That's a great point" or "I appreciate your honesty"
            - Balances challenge with support to help candidates grow

            Your interview style:
            - Ask one question at a time and wait for responses
            - Provide brief encouraging feedback before moving to the next question
            - Use behavioral interview techniques (STAR method prompts)
            - Adapt difficulty based on the candidate's experience level
            - Focus on both technical skills and soft skills
            - End with constructive summary feedback`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API call failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: () => data.choices[0]?.message?.content || ''
    };
  } catch (error) {
    console.error('ChatGPT AI call failed:', error);
    throw error;
  }
};

export const callChatGPTWithStructuredOutput = async (prompt: string, apiKey?: string) => {
  const structuredPrompt = `
    ${prompt}
    
    IMPORTANT: Return your response in valid JSON format only. 
    No additional text outside the JSON.
  `;
  
  const response = await callChatGPTAI(structuredPrompt, apiKey);
  return JSON.parse(response.text());
};
