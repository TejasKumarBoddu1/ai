
import { ResumeParserResponse, InterviewSettings } from '@/types/interview';
import { toast } from "@/components/ui/use-toast";

// API key for RapidAPI
const RAPID_API_KEY = '9515e48d1bmsh7a2462135b3d8e9p1755e7jsn7759e1a20e89';

/**
 * Parse resume using the RapidAPI Resume Parser
 */
export const parseResume = async (fileBase64: string): Promise<ResumeParserResponse> => {
  try {
    const response = await fetch('https://ai-resume-parser-extractor.p.rapidapi.com/resume/file/base64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'ai-resume-parser-extractor.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY
      },
      body: JSON.stringify({
        file: fileBase64,
        fileType: 'pdf'
      })
    });

    if (!response.ok) {
      throw new Error(`Resume parsing failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and return the structured data
    return {
      skills: data.skills || [],
      education: data.education || [],
      workExperience: data.workExperience || [],
      certifications: data.certifications || [],
      name: data.name || 'Candidate',
      email: data.email || 'candidate@example.com',
      phone: data.phone || undefined
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    toast({
      title: "Resume parsing failed",
      description: "We couldn't extract data from your resume. Using default questions instead.",
      variant: "destructive"
    });
    
    // Return mock data for fallback
    return {
      skills: ['Communication', 'Problem Solving', 'Teamwork'],
      education: [{
        institution: 'University',
        degree: 'Bachelor',
        field: 'Computer Science',
        date: '2020'
      }],
      workExperience: [{
        company: 'Previous Company',
        position: 'Developer',
        duration: '2 years',
        description: 'Worked on various projects'
      }],
      certifications: ['Basic Certification'],
      name: 'Candidate',
      email: 'candidate@example.com'
    };
  }
};

/**
 * Generate interview questions based on resume data and job details
 */
export const generateInterviewQuestions = async (
  resumeData: ResumeParserResponse,
  settings: InterviewSettings
): Promise<string[]> => {
  try {
    // In a real implementation, this would call an API
    // For now, we'll simulate with intelligent question generation
    
    // Use mock data for now to avoid API call in development
    console.log('Generating questions based on resume data and job details:', { resumeData, settings });
    
    // Generate questions based on skills, experience level, and job title
    const questions = generateSmartQuestions(resumeData, settings);
    
    return questions;
  } catch (error) {
    console.error('Error generating interview questions:', error);
    toast({
      title: "Question generation failed",
      description: "We couldn't generate custom questions. Using default questions instead.",
      variant: "destructive"
    });
    
    // Default questions as fallback
    return [
      `Tell me about your experience relevant to the ${settings.jobTitle} role.`,
      "What are your greatest strengths and weaknesses?",
      "Describe a challenging project you worked on and how you handled it.",
      `Why do you want to work at ${settings.targetCompany || 'our company'}?`,
      "Where do you see yourself in 5 years?",
      "How do you handle stress and pressure?",
      "Describe your ideal work environment.",
      "What questions do you have for me?"
    ];
  }
};

/**
 * Smart question generation based on resume data and job settings
 */
function generateSmartQuestions(resumeData: ResumeParserResponse, settings: InterviewSettings): string[] {
  const questions: string[] = [];
  const { jobTitle, targetCompany, difficulty, interviewType, yearsOfExperience } = settings;
  
  // Technical/skill questions (40%)
  if (resumeData.skills.length > 0) {
    // Get random skills to ask about
    const skillsToAsk = shuffleArray(resumeData.skills).slice(0, 3);
    
    skillsToAsk.forEach(skill => {
      if (interviewType === 'technical' || interviewType === 'mixed') {
        questions.push(`Can you describe a project where you used ${skill}?`);
      } else {
        questions.push(`I see you listed ${skill} as one of your skills. How have you applied this in your previous roles?`);
      }
    });
  }
  
  // Add job-specific technical questions
  if (jobTitle.toLowerCase().includes('developer') || jobTitle.toLowerCase().includes('engineer')) {
    questions.push("Can you explain the difference between an array and a linked list?");
    questions.push("How do you ensure your code is maintainable and scalable?");
  } else if (jobTitle.toLowerCase().includes('manager')) {
    questions.push("How do you handle conflicts within your team?");
    questions.push("Describe your management style and how it adapts to different team members.");
  }
  
  // Behavioral questions (30%)
  questions.push("Tell me about a time when you had to meet a tight deadline.");
  questions.push("Describe a situation where you had to work with a difficult colleague or client.");
  questions.push("Give an example of a time you showed leadership skills.");
  
  // Company-specific questions (20%)
  if (targetCompany) {
    questions.push(`Why do you want to work at ${targetCompany}?`);
    questions.push(`What do you know about ${targetCompany}'s products/services?`);
  } else {
    questions.push("What are you looking for in your next company?");
  }
  
  // Curveball questions (10%)
  if (difficulty === 'hard') {
    questions.push("If you could have dinner with any three people, dead or alive, who would they be and why?");
  } else if (difficulty === 'medium') {
    questions.push("What's your biggest professional failure and what did you learn from it?");
  } else {
    questions.push("What is something not on your resume that you think I should know about?");
  }
  
  // Ensure we have enough questions
  while (questions.length < 8) {
    questions.push("Tell me more about your professional experience and how it relates to this role.");
  }
  
  // Shuffle and limit to 10-12 questions
  return shuffleArray(questions).slice(0, Math.min(12, questions.length));
}

/**
 * Convert audio to speech using RapidAPI
 */
export const textToSpeech = async (text: string, voice: string = 'alloy'): Promise<ArrayBuffer> => {
  try {
    const response = await fetch('https://open-ai-text-to-speech1.p.rapidapi.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'open-ai-text-to-speech1.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        instructions: 'Speak in a professional and clear tone, like an interviewer.',
        voice: voice // alloy, echo, fable, onyx, nova, shimmer
      })
    });

    if (!response.ok) {
      throw new Error(`Text-to-speech conversion failed: ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
};

/**
 * Convert speech to text using RapidAPI
 */
export const speechToText = async (audioBlob: Blob): Promise<string> => {
  try {
    // Create form data with the audio
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    // Create URL for the blob
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const response = await fetch(`https://speech-to-text-ai.p.rapidapi.com/transcribe?url=${encodeURIComponent(audioUrl)}&lang=en&task=transcribe`, {
      method: 'POST',
      headers: {
        'x-rapidapi-host': 'speech-to-text-ai.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Speech-to-text conversion failed: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error converting speech to text:', error);
    throw error;
  }
};

/**
 * Analyze facial emotions using RapidAPI (optional)
 */
export const analyzeFacialEmotions = async (imageBlob: Blob): Promise<any> => {
  try {
    // Create form data with the image
    const formData = new FormData();
    formData.append('image', imageBlob);
    
    const response = await fetch('https://facial-ai-analyzer.p.rapidapi.com/api/rekognition/face-analysis', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'x-rapidapi-host': 'facial-ai-analyzer.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Facial analysis failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing facial emotions:', error);
    return null; // Optional, so return null on failure
  }
};

/**
 * Check grammar using RapidAPI
 */
export const checkGrammar = async (text: string): Promise<any> => {
  try {
    const response = await fetch(`https://ai-grammer-checker-i-gpt.p.rapidapi.com/api/v1/getSynonyms?text=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'ai-grammer-checker-i-gpt.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Grammar check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking grammar:', error);
    return null;
  }
};

/**
 * Generate PDF report for the interview
 */
export const generatePdfReport = async (report: any): Promise<Blob> => {
  try {
    // In a real implementation, this would call an API or use a library like jsPDF
    // For now, we'll just simulate PDF generation
    console.log('Generating PDF report:', report);
    
    // Placeholder response - in a real app, this would be a PDF
    return new Blob(['PDF report content'], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

// Utility function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
