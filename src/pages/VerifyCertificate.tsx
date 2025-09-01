
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Search, Shield } from "lucide-react";

const VerifyCertificate: React.FC = () => {
  const { certHash } = useParams<{ certHash: string }>();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'invalid'>('pending');
  const [searchInput, setSearchInput] = useState(certHash || '');
  const [certificate, setCertificate] = useState<any>(null);
  
  // Simulate verification process
  useEffect(() => {
    if (certHash) {
      handleVerify();
    }
  }, [certHash]);
  
  const handleVerify = () => {
    // Mock verification - in a real app, this would check against blockchain
    setVerificationStatus('pending');
    
    setTimeout(() => {
      if (searchInput && searchInput.length > 8) {
        setVerificationStatus('verified');
        setCertificate({
          id: 'cert-123',
          title: "Full Stack Web Development",
          recipientName: "John Smith",
          issueDate: "2023-05-15",
          issuer: "QwiXEd360°",
          skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
        });
      } else {
        setVerificationStatus('invalid');
        setCertificate(null);
      }
    }, 1500);
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Certificate Verification</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Verify the authenticity of certificates issued by QwiXEd360° using blockchain verification.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Verify Certificate</CardTitle>
          <CardDescription>Enter a certificate ID or hash to verify its authenticity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter certificate ID or hash" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleVerify}>
              <Search className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {verificationStatus === 'pending' && certHash && (
        <Card className="mt-6">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-e-transparent"></div>
              <p className="mt-4 text-muted-foreground">Verifying certificate on blockchain...</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {verificationStatus === 'verified' && certificate && (
        <Card className="mt-6 border-green-200">
          <CardHeader className="bg-green-50 text-green-700 rounded-t-lg">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
              <CardTitle>Certificate Verified</CardTitle>
            </div>
            <CardDescription className="text-green-600">
              This certificate has been verified on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg">{certificate.title}</h3>
                <p className="text-sm text-muted-foreground">Issued to: <span className="font-medium">{certificate.recipientName}</span></p>
                <p className="text-sm text-muted-foreground">Issue Date: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">Issuer: {certificate.issuer}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Verified Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {certificate.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50">
            <div className="text-xs text-muted-foreground">
              Blockchain Verification ID: {certHash || '0x3a8d7c546f4e9c8a7b8f5e8c9d0a1b2c3d4e5f6a'}
            </div>
          </CardFooter>
        </Card>
      )}
      
      {verificationStatus === 'invalid' && (
        <Card className="mt-6 border-red-200">
          <CardHeader className="bg-red-50 text-red-700 rounded-t-lg">
            <div className="flex items-center">
              <XCircle className="h-6 w-6 mr-2 text-red-600" />
              <CardTitle>Verification Failed</CardTitle>
            </div>
            <CardDescription className="text-red-600">
              We could not verify this certificate on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>The certificate ID or hash you provided could not be verified. Please check the information and try again.</p>
            <ul className="list-disc list-inside mt-4 text-sm text-muted-foreground space-y-1">
              <li>Make sure you entered the correct certificate ID or hash</li>
              <li>Check for any typos or missing characters</li>
              <li>If you received this link directly, contact the sender to verify</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerifyCertificate;
