import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, QrCode, Loader2, Fingerprint } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { useBlockchain } from '@/context/BlockchainContext';
import DocumentUploadPreview from './DocumentUploadPreview';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainDocument, DocumentUploadParams } from '@/types/blockchain';
import { useAuth } from '@/context/AuthContext';
import { saveDocumentToUserVault } from '@/utils/blockchainDocuments';

interface DocumentUploaderProps {
  onUploadComplete: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadComplete }) => {
  const [documentName, setDocumentName] = useState('');
  const [documentDesc, setDocumentDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uniqueId, setUniqueId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { account, uploadDocumentToIPFS, mintDocumentAsNFT } = useBlockchain();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, PNG, or JPEG file",
          variant: "destructive"
        });
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
      
      if (!documentName) {
        const filename = selectedFile.name.split('.').slice(0, -1).join('.');
        setDocumentName(filename);
      }
      
      const newUniqueId = `QM-${Date.now().toString(36)}-${uuidv4().substring(0, 8)}`;
      setUniqueId(newUniqueId);
    }
  };
  
  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    setUniqueId('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 300);
    
    return interval;
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!documentName.trim()) {
      toast({
        title: "Missing document name",
        description: "Please provide a name for your document",
        variant: "destructive"
      });
      return;
    }
    
    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your QwixVault first",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please login to upload documents",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const progressInterval = simulateUploadProgress();
      
      // Create metadata object
      const metadata = {
        fileName: documentName,
        description: documentDesc,
        ownerAddress: account
      };
      
      // Upload to IPFS
      const ipfsResult = await uploadDocumentToIPFS(file, metadata);
      
      // Mint as NFT
      const mintResult = await mintDocumentAsNFT(ipfsResult.ipfsUri, uniqueId);
      
      // Create document object
      const newDocument: BlockchainDocument = {
        uniqueId: uniqueId,
        fileName: documentName,
        description: documentDesc,
        fileType: file.type,
        fileSize: file.size,
        timestamp: new Date().toISOString(),
        ownerAddress: account,
        blockchainHash: mintResult.txHash,
        ipfsUri: ipfsResult.ipfsUri,
        verificationUrl: mintResult.verificationUrl,
        isVerified: true,
        tokenId: mintResult.tokenId
      };
      
      // Save to user's vault in storage
      const saved = saveDocumentToUserVault(user.email, newDocument);
      
      if (!saved) {
        throw new Error("Failed to save document to vault");
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Document secured with unique identity",
        description: `Your document "${documentName}" has been secured on the blockchain with ID: ${uniqueId}`,
      });
      
      setTimeout(() => {
        setDocumentName('');
        setDocumentDesc('');
        clearFile();
        setIsUploading(false);
        setUploadProgress(0);
        onUploadComplete();
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document",
        variant: "destructive"
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="space-y-6">
      <DocumentUploadPreview 
        file={file}
        filePreview={filePreview}
        clearFile={clearFile}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />
      
      {uniqueId && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center mb-2">
            <Fingerprint className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Unique Document Identity</h3>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 font-mono mb-2">{uniqueId}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            This unique ID will be permanently linked to your document on the blockchain and can be used for verification.
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Document File</Label>
          <div className="mt-1">
            <Button
              type="button"
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center border-dashed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-5 w-5 mb-2" />
              {file ? file.name : "Upload a PDF, PNG, or JPEG file"}
              <span className="text-xs text-muted-foreground mt-1">
                Max file size: 5MB
              </span>
            </Button>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document-name">Document Name</Label>
          <Input
            id="document-name"
            placeholder="e.g., Resume, Certificate, Transcript"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            maxLength={50}
            disabled={isUploading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document-desc">Description (Optional)</Label>
          <Textarea
            id="document-desc"
            placeholder="e.g., University degree certificate, Work experience letter"
            value={documentDesc}
            onChange={(e) => setDocumentDesc(e.target.value)}
            rows={3}
            maxLength={200}
            disabled={isUploading}
          />
        </div>
        
        <Button 
          className="w-full"
          onClick={handleUpload}
          disabled={isUploading || !file || !documentName.trim()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Securing with blockchain identity...
            </>
          ) : (
            <>
              <QrCode className="mr-2 h-4 w-4" />
              Secure with Blockchain Identity
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
