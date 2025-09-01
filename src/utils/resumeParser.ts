
// This is a mock implementation of a resume parser with enhanced AI capabilities
// In a real application, this would use actual PDF parsing libraries and AI models

import { toast } from "@/components/ui/use-toast";

export const resumeParser = async (file: File) => {
  return new Promise((resolve, reject) => {
    try {
      // Check if the file is valid
      if (!file || !(file instanceof File)) {
        reject(new Error("Invalid file provided"));
        return;
      }
      
      // Check if it's a PDF
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
        reject(new Error("Invalid file format. Please upload a PDF file."));
        return;
      }
      
      // For demo purposes, show a toast to indicate AI processing
      toast({
        title: "AI Resume Analysis",
        description: "Analyzing your resume with our AI model...",
      });
      
      // Simulate AI parsing delay
      setTimeout(() => {
        const fileReader = new FileReader();
        
        fileReader.onload = () => {
          // In a real implementation, we would use an AI model to extract information
          // from the PDF. For this demo, we'll use mock data based on the file name.
          
          // Extract filename and use it to create a simulated varied response
          const fileName = file.name.toLowerCase();
          let jobRole = "Software Developer";
          let years = 3;
          
          // Simple logic to generate different mock data based on filename
          if (fileName.includes("senior") || fileName.includes("sr")) {
            jobRole = "Senior Software Developer";
            years = 5;
          } else if (fileName.includes("lead") || fileName.includes("manager")) {
            jobRole = "Technical Lead";
            years = 7;
          } else if (fileName.includes("junior") || fileName.includes("jr")) {
            jobRole = "Junior Developer";
            years = 1;
          }
          
          // Generate more relevant skills based on job role
          let skills = ["JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS", "Git"];
          
          if (jobRole.toLowerCase().includes("senior") || jobRole.toLowerCase().includes("lead")) {
            skills = [...skills, "System Architecture", "Team Leadership", "Project Management"];
          }
          
          if (fileName.includes("data") || fileName.includes("ml") || fileName.includes("ai")) {
            skills = ["Python", "TensorFlow", "PyTorch", "SQL", "Data Analysis", "Machine Learning", "Statistics"];
            jobRole = fileName.includes("senior") ? "Senior Data Scientist" : "Data Scientist";
          }
          
          // Create mock resume data
          const mockResumeData = {
            currentRole: jobRole,
            yearsOfExperience: years,
            skills: skills,
            softSkills: ["Communication", "Problem Solving", "Teamwork", "Critical Thinking", "Adaptability"],
            education: fileName.includes("phd") 
              ? ["PhD in Computer Science", "Master of Science in Computer Science", "Bachelor of Science in Computer Science"]
              : fileName.includes("master") 
                ? ["Master of Science in Computer Science", "Bachelor of Science in Computer Science"] 
                : ["Bachelor of Science in Computer Science"],
            certifications: jobRole.includes("Data") 
              ? ["TensorFlow Developer Certificate", "AWS Certified Data Analytics"] 
              : ["AWS Certified Developer", "Microsoft Certified: Azure Developer Associate"]
          };
          
          // In a real implementation, we would use the PDF content to extract this information
          console.log("Resume successfully parsed:", mockResumeData);
          resolve(mockResumeData);
        };
        
        fileReader.onerror = () => {
          reject(new Error("Error reading the file."));
        };
        
        // Start reading the file as text
        fileReader.readAsText(file);
      }, 2000); // Simulate AI processing time
      
    } catch (error) {
      console.error("Error parsing resume:", error);
      reject(error);
    }
  });
};
