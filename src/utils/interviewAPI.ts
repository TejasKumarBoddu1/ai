import { InterviewQuestion, InterviewFeedback } from "@/types/interview";
import { jsPDF } from "jspdf";

// Sample function to generate interview questions based on job role and resume
export const generateInterviewQuestions = async (
  jobRole: string,
  resumeText: string
): Promise<InterviewQuestion[]> => {
  // TODO: Implement real API call to Gemini API for question generation
  // This is a simulation for development purposes
  
  console.log("Generating questions for:", jobRole);
  console.log("Using resume text:", resumeText?.substring(0, 100) + "...");
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const baseQuestions = [
    {
      type: "Behavioral" as "Behavioral",
      question: "Tell me about a time when you had to deal with a difficult colleague or team member?",
    },
    {
      type: "Technical" as "Technical",
      question: "What are the key considerations when designing a scalable application architecture?",
    },
    {
      type: "HR" as "HR",
      question: "Where do you see yourself in 5 years in your career?",
    }
  ];
  
  // Add job-specific questions
  let jobSpecificQuestions: InterviewQuestion[] = [];
  
  if (jobRole.includes('frontend')) {
    jobSpecificQuestions = [
      {
        type: "Technical" as "Technical", 
        question: "Explain the concept of React hooks and give examples of how you've used them in projects."
      },
      {
        type: "Technical" as "Technical",
        question: "How would you optimize the performance of a React application that's rendering slowly?"
      },
      {
        type: "Behavioral" as "Behavioral",
        question: "Tell me about a UI/UX challenge you faced and how you solved it."
      }
    ];
  } else if (jobRole.includes('backend')) {
    jobSpecificQuestions = [
      {
        type: "Technical" as "Technical",
        question: "Explain how you would design a RESTful API for a social media platform."
      },
      {
        type: "Technical" as "Technical",
        question: "What strategies do you use for database optimization and query performance?"
      },
      {
        type: "Behavioral" as "Behavioral",
        question: "Describe a situation where you had to make a critical decision about system architecture."
      }
    ];
  } else if (jobRole.includes('data')) {
    jobSpecificQuestions = [
      {
        type: "Technical" as "Technical",
        question: "Explain the difference between supervised and unsupervised learning with examples."
      },
      {
        type: "Technical" as "Technical",
        question: "How would you handle missing data in a dataset before training a model?"
      },
      {
        type: "Behavioral" as "Behavioral",
        question: "Tell me about a data analysis project where your findings led to meaningful business impact."
      }
    ];
  }
  
  // If we have a resume, add a resume-specific question
  let resumeQuestions: InterviewQuestion[] = [];
  
  if (resumeText && resumeText.trim().length > 0) {
    // Extract skills from resume (simulated)
    const extractedSkills = extractSkillsFromResume(resumeText);
    
    if (extractedSkills.length > 0) {
      resumeQuestions = [
        {
          type: "Technical" as "Technical",
          question: `I see you have experience with ${extractedSkills.join(', ')}. Can you explain a project where you applied these skills?`
        }
      ];
    }
  }
  
  // Combine all questions
  const allQuestions = [...baseQuestions, ...jobSpecificQuestions, ...resumeQuestions];
  
  // Return 6 questions, or fewer if not enough available
  return allQuestions.slice(0, 6);
};

// Helper function to extract skills from resume text (simulated)
const extractSkillsFromResume = (resumeText: string): string[] => {
  const skills = [
    "JavaScript", "React", "Node.js", "Python", "SQL", "AWS",
    "TypeScript", "Docker", "Kubernetes", "GraphQL", "REST APIs"
  ];
  
  // Simple simulation of skill extraction - check if skills are mentioned in the text
  const extractedSkills = skills.filter(skill => 
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );
  
  // Return at least 2 skills, even if not found in text
  return extractedSkills.length >= 2 ? 
    extractedSkills : skills.slice(0, 2 + Math.floor(Math.random() * 3));
};

// Generate feedback for an answer
export const generateFeedback = async (
  jobRole: string,
  question: InterviewQuestion,
  answer: string
): Promise<InterviewFeedback> => {
  // TODO: Implement real API call to Gemini API for feedback generation
  // This is a simulation for development purposes
  
  console.log("Generating feedback for:", question.question);
  console.log("Answer:", answer.substring(0, 100) + "...");
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate scores based on answer length and complexity
  const answerQuality = Math.min(answer.length / 200, 1); // Longer answers get better scores up to a point
  const hasSpecificExamples = answer.toLowerCase().includes("example") || 
                             answer.toLowerCase().includes("instance") ||
                             answer.toLowerCase().includes("situation");
  
  const baseScore = 60;
  const lengthBonus = answerQuality * 20;
  const exampleBonus = hasSpecificExamples ? 10 : 0;
  
  // Add some randomness
  const randomFactor = Math.floor(Math.random() * 10);
  
  const relevanceScore = Math.min(Math.floor(baseScore + lengthBonus + exampleBonus + randomFactor), 100);
  const clarityScore = Math.min(Math.floor(baseScore + lengthBonus + (hasSpecificExamples ? 15 : 0) + randomFactor), 100);
  const depthScore = Math.min(Math.floor(baseScore + (lengthBonus * 1.5) + (hasSpecificExamples ? 15 : 0) + randomFactor), 100);
  
  // Simulated feedback based on scores
  let strengths = "";
  let improvements = "";
  let suggestions = "";
  
  // Generate strengths based on scores
  if (relevanceScore > 80) {
    strengths += "Your answer was highly relevant to the question. ";
  } else if (relevanceScore > 60) {
    strengths += "You addressed the main points of the question. ";
  }
  
  if (clarityScore > 80) {
    strengths += "You communicated your thoughts clearly and concisely. ";
  } else if (clarityScore > 60) {
    strengths += "Your explanation was generally clear. ";
  }
  
  if (depthScore > 80) {
    strengths += "You provided in-depth insights with excellent technical understanding. ";
  } else if (depthScore > 60) {
    strengths += "You demonstrated good knowledge of the subject. ";
  }
  
  if (hasSpecificExamples) {
    strengths += "The specific examples you provided strengthened your response. ";
  }
  
  // Generate improvements based on scores
  if (relevanceScore < 70) {
    improvements += "Your answer could be more focused on directly addressing the question. ";
  }
  
  if (clarityScore < 70) {
    improvements += "Try to structure your response with a clearer beginning, middle, and conclusion. ";
  }
  
  if (depthScore < 70) {
    improvements += "Consider providing more technical details or specific examples to strengthen your answer. ";
  }
  
  if (answer.length < 100) {
    improvements += "Your answer was quite brief; developing it further would be beneficial. ";
  }
  
  // Generate suggestions
  if (question.type === "Technical") {
    suggestions = "Consider using the STAR method (Situation, Task, Action, Result) to structure technical responses. Include specific technologies and metrics when possible.";
  } else if (question.type === "Behavioral") {
    suggestions = "For behavioral questions, provide more detail about your specific role, the actions you took, and quantifiable results of your efforts.";
  } else {
    suggestions = "Try to connect your answer to the company's values or the specific requirements of the position. Be concise but thorough.";
  }
  
  return {
    strengths: strengths || "You provided a reasonable response to the question.",
    improvements: improvements || "Continue to work on providing specific examples in your answers.",
    suggestions,
    scores: {
      relevance: relevanceScore,
      clarity: clarityScore,
      depth: depthScore
    }
  };
};

// Generate PDF report
export const generatePDF = async (
  jobRole: string,
  questions: InterviewQuestion[],
  answers: string[],
  feedback: (InterviewFeedback | null)[]
): Promise<void> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set up document
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80); // Dark blue-gray
  doc.text("Interview Performance Report", 20, 20);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(52, 73, 94); // Slightly lighter blue-gray
  doc.text(`Role: ${jobRole}`, 20, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 37);
  
  // Calculate overall scores
  let totalRelevance = 0;
  let totalClarity = 0;
  let totalDepth = 0;
  let validFeedbackCount = 0;
  
  feedback.forEach(fb => {
    if (fb) {
      totalRelevance += fb.scores.relevance;
      totalClarity += fb.scores.clarity;
      totalDepth += fb.scores.depth;
      validFeedbackCount++;
    }
  });
  
  const avgRelevance = validFeedbackCount ? Math.round(totalRelevance / validFeedbackCount) : 0;
  const avgClarity = validFeedbackCount ? Math.round(totalClarity / validFeedbackCount) : 0;
  const avgDepth = validFeedbackCount ? Math.round(totalDepth / validFeedbackCount) : 0;
  const overallScore = validFeedbackCount ? Math.round((avgRelevance + avgClarity + avgDepth) / 3) : 0;
  
  // Add summary section
  doc.setDrawColor(52, 152, 219); // Blue
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(52, 152, 219);
  doc.text("Performance Summary", 20, 55);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(52, 73, 94);
  doc.text(`Overall Score: ${overallScore}%`, 30, 65);
  doc.text(`Relevance: ${avgRelevance}%`, 30, 72);
  doc.text(`Clarity: ${avgClarity}%`, 30, 79);
  doc.text(`Technical Depth: ${avgDepth}%`, 30, 86);
  
  // Add strengths and improvements
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(52, 152, 219);
  doc.text("Key Strengths & Areas for Improvement", 20, 100);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(39, 174, 96); // Green
  doc.text("Strengths:", 30, 110);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(52, 73, 94);
  
  let yPosition = 117;
  const strengths = new Set<string>();
  feedback.forEach(fb => {
    if (fb) {
      fb.strengths.split('. ').filter(s => s).forEach(s => strengths.add(s));
    }
  });
  
  Array.from(strengths).slice(0, 3).forEach(strength => {
    const lines = doc.splitTextToSize(`• ${strength}`, 150);
    doc.text(lines, 30, yPosition);
    yPosition += lines.length * 7;
  });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(231, 76, 60); // Red
  doc.text("Areas for Improvement:", 30, yPosition + 5);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(52, 73, 94);
  
  yPosition += 12;
  const improvements = new Set<string>();
  feedback.forEach(fb => {
    if (fb) {
      fb.improvements.split('. ').filter(s => s).forEach(s => improvements.add(s));
    }
  });
  
  Array.from(improvements).slice(0, 3).forEach(improvement => {
    const lines = doc.splitTextToSize(`• ${improvement}`, 150);
    doc.text(lines, 30, yPosition);
    yPosition += lines.length * 7;
  });
  
  // Question details
  doc.addPage();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(52, 152, 219);
  doc.text("Question & Answer Details", 20, 20);
  
  let y = 30;
  questions.forEach((question, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(52, 73, 94);
    doc.text(`Question ${index + 1} (${question.type})`, 20, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const questionLines = doc.splitTextToSize(question.question, 170);
    doc.text(questionLines, 20, y + 7);
    
    y += questionLines.length * 5 + 10;
    
    doc.setFont("helvetica", "italic");
    doc.text("Your Answer:", 20, y);
    
    doc.setFont("helvetica", "normal");
    const answerText = answers[index] || "No answer provided";
    const answerLines = doc.splitTextToSize(answerText, 170);
    doc.text(answerLines, 20, y + 5);
    
    y += answerLines.length * 5 + 10;
    
    if (feedback[index]) {
      doc.setFont("helvetica", "italic");
      doc.text("Feedback:", 20, y);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      
      y += 5;
      doc.setTextColor(39, 174, 96); // Green
      const strengthLines = doc.splitTextToSize(`Strengths: ${feedback[index]?.strengths}`, 170);
      doc.text(strengthLines, 20, y);
      
      y += strengthLines.length * 5;
      doc.setTextColor(231, 76, 60); // Red
      const improvementLines = doc.splitTextToSize(`Improvements: ${feedback[index]?.improvements}`, 170);
      doc.text(improvementLines, 20, y);
      
      y += improvementLines.length * 5 + 5;
    }
    
    // Add spacer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(20, y, 190, y);
    
    y += 10;
  });
  
  // Add final page with resources and next steps
  doc.addPage();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(52, 152, 219);
  doc.text("Next Steps & Resources", 20, 20);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(52, 73, 94);
  
  const nextSteps = [
    "Review your answers and the feedback provided",
    "Practice answering similar questions out loud",
    "Record yourself to review your verbal communication",
    "Research the company thoroughly before your actual interview",
    "Prepare specific examples from your experience for common questions"
  ];
  
  y = 30;
  doc.setFont("helvetica", "bold");
  doc.text("Recommended Steps for Improvement:", 20, y);
  y += 7;
  
  doc.setFont("helvetica", "normal");
  nextSteps.forEach(step => {
    doc.text(`• ${step}`, 25, y);
    y += 7;
  });
  
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Helpful Resources:", 20, y);
  y += 7;
  
  doc.setFont("helvetica", "normal");
  doc.text("• Glassdoor.com - Research companies and interview questions", 25, y); y += 7;
  doc.text("• LinkedIn Learning - Courses on interview preparation", 25, y); y += 7;
  doc.text("• Pramp.com - Free platform for mock interviews", 25, y); y += 7;
  doc.text("• GitHub - Build a portfolio of projects", 25, y); y += 7;
  doc.text("• QwiX CV Resources - Additional preparation materials", 25, y);
  
  // Save the PDF
  doc.save(`Interview_Report_${jobRole.replace(/[^a-z0-9]/gi, '_')}.pdf`);
};
