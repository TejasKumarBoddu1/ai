import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Download, Eye, Save, FileText, User, Briefcase, GraduationCap, Award, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';
import AIResumeAnalysis from '@/components/resume/AIResumeAnalysis';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { cn } from "@/lib/utils";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface Skill {
  id: string;
  name: string;
}

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
  });
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    // Load data from local storage on component mount
    const storedPersonalInfo = localStorage.getItem("personalInfo");
    if (storedPersonalInfo) {
      setPersonalInfo(JSON.parse(storedPersonalInfo));
    }

    const storedExperience = localStorage.getItem("experience");
    if (storedExperience) {
      setExperience(JSON.parse(storedExperience));
    }

    const storedEducation = localStorage.getItem("education");
    if (storedEducation) {
      setEducation(JSON.parse(storedEducation));
    }

    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }

    const storedSkills = localStorage.getItem("skills");
    if (storedSkills) {
      setSkills(JSON.parse(storedSkills));
    }
  }, []);

  useEffect(() => {
    // Save data to local storage whenever it changes
    localStorage.setItem("personalInfo", JSON.stringify(personalInfo));
    localStorage.setItem("experience", JSON.stringify(experience));
    localStorage.setItem("education", JSON.stringify(education));
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [personalInfo, experience, education, projects, skills]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setExperience((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeExperience = (id: string) => {
    setExperience((prev) => prev.filter((item) => item.id !== id));
  };

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setEducation((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeEducation = (id: string) => {
    setEducation((prev) => prev.filter((item) => item.id !== id));
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        link: "",
      },
    ]);
  };

  const updateProject = (id: string, field: string, value: string) => {
    setProjects((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const addSkill = () => {
    setSkills((prev) => [...prev, { id: Date.now().toString(), name: "" }]);
  };

  const updateSkill = (id: string, value: string) => {
    setSkills((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: value } : item))
    );
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((item) => item.id !== id));
  };

  const downloadPDF = () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      toast({
        title: "Error",
        description: "Could not find resume preview element.",
        variant: "destructive",
      });
      return;
    }

    html2pdf()
      .from(element)
      .save('resume.pdf')
      .catch(error => {
        console.error("Error generating PDF:", error);
        toast({
          title: "Error",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive",
        });
      });
  };

  // Create resume data object for AI analysis
  const resumeData = {
    personalInfo: {
      ...personalInfo,
      jobTitle: personalInfo.name ? "Professional" : "" // Default job title if not specified
    },
    experience: experience.map(exp => ({
      jobTitle: exp.title,
      companyName: exp.company,
      description: exp.description
    })),
    education: education.map(edu => ({
      degree: edu.degree,
      school: edu.institution
    })),
    projects: projects.map(proj => ({
      title: proj.name,
      description: proj.description,
      technologies: [] // Add technologies if available
    })),
    skills: skills.map(skill => skill.name)
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className="border-gray-300 dark:border-gray-600"
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Side - Form */}
          <div className={cn("bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto", showPreview ? "w-1/2" : "w-full")}>
            <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-6 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="personal" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <User className="h-4 w-4 mr-1" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="education" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <FileText className="h-4 w-4 mr-1" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Star className="h-4 w-4 mr-1" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Award className="h-4 w-4 mr-1" />
                    AI Help
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                        <User className="h-5 w-5 text-blue-600" />
                        Personal Information
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Add your basic contact information and professional summary
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={personalInfo.name}
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            value={personalInfo.email}
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={personalInfo.phone}
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn Profile</Label>
                          <Input
                            id="linkedin"
                            name="linkedin"
                            value={personalInfo.linkedin}
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub Profile</Label>
                          <Input
                            id="github"
                            name="github"
                            value={personalInfo.github}
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="summary">Professional Summary</Label>
                          <Textarea
                            id="summary"
                            name="summary"
                            rows={3}
                            value={personalInfo.summary}
                            onChange={handlePersonalInfoChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                            Work Experience
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">
                            Add your professional work experience
                          </CardDescription>
                        </div>
                        <Button onClick={addExperience} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {experience.map((exp) => (
                        <div key={exp.id} className="space-y-4 border rounded-md p-4 dark:border-gray-700">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`title-${exp.id}`}>Job Title</Label>
                              <Input
                                id={`title-${exp.id}`}
                                value={exp.title}
                                onChange={(e) =>
                                  updateExperience(exp.id, "title", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`company-${exp.id}`}>Company</Label>
                              <Input
                                id={`company-${exp.id}`}
                                value={exp.company}
                                onChange={(e) =>
                                  updateExperience(exp.id, "company", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`location-${exp.id}`}>Location</Label>
                              <Input
                                id={`location-${exp.id}`}
                                value={exp.location}
                                onChange={(e) =>
                                  updateExperience(exp.id, "location", e.target.value)
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                                <Input
                                  type="date"
                                  id={`startDate-${exp.id}`}
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    updateExperience(exp.id, "startDate", e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                                <Input
                                  type="date"
                                  id={`endDate-${exp.id}`}
                                  value={exp.endDate}
                                  onChange={(e) =>
                                    updateExperience(exp.id, "endDate", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`description-${exp.id}`}>Description</Label>
                              <Textarea
                                id={`description-${exp.id}`}
                                rows={3}
                                value={exp.description}
                                onChange={(e) =>
                                  updateExperience(exp.id, "description", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education" className="space-y-6">
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            Education
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">
                            Add your educational background
                          </CardDescription>
                        </div>
                        <Button onClick={addEducation} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Education
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {education.map((edu) => (
                        <div key={edu.id} className="space-y-4 border rounded-md p-4 dark:border-gray-700">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                              <Input
                                id={`institution-${edu.id}`}
                                value={edu.institution}
                                onChange={(e) =>
                                  updateEducation(edu.id, "institution", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                              <Input
                                id={`degree-${edu.id}`}
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(edu.id, "degree", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`location-${edu.id}`}>Location</Label>
                              <Input
                                id={`location-${edu.id}`}
                                value={edu.location}
                                onChange={(e) =>
                                  updateEducation(edu.id, "location", e.target.value)
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                                <Input
                                  type="date"
                                  id={`startDate-${edu.id}`}
                                  value={edu.startDate}
                                  onChange={(e) =>
                                    updateEducation(edu.id, "startDate", e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                                <Input
                                  type="date"
                                  id={`endDate-${edu.id}`}
                                  value={edu.endDate}
                                  onChange={(e) =>
                                    updateEducation(edu.id, "endDate", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`description-${edu.id}`}>Description</Label>
                              <Textarea
                                id={`description-${edu.id}`}
                                rows={3}
                                value={edu.description}
                                onChange={(e) =>
                                  updateEducation(edu.id, "description", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Projects
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">
                            Showcase your notable projects and achievements
                          </CardDescription>
                        </div>
                        <Button onClick={addProject} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Project
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {projects.map((project) => (
                        <div key={project.id} className="space-y-4 border rounded-md p-4 dark:border-gray-700">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${project.id}`}>Project Name</Label>
                              <Input
                                id={`name-${project.id}`}
                                value={project.name}
                                onChange={(e) =>
                                  updateProject(project.id, "name", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`description-${project.id}`}>Description</Label>
                              <Textarea
                                id={`description-${project.id}`}
                                rows={3}
                                value={project.description}
                                onChange={(e) =>
                                  updateProject(project.id, "description", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`link-${project.id}`}>Project Link</Label>
                              <Input
                                id={`link-${project.id}`}
                                value={project.link}
                                onChange={(e) =>
                                  updateProject(project.id, "link", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeProject(project.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                  <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                        <Star className="h-5 w-5 text-blue-600" />
                        Skills & Technologies
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Add your technical and soft skills
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-4 border rounded-md p-4 dark:border-gray-700">
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, e.target.value)}
                            placeholder="Skill name"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSkill(skill.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={addSkill} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ai" className="space-y-6">
                  <AIResumeAnalysis resumeData={resumeData} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Side - Preview */}
          {showPreview && (
            <div className="w-1/2 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-y-auto">
              <div className="p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-8" id="resume-preview">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{personalInfo.name}</h1>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contact</h2>
                    <p className="text-gray-700 dark:text-gray-300">Email: {personalInfo.email}</p>
                    <p className="text-gray-700 dark:text-gray-300">Phone: {personalInfo.phone}</p>
                    {personalInfo.linkedin && (
                      <p className="text-gray-700 dark:text-gray-300">LinkedIn: {personalInfo.linkedin}</p>
                    )}
                    {personalInfo.github && (
                      <p className="text-gray-700 dark:text-gray-300">GitHub: {personalInfo.github}</p>
                    )}
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">Summary</h2>
                    <p className="text-gray-700 dark:text-gray-300">{personalInfo.summary}</p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">Experience</h2>
                    {experience.map((exp) => (
                      <div key={exp.id} className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300">{exp.company}, {exp.location}</p>
                        <p className="text-gray-700 dark:text-gray-300">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                      </div>
                    ))}

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">Education</h2>
                    {education.map((edu) => (
                      <div key={edu.id} className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                        <p className="text-gray-700 dark:text-gray-300">{edu.institution}, {edu.location}</p>
                        <p className="text-gray-700 dark:text-gray-300">{edu.startDate} - {edu.endDate}</p>
                        <p className="text-gray-700 dark:text-gray-300">{edu.description}</p>
                      </div>
                    ))}

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">Projects</h2>
                    {projects.map((project) => (
                      <div key={project.id} className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
                        {project.link && (
                          <a href={project.link} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                            {project.link}
                          </a>
                        )}
                      </div>
                    ))}

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill.id} className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border-none">{skill.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default ResumeBuilder;
