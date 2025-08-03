
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBlockchain } from '@/context/BlockchainContext';
import { useAuth } from '@/context/AuthContext';
import MCQTest from '@/components/certification/MCQTest';
import TestResults from '@/components/certification/TestResults';
import CertificateGenerator from '@/components/certification/CertificateGenerator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, AlertTriangle } from 'lucide-react';
import { TestInfo, Question } from "@/types/certification";
import { Certificate, UserActivity } from "@/types/blockchain";
import { v4 as uuidv4 } from 'uuid';

const TESTS: Record<string, TestInfo> = {
  "resume-01": {
    id: "resume-01",
    title: "Professional Resume Building",
    description: "Master the art of creating ATS-friendly resumes",
    timeLimit: 20,
    questionCount: 15,
    topics: ["Resume Structure", "ATS Optimization", "Content Writing", "Formatting"],
    passingScore: 70,
    category: "Career Development"
  },
  "ats-02": {
    id: "ats-02",
    title: "ATS Optimization Specialist",
    description: "Learn advanced techniques for beating ATS systems",
    timeLimit: 30,
    questionCount: 20,
    topics: ["Keyword Optimization", "ATS Algorithms", "Format Compatibility", "Parsing Technology"],
    passingScore: 75,
    category: "Technical Skills"
  },
  "career-03": {
    id: "career-03",
    title: "Career Development Fundamentals",
    description: "Essential strategies for career growth and advancement",
    timeLimit: 25,
    questionCount: 18,
    topics: ["Networking", "Professional Development", "Industry Trends", "Job Search Strategy"],
    passingScore: 70,
    category: "Career Development"
  },
  "interview-04": {
    id: "interview-04",
    title: "Interview Mastery",
    description: "Ace your interviews with proven techniques",
    timeLimit: 20,
    questionCount: 15,
    topics: ["Common Questions", "STAR Method", "Body Language", "Follow-up Strategy"],
    passingScore: 75,
    category: "Soft Skills"
  },
  "web3-05": {
    id: "web3-05",
    title: "Blockchain & Web3 Basics",
    description: "Essential knowledge for modern technology careers",
    timeLimit: 30,
    questionCount: 20,
    topics: ["Blockchain Fundamentals", "Cryptocurrency", "Smart Contracts", "Decentralized Apps"],
    passingScore: 70,
    category: "Technical Skills"
  },
  "aiml-06": {
    id: "aiml-06",
    title: "AI & Machine Learning Essentials",
    description: "Key concepts in artificial intelligence for your resume",
    timeLimit: 40,
    questionCount: 25,
    topics: ["ML Fundamentals", "Neural Networks", "NLP", "AI Applications"],
    passingScore: 75,
    category: "Technical Skills"
  }
};

const TEST_QUESTIONS: Record<string, Question[]> = {
  "resume-01": [
    {
      id: "q1",
      text: "What is the recommended length for a professional resume?",
      options: ["1 page", "1-2 pages", "3-4 pages", "5+ pages"],
      correctOptionIndex: 1,
      correctAnswer: "1-2 pages"
    },
    {
      id: "q2",
      text: "Which of the following should NOT be included in a modern resume?",
      options: ["Skills section", "Professional experience", "Objective statement", "Education"],
      correctOptionIndex: 2,
      correctAnswer: "Objective statement"
    },
    {
      id: "q3",
      text: "What format do most Applicant Tracking Systems (ATS) prefer?",
      options: [".pdf", ".docx", ".txt", "Any format is fine"],
      correctOptionIndex: 0,
      correctAnswer: ".pdf"
    },
    {
      id: "q4",
      text: "What is the purpose of using keywords in your resume?",
      options: [
        "To make it look more professional",
        "To match ATS search parameters",
        "To impress hiring managers",
        "To fill up space"
      ],
      correctOptionIndex: 1,
      correctAnswer: "To match ATS search parameters"
    },
    {
      id: "q5",
      text: "Which resume section should typically come first?",
      options: [
        "Educational background",
        "Work experience",
        "Contact information and summary",
        "References"
      ],
      correctOptionIndex: 2,
      correctAnswer: "Contact information and summary"
    }
  ],
  "web3-05": [
    {
      id: "q1",
      text: "What is blockchain technology primarily designed to provide?",
      options: [
        "Faster internet speeds",
        "Decentralized, tamper-proof record-keeping",
        "Advanced artificial intelligence",
        "Cross-platform mobile applications"
      ],
      correctOptionIndex: 1,
      correctAnswer: "Decentralized, tamper-proof record-keeping"
    },
    {
      id: "q2",
      text: "What is a smart contract?",
      options: [
        "A legally binding document",
        "A physical contract with embedded microchips",
        "Self-executing code stored on a blockchain",
        "An AI-negotiated agreement"
      ],
      correctOptionIndex: 2,
      correctAnswer: "Self-executing code stored on a blockchain"
    },
    {
      id: "q3",
      text: "What does NFT stand for?",
      options: [
        "New Financial Technology",
        "Network File Transfer",
        "Non-Fungible Token",
        "National FinTech Treasury"
      ],
      correctOptionIndex: 2,
      correctAnswer: "Non-Fungible Token"
    },
    {
      id: "q4",
      text: "Which of these is NOT a feature of decentralized applications (dApps)?",
      options: [
        "Open-source code",
        "Uses blockchain technology",
        "Centralized control",
        "Token-based incentives"
      ],
      correctOptionIndex: 2,
      correctAnswer: "Centralized control"
    },
    {
      id: "q5",
      text: "What is the main purpose of cryptocurrency wallets?",
      options: [
        "To store actual coins digitally",
        "To secure private keys and manage digital assets",
        "To mine new cryptocurrencies",
        "To convert between different currencies"
      ],
      correctOptionIndex: 1,
      correctAnswer: "To secure private keys and manage digital assets"
    }
  ]
};

const generateQuestionsForTest = (testId: string): Question[] => {
  if (TEST_QUESTIONS[testId] && TEST_QUESTIONS[testId].length >= 5) {
    return TEST_QUESTIONS[testId];
  }
  
  const testInfo = TESTS[testId];
  const questions: Question[] = [];
  
  for (let i = 0; i < 10; i++) {
    questions.push({
      id: `q${i+1}`,
      text: `Question ${i+1}: What is the most important aspect of ${testInfo.title}?`,
      options: [
        "Strategic planning and implementation",
        "Technical knowledge and expertise",
        "Communication and stakeholder management",
        "Continuous learning and adaptation"
      ],
      correctOptionIndex: i % 4,
      correctAnswer: ["Strategic planning and implementation", 
                     "Technical knowledge and expertise", 
                     "Communication and stakeholder management", 
                     "Continuous learning and adaptation"][i % 4]
    });
  }
  
  return questions;
};

const CertificationTest = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isConnected, saveCertificateToVault, getVaultUser } = useBlockchain();
  
  const [loading, setLoading] = useState(true);
  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [testPassed, setTestPassed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  
  useEffect(() => {
    const loadTest = async () => {
      setLoading(true);
      
      if (!testId || !TESTS[testId]) {
        toast({
          title: "Test Not Found",
          description: "The certification test you requested could not be found.",
          variant: "destructive"
        });
        navigate("/certification-center");
        return;
      }
      
      try {
        const test = TESTS[testId];
        setTestInfo(test);
        
        const questions = generateQuestionsForTest(testId);
        setTestQuestions(questions);
        
      } catch (error) {
        console.error("Error loading test:", error);
        toast({
          title: "Error Loading Test",
          description: "There was a problem loading the certification test. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTest();
  }, [testId, navigate, toast]);
  
  const handleTestComplete = (score: number, passed: boolean, answers: Record<number, string>) => {
    setTestScore(score);
    setTestPassed(passed);
    setUserAnswers(answers);
    setTestCompleted(true);

    // Record this activity in the user's QwixVault
    if (testInfo) {
      const vaultUsersStr = localStorage.getItem('qwixvault_users');
      const vaultUsers = vaultUsersStr ? JSON.parse(vaultUsersStr) : {};

      if (user && vaultUsers[user.email]) {
        const activity: UserActivity = {
          id: uuidv4(),
          type: 'exam_taken',
          title: 'Certification Test Completed',
          description: `Completed ${testInfo.title}`,
          timestamp: new Date().toISOString(),
          result: {
            passed,
            score
          }
        };

        vaultUsers[user.email].activities = [
          activity,
          ...(vaultUsers[user.email].activities || [])
        ];

        localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
      }
    }
  };
  
  const handleRetryTest = () => {
    navigate("/certification-center");
  };
  
  const handleGenerateCertificate = () => {
    setShowCertificateGenerator(true);
  };
  
  const handleCertificateComplete = (certificate: Certificate) => {
    // Save to local storage for immediate display
    const certificates = JSON.parse(localStorage.getItem('user_certificates') || '[]');
    certificates.push(certificate);
    localStorage.setItem('user_certificates', JSON.stringify(certificates));
    
    // Also ensure certificate is saved to the user's vault
    saveCertificateToVault(certificate);
    
    toast({
      title: "Certificate Generated",
      description: "Your blockchain certificate has been successfully created and stored in your QwixVault."
    });
    
    navigate("/dashboard");
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading certification test...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (showCertificateGenerator && testInfo) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <CertificateGenerator
            testId={testInfo.id}
            testTitle={testInfo.title}
            score={testScore}
            onComplete={handleCertificateComplete}
          />
        </div>
      </MainLayout>
    );
  }
  
  if (testCompleted && testInfo) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <TestResults
            testId={testInfo.id}
            testTitle={testInfo.title}
            score={testScore}
            passingScore={testInfo.passingScore}
            questions={testQuestions}
            userAnswers={userAnswers}
            onGenerate={handleGenerateCertificate}
            onRetry={handleRetryTest}
          />
        </div>
      </MainLayout>
    );
  }
  
  if (testInfo && testQuestions.length > 0) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{testInfo.title}</h1>
            <p className="text-muted-foreground">{testInfo.description}</p>
          </div>
          
          <MCQTest
            testId={testInfo.id}
            testTitle={testInfo.title}
            questions={testQuestions}
            timeLimit={testInfo.timeLimit}
            passingScore={testInfo.passingScore}
            onTestComplete={handleTestComplete}
          />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Test Not Available
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">The requested test could not be found</h2>
            <p className="text-muted-foreground mb-6">
              This certification test may have been removed or is temporarily unavailable.
            </p>
            <Button onClick={() => navigate('/certification-center')}>
              Return to Certification Center
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CertificationTest;
