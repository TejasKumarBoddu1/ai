import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { BlockchainProvider } from "@/context/BlockchainContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import StudentHome from "@/pages/StudentHome";
import JobSearch from "@/pages/JobSearch";
import ApplyJobs from "@/pages/ApplyJobs";
import MyApplications from "@/pages/MyApplications";
import MyAnalytics from "@/pages/MyAnalytics";
import Login from "@/pages/Auth/Login";
import NewLogin from "@/pages/Auth/NewLogin";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import CertificationCenter from "@/pages/CertificationCenter";
import CertificateDetails from "@/pages/CertificateDetails";
import VerifyCertificate from "@/pages/VerifyCertificate";
import VerifyDocument from "@/pages/VerifyDocument";
import Everyone from "@/pages/Everyone";
import ResumeBuilder from "./pages/ResumeBuilder";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import ATSScanner from "./pages/ATSScanner";
import InterviewCoach from "./pages/InterviewCoach";
import JobBoard from "./pages/JobBoard";
import CareerPathSimulator from "./pages/CareerPathSimulator";
import AIJobSwitchPlanner from "./pages/AIJobSwitchPlanner";
import AIShadowCareerSimulator from "./pages/AIShadowCareerSimulator";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";
import AILayoffReadinessToolkit from "./pages/AILayoffReadinessToolkit";
import MindprintAssessment from "./pages/MindprintAssessment";
import AICodingCoach from "./pages/AICodingCoach";
import ResumeCompare from "./pages/ResumeCompare";
import QwiXProBuilder from "./pages/QwiXProBuilder";
import AuthLayout from "./pages/Auth/AuthLayout";
import BlockchainVault from "./pages/BlockchainVault";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AIInterviewCoach from "./pages/AIInterviewCoach";
import TensorFlowDebug from "./pages/TensorFlowDebug";

// HR Dashboard imports
import HRDashboardIndex from "@/pages/HRDashboard";
import HRDashboardJobs from "@/pages/HRDashboard/Jobs";
import CreateJob from "@/pages/HRDashboard/CreateJob";
import JobDetails from "@/pages/HRDashboard/JobDetails";
import HRDashboardCandidates from "@/pages/HRDashboard/Candidates";
import HRDashboardAIAgents from "@/pages/HRDashboard/AIAgents";
import HRDashboardInterviews from "@/pages/HRDashboard/Interviews";
import HRDashboardAnalytics from "@/pages/HRDashboard/Analytics";
import HRDashboardSettings from "@/pages/HRDashboard/Settings";
import HRDashboardProfile from "@/pages/HRDashboard/Profile";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-b-transparent border-primary"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <BlockchainProvider>
            <Routes>
              {/* Auth routes - redirect old login to new login */}
              <Route path="/login" element={<Navigate to="/new-login" replace />} />
              <Route path="/new-login" element={<NewLogin />} />
              <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
              <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
              <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
              
              {/* Public verification routes */}
              <Route path="/verify-cert/:certHash" element={<VerifyCertificate />} />
              <Route path="/verify-document/:documentId" element={<VerifyDocument />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Make Everyone page public */}
              <Route path="/everyone" element={<Everyone />} />
              
              {/* Debug page */}
              <Route path="/debug-tensorflow" element={<TensorFlowDebug />} />
              
              {/* Public information pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Student landing page */}
              <Route 
                path="/student-home" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <StudentHome />
                  </ProtectedRoute>
                } 
              />
              
              {/* New Student Navigation Routes */}
              <Route 
                path="/job-search" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <JobSearch />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/apply" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <ApplyJobs />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/my-applications" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <MyApplications />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <MyAnalytics />
                  </ProtectedRoute>
                } 
              />
              
              {/* HR Dashboard Routes */}
              <Route
                path="/hr-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <HRDashboardIndex />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/jobs"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <HRDashboardJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/jobs/create"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <CreateJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/jobs/:id"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <JobDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/candidates"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <HRDashboardCandidates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/ai-agents"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <HRDashboardAIAgents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/interviews"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <HRDashboardInterviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/analytics"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <HRDashboardAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/settings"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <HRDashboardSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr-dashboard/profile"
                element={
                  <ProtectedRoute allowedRoles={['organization', 'admin']}>
                    <HRDashboardProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* Protected user/student routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Blockchain Vault route */}
              <Route 
                path="/blockchain-vault" 
                element={
                  <ProtectedRoute>
                    <BlockchainVault />
                  </ProtectedRoute>
                } 
              />
              
              {/* CV Tools Routes */}
              <Route 
                path="/builder" 
                element={
                  <ProtectedRoute>
                    <ResumeBuilder />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/linkedin-optimizer" 
                element={
                  <ProtectedRoute>
                    <LinkedInOptimizer />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ats-scanner" 
                element={
                  <ProtectedRoute>
                    <ATSScanner />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/resume-compare" 
                element={
                  <ProtectedRoute>
                    <ResumeCompare />
                  </ProtectedRoute>
                } 
              />
              
              {/* Career Guide Routes */}
              <Route 
                path="/career-path-simulator" 
                element={
                  <ProtectedRoute>
                    <CareerPathSimulator />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/interview-coach" 
                element={
                  <ProtectedRoute>
                    <InterviewCoach />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-interview-coach" 
                element={
                  <ProtectedRoute>
                    <AIInterviewCoach />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-job-switch-planner" 
                element={
                  <ProtectedRoute>
                    <AIJobSwitchPlanner />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-shadow-career-simulator" 
                element={
                  <ProtectedRoute>
                    <AIShadowCareerSimulator />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/skill-gap-analysis" 
                element={
                  <ProtectedRoute>
                    <SkillGapAnalysis />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-layoff-readiness-toolkit" 
                element={
                  <ProtectedRoute>
                    <AILayoffReadinessToolkit />
                  </ProtectedRoute>
                } 
              />
              
              {/* QwiX Learn Routes */}
              <Route 
                path="/mindprint-assessment" 
                element={
                  <ProtectedRoute>
                    <MindprintAssessment />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ai-coding-coach" 
                element={
                  <ProtectedRoute>
                    <AICodingCoach />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/ai-builder" 
                element={
                  <ProtectedRoute>
                    <QwiXProBuilder />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/job-board" 
                element={
                  <ProtectedRoute>
                    <JobBoard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Other protected routes that should only be accessible for students/freelancers */}
              <Route 
                path="/certification-center" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <CertificationCenter />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/certificate/:id" 
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin']}>
                    <CertificateDetails />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default route - redirect to appropriate landing page based on role */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    {({ user }) => (
                      user?.role === 'organization' ? <HRDashboardIndex /> : <StudentHome />
                    )}
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BlockchainProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
