
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Award, CheckCircle, FileCheck, User, Mail, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Certificate } from "@/types/blockchain";
import { generateCertificate } from "@/utils/blockchain";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlockchain } from "@/context/BlockchainContext";
import { useAuth } from "@/context/AuthContext";

interface CertificateGeneratorProps {
  testId: string;
  testTitle: string;
  score: number;
  onComplete: (certificate: Certificate) => void;
}

const CertificateGenerator = ({ testId, testTitle, score, onComplete }: CertificateGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const { toast } = useToast();
  const { saveCertificateToVault, generateCertificate: generateBlockchainCertificate } = useBlockchain();
  const { user } = useAuth();
  
  const steps = [
    "Preparing certificate data",
    "Creating blockchain transaction",
    "Waiting for confirmation",
    "Minting NFT certificate",
    "Finalizing certificate"
  ];

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    // Validate form
    if (!recipientName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name for the certificate.",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    setStep(0);
    
    try {
      // Step 1: Prepare certificate data
      await simulateStep(1);
      
      // Step 2: Create blockchain transaction
      await simulateStep(2);
      
      // Step 3: Wait for confirmation
      await simulateStep(3);
      
      // Step 4: Mint NFT certificate
      await simulateStep(4);
      
      // Step 5: Finalize certificate
      await simulateStep(5);
      
      // Generate the certificate using blockchain
      let certificate;
      
      // Try to use the blockchain context first for proper activity tracking
      if (generateBlockchainCertificate) {
        certificate = await generateBlockchainCertificate(
          testId,
          score,
          testTitle
        );
      } 
      
      // If blockchain generation failed or not available, use the utility function
      if (!certificate) {
        certificate = await generateCertificate(
          testId, 
          testTitle, 
          score, 
          recipientName,
          recipientEmail
        );
        
        // Save to vault manually if using utility function
        if (certificate) {
          await saveCertificateToVault(certificate);
        }
      }
      
      if (!certificate) {
        throw new Error("Failed to generate certificate");
      }
      
      toast({
        title: "Certificate Generated",
        description: "Your blockchain certificate has been successfully created!",
      });
      
      // Pass the certificate back
      onComplete(certificate);
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate your certificate. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };
  
  const simulateStep = async (stepNumber: number) => {
    setStep(stepNumber - 1);
    const baseProgress = (stepNumber - 1) * 20;
    
    // Simulate progress within step
    for (let i = 0; i < 20; i += 4) {
      setProgress(baseProgress + i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  // Prefill with user data if available
  React.useEffect(() => {
    if (user) {
      setRecipientName(user.name || "");
      setRecipientEmail(user.email || "");
    }
  }, [user]);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Award className="h-6 w-6 text-modern-blue-500 mr-2" />
          Generate Blockchain Certificate
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{testTitle}</h3>
          <p className="text-muted-foreground">
            Congratulations on passing with a score of {score}%! 
            Generate your verifiable blockchain certificate to showcase your achievement.
          </p>
        </div>
        
        {!isGenerating && (
          <div className="space-y-4 border p-4 rounded-md">
            <h4 className="font-medium">Certificate Information</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex">
                  <User className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
                  <Input 
                    id="name" 
                    value={recipientName} 
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isGenerating}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex">
                  <Mail className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
                  <Input 
                    id="email" 
                    type="email"
                    value={recipientEmail} 
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={isGenerating}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded p-3 text-sm text-blue-700">
                <div className="flex">
                  <FileText className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                  <span>
                    This information will be used to generate your certificate and cannot be changed after issuance.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isGenerating && (
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            
            <div className="space-y-2">
              {steps.map((stepText, idx) => (
                <div key={idx} className="flex items-center">
                  {idx < step ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : idx === step ? (
                    <Loader2 className="h-5 w-5 text-modern-blue-500 animate-spin mr-2" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-gray-300 mr-2" />
                  )}
                  <span className={idx <= step ? "text-gray-900" : "text-gray-400"}>
                    {stepText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          <p className="flex items-start">
            <FileCheck className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <span>
              Your certificate will be permanently recorded on the Polygon blockchain, making it tamper-proof 
              and allowing employers to verify its authenticity with a simple link or QR code.
            </span>
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Certificate...
            </>
          ) : (
            <>
              <Award className="mr-2 h-4 w-4" />
              Generate My Certificate
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateGenerator;
