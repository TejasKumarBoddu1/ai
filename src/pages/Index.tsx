
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import EnhancedHero from "@/components/home/EnhancedHero";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CertificationSection from "@/components/home/CertificationSection";
import CtaSection from "@/components/home/CtaSection";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, Sparkles, LogIn, Shield, Database, Lock, Share2,
  FileCheck, User, FileArchive, Award, Briefcase, GraduationCap,
  BarChart, MessageSquare, Rocket, Code, Globe, FileText, Monitor,
  Brain, BookOpen
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  // Define staggerContainer and itemVariant animations
  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariant = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 }
  };
  
  return (
    <MainLayout>
      {/* Career Path Simulator Promo Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 text-center mb-0">
        <div className="container mx-auto">
          <p className="flex items-center justify-center text-lg font-medium text-indigo-900 dark:text-indigo-200 gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            {isAuthenticated ? (
              <>
                Welcome back, {user?.name}! Continue exploring AI-powered career tools
              </>
            ) : (
              <>
                Try our new AI-powered Career Development Suite
              </>
            )}
            <Button asChild variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700 ml-4">
              {isAuthenticated ? (
                <RouterLink to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </RouterLink>
              ) : (
                <RouterLink to="/login">
                  <LogIn className="mr-1 h-4 w-4" /> Log In
                </RouterLink>
              )}
            </Button>
          </p>
        </div>
      </div>
      
      {/* Replace the old HeroSection with our new EnhancedHero */}
      <EnhancedHero />
      
      {/* Blockchain Documents Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <Badge variant="secondary" className="mb-4">Blockchain-Powered Security</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Blockchain Documents</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Manage and verify your documents secured on the blockchain, ensuring tamper-proof
              authenticity and easy verification for any professional credential.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariant} className="order-2 md:order-1">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mr-4 shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Tamper-Proof Security</h3>
                    <p className="text-gray-600">
                      Every document is cryptographically sealed and stored on blockchain, making it impossible to alter records without detection.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mr-4 shrink-0">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Decentralized Storage</h3>
                    <p className="text-gray-600">
                      Documents are stored across a distributed network, eliminating single points of failure and ensuring constant availability.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mr-4 shrink-0">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Private Access Control</h3>
                    <p className="text-gray-600">
                      You maintain complete control over who can access your documents, with secure key-based permissions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mr-4 shrink-0">
                    <Share2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Instant Verification</h3>
                    <p className="text-gray-600">
                      Share verification links that allow third parties to authenticate your documents without accessing sensitive details.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <RouterLink to="/blockchain-vault">
                      Access Your Vault <ArrowRight className="ml-2 h-4 w-4" />
                    </RouterLink>
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariant} className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Document Vault</h3>
                    <Badge className="bg-blue-600">Blockchain Secured</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 flex items-center">
                      <FileCheck className="h-8 w-8 text-green-600 mr-4" />
                      <div>
                        <p className="font-medium">Professional_Resume_2024.pdf</p>
                        <p className="text-sm text-gray-500">Verified • Added 2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 flex items-center">
                      <FileCheck className="h-8 w-8 text-green-600 mr-4" />
                      <div>
                        <p className="font-medium">University_Degree.pdf</p>
                        <p className="text-sm text-gray-500">Verified • Added 1 week ago</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 flex items-center">
                      <FileCheck className="h-8 w-8 text-green-600 mr-4" />
                      <div>
                        <p className="font-medium">Certification_Web_Development.pdf</p>
                        <p className="text-sm text-gray-500">Verified • Added 1 month ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Lock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Secured with blockchain technology</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* All Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <Badge variant="secondary" className="mb-4">Comprehensive Tools</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All QwiXEd360°Suite Features</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Discover our complete set of tools designed to empower your career journey with 
              AI, blockchain, and precision tools.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {/* Feature 1: Resume Builder */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Resume Builder</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Create stunning, ATS-friendly resumes with real-time optimization tips and templates for every career stage.
                  </p>
                  <RouterLink to="/builder" className="inline-flex items-center text-blue-600 font-medium hover:underline">
                    Build Your Resume <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 2: ATS Scanner */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Monitor className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">ATS Scanner</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Analyze your resume like a recruiter does. Understand what bots see and fix what's missing with AI guidance.
                  </p>
                  <RouterLink to="/ats-scanner" className="inline-flex items-center text-purple-600 font-medium hover:underline">
                    Run ATS Scan <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 3: LinkedIn Optimizer */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.3 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-sky-500 to-sky-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-sky-100 p-3 rounded-lg">
                      <User className="h-6 w-6 text-sky-600" />
                    </div>
                    <h3 className="font-semibold text-lg">LinkedIn Optimizer</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Transform your LinkedIn into a professional magnet with profile scoring, keyword optimization, and visual suggestions.
                  </p>
                  <RouterLink to="/linkedin-optimizer" className="inline-flex items-center text-sky-600 font-medium hover:underline">
                    Optimize Profile <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 4: Resume Compare */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.4 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <FileArchive className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Resume Compare</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Upload multiple resumes to instantly compare structure, impact, and keyword relevance with detailed analytics.
                  </p>
                  <RouterLink to="/resume-compare" className="inline-flex items-center text-amber-600 font-medium hover:underline">
                    Compare Resumes <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 5: QwiXCert */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">QwiXCert</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Earn blockchain-verified micro-certifications for in-demand skills with AI-curated learning recommendations.
                  </p>
                  <RouterLink to="/certification-center" className="inline-flex items-center text-green-600 font-medium hover:underline">
                    Explore Certifications <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 6: Job Board */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-pink-500 to-pink-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <Briefcase className="h-6 w-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Job Board</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Find curated job opportunities with smart filters and AI matching based on your resume and professional profile.
                  </p>
                  <RouterLink to="/job-board" className="inline-flex items-center text-pink-600 font-medium hover:underline">
                    Browse Jobs <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 7: Career Guide */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.3 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Career Guide</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Access AI-personalized growth roadmaps for hundreds of roles with detailed learning paths and milestones.
                  </p>
                  <RouterLink to="/career-paths" className="inline-flex items-center text-indigo-600 font-medium hover:underline">
                    Explore Career Paths <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 8: Career Path Simulator */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.4 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-teal-500 to-teal-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <BarChart className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Career Path Simulator</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Explore multiple career routes based on your skills and interests with visual simulations of potential paths.
                  </p>
                  <RouterLink to="/career-path-simulator" className="inline-flex items-center text-teal-600 font-medium hover:underline">
                    Try Simulator <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 9: Interview Coach */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-cyan-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-cyan-100 p-3 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-cyan-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Interview Coach</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Practice with AI mock interviews featuring instant feedback, response suggestions, and confidence building exercises.
                  </p>
                  <RouterLink to="/interview-coach" className="inline-flex items-center text-cyan-600 font-medium hover:underline">
                    Start Mock Interview <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 10: AI Job Switch Planner */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-violet-500 to-violet-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-violet-100 p-3 rounded-lg">
                      <Rocket className="h-6 w-6 text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-lg">AI Job Switch Planner</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Calculate career switch feasibility, identify learning gaps, and plan your ideal transition path with AI guidance.
                  </p>
                  <RouterLink to="/job-switch-planner" className="inline-flex items-center text-violet-600 font-medium hover:underline">
                    Plan Career Switch <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 11: AI Shadow Career Simulator */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.3 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">AI Shadow Career</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Experience what it's like to "shadow" another career through realistic AI-generated workplace scenarios.
                  </p>
                  <RouterLink to="/shadow-career-simulator" className="inline-flex items-center text-red-600 font-medium hover:underline">
                    Launch Simulator <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 12: AI Layoff Readiness Toolkit */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.4 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Layoff Readiness</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Assess job stability, create backup plans, and prepare comprehensive career defense strategies for uncertain times.
                  </p>
                  <RouterLink to="/layoff-readiness" className="inline-flex items-center text-orange-600 font-medium hover:underline">
                    Launch Toolkit <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 13: AI Coding Coach */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <Code className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-lg">AI Coding Coach</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Get real-time code mentoring with smart suggestions, time complexity analysis, and technical interview preparation.
                  </p>
                  <RouterLink to="/coding-coach" className="inline-flex items-center text-emerald-600 font-medium hover:underline">
                    Meet Your Coach <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 14: QwiXPro Builder */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">QwiXPro Builder</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Build an advanced professional portfolio to showcase projects, blogs, media, and GitHub repositories in one dynamic page.
                  </p>
                  <RouterLink to="/portfolio-builder" className="inline-flex items-center text-blue-600 font-medium hover:underline">
                    Build Portfolio <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 15: Skill Gap Analysis */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.3 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Skill Gap Analysis</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Upload your resume to identify missing skills and get personalized learning tracks to stay competitive in your field.
                  </p>
                  <RouterLink to="/skill-gap" className="inline-flex items-center text-purple-600 font-medium hover:underline">
                    Analyze Skills <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Feature 16: Mindprint Assessment */}
            <motion.div variants={itemVariant} transition={{ duration: 0.3, delay: 0.4 }}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-rose-500 to-rose-600"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-rose-100 p-3 rounded-lg">
                      <Brain className="h-6 w-6 text-rose-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Mindprint Assessment</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Take an AI-driven psychological profile test to match your cognitive style, interests, and values with ideal career roles.
                  </p>
                  <RouterLink to="/mindprint" className="inline-flex items-center text-rose-600 font-medium hover:underline">
                    Take Assessment <ArrowRight className="ml-1 h-4 w-4" />
                  </RouterLink>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <FeaturesSection />
      <HowItWorksSection />
      <CertificationSection />
      <TestimonialsSection />
      <CtaSection />
    </MainLayout>
  );
};

export default Index;
