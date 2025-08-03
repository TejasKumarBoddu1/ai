
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Info, ArrowRight, Book, LayoutDashboard } from "lucide-react";
import QwikzTeamBanner from "@/components/QwikzTeamBanner";

const OrganizationHome = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to QwiX CV</h1>
          <p className="mt-3 text-xl text-muted-foreground">
            AI-Powered Recruitment & Document Management Platform
          </p>
        </div>
        
        <QwikzTeamBanner />
        
        <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Resume Parser Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>Resume Parser</CardTitle>
              <CardDescription>Extract structured data from candidate resumes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">✓</span>
                  <span>Bulk resume processing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">✓</span>
                  <span>Candidate data extraction</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">✓</span>
                  <span>Skills and experience analysis</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/organization/resume-parser">
                  <span>Parse Resumes</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Document Generator Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle>Document Generator</CardTitle>
              <CardDescription>Create standardized HR documents with AI</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center">✓</span>
                  <span>Offer letter templates</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center">✓</span>
                  <span>Legal document generation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center">✓</span>
                  <span>Customizable company branding</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/organization/document-generator">
                  <span>Generate Documents</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Blockchain Verification Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <LayoutDashboard className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>Verify candidate documents securely</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">✓</span>
                  <span>Tamper-proof credential verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">✓</span>
                  <span>QR code document verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">✓</span>
                  <span>Document authentication records</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/organization/blockchain-verification">
                  <span>Verify Documents</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* AI Interviewer Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
              <Users className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
              <CardTitle>AI Interviewer</CardTitle>
              <CardDescription>Pre-screen candidates with AI assistance</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">✓</span>
                  <span>Automated screening interviews</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">✓</span>
                  <span>Customizable question sets</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">✓</span>
                  <span>Response analysis and scoring</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/organization/ai-interviewer">
                  <span>Start Screening</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Aptitude Exams Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20">
              <Book className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mb-2" />
              <CardTitle>Aptitude Exams</CardTitle>
              <CardDescription>Create and manage technical assessment tests</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-600 flex items-center justify-center">✓</span>
                  <span>Custom test creation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-600 flex items-center justify-center">✓</span>
                  <span>Automated grading</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-600 flex items-center justify-center">✓</span>
                  <span>Skills gap analysis</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/organization/aptitude-exams">
                  <span>Manage Exams</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Dashboard Card */}
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20">
              <Info className="h-8 w-8 text-rose-600 dark:text-rose-400 mb-2" />
              <CardTitle>Organization Dashboard</CardTitle>
              <CardDescription>Comprehensive recruitment analytics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center">✓</span>
                  <span>Candidate pipeline visualization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center">✓</span>
                  <span>Recruitment metrics and KPIs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 h-5 w-5 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center">✓</span>
                  <span>Team collaboration tools</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/organization/dashboard">
                  <span>View Dashboard</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to revolutionize your recruitment?</h2>
          <p className="text-muted-foreground mb-6">
            Access all your recruitment tools and begin streamlining your HR processes
          </p>
          <Button asChild size="lg">
            <Link to="/organization/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationHome;
