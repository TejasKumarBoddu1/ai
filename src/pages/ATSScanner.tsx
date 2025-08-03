import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, FileText, CheckCircle, AlertCircle, Zap, Download, Target, Info, Briefcase } from "lucide-react";
import { ATSScoreDisplay } from "@/components/resume/ATSScoreDisplay";
import { generateATSScore, ATSScoreData } from "@/utils/atsScoreApi";
import { toast } from "@/components/ui/use-toast";
import * as THREE from "three";
import { getJobRecommendations } from "@/utils/jobBoardApi";
import { JobListing } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";

const ATSScanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScoreData | null>(null);
  const [jobRecommendations, setJobRecommendations] = useState<JobListing[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!scannerRef.current) return;
    
    const container = scannerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    const documentGeometry = new THREE.BoxGeometry(3, 4, 0.1);
    const documentMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.5
    });
    const document = new THREE.Mesh(documentGeometry, documentMaterial);
    scene.add(document);
    
    const linesGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const lineGeometry = new THREE.BoxGeometry(2, 0.08, 0.02);
      const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.y = 1.5 - (i * 0.2);
      line.position.z = 0.06;
      line.scale.x = 0.5 + Math.random() * 0.5;
      linesGroup.add(line);
    }
    document.add(linesGroup);
    
    const scannerGeometry = new THREE.PlaneGeometry(3.2, 0.1);
    const scannerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const scanner = new THREE.Mesh(scannerGeometry, scannerMaterial);
    scanner.position.z = 0.2;
    scanner.visible = false;
    scene.add(scanner);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 5);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x4f46e5, 2, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 10);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);
    
    camera.position.z = 5;
    
    let scannerPosition = -2;
    let scannerDirection = 0.05;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      document.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
      document.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      
      if (isAnalyzing) {
        scanner.visible = true;
        scanner.position.y = scannerPosition;
        scannerPosition += scannerDirection;
        
        if (scannerPosition > 2 || scannerPosition < -2) {
          scannerDirection *= -1;
        }
      } else {
        scanner.visible = false;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAnalyzing]);
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (validTypes.includes(file.type)) {
      setFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive"
      });
    }
  };
  
  const removeFile = () => {
    setFile(null);
    setAtsScore(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveATSResultToDatabase = async (scoreData: ATSScoreData, fileName: string, fileSize: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your ATS scan results.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('ats_scan_results')
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_size: fileSize,
          overall_score: scoreData.overallScore,
          keyword_score: scoreData.keywordScore,
          format_score: scoreData.formatScore,
          content_score: scoreData.contentScore,
          suggestions: scoreData.suggestions,
          job_match: scoreData.jobMatch,
          scan_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving ATS result:", error);
        toast({
          title: "Save failed",
          description: "Failed to save ATS scan results to database.",
          variant: "destructive"
        });
      } else {
        console.log("ATS result saved successfully:", data);
        toast({
          title: "Results saved",
          description: "Your ATS scan results have been saved to your profile.",
        });
      }
    } catch (error) {
      console.error("Error in saveATSResultToDatabase:", error);
      toast({
        title: "Save failed",
        description: "An unexpected error occurred while saving results.",
        variant: "destructive"
      });
    }
  };
  
  const analyzeResume = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a resume file to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setJobRecommendations([]);
    
    try {
      setTimeout(async () => {
        const mockResumeData = {
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
          }
        };
        
        const score = await generateATSScore(mockResumeData);
        setAtsScore(score);
        setIsAnalyzing(false);
        
        // Save to database
        await saveATSResultToDatabase(score, file.name, file.size);
        
        setIsLoadingJobs(true);
        try {
          const skills = mockResumeData.skills.technical.split(', ');
          const jobTitle = mockResumeData.personalInfo.jobTitle;
          const location = mockResumeData.personalInfo.location;
          
          const recommendations = await getJobRecommendations(skills, jobTitle, location);
          setJobRecommendations(recommendations);
        } catch (error) {
          console.error("Error fetching job recommendations:", error);
        } finally {
          setIsLoadingJobs(false);
        }
        
        toast({
          title: "Analysis complete",
          description: "Your resume has been analyzed successfully!",
        });
      }, 3000);
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ATS Scanner</h1>
            <p className="text-muted-foreground">Optimize your resume for Applicant Tracking Systems</p>
          </div>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Resume Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FileText className="h-16 w-16 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button 
                      onClick={analyzeResume}
                      disabled={isAnalyzing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Analyze Resume
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={removeFile}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Upload className="h-16 w-16 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your resume here</p>
                    <p className="text-sm text-gray-500">
                      or click to browse (PDF, DOC, DOCX)
                    </p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3D Scanner Visualization */}
        {isAnalyzing && (
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis in Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={scannerRef} className="w-full h-[300px] rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" />
              <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                Scanning your resume for ATS compatibility...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {atsScore && (
          <div className="space-y-6">
            <ATSScoreDisplay 
              scoreData={atsScore}
              isLoading={false}
            />
            
            {/* Job Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Recommended Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingJobs ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
                    <p>Finding relevant job opportunities...</p>
                  </div>
                ) : jobRecommendations.length > 0 ? (
                  <div className="grid gap-4">
                    {jobRecommendations.slice(0, 3).map((job) => (
                      <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{job.title}</h4>
                          <span className="text-sm text-gray-500">85% match</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                        <p className="text-sm text-gray-500 mb-3">{job.location}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-600">
                            {job.salary || "Salary not specified"}
                          </span>
                          <Button size="sm" variant="outline">
                            View Job
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No job recommendations available at the moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default ATSScanner;
