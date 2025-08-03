
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ResumeDropzoneProps {
  onFileUploaded?: (filePath: string, fileName: string) => void;
  selectedFile?: { path: string; name: string } | null;
}

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ onFileUploaded, selectedFile }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ path: string; name: string } | null>(selectedFile || null);
  const { user } = useAuth();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload your resume",
        variant: "destructive"
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const uploadedFileData = { path: filePath, name: file.name };
      setUploadedFile(uploadedFileData);
      
      if (onFileUploaded) {
        onFileUploaded(filePath, file.name);
      }

      toast({
        title: "Resume uploaded successfully",
        description: `${file.name} has been uploaded`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [user, onFileUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const removeFile = () => {
    setUploadedFile(null);
    if (onFileUploaded) {
      onFileUploaded('', '');
    }
  };

  if (uploadedFile) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
              <p className="text-xs text-green-600">Resume uploaded successfully</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {uploading
          ? 'Uploading...'
          : isDragActive
          ? 'Drop your resume here'
          : 'Drag & drop your resume here, or click to select'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports PDF, DOC, DOCX (max 5MB)
      </p>
    </div>
  );
};

export default ResumeDropzone;
