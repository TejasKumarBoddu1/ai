
import { apiKeys } from "./apiKeys";

// Updated API URL - the issue might be with the model name or endpoint
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent";

/**
 * Generate content using the Gemini API for QwiX Pro Builder
 * @param prompt The prompt to send to the API
 * @param apiKeyType The type of API key to use (default, career, or layoff)
 * @returns The generated content
 */
export const generateQwiXProContent = async (prompt: string, apiKeyType: 'default' | 'career' | 'layoff' = 'default'): Promise<string> => {
  // Select the appropriate API key based on the type
  let apiKey = apiKeys.GEMINI_API_KEY;
  if (apiKeyType === 'career') {
    apiKey = apiKeys.CAREER_SIMULATOR_API_KEY;
  } else if (apiKeyType === 'layoff') {
    apiKey = apiKeys.LAYOFF_TOOLKIT_API_KEY;
  }

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw error;
  }
};

// Mock data for Career Simulator in case the API fails
export const getCareerSimulatorMockData = (role: string, industry: string = ""): string => {
  const mockData = {
    "role": role || "Product Manager",
    "dailyTasks": [
      "Prioritize product backlog based on business value and user needs",
      "Collaborate with engineering teams on implementation details",
      "Analyze user data and feedback to inform product decisions",
      "Create and maintain product documentation and roadmaps",
      "Conduct competitor analysis to identify market opportunities"
    ],
    "meetings": [
      "Daily standup with development team",
      "Weekly product strategy with leadership",
      "Bi-weekly sprint planning and retrospectives",
      "Monthly user research interviews",
      "Quarterly product roadmap reviews"
    ],
    "stressFactors": {
      "level": 7,
      "description": "Product Management typically involves high-pressure decision making with competing priorities from multiple stakeholders.",
      "triggers": [
        "Tight deadlines for product releases",
        "Conflicting stakeholder requirements",
        "Technical constraints limiting desired features",
        "Market or competitor changes requiring quick pivots",
        "Critical user issues that need immediate resolution"
      ]
    },
    "kpis": [
      "User adoption and retention metrics",
      "Feature usage statistics",
      "Customer satisfaction scores",
      "Revenue growth attributable to product changes",
      "Development velocity and sprint completion rate"
    ],
    "schedule": {
      "morning": "Start the day by reviewing analytics dashboards and catching up on user feedback. Attend the daily standup meeting to align with the development team on priorities. Respond to urgent inquiries from stakeholders.",
      "afternoon": "Lead product specification meetings and work on roadmap planning. Collaborate with designers and engineers on feature implementations. Review prototypes and provide feedback.",
      "evening": "Wrap up by documenting decisions made during the day. Prepare for upcoming meetings and occasionally attend industry events or networking sessions to stay current with trends."
    },
    "skills": [
      "Strategic thinking",
      "Data analysis",
      "User experience design",
      "Stakeholder management",
      "Technical communication",
      "Market research",
      "Agile methodologies"
    ],
    "challenges": [
      "Balancing stakeholder expectations with technical feasibility",
      "Making data-driven decisions with incomplete information",
      "Managing scope to meet delivery timelines",
      "Communicating effectively across technical and non-technical teams",
      "Staying ahead of market trends while focusing on current priorities"
    ]
  };

  // Customize a bit based on industry if provided
  if (industry) {
    mockData.dailyTasks.push(`Research ${industry} industry trends and customer needs`);
    mockData.skills.push(`${industry} domain knowledge`);
  }

  return JSON.stringify(mockData, null, 2);
};

// Mock data for Layoff Readiness Toolkit in case the API fails
export const getLayoffToolkitMockData = (currentRole: string, skills: string): string => {
  const mockData = {
    "emergencyResume": {
      "professionalSummary": `Experienced ${currentRole} with a proven track record of delivering high-quality results and adapting to changing environments. Skilled in ${skills}. Known for strong problem-solving abilities, collaborative approach, and commitment to continuous improvement.`,
      "keyAchievements": [
        `Led critical projects as a ${currentRole}, consistently delivering on-time and under-budget results`,
        "Implemented process improvements that increased team productivity by 25%",
        "Recognized for excellence with multiple performance awards",
        "Successfully mentored junior team members while maintaining high personal output",
        "Adapted quickly to changing priorities while maintaining quality standards"
      ],
      "skillsHighlight": skills.split(',').map(skill => skill.trim())
    },
    "highDemandRoles": [
      {
        "title": "Project Manager",
        "relevanceScore": 85,
        "description": `Your experience as a ${currentRole} provides excellent transferable skills in organization, stakeholder management, and delivery.`
      },
      {
        "title": "Business Analyst",
        "relevanceScore": 80,
        "description": `Your technical knowledge combined with business acumen makes you well-suited for analyzing and improving business processes.`
      },
      {
        "title": "Consultant",
        "relevanceScore": 75,
        "description": `Your expertise in ${currentRole.toLowerCase()} could be valuable to organizations seeking specialist guidance.`
      },
      {
        "title": "Product Owner",
        "relevanceScore": 70,
        "description": "Your understanding of user needs and business requirements would translate well to product ownership."
      },
      {
        "title": "Operations Manager",
        "relevanceScore": 65,
        "description": "Your organizational and process management skills would be valuable in operations roles."
      }
    ],
    "linkedinImprovements": [
      "Update your headline to highlight your most marketable skills",
      "Add specific, measurable achievements to each role description",
      "Request recommendations from past managers and colleagues",
      "Join and actively participate in industry groups related to your target roles",
      "Share relevant industry content weekly to increase visibility",
      "Ensure your profile photo is professional and approachable"
    ],
    "githubImprovements": [
      "Pin your most impressive projects to your profile",
      "Ensure all pinned repositories have detailed README files",
      "Contribute to open-source projects related to your target field",
      "Add clear descriptions and tags to your repositories",
      "Complete your profile information, including a bio and contact details",
      "Maintain consistent activity to show ongoing engagement"
    ],
    "motivationalMessage": "Remember that career transitions, even when unexpected, often lead to new opportunities for growth. Your skills and experience are valuable assets that extend beyond any single job title. This moment is not a reflection of your worth but an opportunity to redirect your expertise. Be patient with yourself during this transition, celebrate small wins, and know that your resilience will carry you to your next success."
  };

  return JSON.stringify(mockData, null, 2);
};

/**
 * Generate professional profile content for QwiX Pro Builder
 * @param name User's name
 * @param role User's role
 * @param skills User's skills
 * @returns Generated professional profile
 */
export const generateProfessionalProfile = async (name: string, role: string, skills: string[]): Promise<string> => {
  const prompt = `
    Create a professional profile summary for ${name}, who works as a ${role}.
    Their key skills include: ${skills.join(', ')}.
    
    Write a concise, professional paragraph that:
    1. Highlights their expertise in their field
    2. Emphasizes their key skills
    3. Makes them stand out as a professional
    
    Keep the response under 200 words and make it compelling for professional networks.
  `;

  return generateQwiXProContent(prompt);
};

/**
 * Generate project description for QwiX Pro Builder
 * @param projectTitle Project title
 * @param technologies Technologies used
 * @param role User's role in the project
 * @returns Generated project description
 */
export const generateProjectDescription = async (
  projectTitle: string, 
  technologies: string[], 
  role: string
): Promise<string> => {
  const prompt = `
    Create a professional project description for a portfolio entry titled "${projectTitle}".
    Technologies used: ${technologies.join(', ')}.
    Role in the project: ${role}.
    
    Write a concise description that:
    1. Explains the project purpose and functionality
    2. Highlights technical challenges overcome
    3. Describes specific contributions and impact
    
    Keep the response under 150 words and focus on achievements and technical skills demonstrated.
  `;

  return generateQwiXProContent(prompt);
};

/**
 * Generate career advice for QwiX Pro Builder
 * @param currentRole User's current role
 * @param targetRole User's target role
 * @param yearsExperience User's years of experience
 * @returns Generated career advice
 */
export const generateCareerAdvice = async (
  currentRole: string,
  targetRole: string,
  yearsExperience: number
): Promise<string> => {
  const prompt = `
    Provide career development advice for a professional with ${yearsExperience} years of experience
    currently working as a ${currentRole} who wants to transition to becoming a ${targetRole}.
    
    Include:
    1. Specific skills they should develop
    2. Learning resources they might consider
    3. Professional networking suggestions
    4. Timeline expectations for the transition
    
    Keep the response practical, actionable, and under 250 words.
  `;

  return generateQwiXProContent(prompt);
};
