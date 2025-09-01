import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Building, Briefcase, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { FormValidator } from "@/components/ui/form-validator";
import { Progress } from "@/components/ui/progress";
import html2pdf from "html2pdf.js";
import { sendEmailWithMailchimp } from "@/utils/mailchimpService";
import { getAIEmailDraft } from "@/utils/geminiApi";

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
  skills?: {
    professional?: string;
    technical?: string;
    soft?: string;
  };
  objective?: string;
  projects?: Array<{
    id: string;
    title: string;
    technologies?: string;
    link?: string;
    description?: string;
  }>;
}

const ShareToCompany = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [resumePdfUrl, setResumePdfUrl] = useState<string | null>(null);
  const [resumePdfBlob, setResumePdfBlob] = useState<Blob | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const resumeRef = useRef<HTMLDivElement>(null);
  const pdfGeneratedRef = useRef<boolean>(false);

  useEffect(() => {
    if (location.state && location.state.resumeData) {
      setResumeData(location.state.resumeData);
      if (location.state.resumeData.personalInfo?.email) {
        setFromEmail(location.state.resumeData.personalInfo.email);
      }
      if (location.state.resumeData.personalInfo?.jobTitle) {
        setJobTitle(location.state.resumeData.personalInfo.jobTitle);
      }
    } else {
      toast({
        title: "Error",
        description: "No resume data found. Please go back to the resume preview.",
        variant: "destructive"
      });
    }
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateResumePdf();
    }, 1500); // Delay to ensure DOM rendering is complete

    return () => clearTimeout(timer);
  }, [resumeData]);

  const markAsTouched = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const generateResumePdf = async () => {
    if (!resumeData || !resumeRef.current || pdfGeneratedRef.current) return;
    
    try {
      console.log("Starting PDF generation process");
      const fullName = `${resumeData.personalInfo?.firstName || 'resume'}_${resumeData.personalInfo?.lastName || ''}`;
      const fileName = `${fullName.replace(/\s+/g, '_')}.pdf`;
      setResumeFileName(fileName);
      
      const opt = {
        margin: 1,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      console.log("Generating PDF from resume element");
      
      const pdfBlob = await html2pdf().from(resumeRef.current).set(opt).outputPdf('blob');
      console.log("PDF blob generated:", pdfBlob);
      
      setResumePdfBlob(pdfBlob);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setResumePdfUrl(pdfUrl);
      
      console.log("Resume PDF generated successfully:", pdfUrl);
      pdfGeneratedRef.current = true;
      
      toast({
        title: "Resume PDF Ready",
        description: "Your resume has been converted to PDF and is ready to attach to your email."
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "PDF Generation Failed",
        description: "Could not generate the PDF resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateEmailDraft = async () => {
    if (!resumeData || !companyName || !jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide company name and job title to generate an email draft.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const { subject, body } = await getAIEmailDraft(
        resumeData, 
        companyName, 
        jobTitle
      );
      
      setEmailSubject(subject);
      setEmailBody(body);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);
      
    } catch (error) {
      console.error("Error generating email draft:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate email draft. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleSendEmail = async () => {
    if (!companyName || !jobTitle || !fromEmail || !toEmail || !emailBody) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before sending.",
        variant: "destructive"
      });
      
      setTouchedFields({
        companyName: true,
        jobTitle: true,
        fromEmail: true,
        toEmail: true,
        emailBody: true
      });
      
      return;
    }
    
    if (!isValidEmail(fromEmail) || !isValidEmail(toEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please provide valid email addresses.",
        variant: "destructive"
      });
      return;
    }
    
    if (!resumePdfBlob) {
      toast({
        title: "Resume PDF Not Ready",
        description: "Please wait for the resume PDF to be generated.",
        variant: "destructive"
      });
      
      await generateResumePdf();
      
      if (!resumePdfBlob) {
        return;
      }
    }
    
    try {
      setIsSending(true);
      
      if (resumePdfUrl) {
        const downloadLink = document.createElement('a');
        downloadLink.href = resumePdfUrl;
        downloadLink.download = resumeFileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const subject = encodeURIComponent(emailSubject);
      const body = encodeURIComponent(emailBody + "\n\n[Please attach the resume PDF that was just downloaded]");
      const mailtoUrl = `mailto:${toEmail}?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoUrl;
      
      toast({
        title: "Email Ready",
        description: "Your default email client has been opened with your message. Please attach the resume PDF that was just downloaded.",
      });
      
      setSendSuccess(true);
      setIsSending(false);
    } catch (error) {
      console.error("Error opening email client:", error);
      toast({
        title: "Email Opening Failed",
        description: "Could not open your email client. Please try again or use a different method to send your email.",
        variant: "destructive"
      });
      setIsSending(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Share Your Resume</h1>
            <p className="text-muted-foreground">Send your resume to a company</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Preview
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Application Details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <div className="flex items-center mt-1">
                        <Building className="w-4 h-4 text-muted-foreground mr-2" />
                        <Input
                          id="companyName"
                          placeholder="Enter company name"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          onBlur={() => markAsTouched('companyName')}
                        />
                      </div>
                      <FormValidator
                        value={companyName}
                        required
                        showMessage={touchedFields.companyName}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <div className="flex items-center mt-1">
                        <Briefcase className="w-4 h-4 text-muted-foreground mr-2" />
                        <Input
                          id="jobTitle"
                          placeholder="Enter job title"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          onBlur={() => markAsTouched('jobTitle')}
                        />
                      </div>
                      <FormValidator
                        value={jobTitle}
                        required
                        showMessage={touchedFields.jobTitle}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="mt-4 w-full" 
                    onClick={generateEmailDraft}
                    disabled={isGenerating || !companyName || !jobTitle}
                  >
                    {isGenerating ? "Generating..." : "Generate Email Draft"}
                  </Button>
                  
                  {isGenerating && (
                    <div className="mt-4">
                      <Progress
                        value={generationProgress}
                        className="h-2"
                        style={{
                          "--progress-background": "var(--blue-600)"
                        } as React.CSSProperties}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Generating email draft...</p>
                    </div>
                  )}
                </div>
                
                {emailBody && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Email Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fromEmail">Your Email</Label>
                        <div className="flex items-center mt-1">
                          <Mail className="w-4 h-4 text-muted-foreground mr-2" />
                          <Input
                            id="fromEmail"
                            type="email"
                            placeholder="Your email address"
                            value={fromEmail}
                            onChange={(e) => setFromEmail(e.target.value)}
                            onBlur={() => markAsTouched('fromEmail')}
                          />
                        </div>
                        <FormValidator
                          value={fromEmail}
                          required
                          showMessage={touchedFields.fromEmail}
                          pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                          patternMessage="Please enter a valid email address"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="toEmail">Company Email</Label>
                        <div className="flex items-center mt-1">
                          <Mail className="w-4 h-4 text-muted-foreground mr-2" />
                          <Input
                            id="toEmail"
                            type="email"
                            placeholder="Company email address"
                            value={toEmail}
                            onChange={(e) => setToEmail(e.target.value)}
                            onBlur={() => markAsTouched('toEmail')}
                          />
                        </div>
                        <FormValidator
                          value={toEmail}
                          required
                          showMessage={touchedFields.toEmail}
                          pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                          patternMessage="Please enter a valid email address"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="emailSubject">Subject</Label>
                        <Input
                          id="emailSubject"
                          placeholder="Email subject"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="emailBody">Email Body</Label>
                        <Textarea
                          id="emailBody"
                          placeholder="Email content"
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          className="min-h-[200px]"
                          onBlur={() => markAsTouched('emailBody')}
                        />
                        <FormValidator
                          value={emailBody}
                          required
                          showMessage={touchedFields.emailBody}
                        />
                      </div>
                    </div>
                    
                    {resumePdfUrl && (
                      <div className="flex items-center mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex-1">
                          <p className="text-sm font-medium">Resume PDF is ready</p>
                          <p className="text-xs text-muted-foreground mt-1">Will be attached to your email</p>
                        </div>
                        <a 
                          href={resumePdfUrl} 
                          download={resumeFileName}
                          className="text-primary text-sm hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Preview
                        </a>
                      </div>
                    )}
                    
                    <Button 
                      className="mt-4 w-full" 
                      variant="ats"
                      onClick={handleSendEmail}
                      disabled={isSending || !resumePdfBlob}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? "Sending..." : sendSuccess ? "Email Sent" : "Send to Company"}
                    </Button>
                    
                    {sendSuccess && (
                      <p className="text-sm text-green-600 mt-2 text-center">
                        Email has been sent directly to the company!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          <div>
            <div className="sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Your Resume</h2>
              <div className="border rounded-md p-4 max-h-[700px] overflow-auto bg-white">
                {resumeData && (
                  <div id="resume-content" ref={resumeRef}>
                    <Card className="p-6 bg-white shadow-sm">
                      <div className="border-b pb-4 mb-4">
                        <h2 className="text-2xl font-bold text-center text-black">
                          {resumeData.personalInfo?.firstName || ""} {resumeData.personalInfo?.lastName || ""}
                        </h2>
                        <p className="text-primary font-medium text-center">{resumeData.personalInfo?.jobTitle || ""}</p>
                        
                        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 mt-2">
                          {resumeData.personalInfo?.email && (
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {resumeData.personalInfo.email}
                            </span>
                          )}
                          {resumeData.personalInfo?.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {resumeData.personalInfo.phone}
                            </span>
                          )}
                          {resumeData.personalInfo?.location && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {resumeData.personalInfo.location}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {resumeData.objective && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-1 text-black">Objective</h3>
                          <p className="text-sm text-black">{resumeData.objective}</p>
                        </div>
                      )}
                      
                      {resumeData.education && resumeData.education.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-1 text-black">Education</h3>
                          <div className="space-y-2">
                            {resumeData.education.map((edu: any, index: number) => (
                              <div key={index} className="mb-2">
                                <p className="font-medium text-black">{edu.school}</p>
                                <p className="text-sm text-black">{edu.degree}</p>
                                <p className="text-xs text-gray-600">
                                  {edu.graduationDate} {edu.score && `- ${edu.score}`}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {resumeData.experience && resumeData.experience.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-1 text-black">Experience</h3>
                          <div className="space-y-2">
                            {resumeData.experience.map((exp: any, index: number) => (
                              <div key={index} className="mb-2">
                                <p className="font-medium text-black">{exp.jobTitle} at {exp.companyName}</p>
                                <p className="text-xs text-gray-600">
                                  {exp.startDate} - {exp.endDate || "Present"}
                                </p>
                                {exp.description && (
                                  <p className="text-sm mt-1 text-black">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {resumeData.projects && resumeData.projects.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-1 text-black">Projects</h3>
                          <div className="space-y-2">
                            {resumeData.projects.map((proj: any, index: number) => (
                              <div key={index} className="mb-2">
                                <p className="font-medium text-black">{proj.title}</p>
                                {proj.technologies && (
                                  <p className="text-xs text-gray-600">{proj.technologies}</p>
                                )}
                                {proj.description && (
                                  <p className="text-sm mt-1 text-black">{proj.description}</p>
                                )}
                                {proj.link && (
                                  <a 
                                    href={proj.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary underline"
                                  >
                                    {proj.link}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {resumeData.skills && (
                        <div>
                          <h3 className="font-semibold mb-1 text-black">Skills</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {resumeData.skills.technical && (
                              <div>
                                <p className="font-medium text-sm text-black">Technical</p>
                                <p className="text-sm text-black">{resumeData.skills.technical}</p>
                              </div>
                            )}
                            {resumeData.skills.professional && (
                              <div>
                                <p className="font-medium text-sm text-black">Professional</p>
                                <p className="text-sm text-black">{resumeData.skills.professional}</p>
                              </div>
                            )}
                            {resumeData.skills.soft && (
                              <div>
                                <p className="font-medium text-sm text-black">Soft Skills</p>
                                <p className="text-sm text-black">{resumeData.skills.soft}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShareToCompany;
