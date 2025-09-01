import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Award,
  Search,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Shield,
  ExternalLink,
  Share2,
  Download,
  Loader2,
  QrCode,
  Copy
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { verifyCertificateByHash } from '@/utils/blockchainDocuments';
import { generateCertificatePDF, shareCertificate } from '@/utils/blockchain';
import QRCode from 'qrcode.react';

const CertificateVerification = () => {
  const { certHash } = useParams<{ certHash?: string }>();
  const [searchHash, setSearchHash] = useState(certHash || '');
  const [certificate, setCertificate] = useState<any | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (certHash) {
      setSearchHash(certHash);
      verifyCertificate(certHash);
    }
  }, [certHash]);
  
  const verifyCertificate = async (hash: string) => {
    setIsLoading(true);
    
    // Add a slight delay to simulate blockchain verification
    setTimeout(() => {
      try {
        // Call the verification function
        const certificateData = verifyCertificateByHash(hash);
        
        if (certificateData) {
          setCertificate(certificateData);
          setIsVerified(true);
          
          toast({
            title: "Certificate Verified",
            description: "This certificate has been successfully verified on the blockchain",
            variant: "default",
          });
        } else {
          setCertificate(null);
          setIsVerified(false);
          
          toast({
            title: "Verification Failed",
            description: "Could not verify this certificate",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Certificate verification error:", error);
        setCertificate(null);
        setIsVerified(false);
        
        toast({
          title: "Error",
          description: "An error occurred during certificate verification",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };
  
  const handleVerify = () => {
    if (!searchHash.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a certificate hash",
        variant: "destructive",
      });
      return;
    }
    
    verifyCertificate(searchHash.trim());
  };
  
  const handleDownload = async () => {
    if (!certificate) return;
    
    setIsGenerating(true);
    
    try {
      const pdfUrl = await generateCertificatePDF(certificate);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${certificate.title.replace(/\s+/g, '-')}-${certificate.certHash}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Certificate Downloaded",
        description: "Certificate PDF has been downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the certificate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleShare = async () => {
    if (!certificate) return;
    
    try {
      const result = await shareCertificate(certificate);
      
      if (result) {
        toast({
          title: "Certificate Shared",
          description: "Certificate verification link has been shared/copied",
        });
      } else {
        toast({
          title: "Share Failed",
          description: "Failed to share the certificate",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sharing certificate:", error);
      toast({
        title: "Share Failed",
        description: "Failed to share the certificate",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const verificationUrl = certificate ? 
    `${window.location.origin}/verify-cert/${certificate.certHash}` : '';
  
  return (
    <Layout>
      <div className="container max-w-4xl py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Certificate Verification</h1>
          <p className="text-muted-foreground">
            Verify the authenticity of blockchain-secured certificates
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Verify Certificate
            </CardTitle>
            <CardDescription>
              Enter a certificate hash to verify its authenticity on the blockchain
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter certificate hash..."
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleVerify} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Verify
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {isVerified === true && certificate && (
          <Card className="border-green-200">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-100 text-green-700 rounded-full p-2">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            
            <CardHeader className="pt-8 pb-2">
              <div className="text-center">
                <CardTitle className="text-xl text-green-700">Certificate Verified</CardTitle>
                <CardDescription>
                  This certificate is valid and has been verified on the blockchain
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h2 className="text-2xl font-bold">{certificate.title}</h2>
                  <p className="text-muted-foreground">
                    Score: <span className="font-bold">{certificate.score}%</span>
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Recipient</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <p className="font-medium">{certificate.holderName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{certificate.holderEmail}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Issued On</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <p className="font-medium">{formatDate(certificate.issuedDate)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Issuer</p>
                      <p className="font-medium">{certificate.issuerName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Certificate ID</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm truncate">{certificate.certHash}</p>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(certificate.certHash)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Blockchain Transaction</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm truncate">{certificate.txHash.substring(0, 10)}...</p>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(certificate.txHash)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">QwixVault ID</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm truncate">{certificate.vaultId}</p>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(certificate.vaultId)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center py-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Verification QR Code</p>
                  <div className="bg-white p-3 border rounded">
                    <QRCode
                      value={verificationUrl}
                      size={150}
                      level="H"
                      renderAs="svg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download Certificate
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Certificate
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/50 p-4 text-center text-sm text-muted-foreground">
              <div className="flex flex-col items-center w-full">
                <p>
                  This certificate is secured on the blockchain and cannot be tampered with.
                </p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-primary hover:underline mt-1"
                >
                  Learn more about blockchain verification
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </div>
            </CardFooter>
          </Card>
        )}
        
        {isVerified === false && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              The certificate could not be verified. Please check the hash and try again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  );
};

export default CertificateVerification;
