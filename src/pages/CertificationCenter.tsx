
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import QwiXCertHeader from '@/components/certification/QwiXCertHeader';
import WalletConnect from '@/components/blockchain/WalletConnect';
import MCQTestList from '@/components/certification/MCQTestList';
import { TestInfo } from "@/types/certification";
import { getUserCertificates } from '@/utils/blockchain';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Shield, Brain } from "lucide-react";
import { useBlockchain } from '@/context/BlockchainContext';
import { useToast } from '@/components/ui/use-toast';

const CertificationCenter = () => {
  const [tests, setTests] = useState<TestInfo[]>([]);
  const [userCertificates, setUserCertificates] = useState<string[]>([]);
  const { isConnected, account } = useBlockchain();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch test data
    const fetchTestData = () => {
      // In a real app, this would be an API call
      const testData: TestInfo[] = [
        {
          id: "resume-01",
          title: "Professional Resume Building",
          description: "Master the art of creating ATS-friendly resumes",
          timeLimit: 20,
          questionCount: 15,
          topics: ["Resume Structure", "ATS Optimization", "Content Writing", "Formatting"],
          passingScore: 70,
          category: "Career Development"
        },
        {
          id: "ats-02",
          title: "ATS Optimization Specialist",
          description: "Learn advanced techniques for beating ATS systems",
          timeLimit: 30,
          questionCount: 20,
          topics: ["Keyword Optimization", "ATS Algorithms", "Format Compatibility", "Parsing Technology"],
          passingScore: 75,
          category: "Technical Skills"
        },
        {
          id: "career-03",
          title: "Career Development Fundamentals",
          description: "Essential strategies for career growth and advancement",
          timeLimit: 25,
          questionCount: 18,
          topics: ["Networking", "Professional Development", "Industry Trends", "Job Search Strategy"],
          passingScore: 70,
          category: "Career Development"
        },
        {
          id: "interview-04",
          title: "Interview Mastery",
          description: "Ace your interviews with proven techniques",
          timeLimit: 20,
          questionCount: 15,
          topics: ["Common Questions", "STAR Method", "Body Language", "Follow-up Strategy"],
          passingScore: 75,
          category: "Soft Skills"
        },
        {
          id: "web3-05",
          title: "Blockchain & Web3 Basics",
          description: "Essential knowledge for modern technology careers",
          timeLimit: 30,
          questionCount: 20,
          topics: ["Blockchain Fundamentals", "Cryptocurrency", "Smart Contracts", "Decentralized Apps"],
          passingScore: 70,
          category: "Technical Skills"
        },
        {
          id: "aiml-06",
          title: "AI & Machine Learning Essentials",
          description: "Key concepts in artificial intelligence for your resume",
          timeLimit: 40,
          questionCount: 25,
          topics: ["ML Fundamentals", "Neural Networks", "NLP", "AI Applications"],
          passingScore: 75,
          category: "Technical Skills"
        }
      ];
      
      setTests(testData);
      
      // Provide feedback to the user that tests are loaded
      toast({
        title: "Tests Loaded",
        description: `${testData.length} certification tests are available`,
      });
    };
    
    // Fetch user's certificates
    const fetchUserCertificates = () => {
      try {
        const certificates = getUserCertificates();
        const certifiedTestIds = certificates.map(cert => cert.testId);
        setUserCertificates(certifiedTestIds);
      } catch (error) {
        console.error("Error fetching user certificates:", error);
        setUserCertificates([]);
      }
    };
    
    fetchTestData();
    fetchUserCertificates();
  }, [isConnected, account, toast]);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <QwiXCertHeader 
            title="QwiXCert Certification Center" 
            subtitle="Earn blockchain-verified credentials to showcase your skills" 
          />
          <div className="min-w-[180px]">
            <WalletConnect />
          </div>
        </div>
        
        <Tabs defaultValue="exams" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="exams" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Certification Exams
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              About Blockchain Certificates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="exams">
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="md:w-2/3">
                      <h3 className="text-xl font-bold mb-2">Blockchain-Verified Certifications</h3>
                      <p className="text-muted-foreground mb-4">
                        Pass our certification exams to earn tamper-proof credentials stored on the Polygon blockchain.
                        These certifications can be added to your resume and verified by employers with a simple QR code.
                      </p>
                    </div>
                    <div className="md:w-1/3 flex justify-center">
                      <div className="bg-white p-6 rounded-full shadow-md">
                        <Brain className="h-16 w-16 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <h2 className="text-2xl font-bold mb-4">Available Certifications</h2>
              <MCQTestList 
                tests={tests} 
                userCertificates={userCertificates}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-600" />
                  Blockchain Certification Technology
                </CardTitle>
                <CardDescription>
                  Understanding the technology behind QwiXCert blockchain certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                    <p className="text-muted-foreground text-sm">
                      When you pass a certification exam, a unique digital certificate is minted as a 
                      non-fungible token (NFT) on the Polygon blockchain. This creates a permanent, 
                      tamper-proof record of your achievement that can be verified by anyone with the 
                      certificate's unique identifier or QR code.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Why Blockchain?</h3>
                    <p className="text-muted-foreground text-sm">
                      Traditional certifications rely on centralized authorities and can be easily 
                      falsified. Blockchain technology ensures your credentials are permanently recorded, 
                      impossible to forge, and don't require a third party to verify their authenticity.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Technical Implementation</h3>
                    <p className="text-muted-foreground text-sm">
                      We use ERC-721 standard smart contracts deployed on the Polygon network, 
                      a layer 2 scaling solution for Ethereum. This provides the security of 
                      blockchain with minimal gas fees and environmental impact.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Resume Integration</h3>
                    <p className="text-muted-foreground text-sm">
                      Your blockchain certifications can be seamlessly integrated into your QWIK CV 
                      resume. Each certification includes a verification link and QR code that employers 
                      can use to instantly verify the authenticity of your credentials.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More About Blockchain Technology
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CertificationCenter;
