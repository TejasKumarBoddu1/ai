
import { CareerPath, CareerNode, SkillRequirement, SkillGap } from "@/types/career";
import { transformText } from "@/utils/huggingFaceTransformer";

// Helper function to generate skill requirements
const generateSkillRequirements = (skills: string[], level: number): SkillRequirement[] => {
  // Take a random subset of skills and assign levels
  return skills
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(skill => ({
      name: skill,
      level: Math.min(Math.floor(level + Math.random() * 2), 5) // Ensure level is between 1-5
    }));
};

// Helper function to generate skill gaps
const generateSkillGaps = (currentRole: string, targetRole: string): SkillGap[] => {
  const gaps: SkillGap[] = [];
  
  // List of possible skill gaps based on common career paths
  const possibleGaps = [
    {
      skill: "Leadership",
      suggestion: "Take on team lead responsibilities in smaller projects",
      resourceUrl: "https://www.coursera.org/learn/leadership-skills"
    },
    {
      skill: "Project Management",
      suggestion: "Get certified in Agile or traditional PM methodologies",
      resourceUrl: "https://www.pmi.org/certifications/project-management-pmp"
    },
    {
      skill: "Technical Architecture",
      suggestion: "Study system design patterns and contribute to architecture discussions",
      resourceUrl: "https://www.udemy.com/course/software-architecture-design/"
    },
    {
      skill: "Cloud Services",
      suggestion: "Get certified in AWS, Azure, or Google Cloud",
      resourceUrl: "https://aws.amazon.com/certification/"
    },
    {
      skill: "Machine Learning",
      suggestion: "Take an ML course and build a portfolio project",
      resourceUrl: "https://www.coursera.org/learn/machine-learning"
    },
    {
      skill: "Data Structures & Algorithms",
      suggestion: "Practice problem-solving on platforms like LeetCode",
      resourceUrl: "https://leetcode.com/"
    },
    {
      skill: "Frontend Frameworks",
      suggestion: "Build a personal project using React, Vue, or Angular",
      resourceUrl: "https://react.dev/learn"
    },
    {
      skill: "Backend Development",
      suggestion: "Create a REST API using Node.js, Django, or Spring",
      resourceUrl: "https://nodejs.org/en/learn"
    },
    {
      skill: "DevOps",
      suggestion: "Learn CI/CD pipelines and containerization",
      resourceUrl: "https://www.docker.com/get-started/"
    },
    {
      skill: "Soft Skills",
      suggestion: "Improve communication and presentation abilities",
      resourceUrl: "https://www.linkedin.com/learning/topics/communication"
    }
  ];
  
  // Select a few random gaps
  const selectedGaps = possibleGaps
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  return selectedGaps;
};

// Generate skills based on job role
const generateSkillsForRole = async (jobRole: string): Promise<string[]> => {
  // Use the job role to generate appropriate skills
  // This would ideally use the AI transformer to get relevant skills
  let baseSkills: string[] = [];
  
  // Basic skill sets by role type
  if (jobRole.toLowerCase().includes('develop') || jobRole.toLowerCase().includes('engineer') || jobRole.toLowerCase().includes('program')) {
    baseSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Git", "REST APIs", "SQL", "Testing", "CI/CD"];
  } else if (jobRole.toLowerCase().includes('data') || jobRole.toLowerCase().includes('scientist') || jobRole.toLowerCase().includes('analyst')) {
    baseSkills = ["Python", "SQL", "Statistics", "Machine Learning", "Data Visualization", "Pandas", "TensorFlow", "R", "Jupyter"];
  } else if (jobRole.toLowerCase().includes('design') || jobRole.toLowerCase().includes('ux') || jobRole.toLowerCase().includes('ui')) {
    baseSkills = ["Figma", "Adobe XD", "UI Design", "Wireframing", "User Research", "Prototyping", "Visual Design", "Design Systems", "Accessibility"];
  } else if (jobRole.toLowerCase().includes('product') || jobRole.toLowerCase().includes('manager')) {
    baseSkills = ["Product Strategy", "Roadmapping", "User Stories", "Agile", "Stakeholder Management", "Market Research", "Analytics", "A/B Testing", "Prioritization"];
  } else if (jobRole.toLowerCase().includes('market') || jobRole.toLowerCase().includes('growth')) {
    baseSkills = ["SEO", "Content Marketing", "Social Media", "Email Marketing", "Analytics", "Copywriting", "CRM", "Lead Generation", "Campaign Management"];
  } else {
    // Default skills for unknown roles
    baseSkills = ["Communication", "Project Management", "Problem Solving", "Teamwork", "Time Management", "Critical Thinking", "Technical Skills", "Adaptability"];
  }
  
  try {
    // Try to enhance the skills using AI transformer
    const enhancedSkillsText = await transformText(`Generate 8 specific professional skills for a ${jobRole} role, separated by commas.`);
    if (enhancedSkillsText && enhancedSkillsText.length > 10) {
      const enhancedSkills = enhancedSkillsText.split(',').map(skill => skill.trim());
      if (enhancedSkills.length >= 5) {
        return enhancedSkills;
      }
    }
  } catch (error) {
    console.error("Error enhancing skills with AI:", error);
  }
  
  return baseSkills;
};

// Main function to generate career paths
export const generateCareerPaths = async (resumeData: any): Promise<CareerPath[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get basic information from resume or job role
  const { currentRole } = resumeData;
  
  // Generate skills based on the current role
  const skills = await generateSkillsForRole(currentRole);
  const allSkills = [...skills, "Communication", "Problem Solving", "Teamwork", "Critical Thinking", "Adaptability"];
  
  // Generate career paths based on the job role
  // Use the AI transformer to enhance descriptions
  let ambitiousDescription = "This accelerated path focuses on management and leadership positions, trading technical depth for breadth and people management skills.";
  let skillsDescription = "This path emphasizes technical excellence and specialization, becoming an authority in your domain.";
  let balancedDescription = "This path focuses on steady progression with emphasis on work-life balance and sustainable career growth.";
  
  try {
    const enhancedAmbitiousDesc = await transformText(`Write a concise 1-2 sentence description of a leadership-focused career path for a ${currentRole}. Focus on management and growth.`);
    if (enhancedAmbitiousDesc && enhancedAmbitiousDesc.length > 20) {
      ambitiousDescription = enhancedAmbitiousDesc;
    }
    
    const enhancedSkillsDesc = await transformText(`Write a concise 1-2 sentence description of a technical specialization career path for a ${currentRole}. Focus on technical depth.`);
    if (enhancedSkillsDesc && enhancedSkillsDesc.length > 20) {
      skillsDescription = enhancedSkillsDesc;
    }
    
    const enhancedBalancedDesc = await transformText(`Write a concise 1-2 sentence description of a balanced career path for a ${currentRole}. Focus on work-life balance and steady progression.`);
    if (enhancedBalancedDesc && enhancedBalancedDesc.length > 20) {
      balancedDescription = enhancedBalancedDesc;
    }
  } catch (error) {
    console.error("Error enhancing descriptions with AI:", error);
  }
  
  // 1. Ambitious Path (Leadership)
  const ambitiousPath: CareerPath = {
    name: "Leadership Track",
    type: "ambitious",
    title: "Leadership Track",
    description: ambitiousDescription,
    nodes: [
      {
        title: currentRole,
        description: "Your current role where you're developing core technical and soft skills.",
        yearsFromNow: 0,
        stage: "Entry",
        salaryRange: `$${Math.floor(70000 + Math.random() * 20000).toLocaleString()} - $${Math.floor(90000 + Math.random() * 20000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements(allSkills, 3),
      },
      {
        title: `Senior ${currentRole.split(' ').pop()}`,
        description: "At this level, you'll take on more complex projects and begin mentoring junior team members.",
        yearsFromNow: 2,
        stage: "Mid",
        salaryRange: `$${Math.floor(90000 + Math.random() * 30000).toLocaleString()} - $${Math.floor(120000 + Math.random() * 30000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements(allSkills, 4),
        skillGaps: generateSkillGaps(currentRole, `Senior ${currentRole}`)
      },
      {
        title: `Team Lead`,
        description: "You'll lead a small team, balance technical work with people management, and help set technical direction.",
        yearsFromNow: 4,
        stage: "Senior",
        salaryRange: `$${Math.floor(120000 + Math.random() * 40000).toLocaleString()} - $${Math.floor(160000 + Math.random() * 40000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements([...allSkills, "Leadership", "Project Management", "Strategic Planning"], 4),
        skillGaps: generateSkillGaps(`Senior ${currentRole}`, "Team Lead")
      },
      {
        title: "Director",
        description: "At the director level, you'll manage multiple teams and be responsible for larger organizational objectives.",
        yearsFromNow: 7,
        stage: "Lead",
        salaryRange: `$${Math.floor(160000 + Math.random() * 50000).toLocaleString()} - $${Math.floor(210000 + Math.random() * 50000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements(["Leadership", "Strategic Planning", "Budget Management", "Executive Communication"], 5),
        skillGaps: generateSkillGaps("Team Lead", "Director")
      },
      {
        title: "VP/CTO",
        description: "Executive-level position where you'll shape company-wide technical strategy and direction.",
        yearsFromNow: 10,
        stage: "Executive",
        salaryRange: `$${Math.floor(200000 + Math.random() * 100000).toLocaleString()} - $${Math.floor(300000 + Math.random() * 100000).toLocaleString()}+`,
        requiredSkills: generateSkillRequirements(["Executive Leadership", "Technical Vision", "Strategic Planning", "Business Acumen"], 5),
        skillGaps: generateSkillGaps("Director", "VP/CTO")
      }
    ]
  };
  
  // 2. Skills Growth Path (Technical Depth)
  const skillsPath: CareerPath = {
    name: "Technical Specialization",
    type: "skills",
    title: "Technical Specialization",
    description: skillsDescription,
    nodes: [
      {
        title: currentRole,
        description: "Your current role where you're developing core technical skills.",
        yearsFromNow: 0,
        stage: "Entry",
        salaryRange: `$${Math.floor(70000 + Math.random() * 20000).toLocaleString()} - $${Math.floor(90000 + Math.random() * 20000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements(allSkills, 3),
      },
      {
        title: `Senior ${currentRole.split(' ').pop()}`,
        description: "You'll tackle complex technical challenges and begin to develop deeper expertise in specific areas.",
        yearsFromNow: 2,
        stage: "Mid",
        salaryRange: `$${Math.floor(90000 + Math.random() * 30000).toLocaleString()} - $${Math.floor(120000 + Math.random() * 30000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements([...allSkills, "System Design", "Performance Optimization"], 4),
        skillGaps: generateSkillGaps(currentRole, `Senior ${currentRole}`)
      },
      {
        title: "Technical Specialist",
        description: "At this stage, you'll be recognized for your deep expertise in specific technologies or domains.",
        yearsFromNow: 4,
        stage: "Senior",
        salaryRange: `$${Math.floor(110000 + Math.random() * 40000).toLocaleString()} - $${Math.floor(150000 + Math.random() * 40000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements([...allSkills, "Advanced Algorithms", "Domain Expertise", "Technical Writing"], 5),
        skillGaps: generateSkillGaps(`Senior ${currentRole}`, "Technical Specialist")
      },
      {
        title: "Principal Engineer",
        description: "As a principal engineer, you'll guide major technical decisions and mentor other engineers.",
        yearsFromNow: 6,
        stage: "Lead",
        salaryRange: `$${Math.floor(140000 + Math.random() * 60000).toLocaleString()} - $${Math.floor(200000 + Math.random() * 60000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements(["System Architecture", "Technical Leadership", "Cross-functional Collaboration", "Mentoring"], 5),
        skillGaps: generateSkillGaps("Technical Specialist", "Principal Engineer")
      },
      {
        title: "Distinguished Engineer",
        description: "Top technical position where you'll influence company-wide architecture and technology choices.",
        yearsFromNow: 9,
        stage: "Executive",
        salaryRange: `$${Math.floor(180000 + Math.random() * 80000).toLocaleString()} - $${Math.floor(260000 + Math.random() * 80000).toLocaleString()}+`,
        requiredSkills: generateSkillRequirements(["Enterprise Architecture", "Technology Strategy", "Research & Development", "Industry Leadership"], 5),
        skillGaps: generateSkillGaps("Principal Engineer", "Distinguished Engineer")
      }
    ]
  };
  
  // 3. Balanced Path (Work-Life Balance)
  const balancedPath: CareerPath = {
    name: "Balanced Growth",
    type: "balanced",
    title: "Balanced Growth",
    description: balancedDescription,
    nodes: [
      {
        title: currentRole,
        description: "Your current role where you're building foundational skills and experience.",
        yearsFromNow: 0,
        stage: "Entry",
        salaryRange: `$${Math.floor(70000 + Math.random() * 20000).toLocaleString()} - $${Math.floor(90000 + Math.random() * 20000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements(allSkills, 3),
      },
      {
        title: `${currentRole.split(' ').pop()} II`,
        description: "A step up in responsibility and skill, but maintaining a strong focus on execution rather than management.",
        yearsFromNow: 3,
        stage: "Mid",
        salaryRange: `$${Math.floor(85000 + Math.random() * 25000).toLocaleString()} - $${Math.floor(110000 + Math.random() * 25000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements([...allSkills, "Project Management", "Technical Documentation"], 3),
        skillGaps: generateSkillGaps(currentRole, `${currentRole} II`)
      },
      {
        title: `Senior ${currentRole.split(' ').pop()}`,
        description: "At this level, you'll work on more complex projects while maintaining a healthy work-life balance.",
        yearsFromNow: 6,
        stage: "Senior",
        salaryRange: `$${Math.floor(100000 + Math.random() * 30000).toLocaleString()} - $${Math.floor(130000 + Math.random() * 30000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements([...allSkills, "System Design", "Mentoring", "Cross-functional Collaboration"], 4),
        skillGaps: generateSkillGaps(`${currentRole} II`, `Senior ${currentRole}`)
      },
      {
        title: "Staff Engineer",
        description: "A respected technical position that allows for influence without the stress of people management.",
        yearsFromNow: 9,
        stage: "Lead",
        salaryRange: `$${Math.floor(130000 + Math.random() * 40000).toLocaleString()} - $${Math.floor(170000 + Math.random() * 40000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements(["Technical Leadership", "Architecture", "Mentoring", "Project Planning"], 5),
        skillGaps: generateSkillGaps(`Senior ${currentRole}`, "Staff Engineer")
      },
      {
        title: "Consultant/Advisor",
        description: "At this stage, you can leverage your expertise in a more flexible role with better work-life balance.",
        yearsFromNow: 12,
        stage: "Executive",
        salaryRange: `$${Math.floor(150000 + Math.random() * 50000).toLocaleString()} - $${Math.floor(200000 + Math.random() * 50000).toLocaleString()}`,
        requiredSkills: generateSkillRequirements(["Strategic Consulting", "Industry Expertise", "Communication", "Relationship Building"], 5),
        skillGaps: generateSkillGaps("Staff Engineer", "Consultant/Advisor")
      }
    ]
  };
  
  return [ambitiousPath, skillsPath, balancedPath];
};
