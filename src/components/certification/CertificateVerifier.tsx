import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Search, QrCode, AlertCircle, CheckCircle, XCircle, Loader2, 
  ExternalLink, Info, Calendar, FileText, Download, Share2, File, Upload
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Certificate, BlockchainTransaction, VerificationMethod } from "@/types/certification";
import { verifyCertificate, verifyCertificateFromFile, generateCertificatePDF, shareCertificate, getUserCertificates } from "@/utils/blockchain";
import QRCode from 'qrcode.react';

interface CertificateVerifierProps {
  initialHash?: string;
}

const CertificateVerifier = ({ initialHash }: CertificateVerifierProps) => {
  const [certHash, setCertHash] = useState(initialHash || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('certHash');
  const [activeTab, setActiveTab] = useState('input');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const [result, setResult] = useState<{
    isValid: boolean;
    certificate?: Certificate;
    transaction?: BlockchainTransaction;
    error?: string;
  } | null>(null);
  
  const { toast } = useToast();

  // Debug log certificates when component mounts
  useEffect(() => {
    const certificates = getUserCertificates();
    console.log("Available certificates:", certificates);
    console.log("Initial hash:", initialHash);
  }, [initialHash]);

  // Auto-verify if initialHash is provided
  useEffect(() => {
    if (initialHash && initialHash.trim() !== '') {
      console.log("Auto-verifying with hash:", initialHash);
      handleVerify();
    }
  }, [initialHash]);

  const handleVerify = async () => {
    if (!certHash.trim()) {
      toast({
        title: "Error",
        description: "Please enter a certificate identifier",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    setResult(null);
    
    try {
      console.log("Verifying with:", { certHash, method: verificationMethod });
      
      // Clean up the certHash to remove any whitespace
      const cleanCertHash = certHash.trim();
      
      // Only use valid verification methods for the verifyCertificate function
      const validMethod = verificationMethod === 'file' ? 'certHash' : verificationMethod;
      const verificationResult = await verifyCertificate(cleanCertHash, validMethod);
      
      console.log("Verification result:", verificationResult);
      setResult(verificationResult);
      
      if (!verificationResult.isValid) {
        toast({
          title: "Verification Failed",
          description: verificationResult.error || "Could not verify this certificate",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Certificate Verified",
          description: "This certificate has been successfully verified on the blockchain",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setResult({
        isValid: false,
        error: "Failed to verify the certificate. Try again later."
      });
      
      toast({
        title: "Verification Error",
        description: "An error occurred during verification",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a certificate file",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setResult(null);
    
    try {
      const verificationResult = await verifyCertificateFromFile(selectedFile);
      setResult(verificationResult);
      
      if (!verificationResult.isValid) {
        toast({
          title: "Verification Failed",
          description: verificationResult.error || "Could not verify this certificate file",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Certificate Verified",
          description: "This certificate file has been successfully verified",
        });
      }
    } catch (error) {
      setResult({
        isValid: false,
        error: "Failed to verify the certificate file. Try again later."
      });
      
      toast({
        title: "Verification Error",
        description: "An error occurred during file verification",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!result?.certificate) return;
    
    setIsDownloading(true);
    
    try {
      const fileName = `${result.certificate.title.replace(/\s+/g, '_')}_Certificate.pdf`;
      await generateCertificatePDF('certificate-card', fileName);
      
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been downloaded as a PDF",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download certificate as PDF",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleShareCertificate = async () => {
    if (!result?.certificate) return;
    
    setIsSharing(true);
    
    try {
      const success = await shareCertificate(result.certificate);
      
      if (success) {
        toast({
          title: "Certificate Shared",
          description: "Your certificate has been shared successfully",
        });
      } else {
        // Fallback to copy link if Web Share API is not supported
        const verificationUrl = `${window.location.origin}/verify-cert/${result.certificate.certHash}`;
        await navigator.clipboard.writeText(verificationUrl);
        
        toast({
          title: "Link Copied",
          description: "Certificate verification link copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share certificate",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const verificationMethodOptions = [
    { value: 'certHash', label: 'Certificate Hash' },
    { value: 'txHash', label: 'Transaction Hash' },
    { value: 'blockId', label: 'Block ID' },
    { value: 'uniqueId', label: 'Certificate ID' }
  ];

  const baseUrl = window.location.origin.replace(/\/+$/, '');
  const verificationUrl = result?.certificate 
    ? `${baseUrl}/verify-cert/${result.certificate.certHash}` 
    : `${baseUrl}/verify-cert`;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <div className="flex items-center justify-center mb-3">
          <Shield className="h-7 w-7 text-green-600 mr-2" />
          <CardTitle>Certificate Verification</CardTitle>
        </div>
        <CardDescription>
          Verify the authenticity of a QwiXCertChain certificate using blockchain technology
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="input" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Verify by ID/Hash
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Verify Certificate File
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="md:col-span-1">
                  <Select 
                    value={verificationMethod} 
                    onValueChange={(value) => setVerificationMethod(value as VerificationMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {verificationMethodOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Input 
                    placeholder={`Enter ${verificationMethodOptions.find(m => m.value === verificationMethod)?.label}...`} 
                    value={certHash}
                    onChange={(e) => setCertHash(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleVerify} disabled={isVerifying} className="flex-1">
                    {isVerifying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowQR(!showQR)}>
                    <QrCode className="h-4 w-4" />
                    <span className="sr-only">Scan QR</span>
                  </Button>
                </div>
              </div>
              
              {showQR && !result?.certificate && (
                <div className="flex flex-col items-center justify-center space-y-3 p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">Scan a QR code to verify a certificate</p>
                  <div className="bg-white p-3 rounded-lg border">
                    <QRCode value={verificationUrl || "https://qwikzen.com/verify-certificate"} size={150} />
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4 pt-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <input
                  type="file"
                  id="certificate-file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="certificate-file" 
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <File className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Drop certificate file or click to browse</p>
                  <p className="text-xs text-muted-foreground">
                    Upload a QwiXCert certificate PDF to verify
                  </p>
                </label>
                
                {selectedFile && (
                  <div className="mt-4 text-sm">
                    <Badge variant="outline" className="bg-blue-50">
                      {selectedFile.name}
                    </Badge>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleFileUpload} 
                disabled={isUploading || !selectedFile}
                className="w-full"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Verify Certificate File
              </Button>
            </TabsContent>
          </Tabs>
          
          {result && (
            <div className="mt-6">
              {result.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Error</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              ) : result.isValid ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Certificate Verified</AlertTitle>
                    <AlertDescription className="text-green-700">
                      This certificate is authentic and has been verified on the blockchain.
                    </AlertDescription>
                  </Alert>
                  
                  {result.certificate && (
                    <>
                      <div className="flex justify-end gap-2 mb-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleShareCertificate}
                          disabled={isSharing}
                        >
                          {isSharing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Share2 className="h-4 w-4 mr-2" />
                          )}
                          Share
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleDownloadPDF}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Download PDF
                        </Button>
                      </div>
                      
                      <Card className="overflow-hidden" id="certificate-card" ref={certificateRef}>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-6 text-white">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">QwiXCertChain</h2>
                            <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                              Blockchain Verified
                            </Badge>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">{result.certificate.title}</h3>
                          <p className="opacity-90">Awarded to</p>
                          <p className="text-xl font-semibold mb-3">{result.certificate.recipientName}</p>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-xs opacity-80">Issued By</p>
                              <p className="font-medium">{result.certificate.issuer}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-80">Issue Date</p>
                              <p className="font-medium">{formatDate(result.certificate.issuedDate)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Certificate Details</h4>
                                <div className="space-y-2 mt-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Recipient:</span>
                                    <span className="text-sm">{result.certificate.recipientName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Email:</span>
                                    <span className="text-sm">{result.certificate.recipientEmail}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Score:</span>
                                    <span className="text-sm">{result.certificate.score}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Issued On:</span>
                                    <span className="text-sm">{formatDate(result.certificate.issuedDate)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Certificate ID:</span>
                                    <span className="text-sm font-mono">{result.certificate.uniqueId}</span>
                                  </div>
                                  {result.certificate.validUntil && (
                                    <div className="flex justify-between">
                                      <span className="text-sm font-medium">Valid Until:</span>
                                      <span className="text-sm">{formatDate(result.certificate.validUntil)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Blockchain Verification</h4>
                                <div className="space-y-2 mt-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Network:</span>
                                    <span className="text-sm">{result.certificate.blockchainNetwork}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Transaction:</span>
                                    <a 
                                      href={`https://polygonscan.com/tx/${result.certificate.txHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm font-mono flex items-center"
                                    >
                                      {result.certificate.txHash.substring(0, 6)}...
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Block ID:</span>
                                    <a 
                                      href={`https://polygonscan.com/block/${result.certificate.blockId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm font-mono flex items-center"
                                    >
                                      {result.certificate.blockId}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Contract:</span>
                                    <a 
                                      href={`https://polygonscan.com/address/${result.certificate.contractAddress}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm font-mono flex items-center"
                                    >
                                      {result.certificate.contractAddress?.substring(0, 6)}...
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </div>
                                  {result.certificate.smartContractStandard && (
                                    <div className="flex justify-between">
                                      <span className="text-sm font-medium">Standard:</span>
                                      <span className="text-sm">{result.certificate.smartContractStandard}</span>
                                    </div>
                                  )}
                                  {result.transaction && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">Confirmations:</span>
                                        <span className="text-sm">{result.transaction.confirmations}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">Status:</span>
                                        <Badge variant={result.transaction.status === 'confirmed' ? 'default' : 'outline'} className="text-xs">
                                          {result.transaction.status}
                                        </Badge>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-center">
                            <div className="text-center">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Verification QR Code</h4>
                              <div className="bg-white p-3 rounded-lg border inline-block">
                                <QRCode value={verificationUrl} size={150} />
                                <p className="text-xs text-muted-foreground mt-2">Scan to verify certificate</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>How to Verify</AlertTitle>
                        <AlertDescription>
                          This certificate has been cryptographically secured on the {result.certificate.blockchainNetwork}.
                          You can verify its authenticity by checking the transaction on{' '}
                          <a 
                            href={`https://polygonscan.com/tx/${result.certificate.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Polygonscan
                          </a>.
                        </AlertDescription>
                      </Alert>
                    </>
                  )}
                </div>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Invalid Certificate</AlertTitle>
                  <AlertDescription>
                    This certificate could not be verified. It may be invalid or tampered with.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        <div className="w-full h-px bg-border"></div>
        <div className="text-sm text-muted-foreground text-center">
          QwiXCertChain uses blockchain technology to ensure certificates are tamper-proof and verifiable.
          Each certificate is minted as a digital asset on the blockchain network.
        </div>
      </CardFooter>
    </Card>
  );
};

export default CertificateVerifier;
