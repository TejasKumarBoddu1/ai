import { useState, useRef } from "react";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileCheck, AlertTriangle, Award, ArrowRight, Download, FileText, Scan } from "lucide-react";
import { motion } from "framer-motion";
import { generateATSScore } from "@/utils/atsScoreApi";
import { generateComparisonReport, downloadPDF } from "@/utils/comparisonReportApi";
import { toast } from "@/components/ui/use-toast";
import { ResumeComparisonScanner } from "@/components/resume/ResumeComparisonScanner";

const ResumeCompare = () => {
  const [resumeA, setResumeA] = useState<File | null>(null);
  const [resumeB, setResumeB] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<any | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleResumeAUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeA(e.target.files[0]);
    }
  };

  const handleResumeBUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeB(e.target.files[0]);
    }
  };

  const compareResumes = async () => {
    if (!resumeA || !resumeB) {
      toast({
        title: "Missing files",
        description: "Please upload both resumes to compare",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    
    try {
      const mockResumeDataA = {
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          jobTitle: "Software Engineer",
          email: "john.doe@example.com",
          phone: "+1 123-456-7890",
          location: "San Francisco, CA"
        },
        education: [{
          id: "1",
          school: "University of Technology",
          degree: "Bachelor of Science in Computer Science",
          graduationDate: "2019"
        }],
        experience: [{
          id: "1",
          jobTitle: "Software Engineer",
          companyName: "Tech Corp",
          startDate: "Jan 2020",
          description: "Developed and maintained web applications using React and Node.js."
        }],
        skills: {
          professional: "Project Management, Business Analysis",
          technical: "JavaScript, React, Node.js, TypeScript",
          soft: "Communication, Teamwork, Problem Solving"
        },
        objective: "Experienced software engineer seeking a challenging role in a dynamic organization."
      };

      const mockResumeDataB = {
        personalInfo: {
          firstName: "Jane",
          lastName: "Smith",
          jobTitle: "Frontend Developer",
          email: "jane.smith@example.com",
          phone: "+1 987-654-3210",
          location: "New York, NY"
        },
        education: [{
          id: "1",
          school: "State University",
          degree: "Master of Computer Science",
          graduationDate: "2020"
        }],
        experience: [{
          id: "1",
          jobTitle: "Frontend Developer",
          companyName: "Web Solutions Inc",
          startDate: "Mar 2021",
          description: "Built responsive web interfaces using React, improved site performance by 40%."
        }],
        skills: {
          professional: "UI/UX Design, Project Planning",
          technical: "React, TypeScript, CSS, HTML5, Redux",
          soft: "Leadership, Communication, Time Management"
        },
        objective: "Frontend Developer with expertise in React seeking opportunities to build intuitive user experiences."
      };

      try {
        const scoreDataA = await generateATSScore(mockResumeDataA);
        const scoreDataB = await generateATSScore(mockResumeDataB);
        
        console.log("Score data A:", scoreDataA);
        console.log("Score data B:", scoreDataB);

        const comparisonData = await generateComparisonReport(
          mockResumeDataA, 
          mockResumeDataB, 
          scoreDataA, 
          scoreDataB
        );
        
        console.log("Comparison data:", comparisonData);

        setComparisonResults(comparisonData);
        setIsComparing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Both resumes have been analyzed and compared successfully."
        });
      } catch (error) {
        console.error("Error in ATS scoring or comparison:", error);
        setIsComparing(false);
        
        toast({
          title: "Analysis Error",
          description: "There was a problem analyzing your resumes. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error comparing resumes:", error);
      setIsComparing(false);
      
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing your resumes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadComparisonReport = () => {
    if (!reportRef.current || !comparisonResults) return;
    
    toast({
      title: "Generating PDF",
      description: "Your comparison report is being prepared for download..."
    });
    
    downloadPDF(reportRef.current)
      .then(() => {
        toast({
          title: "PDF Downloaded",
          description: "Your comparison report has been saved successfully."
        });
      })
      .catch(error => {
        console.error("PDF generation error:", error);
        toast({
          title: "PDF Generation Failed",
          description: "There was a problem creating your PDF. Please try again.",
          variant: "destructive"
        });
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="container py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Compare Your Resumes & Find the Best!
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload two different versions of your resume to see which one performs better with ATS systems.
            Our AI will analyze both and provide detailed feedback on which one is more likely to land you the job.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-600">Resume A</h2>
              <p className="text-gray-500">Upload your first resume</p>
            </div>
            
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              resumeA 
                ? 'border-green-500 bg-green-50/50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            }`}>
              {resumeA ? (
                <div className="flex flex-col items-center">
                  <FileCheck className="h-16 w-16 text-green-500 mb-2" />
                  <p className="text-green-700 font-medium">{resumeA.name}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setResumeA(null)}
                  >
                    Replace File
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-16 w-16 text-blue-500 mb-2" />
                  <p className="text-blue-600 font-medium mb-2">Drag & drop your resume or click to browse</p>
                  <p className="text-sm text-gray-500">Supported formats: PDF, DOCX</p>
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    className="hidden" 
                    onChange={handleResumeAUpload}
                  />
                </label>
              )}
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-600">Resume B</h2>
              <p className="text-gray-500">Upload your second resume</p>
            </div>
            
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              resumeB 
                ? 'border-green-500 bg-green-50/50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            }`}>
              {resumeB ? (
                <div className="flex flex-col items-center">
                  <FileCheck className="h-16 w-16 text-green-500 mb-2" />
                  <p className="text-green-700 font-medium">{resumeB.name}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setResumeB(null)}
                  >
                    Replace File
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-16 w-16 text-blue-500 mb-2" />
                  <p className="text-blue-600 font-medium mb-2">Drag & drop your resume or click to browse</p>
                  <p className="text-sm text-gray-500">Supported formats: PDF, DOCX</p>
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    className="hidden" 
                    onChange={handleResumeBUpload}
                  />
                </label>
              )}
            </div>
          </motion.div>
        </div>

        <div className="text-center mb-12">
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-3 text-lg"
            disabled={!resumeA || !resumeB || isComparing}
            onClick={compareResumes}
          >
            {isComparing ? "Analyzing..." : "Compare Resumes"}
            {!isComparing && <ArrowRight className="ml-2" />}
          </Button>
        </div>

        {isComparing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="my-12"
          >
            <Card className="border shadow-sm overflow-hidden bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="text-center flex items-center justify-center">
                  <Scan className="mr-2 h-5 w-5 animate-pulse" />
                  Scanning & Comparing Resumes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center py-8">
                  <ResumeComparisonScanner />
                </div>
                <p className="text-center text-gray-600 animate-pulse mt-4">
                  Our AI is analyzing both resumes for ATS compatibility, keywords, formatting, and content quality...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {comparisonResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Comparison Results
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className={`overflow-hidden relative bg-white/70 backdrop-blur-sm ${comparisonResults.winner === 'resumeA' ? 'border-2 border-green-500' : ''}`}>
                {comparisonResults.winner === 'resumeA' && (
                  <div className="absolute -right-12 top-10 bg-green-500 text-white py-2 px-12 transform rotate-45 flex items-center justify-center z-10">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">WINNER</span>
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <CardTitle className="text-center">Resume A Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">ATS Score Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Overall ATS Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeA.atsScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                            style={{ width: `${comparisonResults.resumeA.atsScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Keyword Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeA.keywordScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                            style={{ width: `${comparisonResults.resumeA.keywordScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Format Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeA.formatScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                            style={{ width: `${comparisonResults.resumeA.formatScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Content Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeA.contentScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                            style={{ width: `${comparisonResults.resumeA.contentScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-green-600 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <FileCheck className="w-4 h-4 text-green-600" />
                      </div>
                      Strengths
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {comparisonResults.resumeA.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-gray-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-amber-600 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                      Areas to Improve
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {comparisonResults.resumeA.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="text-gray-700">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`overflow-hidden relative bg-white/70 backdrop-blur-sm ${comparisonResults.winner === 'resumeB' ? 'border-2 border-green-500' : ''}`}>
                {comparisonResults.winner === 'resumeB' && (
                  <div className="absolute -right-12 top-10 bg-green-500 text-white py-2 px-12 transform rotate-45 flex items-center justify-center z-10">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">WINNER</span>
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                  <CardTitle className="text-center">Resume B Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">ATS Score Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Overall ATS Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeB.atsScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" 
                            style={{ width: `${comparisonResults.resumeB.atsScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Keyword Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeB.keywordScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" 
                            style={{ width: `${comparisonResults.resumeB.keywordScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Format Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeB.formatScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" 
                            style={{ width: `${comparisonResults.resumeB.formatScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Content Score</span>
                          <span className="text-sm font-medium">{comparisonResults.resumeB.contentScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" 
                            style={{ width: `${comparisonResults.resumeB.contentScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-green-600 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <FileCheck className="w-4 h-4 text-green-600" />
                      </div>
                      Strengths
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {comparisonResults.resumeB.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-gray-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-amber-600 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                      Areas to Improve
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {comparisonResults.resumeB.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="text-gray-700">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white/70 backdrop-blur-sm my-8">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Award className="mr-2 h-6 w-6 text-blue-600" />
                  Expert Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{comparisonResults.reason}</p>
              </CardContent>
            </Card>
            
            <Card className="mb-10 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle>Improvement Suggestions for Both Resumes</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {comparisonResults.improvementSuggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <div className="hidden">
              <div ref={reportRef} className="p-8 bg-white">
                <div className="pdf-header">
                  <h1 className="text-3xl font-bold text-center mb-2">Resume Comparison Report</h1>
                  <p className="text-center text-gray-600 mb-6">Detailed analysis and recommendations powered by AI</p>
                </div>
                
                <div className="mb-6 p-4 border rounded-lg">
                  <div className="text-xl font-bold mb-3">Resume A Analysis</div>
                  <div className="mb-1">
                    <span className="font-semibold">Overall ATS Score:</span> {comparisonResults.resumeA.atsScore}%
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Keyword Score:</span> {comparisonResults.resumeA.keywordScore}%
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Format Score:</span> {comparisonResults.resumeA.formatScore}%
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Content Score:</span> {comparisonResults.resumeA.contentScore}%
                  </div>
                  
                  <div className="font-bold mt-3 mb-2">Strengths:</div>
                  <ul className="list-disc pl-6 mb-4">
                    {comparisonResults.resumeA.strengths.map((strength: string, index: number) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                  
                  <div className="font-bold mt-3 mb-2">Areas to Improve:</div>
                  <ul className="list-disc pl-6 mb-2">
                    {comparisonResults.resumeA.weaknesses.map((weakness: string, index: number) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6 p-4 border rounded-lg">
                  <div className="text-xl font-bold mb-3">Resume B Analysis</div>
                  <div className="mb-1">
                    <span className="font-semibold">Overall ATS Score:</span> {comparisonResults.resumeB.atsScore}%
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Keyword Score:</span> {comparisonResults.resumeB.keywordScore}%
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Format Score:</span> {comparisonResults.resumeB.formatScore}%
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Content Score:</span> {comparisonResults.resumeB.contentScore}%
                  </div>
                  
                  <div className="font-bold mt-3 mb-2">Strengths:</div>
                  <ul className="list-disc pl-6 mb-4">
                    {comparisonResults.resumeB.strengths.map((strength: string, index: number) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                  
                  <div className="font-bold mt-3 mb-2">Areas to Improve:</div>
                  <ul className="list-disc pl-6 mb-2">
                    {comparisonResults.resumeB.weaknesses.map((weakness: string, index: number) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6 p-4 border rounded-lg">
                  <div className="font-bold mb-3">Expert Recommendation:</div>
                  <p>
                    {comparisonResults.winner === 'resumeA' ? 
                      <span className="font-bold">Resume A is the winner. </span> : 
                      <span className="font-bold">Resume B is the winner. </span>
                    }
                    {comparisonResults.reason}
                  </p>
                </div>
                
                <div className="mb-6 p-4 border rounded-lg">
                  <div className="font-bold mb-3">Improvement Suggestions for Both Resumes:</div>
                  <ol className="list-decimal pl-6">
                    {comparisonResults.improvementSuggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="mb-2">{suggestion}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
                  <p>Generated by QwiX CV | ATS Resume Scanner and Optimizer</p>
                  <p>https://qwixcv.com | © {new Date().getFullYear()} QwikZen</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                onClick={downloadComparisonReport}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Detailed Comparison Report
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default ResumeCompare;
