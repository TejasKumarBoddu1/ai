
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useBlockchain } from '@/context/BlockchainContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, FileText, Download, Share2, Fingerprint, Shield, RefreshCw, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import QRCode from 'qrcode.react';
import DocumentVerifier from './DocumentVerifier';
import type { BlockchainDocument } from '@/types/blockchain';
import { Skeleton } from '@/components/ui/skeleton';

const DocumentsDashboard: React.FC = () => {
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<BlockchainDocument | null>(null);
  const [activeTab, setActiveTab] = useState('documents');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { account, getUserDocuments } = useBlockchain();
  
  // Memoize document loading to prevent unnecessary rerenders
  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const userDocs = await getUserDocuments();
      setDocuments(userDocs);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getUserDocuments]);

  useEffect(() => {
    // Add a small timeout to avoid UI freeze
    const timer = setTimeout(() => {
      loadDocuments();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [loadDocuments, account]);

  const handleDocumentClick = useCallback((doc: BlockchainDocument) => {
    setSelectedDocument(doc);
    
    const verificationUrl = doc.verificationUrl || `${window.location.origin}/verify-document/${doc.uniqueId}`;
    setQrCodeUrl(verificationUrl);
    
    setActiveTab('details');
  }, []);
  
  const formatBytes = useMemo(() => (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);
  
  const formatDate = useMemo(() => (dateString: string) => {
    return new Date(dateString).toLocaleString();
  }, []);
  
  const formatFileType = useMemo(() => (fileType: string) => {
    if (fileType.includes('pdf')) return 'PDF Document';
    if (fileType.includes('png')) return 'PNG Image';
    if (fileType.includes('jpeg') || fileType.includes('jpg')) return 'JPEG Image';
    return fileType;
  }, []);
  
  const handleDownload = useCallback((doc: BlockchainDocument) => {
    alert(`Downloading ${doc.fileName} from IPFS: ${doc.ipfsUri}`);
  }, []);
  
  const handleShare = useCallback((doc: BlockchainDocument) => {
    const verificationUrl = doc.verificationUrl || `${window.location.origin}/verify-document/${doc.uniqueId}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Verify: ${doc.fileName}`,
        text: 'Verify this blockchain-secured document',
        url: verificationUrl,
      });
    } else {
      navigator.clipboard.writeText(verificationUrl);
      alert('Verification link copied to clipboard');
    }
  }, []);
  
  const getStatusColor = useMemo(() => (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'revoked': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  }, []);

  // Loading state components
  const DocumentSkeleton = () => (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="h-28 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="h-14 w-14 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
      <div className="p-3">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2 mb-2"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-4">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            My Documents
          </TabsTrigger>
          <TabsTrigger value="verify" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Verify Documents
          </TabsTrigger>
          {selectedDocument && (
            <TabsTrigger value="details" className="flex items-center">
              <Fingerprint className="h-4 w-4 mr-2" />
              Document Details
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Blockchain Documents</h3>
            <Button variant="outline" size="sm" onClick={loadDocuments} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <DocumentSkeleton key={i} />)}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">You don't have any documents stored yet</p>
              <p className="text-sm text-muted-foreground mt-1">Upload documents to secure them on the blockchain</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div 
                  key={doc.uniqueId} 
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className="h-28 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                    <FileText className="h-14 w-14 text-slate-400" />
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium truncate">{doc.fileName}</h4>
                      <div className="flex-shrink-0 ml-2">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor('verified')}`}></div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {formatFileType(doc.fileType)} • {formatBytes(doc.fileSize)}
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span title={doc.timestamp}>{formatDate(doc.timestamp)}</span>
                      <Badge variant="outline" className="truncate max-w-[100px]">
                        ID: {doc.uniqueId.substring(0, 8)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="verify">
          <DocumentVerifier />
        </TabsContent>
        
        <TabsContent value="details">
          {isLoading && !selectedDocument ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-60 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
            </div>
          ) : selectedDocument && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="border p-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4">
                    <FileText className="h-20 w-20 text-slate-400" />
                  </div>
                  
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <div className="border p-3 rounded bg-white w-full text-center">
                      <h4 className="text-sm font-medium mb-2">Document QR Verification</h4>
                      <QRCode 
                        value={qrCodeUrl}
                        size={150}
                        renderAs="svg" 
                        className="mx-auto"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Scan to verify this document
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 w-full">
                      <Button 
                        onClick={() => handleDownload(selectedDocument)} 
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        onClick={() => handleShare(selectedDocument)}
                        className="flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">{selectedDocument.fileName}</h3>
                    {selectedDocument.description && (
                      <p className="text-muted-foreground mb-4">{selectedDocument.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Document Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">File Type:</span>
                            <span className="text-sm font-medium">{formatFileType(selectedDocument.fileType)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">File Size:</span>
                            <span className="text-sm font-medium">{formatBytes(selectedDocument.fileSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Uploaded On:</span>
                            <span className="text-sm font-medium">{formatDate(selectedDocument.timestamp)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Unique ID:</span>
                            <span className="text-sm font-mono">{selectedDocument.uniqueId}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Blockchain Info</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Status:</span>
                            <Badge className="bg-green-600">Verified</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Owner:</span>
                            <span className="text-sm font-mono truncate max-w-[180px]" title={selectedDocument.ownerAddress}>
                              {selectedDocument.ownerAddress.substring(0, 6)}...{selectedDocument.ownerAddress.substring(selectedDocument.ownerAddress.length - 4)}
                            </span>
                          </div>
                          {selectedDocument.tokenId && (
                            <div className="flex justify-between">
                              <span className="text-sm">Token ID:</span>
                              <span className="text-sm font-medium">{selectedDocument.tokenId}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm">TX Hash:</span>
                            <span className="text-sm font-mono truncate max-w-[180px]" title={selectedDocument.blockchainHash}>
                              {selectedDocument.blockchainHash.substring(0, 6)}...{selectedDocument.blockchainHash.substring(selectedDocument.blockchainHash.length - 4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Fingerprint className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">Blockchain Verification</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      This document has been secured on the blockchain with a unique identity. Anyone can verify its authenticity using the QR code or unique ID without requiring access to the original file.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
                      <p className="text-blue-700 dark:text-blue-300">
                        <strong>Verification URL:</strong> 
                        <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" className="ml-1 font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                          {qrCodeUrl}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsDashboard;
