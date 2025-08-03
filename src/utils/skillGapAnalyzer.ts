
import { GEMINI_API_KEY } from "@/utils/apiKeys";

// Define types for the API responses
interface SkillGapAnalysisResult {
  strengths: string[];
  gapSkills: string[];
  analysis: string;
  learningPath: LearningPathStep[];
}

interface LearningPathStep {
  title: string;
  timeframe: string;
  description: string;
  resources: LearningResource[];
}

interface LearningResource {
  name: string;
  type: string; // e.g., "Course", "Book", "Tutorial", etc.
  url: string;
}

/**
 * Generate a skill gap analysis and learning path for a target job role
 * using the Gemini API
 */
export const generateSkillGapAnalysis = async (
  currentSkills: string,
  targetJobRole: string
): Promise<SkillGapAnalysisResult> => {
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
  
  const prompt = `
    Act as a career advisor specialized in tech and professional roles. Create a comprehensive skill gap analysis and learning path for someone transitioning to the role of "${targetJobRole}".

    CURRENT SKILLS:
    ${currentSkills}

    Provide the following in a structured JSON format:
    1. "strengths": Array of skills from the current skill set that are valuable for the target role
    2. "gapSkills": Array of important skills missing for the target role (focus on 5-8 most critical skills)
    3. "analysis": A 2-3 sentence analysis of the skill gap and career transition
    4. "learningPath": An array of 4-6 sequential learning steps, each containing:
       - "title": Short name for this step (e.g., "Master JavaScript Fundamentals")
       - "timeframe": Estimated time to complete this step (e.g., "2-4 weeks")
       - "description": 1-2 sentences explaining this step
       - "resources": Array of 2-3 specific learning resources with:
         - "name": Resource name
         - "type": Type of resource (Course, Book, Project, etc.)
         - "url": URL to the resource (use real, high-quality resources)

    Return ONLY the JSON object with no additional text, explanations or formatting.
  `;

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the response
    try {
      // The response might contain markdown code blocks, so we need to extract just the JSON
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return result;
      }
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
    }
    
    // Fallback to default response if parsing fails
    return generateFallbackResponse(currentSkills, targetJobRole);
  } catch (error) {
    console.error("Error in skill gap analysis:", error);
    return generateFallbackResponse(currentSkills, targetJobRole);
  }
};

/**
 * Generate a fallback response if the API call fails
 */
const generateFallbackResponse = (currentSkills: string, targetJobRole: string): SkillGapAnalysisResult => {
  // Parse current skills
  const skillsArray = currentSkills.split(',').map(skill => skill.trim());
  
  // Determine if it's a technical role
  const isTechnicalRole = targetJobRole.toLowerCase().includes('developer') || 
                         targetJobRole.toLowerCase().includes('engineer') || 
                         targetJobRole.toLowerCase().includes('data') ||
                         targetJobRole.toLowerCase().includes('tech');
  
  // Generate appropriate fallback data
  if (isTechnicalRole) {
    return {
      strengths: skillsArray.slice(0, 4),
      gapSkills: ["System Design", "CI/CD Pipeline Management", "Cloud Architecture", "Advanced Algorithms", "Leadership", "Technical Communication"],
      analysis: `Transitioning to a ${targetJobRole} role requires strengthening your technical architecture skills and gaining experience with modern development workflows. Focus on practical projects to build your portfolio.`,
      learningPath: [
        {
          title: "Foundation Building",
          timeframe: "4-6 weeks",
          description: "Solidify your understanding of core concepts required for the role",
          resources: [
            {
              name: "Complete guide to your target role",
              type: "Online Course",
              url: "https://www.coursera.org/specializations/software-development-lifecycle"
            },
            {
              name: "Fundamentals practice problems",
              type: "Interactive Exercises",
              url: "https://www.hackerrank.com/"
            }
          ]
        },
        {
          title: "Technical Specialization",
          timeframe: "8-10 weeks",
          description: "Develop expertise in key technical areas that are most relevant",
          resources: [
            {
              name: "Advanced concepts masterclass",
              type: "Video Course",
              url: "https://www.pluralsight.com/"
            },
            {
              name: "Hands-on projects",
              type: "Project-based learning",
              url: "https://www.freecodecamp.org/"
            }
          ]
        },
        {
          title: "Portfolio Development",
          timeframe: "4-6 weeks",
          description: "Build real-world projects that demonstrate your newly acquired skills",
          resources: [
            {
              name: "Portfolio project ideas",
              type: "Project Guide",
              url: "https://github.com/danistefanovic/build-your-own-x"
            },
            {
              name: "GitHub portfolio optimization",
              type: "Tutorial",
              url: "https://www.makeuseof.com/tag/github-portfolio-website/"
            }
          ]
        },
        {
          title: "Interview Preparation",
          timeframe: "3-4 weeks",
          description: "Prepare for technical interviews and role-specific questions",
          resources: [
            {
              name: "Technical interview handbook",
              type: "Guide",
              url: "https://www.techinterviewhandbook.org/"
            },
            {
              name: "Mock interview practice",
              type: "Practice Tool",
              url: "https://www.pramp.com/"
            }
          ]
        }
      ]
    };
  } else {
    // Non-technical role fallback
    return {
      strengths: skillsArray.slice(0, 4),
      gapSkills: ["Strategic Planning", "Stakeholder Management", "Data Analysis", "Project Management", "Industry Knowledge", "Leadership"],
      analysis: `Moving into a ${targetJobRole} position requires developing a blend of strategic thinking, leadership skills, and specialized domain knowledge. Focus on building practical experience through relevant projects.`,
      learningPath: [
        {
          title: "Domain Knowledge",
          timeframe: "4-6 weeks",
          description: "Build foundational knowledge specific to the industry and role",
          resources: [
            {
              name: "Industry fundamentals course",
              type: "Online Course",
              url: "https://www.coursera.org/learn/business-foundations"
            },
            {
              name: "Role-specific best practices",
              type: "E-Book",
              url: "https://www.amazon.com/dp/B08BZS3D9Y"
            }
          ]
        },
        {
          title: "Key Skills Development",
          timeframe: "6-8 weeks",
          description: "Focus on developing the most critical skills for the role",
          resources: [
            {
              name: "Essential skills masterclass",
              type: "Online Course",
              url: "https://www.linkedin.com/learning/"
            },
            {
              name: "Practical applications workshop",
              type: "Workshop",
              url: "https://www.udemy.com/"
            }
          ]
        },
        {
          title: "Leadership & Communication",
          timeframe: "4-5 weeks",
          description: "Enhance your leadership and stakeholder communication abilities",
          resources: [
            {
              name: "Effective leadership course",
              type: "Online Course",
              url: "https://www.coursera.org/learn/leadership-collaboration"
            },
            {
              name: "Communication skills workshop",
              type: "Interactive Workshop",
              url: "https://www.udemy.com/course/communication-skills-for-professionals/"
            }
          ]
        },
        {
          title: "Practical Application",
          timeframe: "Ongoing",
          description: "Apply your skills in real-world scenarios and build experience",
          resources: [
            {
              name: "Industry networking groups",
              type: "Community",
              url: "https://www.linkedin.com/groups/"
            },
            {
              name: "Portfolio project guide",
              type: "Guide",
              url: "https://www.themuse.com/advice/how-to-build-a-professional-portfolio"
            }
          ]
        }
      ]
    };
  }
};
