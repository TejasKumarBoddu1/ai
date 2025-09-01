
import React from 'react';
import { FileText, FileImage, X, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentUploadPreviewProps {
  file: File | null;
  filePreview: string | null;
  clearFile: () => void;
  isUploading: boolean;
  uploadProgress: number;
}

const DocumentUploadPreview: React.FC<DocumentUploadPreviewProps> = ({
  file,
  filePreview,
  clearFile,
  isUploading,
  uploadProgress
}) => {
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center bg-secondary/30 rounded-lg p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-1">Upload a Document</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Select a document to upload to the blockchain for secure, tamper-proof storage
        </p>
      </div>
    );
  }

  const isPdf = file.type === 'application/pdf';

  return (
    <Card className="relative overflow-hidden bg-secondary/10 p-5">
      {/* Upload progress overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-6">
          <div className="w-20 h-20 relative mb-4">
            {/* 3D Cube Animation */}
            <div className="cube-wrapper">
              <div className="cube">
                <div className="cube-face front"></div>
                <div className="cube-face back"></div>
                <div className="cube-face top"></div>
                <div className="cube-face bottom"></div>
                <div className="cube-face left"></div>
                <div className="cube-face right"></div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-3">Uploading to Blockchain</h3>
          <div className="w-full max-w-xs mb-2">
            <Progress value={uploadProgress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            Securing your document with tamper-proof blockchain technology...
          </p>
        </div>
      )}

      {/* Document preview */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="flex-shrink-0 w-36 h-48 border border-border rounded-md overflow-hidden flex items-center justify-center bg-background">
          {filePreview ? (
            <img src={filePreview} alt="Document preview" className="object-contain w-full h-full" />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              {isPdf ? (
                <FileText className="h-12 w-12 text-primary/70" />
              ) : (
                <FileImage className="h-12 w-12 text-primary/70" />
              )}
              <span className="text-xs mt-2 px-2 text-center">{file.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-medium truncate">
              {file.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB • {isPdf ? 'PDF Document' : 'Image File'}
            </p>
          </div>
          
          {!isUploading && (
            <Button variant="outline" size="sm" onClick={clearFile} className="text-destructive hover:text-destructive">
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Add CSS for the 3D cube animation */}
      <style>
        {`
        .cube-wrapper {
          perspective: 800px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cube {
          width: 60px;
          height: 60px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotate 4s infinite linear;
        }
        
        .cube-face {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 2px solid hsl(var(--primary));
          border-radius: 4px;
          background-color: hsl(var(--primary) / 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px hsl(var(--primary) / 0.5);
        }
        
        .front  { transform: rotateY(0deg) translateZ(30px); }
        .back   { transform: rotateY(180deg) translateZ(30px); }
        .top    { transform: rotateX(90deg) translateZ(30px); }
        .bottom { transform: rotateX(-90deg) translateZ(30px); }
        .left   { transform: rotateY(-90deg) translateZ(30px); }
        .right  { transform: rotateY(90deg) translateZ(30px); }
        
        @keyframes rotate {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        `}
      </style>
    </Card>
  );
};

export default DocumentUploadPreview;
