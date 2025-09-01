import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Image, 
  Code, 
  Eye, 
  Download, 
  Trash2, 
  Plus,
  File,
  FileImage,
  FileCode,
  FileVideo
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'resume' | 'portfolio' | 'work-sample' | 'other';
  file?: File;
  url?: string;
  description?: string;
  uploadedAt: Date;
  size: number;
}

interface DocumentSharingProps {
  onDocumentReview?: (document: Document, analysis: string) => void;
  isInterviewActive?: boolean;
}

const DocumentSharing: React.FC<DocumentSharingProps> = ({ 
  onDocumentReview, 
  isInterviewActive = false 
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = ((i + 1) / files.length) * 100;
      
      // Simulate upload progress
      for (let j = 0; j <= 100; j += 10) {
        setUploadProgress(j);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const document: Document = {
        id: Date.now().toString() + i,
        name: file.name,
        type: getDocumentType(file.name),
        file: file,
        uploadedAt: new Date(),
        size: file.size
      };

      setDocuments(prev => [...prev, document]);
    }

    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getDocumentType = (filename: string): Document['type'] => {
    const ext = filename.toLowerCase().split('.').pop();
    if (['pdf', 'doc', 'docx'].includes(ext || '')) return 'resume';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return 'portfolio';
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css'].includes(ext || '')) return 'work-sample';
    return 'other';
  };

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'resume': return <FileText className="h-4 w-4" />;
      case 'portfolio': return <Image className="h-4 w-4" />;
      case 'work-sample': return <Code className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: Document['type']) => {
    const colors = {
      resume: 'bg-blue-100 text-blue-800',
      portfolio: 'bg-green-100 text-green-800',
      'work-sample': 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colors[type]}>
        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleDocumentReview = async (document: Document) => {
    if (!onDocumentReview) return;

    // Simulate AI analysis
    const analysis = await generateDocumentAnalysis(document);
    onDocumentReview(document, analysis);
  };

  const generateDocumentAnalysis = async (document: Document): Promise<string> => {
    // Simulate AI analysis based on document type
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analyses = {
      resume: `📄 **Resume Analysis for ${document.name}**\n\n**Strengths:**\n• Well-structured format with clear sections\n• Quantified achievements in previous roles\n• Relevant technical skills highlighted\n\n**Areas for Improvement:**\n• Could include more specific metrics\n• Consider adding a summary section\n• Skills section could be more detailed\n\n**Overall Rating:** 8.5/10`,
      portfolio: `🎨 **Portfolio Review for ${document.name}**\n\n**Visual Design:**\n• Clean and professional layout\n• Good use of whitespace\n• Consistent branding elements\n\n**Content Quality:**\n• Projects demonstrate relevant skills\n• Good variety of work samples\n• Clear project descriptions\n\n**Recommendations:**\n• Add more interactive elements\n• Include case studies for major projects\n• Consider adding testimonials`,
      'work-sample': `💻 **Code Review for ${document.name}**\n\n**Code Quality:**\n• Clean, readable code structure\n• Good use of modern practices\n• Proper error handling implemented\n\n**Technical Assessment:**\n• Demonstrates solid understanding\n• Good problem-solving approach\n• Efficient algorithms used\n\n**Suggestions:**\n• Add more comprehensive comments\n• Consider edge cases\n• Include unit tests`,
      other: `📁 **Document Review for ${document.name}**\n\n**Content Analysis:**\n• Professional presentation\n• Relevant to the position\n• Good organization of information\n\n**Technical Aspects:**\n• Appropriate file format\n• Good quality presentation\n• Clear communication of ideas\n\n**Overall Assessment:**\n• Suitable for interview context\n• Demonstrates preparation\n• Shows attention to detail`
    };

    return analyses[document.type] || analyses.other;
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  };

  const filteredDocuments = {
    all: documents,
    resume: documents.filter(doc => doc.type === 'resume'),
    portfolio: documents.filter(doc => doc.type === 'portfolio'),
    'work-sample': documents.filter(doc => doc.type === 'work-sample'),
    other: documents.filter(doc => doc.type === 'other')
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Sharing & Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({documents.length})</TabsTrigger>
            <TabsTrigger value="resume">Resume ({filteredDocuments.resume.length})</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio ({filteredDocuments.portfolio.length})</TabsTrigger>
            <TabsTrigger value="work-sample">Code ({filteredDocuments['work-sample'].length})</TabsTrigger>
            <TabsTrigger value="other">Other ({filteredDocuments.other.length})</TabsTrigger>
          </TabsList>

          {Object.entries(filteredDocuments).map(([key, docs]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {key === 'all' ? 'All Documents' : 
                   key === 'work-sample' ? 'Code Samples' :
                   key.charAt(0).toUpperCase() + key.slice(1)}s
                </h3>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Upload {key === 'all' ? 'Document' : key === 'work-sample' ? 'Code' : key}
                </Button>
              </div>

              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {docs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No {key === 'all' ? 'documents' : key === 'work-sample' ? 'code samples' : key}s uploaded yet</p>
                      <p className="text-sm">Click upload to add your first document</p>
                    </div>
                  ) : (
                    docs.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                          selectedDocument?.id === doc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => handleDocumentSelect(doc)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.type)}
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                {getTypeBadge(doc.type)}
                                <span>{formatFileSize(doc.size)}</span>
                                <span>•</span>
                                <span>{doc.uploadedAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Document Review: {doc.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold mb-2">AI Analysis</h4>
                                    <div className="whitespace-pre-line text-sm">
                                      {doc.description || 'Click "Analyze" to generate AI review...'}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => handleDocumentReview(doc)}
                                      className="flex-1"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Analyze with AI
                                    </Button>
                                    <Button variant="outline">
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDocument(doc.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.svg,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css"
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default DocumentSharing; 