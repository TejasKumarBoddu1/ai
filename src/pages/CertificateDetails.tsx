
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const CertificateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mock certificate data
  const certificate = {
    id: id || 'cert-123',
    title: "Full Stack Web Development",
    issueDate: "2023-05-15",
    expiration: "2025-05-15",
    issuer: "QwiXEd360°",
    skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
    description: "This certificate validates expertise in building full-stack web applications using modern JavaScript frameworks and tools. The recipient has demonstrated proficiency in both frontend and backend development.",
    verifiedOnChain: true,
    blockchainTxId: "0x3a8d7c546f4e9c8a7b8f5e8c9d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    imageUrl: "https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Full+Stack+Certificate"
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{certificate.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-0">
              <img 
                src={certificate.imageUrl} 
                alt={certificate.title} 
                className="w-full h-auto border-b"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                {certificate.verifiedOnChain && (
                  <Badge className="mr-2">Blockchain Verified</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  Issued on {new Date(certificate.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Issued By</h3>
                <p>{certificate.issuer}</p>
              </div>
              <div>
                <h3 className="font-medium">Issue Date</h3>
                <p>{new Date(certificate.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-medium">Valid Until</h3>
                <p>{new Date(certificate.expiration).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-medium">Blockchain Verification</h3>
                <p className="text-xs text-muted-foreground break-all">
                  {certificate.blockchainTxId}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Verified Skills</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {certificate.skills.map(skill => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{certificate.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;
