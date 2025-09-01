
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, CheckCircle, XCircle, Calendar, FileText, Fingerprint, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBlockchain } from "@/context/BlockchainContext";
import { verifyDocument } from "@/utils/blockchain";
import { BlockchainDocument, DocumentVerification } from "@/types/blockchain";

interface DocumentVerifierProps {
  uniqueId?: string;
}

const DocumentVerifier = ({ uniqueId: initialUniqueId }: DocumentVerifierProps) => {
  const [documentId, setDocumentId] = useState(initialUniqueId || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<DocumentVerification | null>(null);
  const [document, setDocument] = useState<BlockchainDocument | null>(null);
  const { toast } = useToast();
  const { verifyDocument: blockchainVerifyDocument } = useBlockchain();
  
  useEffect(() => {
    if (initialUniqueId) {
      setDocumentId(initialUniqueId);
      handleVerify();
    }
  }, [initialUniqueId]);
  
  const handleVerify = async () => {
    if (!documentId.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a document ID to verify.",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    setVerificationResult(null);
    setDocument(null);
    
    try {
      // First try to use blockchain context if available
      let result;
      
      if (blockchainVerifyDocument) {
        result = await blockchainVerifyDocument(documentId.trim());
      } else {
        // Fall back to utility function for public verification without login
        result = await verifyDocument(documentId.trim());
      }
      
      setVerificationResult(result);
      
      if (result.isValid && result.document) {
        setDocument(result.document);
        
        toast({
          title: "Verification Successful",
          description: "This document has been verified on the blockchain.",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: result.error || "Could not verify this document.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        isValid: false,
        error: "An error occurred during verification."
      });
      
      toast({
        title: "Error",
        description: "An error occurred during document verification.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Document Verification
          </CardTitle>
          <CardDescription>
            Verify the authenticity of blockchain-secured documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter document ID or hash..."
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              className="flex-1"
              disabled={isVerifying}
            />
            <Button onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {verificationResult && (
        <Card className={verificationResult.isValid ? "border-green-200" : "border-red-200"}>
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className={`rounded-full p-2 ${verificationResult.isValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {verificationResult.isValid ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
            </div>
          </div>
          
          <CardHeader className="pt-8">
            <CardTitle className={verificationResult.isValid ? "text-green-700" : "text-red-700"}>
              {verificationResult.isValid ? "Document Verified" : "Verification Failed"}
            </CardTitle>
            <CardDescription>
              {verificationResult.isValid 
                ? "This document is authentic and has been verified on the blockchain"
                : verificationResult.error || "This document could not be verified"}
            </CardDescription>
          </CardHeader>
          
          {verificationResult.isValid && document && (
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{document.fileName}</h3>
                    <p className="text-sm text-muted-foreground">{document.fileType}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Document ID</p>
                    <p className="font-mono">{document.uniqueId}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Timestamp</p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(document.timestamp)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">Blockchain Hash</p>
                    <p className="font-mono text-xs truncate">{document.blockchainHash}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground mb-1">IPFS URI</p>
                    <p className="font-mono text-xs truncate">{document.ipfsUri}</p>
                  </div>
                </div>
                
                {document.description && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-muted-foreground mb-1">Description</p>
                    <p>{document.description}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                <Fingerprint className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium mb-1">Blockchain Verification Successful</p>
                  <p className="text-green-700 text-sm">
                    This document has been cryptographically verified on the blockchain. 
                    Its contents are authentic and have not been tampered with since being registered.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default DocumentVerifier;
