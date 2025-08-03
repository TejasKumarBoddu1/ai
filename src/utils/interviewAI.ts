
import { InterviewSettings } from '@/components/interview/InterviewSetup';
import { InterviewMessage, InterviewFeedback, InterviewQuestion } from '@/types/interview';

// Analyze resume and generate questions based on the resume and job details
export const analyzeResumeAndGenerateQuestions = async (
  settings: InterviewSettings,
  apiKey: string
): Promise<InterviewQuestion[]> => {
  try {
    console.log('Analyzing resume and generating questions...');
    
    // Prepare prompt for Gemini, customized for difficulty and type
    let difficultyContext = 'standard';
    if (settings.difficulty === 'easy') {
      difficultyContext = 'beginner-friendly, supportive';
    } else if (settings.difficulty === 'hard') {
      difficultyContext = 'challenging, in-depth, thorough';
    }
    
    let typeContext = '';
    if (settings.interviewType === 'technical') {
      typeContext = 'Focus exclusively on technical skills, knowledge, and problem-solving abilities.';
    } else if (settings.interviewType === 'behavioral') {
      typeContext = 'Focus exclusively on behavioral competencies, soft skills, and past experiences.';
    } else {
      typeContext = 'Include a balanced mix of both technical and behavioral questions.';
    }
    
    const prompt = `
    You're an AI interview coach conducting a ${difficultyContext} job interview. 
    I'm applying for: ${settings.jobTitle} (${settings.jobLevel} level).
    This is a ${settings.duration} minute interview.
    ${typeContext}
    
    Here is my resume:
    ${settings.resumeText}
    
    Based on my resume and the job I'm applying for:
    1. Generate 8-10 thoughtful interview questions that are specifically tailored to my background, skills, and the job requirements.
    2. ${settings.interviewType === 'technical' ? 'Focus on technical knowledge, problem-solving, and specific technologies mentioned in my resume.' : 
       settings.interviewType === 'behavioral' ? 'Focus on behavioral questions that probe my soft skills, teamwork, leadership, and past experiences.' : 
       'Include a mix of behavioral, technical, and situational questions relevant to the position.'}
    3. The questions should be ${settings.difficulty === 'easy' ? 'approachable and straightforward' : 
                                settings.difficulty === 'hard' ? 'challenging and thought-provoking' : 
                                'moderately challenging'}
    4. Include questions about specific projects or achievements mentioned in my resume.
    5. ONLY return the list of questions, with each question on its own line.
    6. Do not include any other text, explanations, or numbering.
    `;
    
    // Make API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the questions from the response
    const text = data.candidates[0].content.parts[0].text.trim();
    
    // Split by newlines and filter out empty strings
    const questionsText = text.split('\n').filter(q => q.trim() !== '');
    
    // Convert to the required InterviewQuestion format
    const questions: InterviewQuestion[] = questionsText.map(question => {
      // Determine if the question is technical, behavioral, or HR based on content
      let type: "Technical" | "Behavioral" | "HR" = "Behavioral"; // Default
      
      const lowerCaseQuestion = question.toLowerCase();
      
      if (lowerCaseQuestion.includes('code') || 
          lowerCaseQuestion.includes('technical') || 
          lowerCaseQuestion.includes('programming') ||
          lowerCaseQuestion.includes('architecture') ||
          lowerCaseQuestion.includes('algorithm') ||
          lowerCaseQuestion.includes('technology') ||
          lowerCaseQuestion.includes('tool') ||
          lowerCaseQuestion.includes('framework')) {
        type = "Technical";
      } else if (lowerCaseQuestion.includes('salary') || 
                lowerCaseQuestion.includes('benefit') ||
                lowerCaseQuestion.includes('culture') ||
                lowerCaseQuestion.includes('work-life balance') ||
                lowerCaseQuestion.includes('policy')) {
        type = "HR";
      }
      
      return {
        type,
        question
      };
    });
    
    return questions;
    
  } catch (error) {
    console.error('Error analyzing resume:', error);
    
    // Return fallback questions if the API fails
    return [
      { 
        type: "Behavioral", 
        question: "Can you walk me through your background and experience?"
      },
      { 
        type: "Behavioral", 
        question: "What makes you interested in this position?"
      },
      { 
        type: "Behavioral", 
        question: "Tell me about a challenging project you worked on."
      },
      { 
        type: "Behavioral", 
        question: "How do you prioritize tasks when you have multiple deadlines?"
      },
      { 
        type: "Behavioral", 
        question: "What are your greatest strengths related to this role?"
      },
      { 
        type: "Behavioral", 
        question: "Where do you see yourself professionally in 5 years?"
      },
      { 
        type: "Technical", 
        question: "Describe a situation where you had to learn something new quickly."
      },
      { 
        type: "Behavioral", 
        question: "How do you handle feedback or criticism?"
      }
    ];
  }
};

// Evaluate user's answer and provide feedback
export const evaluateAnswer = async (
  question: string,
  answer: string,
  jobTitle: string,
  jobLevel: string,
  apiKey: string
): Promise<string> => {
  try {
    console.log('Evaluating answer...');
    
    // Prepare prompt for Gemini
    const prompt = `
    You're an AI interview coach conducting a job interview for a ${jobLevel} level ${jobTitle} position.
    
    The question was: "${question}"
    
    The candidate's answer was: "${answer}"
    
    Please analyze the answer and provide constructive feedback:
    1. Identify strengths in the answer 
    2. Suggest improvements
    3. If needed, provide example statements that would make the answer stronger
    
    Keep your response concise, friendly, and focused on helping the candidate improve.
    Remain supportive and encouraging while providing honest evaluation.
    Speak directly to the candidate using "you" language.
    Format your response with markdown for better readability (use bold, bullets, etc).
    `;
    
    // Make API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const feedback = data.candidates[0].content.parts[0].text.trim();
    
    return feedback;
    
  } catch (error) {
    console.error('Error evaluating answer:', error);
    
    // Return a generic response if the API fails
    return "That's an interesting response. As we continue, try to provide specific examples and quantify your achievements when possible. Let's move to the next question.";
  }
};

// Generate a comprehensive summary of the interview
export const generateInterviewSummary = async (
  messages: InterviewMessage[],
  jobTitle: string,
  jobLevel: string,
  apiKey: string
): Promise<string> => {
  try {
    console.log('Generating interview summary...');
    
    // Extract the conversation
    const conversation = messages
      .map(msg => `${msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
      .join('\n\n');
    
    // Prepare prompt for Gemini
    const prompt = `
    You're an AI interview coach that just conducted a job interview for a ${jobLevel} level ${jobTitle} position.
    
    Here is the interview transcript:
    ${conversation}
    
    Based on this interview, please provide a comprehensive evaluation:
    
    # Interview Summary
    
    [Provide a brief summary of the candidate's overall performance (2-3 sentences)]
    
    ## Performance Metrics
    
    ### Technical Knowledge (Score: X/100)
    [Evaluate the candidate's technical knowledge and skills relevant to the position]
    
    ### Communication Skills (Score: X/100)
    [Evaluate the candidate's clarity, structure, and effectiveness of communication]
    
    ### Problem-Solving Ability (Score: X/100)
    [Evaluate how well the candidate approached and solved problems or answered challenging questions]
    
    ### Professional Presentation (Score: X/100)
    [Evaluate the candidate's overall professional presence]
    
    ## Key Strengths
    - [Strength 1]
    - [Strength 2]
    - [Strength 3]
    
    ## Areas for Improvement
    - [Area 1]: [Specific advice for improvement]
    - [Area 2]: [Specific advice for improvement]
    
    ## Action Plan
    1. [Specific action to improve]
    2. [Specific action to improve]
    3. [Specific action to improve]
    
    Format your response in markdown for better readability. Be specific, constructive, and actionable in your feedback.
    `;
    
    // Make API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text.trim();
    
    return summary;
    
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Return a generic summary if the API fails
    return `
    # Interview Summary
    
    You demonstrated good communication skills and provided relevant examples from your experience. Your answers showed enthusiasm for the ${jobTitle} position.
    
    ## Performance Metrics
    
    ### Technical Knowledge (Score: 75/100)
    Your technical knowledge was satisfactory, showing a good understanding of the core concepts related to the position.
    
    ### Communication Skills (Score: 80/100)
    You communicated your thoughts clearly with good structure and examples.
    
    ### Problem-Solving Ability (Score: 70/100)
    You approached problems methodically but could benefit from more structured problem-solving techniques.
    
    ### Professional Presentation (Score: 85/100)
    You maintained a professional demeanor throughout the interview.
    
    ## Key Strengths
    - Clear communication style
    - Good examples from past experience
    - Strong understanding of the role
    
    ## Areas for Improvement
    - Technical depth: Provide more in-depth technical explanations
    - Specific examples: Quantify your achievements with metrics when possible
    - Structured responses: Use the STAR method more consistently
    
    ## Action Plan
    1. Practice the STAR method (Situation, Task, Action, Result) for behavioral questions
    2. Prepare more detailed technical explanations for common interview questions
    3. Research the company more deeply before your actual interviews
    `;
  }
};

// Generate a comprehensive feedback report
export const generateInterviewFeedback = async (
  messages: InterviewMessage[],
  voiceAnalysis: any,
  postureAnalysis: any,
  settings: InterviewSettings,
  apiKey: string
): Promise<InterviewFeedback> => {
  try {
    // This is a mock implementation that would normally call an AI API
    // In a real implementation, this would call Gemini API to generate detailed feedback
    
    const technicalScore = Math.floor(Math.random() * 30) + 65;
    const communicationScore = Math.floor(Math.random() * 25) + 70;
    const problemSolvingScore = Math.floor(Math.random() * 20) + 75;
    const presentationScore = Math.floor(Math.random() * 15) + 80;
    
    const feedback: InterviewFeedback = {
      strengths: "You demonstrated good communication skills with a professional approach.",
      improvements: "Consider providing more detailed technical examples and reducing filler words.",
      suggestions: "Try to structure responses using the STAR method for more effective answers.",
      scores: {
        relevance: Math.floor((technicalScore + communicationScore) / 2),
        clarity: communicationScore,
        depth: technicalScore
      },
      technical: {
        score: technicalScore,
        strengths: [
          "Demonstrated good knowledge of core concepts",
          "Provided relevant examples from past projects",
          "Showed understanding of industry best practices"
        ],
        weaknesses: [
          "Could improve depth in some technical areas",
          "Explanations could be more concise and focused"
        ],
        suggestions: [
          "Prepare more detailed technical answers",
          "Practice explaining complex concepts simply",
          "Research latest trends in your field"
        ]
      },
      communication: {
        score: communicationScore,
        voice: voiceAnalysis || {
          paceScore: 80,
          toneScore: 75,
          fillerWordCount: 8,
          fillerWords: ["um (3x)", "like (2x)", "you know (3x)"],
          suggestions: ["Reduce filler words by pausing instead of saying 'um' or 'like'"]
        },
        clarity: 80,
        structure: 75,
        suggestions: [
          "Structure responses using the STAR method",
          "Be more concise in your explanations",
          "Use more professional vocabulary"
        ]
      },
      presentation: {
        score: presentationScore,
        posture: postureAnalysis || {
          posture: 'good',
          eyeContact: 'neutral',
          gestures: 'appropriate',
          dressCode: 'formal',
          suggestions: ["Maintain more consistent eye contact with the interviewer"]
        },
        confidence: 80,
        professionalism: 85,
        suggestions: [
          "Maintain consistent eye contact",
          "Sit up straighter to project confidence",
          "Use purposeful hand gestures to emphasize key points"
        ]
      },
      overall: {
        score: Math.floor((technicalScore + communicationScore + problemSolvingScore + presentationScore) / 4),
        strengths: [
          "Professional communication style",
          "Good technical foundation",
          "Positive and engaging attitude"
        ],
        improvementAreas: [
          "More structured responses",
          "Deeper technical explanations",
          "Reduced use of filler words"
        ],
        nextSteps: [
          "Practice with mock interviews focusing on STAR method",
          "Record yourself to identify and reduce filler words",
          "Research the company more deeply before interviews"
        ]
      }
    };
    
    return feedback;
    
  } catch (error) {
    console.error('Error generating feedback:', error);
    
    // Return a default feedback object if the API fails
    return {
      strengths: "You showed good communication skills and a professional approach.",
      improvements: "Your answers could benefit from more structured examples and technical details.",
      suggestions: "Using the STAR method would help structure your answers better.",
      scores: {
        relevance: 75,
        clarity: 80,
        depth: 70
      },
      technical: {
        score: 75,
        strengths: ["Good technical foundation", "Relevant experience"],
        weaknesses: ["Could provide more depth"],
        suggestions: ["Prepare more detailed technical answers"]
      },
      communication: {
        score: 80,
        voice: {
          paceScore: 80,
          toneScore: 75,
          fillerWordCount: 5,
          fillerWords: ["um", "like"],
          suggestions: ["Reduce filler words"]
        },
        clarity: 80,
        structure: 75,
        suggestions: ["Structure responses using the STAR method"]
      },
      presentation: {
        score: 85,
        posture: {
          posture: 'good',
          eyeContact: 'neutral',
          gestures: 'appropriate',
          dressCode: 'formal',
          suggestions: ["Maintain more consistent eye contact"]
        },
        confidence: 80,
        professionalism: 85,
        suggestions: ["Project more confidence"]
      },
      overall: {
        score: 80,
        strengths: ["Professional demeanor", "Good communication"],
        improvementAreas: ["Response structure", "Technical depth"],
        nextSteps: ["Practice mock interviews", "Research companies thoroughly"]
      }
    };
  }
};

// New function for PDF generation with enhanced formatting
export const generateEnhancedPDF = async (
  jobRole: string,
  questions: InterviewQuestion[],
  answers: string[],
  feedback: (InterviewFeedback | null)[],
): Promise<string> => {
  try {
    console.log('Generating enhanced PDF report...');
    
    // In a real implementation, this would use a library like jsPDF or html2pdf
    // to generate a well-formatted PDF with sections for each question and feedback
    
    // For now, simulate successful PDF generation
    
    // Calculate overall scores based on feedback
    let overallScore = 0;
    let technicalScore = 0;
    let communicationScore = 0;
    let presentationScore = 0;
    let validFeedbackCount = 0;
    
    feedback.forEach(fb => {
      if (fb && fb.overall) {
        overallScore += fb.overall.score;
        technicalScore += fb.technical?.score || 0;
        communicationScore += fb.communication?.score || 0;
        presentationScore += fb.presentation?.score || 0;
        validFeedbackCount++;
      }
    });
    
    if (validFeedbackCount > 0) {
      overallScore = Math.round(overallScore / validFeedbackCount);
      technicalScore = Math.round(technicalScore / validFeedbackCount);
      communicationScore = Math.round(communicationScore / validFeedbackCount);
      presentationScore = Math.round(presentationScore / validFeedbackCount);
    }
    
    // In a real implementation, this would return the URL to the downloaded PDF
    // For this mock implementation, we'll just return a message
    return `interview_report_${jobRole.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};
