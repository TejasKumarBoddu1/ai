import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, Upload, X, Download, CheckCircle, File as FileIcon, Plus, Search,
  Copy, Link, AlertTriangle, RefreshCcw, Check, X as XIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Filter } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'pending' | 'verified' | 'rejected';
  hash?: string;
  uploaded: string;
}

const BlockchainVerification = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Filter for only PDF and Word documents
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    );
    
    if (validFiles.length < files.length) {
      toast({
        title: "Invalid files",
        description: "Some files were skipped. Only PDF and Word documents are supported.",
        variant: "warning"
      });
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          simulateVerification();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const simulateVerification = () => {
    setIsUploading(false);
    setIsVerifying(true);
    
    // Mock document data after delay to simulate processing
    setTimeout(() => {
      const mockDocuments: Document[] = uploadedFiles.map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(0) + ' KB',
        status: Math.random() > 0.8 ? 'rejected' : 'verified',
        hash: '0x' + Math.random().toString(36).substring(2, 15),
        uploaded: new Date().toLocaleDateString()
      }));
      
      setDocuments(mockDocuments);
      setIsVerifying(false);
      
      toast({
        title: "Verification complete",
        description: `Successfully processed ${mockDocuments.length} documents`,
      });
    }, 2000);
  };

  const clearAll = () => {
    setUploadedFiles([]);
    setDocuments([]);
    setUploadProgress(0);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-500 border-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Verification</h1>
          <p className="text-muted-foreground">Upload and verify documents using blockchain technology</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Document Upload</CardTitle>
            <CardDescription>Upload multiple documents for blockchain verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Drag and drop documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Drop your files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF and Word documents
                  </p>
                </div>
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Select Files
                </Button>
                <input 
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Selected Files ({uploadedFiles.length})</h3>
                  <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>
                </div>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isUploading && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Uploading...</p>
                  <p className="text-sm">{uploadProgress}%</p>
                </div>
                <Progress value={uploadProgress} className="w-full h-2" />
              </div>
            )}
            
            {isVerifying && (
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="text-sm font-medium">Verifying documents on blockchain...</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={clearAll} disabled={isUploading || isVerifying}>
              Cancel
            </Button>
            <Button 
              onClick={processFiles} 
              disabled={uploadedFiles.length === 0 || isUploading || isVerifying}
            >
              Process {uploadedFiles.length} {uploadedFiles.length === 1 ? 'Document' : 'Documents'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Verification Results</h2>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearAll}>
                New Upload
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Verified Documents</CardTitle>
              <CardDescription>List of documents verified on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        {doc.status === 'verified' ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">Verified</span>
                          </div>
                        ) : doc.status === 'rejected' ? (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-red-500">Rejected</span>
                          </div>
                        ) : (
                          getStatusBadge(doc.status)
                        )}
                      </TableCell>
                      <TableCell>{doc.uploaded}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {doc.status === 'verified' && (
                            <>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <Link className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BlockchainVerification;
