import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, 
  ArrowLeft, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Link as LinkIcon,
  Share2
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import html2pdf from 'html2pdf.js';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import JobSuggestions from "@/components/resume/JobSuggestions";
import AIResumeAnalysis from "@/components/resume/AIResumeAnalysis";

interface Skills {
  professional?: string;
  technical?: string;
  soft?: string;
}

interface ResumeData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    jobTitle?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  };
  education?: Array<{
    id: string;
    school: string;
    degree: string;
    graduationDate: string;
    score?: string;
  }>;
  experience?: Array<{
    id: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  skills?: Skills;
  objective?: string;
  projects?: Array<{
    id: string;
    title: string;
    technologies?: string;
    link?: string;
    description?: string;
  }>;
  countryCode?: string;
}

const ResumePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const resumeRef = useRef<HTMLDivElement>(null);
  const pdfGeneratedRef = useRef<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    try {
      if (location.state && location.state.resumeData) {
        console.log("Found resume data in location state", location.state.resumeData);
        setResumeData(location.state.resumeData);
        setLoading(false);
        return;
      }
      
      const searchParams = new URLSearchParams(location.search);
      const dataParam = searchParams.get('data');
      
      if (!dataParam) {
        setError("No resume data found. Please go back to the builder and try again.");
        setLoading(false);
        return;
      }
      
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        console.log("Parsed data from URL param", parsedData);
        setResumeData(parsedData);
        setLoading(false);
      } catch (parseErr) {
        console.error("Error parsing JSON data:", parseErr);
        setError("Invalid resume data format. Please go back and try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error loading resume data:", err);
      setError("Error loading resume data. Please go back and try again.");
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (resumeData && !pdfGeneratedRef.current) {
      const timer = setTimeout(() => {
        generateResumePdf();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [resumeData]);

  const generateResumePdf = async () => {
    if (!resumeData || !resumeRef.current || isGeneratingPdf) return;
    
    try {
      setIsGeneratingPdf(true);
      console.log("Starting PDF generation process");
      
      const fullName = `${resumeData.personalInfo?.firstName || 'resume'}_${resumeData.personalInfo?.lastName || ''}`;
      const fileName = `${fullName.replace(/\s+/g, '_')}.pdf`;
      setResumeFileName(fileName);
      
      // Clone the resume element to style it properly for PDF
      const clonedElement = resumeRef.current.cloneNode(true) as HTMLElement;
      
      // Ensure all fonts and styles are properly applied
      const fontStyle = document.createElement('style');
      fontStyle.textContent = `
        * {
          font-family: Arial, Helvetica, sans-serif !important;
          color: black !important;
        }
        .text-primary, a {
          color: #3B82F6 !important;
        }
        .text-muted-foreground, .text-gray-600 {
          color: #4B5563 !important;
        }
      `;
      clonedElement.appendChild(fontStyle);
      
      // Ensure proper styling for PDF export
      clonedElement.style.background = "white";
      clonedElement.style.padding = "20px";
      clonedElement.style.width = "210mm"; // A4 width
      clonedElement.style.minHeight = "297mm"; // A4 height
      
      const opt = {
        margin: 10,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      
      console.log("Generating PDF from resume element");
      const pdfBlob = await html2pdf().from(clonedElement).set(opt).outputPdf('blob');
      console.log("PDF blob generated:", pdfBlob);
      
      setPdfBlob(pdfBlob);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      
      console.log("Resume PDF generated successfully:", pdfUrl);
      pdfGeneratedRef.current = true;
      setIsGeneratingPdf(false);
      
      toast({
        title: "PDF Ready",
        description: "Your resume PDF has been generated successfully"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGeneratingPdf(false);
      toast({
        title: "PDF Generation Error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    try {
      if (pdfUrl && pdfBlob) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = resumeFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Complete",
          description: "Your resume has been downloaded successfully"
        });
        return;
      }
      
      toast({
        title: "Generating PDF",
        description: "Your resume is being prepared for download"
      });
      
      pdfGeneratedRef.current = false;
      await generateResumePdf();
      
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = resumeFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Complete",
          description: "Your resume has been downloaded successfully"
        });
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (err) {
      console.error("PDF download error:", err);
      toast({
        title: "Error",
        description: "Could not download PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShareToMedia = async () => {
    try {
      if (!pdfBlob) {
        toast({
          title: "Preparing Resume",
          description: "Getting your resume ready for sharing..."
        });
        await generateResumePdf();
        
        if (!pdfBlob) {
          throw new Error("Could not generate PDF for sharing");
        }
      }
      
      if (navigator.share) {
        const file = new File([pdfBlob!], resumeFileName, { 
          type: 'application/pdf' 
        });
        
        try {
          await navigator.share({
            title: `${resumeData?.personalInfo?.firstName || ''} ${resumeData?.personalInfo?.lastName || ''} Resume`,
            files: [file]
          });
          
          toast({
            title: "Shared Successfully",
            description: "Your resume has been shared"
          });
        } catch (shareError) {
          console.error("Share API error:", shareError);
          if (pdfUrl) {
            window.open(pdfUrl, '_blank');
            
            toast({
              title: "Resume Ready",
              description: "Your resume has opened in a new tab"
            });
          }
        }
      } else {
        if (pdfUrl) {
          window.open(pdfUrl, '_blank');
          
          toast({
            title: "Resume Ready",
            description: "Your resume has opened in a new tab"
          });
        }
      }
    } catch (error) {
      console.error("Share error:", error);
      toast({
        title: "Sharing Failed",
        description: "Could not share your resume. Please try downloading it instead.",
        variant: "destructive"
      });
    }
  };

  const handleShareToCompany = () => {
    if (!resumeData) {
      toast({
        title: "Error",
        description: "Resume data not available. Please try again.",
        variant: "destructive"
      });
      return;
    }

    navigate('/share-to-company', { 
      state: { 
        resumeData 
      } 
    });
  };

  const getAllSkills = () => {
    if (!resumeData?.skills) return [];
    
    const skillsObj = resumeData.skills;
    return Object.values(skillsObj)
      .filter(Boolean)
      .map((skillSet: any) => skillSet.toString())
      .join(", ")
      .split(/[,;]\s*/)
      .filter(Boolean);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-pulse w-full max-w-3xl h-[800px] bg-muted rounded-md"></div>
          <p className="mt-4 text-muted-foreground">Loading your resume...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/builder')}>Return to Resume Builder</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Preview</h1>
            <p className="text-muted-foreground">Review your generated resume</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/builder')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit Resume
            </Button>
            <Button 
              onClick={handleDownload}
              disabled={isGeneratingPdf}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPdf ? "Preparing..." : "Download PDF"}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ats">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-0" align="end">
                <div className="flex flex-col">
                  <Button 
                    variant="ghost" 
                    className="justify-start rounded-none py-3 px-4"
                    onClick={handleShareToMedia}
                    disabled={isGeneratingPdf}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share to Media
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start rounded-none py-3 px-4"
                    onClick={handleShareToCompany}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Share to Company
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-6">
            <JobSuggestions 
              skills={getAllSkills()} 
              jobTitle={resumeData?.personalInfo?.jobTitle || ""}
              location={resumeData?.personalInfo?.location}
            />
          </div>
          
          <div className="md:col-span-8 space-y-6">
            <Card 
              id="resume-content" 
              ref={resumeRef} 
              className="p-6 bg-white shadow-lg print:shadow-none"
              style={{
                color: "black", 
                fontFamily: "Arial, sans-serif",
              }}
            >
              <div className="border-b pb-3 mb-3">
                <h2 className="text-xl font-bold text-center text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                  {resumeData?.personalInfo?.firstName || ""} {resumeData?.personalInfo?.lastName || ""}
                </h2>
                <p className="text-primary font-medium text-center text-sm" style={{fontFamily: "Arial, sans-serif", color: "#3B82F6"}}>
                  {resumeData?.personalInfo?.jobTitle || ""}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 mt-1">
                  {resumeData?.personalInfo?.email && (
                    <span className="flex items-center" style={{fontFamily: "Arial, sans-serif", color: "#4B5563"}}>
                      <Mail className="h-3 w-3 mr-1" />
                      {resumeData.personalInfo.email}
                    </span>
                  )}
                  {resumeData?.personalInfo?.phone && (
                    <span className="flex items-center" style={{fontFamily: "Arial, sans-serif", color: "#4B5563"}}>
                      <Phone className="h-3 w-3 mr-1" />
                      {resumeData.personalInfo.phone}
                    </span>
                  )}
                  {resumeData?.personalInfo?.location && (
                    <span className="flex items-center" style={{fontFamily: "Arial, sans-serif", color: "#4B5563"}}>
                      <MapPin className="h-3 w-3 mr-1" />
                      {resumeData.personalInfo.location}
                    </span>
                  )}
                  {resumeData?.personalInfo?.githubUrl && resumeData.personalInfo.githubUrl.trim() !== "" && (
                    <a 
                      href={resumeData.personalInfo.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-primary hover:underline"
                      style={{fontFamily: "Arial, sans-serif", color: "#3B82F6"}}
                    >
                      <Github className="h-3 w-3 mr-1" />
                      {resumeData.personalInfo.githubUrl}
                    </a>
                  )}
                  {resumeData?.personalInfo?.linkedinUrl && resumeData.personalInfo.linkedinUrl.trim() !== "" && (
                    <a 
                      href={resumeData.personalInfo.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-primary hover:underline"
                      style={{fontFamily: "Arial, sans-serif", color: "#3B82F6"}}
                    >
                      <Linkedin className="h-3 w-3 mr-1" />
                      {resumeData.personalInfo.linkedinUrl}
                    </a>
                  )}
                </div>
              </div>
              
              {resumeData?.objective && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold border-b pb-1 mb-1 text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                    Career Objective
                  </h3>
                  <p className="text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                    {resumeData.objective}
                  </p>
                </div>
              )}
              
              {resumeData?.education && resumeData.education.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold border-b pb-1 mb-1 text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                    Education
                  </h3>
                  <div className="space-y-1">
                    {resumeData.education.map((edu: any) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                              {edu.school || "University/School"}
                            </p>
                            <p className="text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                              {edu.degree || "Degree"}
                            </p>
                          </div>
                          <p className="text-xs text-right text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                            {edu.graduationDate || "Graduation Year"}
                          </p>
                        </div>
                        {edu.score && (
                          <p className="text-xs text-gray-600" style={{fontFamily: "Arial, sans-serif", color: "#4B5563"}}>
                            {edu.score}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {resumeData?.projects && resumeData.projects.length > 0 && resumeData.projects[0].title && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold border-b pb-1 mb-1 text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                    Projects
                  </h3>
                  <div className="space-y-2">
                    {resumeData.projects
                      .filter((proj: any) => proj.title.trim() !== "")
                      .map((proj: any) => (
                      <div key={proj.id} className="mb-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                              {proj.title}
                            </p>
                            {proj.technologies && (
                              <p className="text-xs text-muted-foreground" style={{fontFamily: "Arial, sans-serif", color: "#6B7280"}}>
                                {proj.technologies}
                              </p>
                            )}
                          </div>
                        </div>
                        {proj.link && proj.link.trim() !== "" && (
                          <a 
                            href={proj.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary hover:underline flex items-center"
                            style={{fontFamily: "Arial, sans-serif", color: "#3B82F6"}}
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            {proj.link}
                          </a>
                        )}
                        {proj.description && (
                          <div 
                            className="text-xs text-black" 
                            style={{fontFamily: "Arial, sans-serif", color: "black"}}
                            dangerouslySetInnerHTML={{ 
                              __html: proj.description
                                        .split('\n')
                                        .filter((line: string) => line.trim() !== '')
                                        .slice(0, 3)
                                        .join('<br>')
                            }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {resumeData?.experience && resumeData.experience.length > 0 && resumeData.experience[0].jobTitle && (
                <div className="mb-3">
                  <h3 className="text-sm font-semibold border-b pb-1 mb-1 text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                    Work Experience
                  </h3>
                  <div className="space-y-2">
                    {resumeData.experience
                      .filter((exp: any) => exp.jobTitle.trim() !== "")
                      .map((exp: any) => (
                      <div key={exp.id} className="mb-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                              {exp.jobTitle}
                            </p>
                            <p className="text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                              {exp.companyName}
                            </p>
                          </div>
                          <p className="text-xs text-black text-right" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                        </div>
                        {exp.description && (
                          <div 
                            className="text-xs text-black" 
                            style={{fontFamily: "Arial, sans-serif", color: "black"}}
                            dangerouslySetInnerHTML={{ 
                              __html: exp.description
                                        .split('\n')
                                        .filter((line: string) => line.trim() !== '')
                                        .slice(0, 3)
                                        .join('<br>')
                            }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {resumeData?.skills && (
                Object.values(resumeData.skills).some(val => 
                  typeof val === 'string' && val.trim() !== ""
                )) && (
                <div className="mb-2">
                  <h3 className="text-sm font-semibold border-b pb-1 mb-1 text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                    Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {resumeData.skills.professional && (
                      <div>
                        <p className="font-medium text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                          Professional
                        </p>
                        <p className="text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                          {resumeData.skills.professional}
                        </p>
                      </div>
                    )}
                    {resumeData.skills.technical && (
                      <div>
                        <p className="font-medium text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                          Technical
                        </p>
                        <p className="text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                          {resumeData.skills.technical}
                        </p>
                      </div>
                    )}
                    {resumeData.skills.soft && (
                      <div>
                        <p className="font-medium text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                          Soft Skills
                        </p>
                        <p className="text-xs text-black" style={{fontFamily: "Arial, sans-serif", color: "black"}}>
                          {resumeData.skills.soft}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
            
            {/* Add our new AI Resume Analysis component here */}
            {resumeData && (
              <AIResumeAnalysis resumeData={resumeData} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export const ResumePreviewContent = ({ 
  data, 
  templateId,
  isPreview = false 
}: { 
  data: any; 
  templateId?: string;
  isPreview?: boolean;
}) => {
  return (
    <div className="h-full overflow-auto p-4 bg-muted border-l">
      {!isPreview && <h3 className="text-sm font-medium mb-3">Live Preview</h3>}
      {data && <MiniResumeContent data={data} isPreview={isPreview} />}
    </div>
  );
};

const MiniResumeContent = ({ data, isPreview = false }: { data: ResumeData, isPreview?: boolean }) => {
  if (!data || !data.personalInfo) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <p className="text-sm text-muted-foreground text-center py-8">
          Fill in your details to see a preview of your resume here
        </p>
      </Card>
    );
  }
  
  const { personalInfo, education, experience, skills, objective, projects, countryCode } = data;
  
  return (
    <Card className={`p-4 bg-white shadow-lg print:shadow-none ${isPreview ? 'max-h-full overflow-auto' : 'max-w-3xl w-full'}`}>
      <div className="border-b pb-2 mb-3 text-center">
        <h2 className="text-xl font-bold">
          {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
        </h2>
        <p className="text-primary font-medium text-sm">{personalInfo?.jobTitle || ""}</p>
        
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground mt-1">
          {personalInfo?.email && (
            <span className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {countryCode || "+91"} {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo?.githubUrl && personalInfo.githubUrl.trim() !== "" && (
            <span className="inline-flex items-center text-xs text-primary truncate">
              <Github className="h-3 w-3 mr-1" />
              <span className="truncate">{personalInfo.githubUrl}</span>
            </span>
          )}
          {personalInfo?.linkedinUrl && personalInfo.linkedinUrl.trim() !== "" && (
            <span className="inline-flex items-center text-xs text-primary truncate">
              <Linkedin className="h-3 w-3 mr-1" />
              <span className="truncate">{personalInfo.linkedinUrl}</span>
            </span>
          )}
        </div>
      </div>
      
      {objective && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Career Objective</h3>
          <p className="text-xs">{objective}</p>
        </div>
      )}
      
      {education && education.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Education</h3>
          <div className="space-y-2">
            {education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs">{edu.school || "University/School"}</p>
                    <p className="text-xs">{edu.degree || "Degree"}</p>
                  </div>
                  <p className="text-xs text-right">{edu.graduationDate || "Graduation Year"}</p>
                </div>
                {edu.score && <p className="text-xs text-muted-foreground mt-1">{edu.score}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects && projects.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Projects</h3>
          <div className="space-y-2">
            {projects.map((proj: any) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs">{proj.title || "Project Title"}</p>
                    {proj.technologies && <p className="text-xs text-muted-foreground">{proj.technologies}</p>}
                  </div>
                </div>
                {proj.link && proj.link.trim() !== "" && (
                  <span className="text-xs text-primary flex items-center mt-1 truncate">
                    <LinkIcon className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate">{proj.link}</span>
                  </span>
                )}
                {proj.description && (
                  <div className="text-xs mt-1">
                    {proj.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {experience && experience.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Work Experience</h3>
          <div className="space-y-2">
            {experience.map((exp: any) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-xs">{exp.jobTitle || "Job Title"}</p>
                    <p className="text-xs text-muted-foreground">{exp.companyName || "Company"}</p>
                  </div>
                  <p className="text-xs text-right">
                    {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                  </p>
                </div>
                {exp.description && (
                  <div className="text-xs mt-1">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {skills && (Object.values(skills).some(val => val && val.trim() !== "")) && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold border-b pb-1 mb-1">Skills</h3>
          <div className="grid grid-cols-1 gap-2">
            {skills.professional && (
              <div>
                <p className="font-medium text-xs">Professional</p>
                <p className="text-xs">{skills.professional}</p>
              </div>
            )}
            {skills.technical && (
              <div>
                <p className="font-medium text-xs">Technical</p>
                <p className="text-xs">{skills.technical}</p>
              </div>
            )}
            {skills.soft && (
              <div>
                <p className="font-medium text-xs">Soft Skills</p>
                <p className="text-xs">{skills.soft}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResumePreview;
