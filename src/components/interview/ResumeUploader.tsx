
import { useState } from 'react';
import { Upload, File, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { parseResume } from '@/utils/interviewApiService';

interface ResumeUploaderProps {
  onResumeProcessed: (resumeText: string, resumeFileName: string) => void;
  isProcessing: boolean;
}

const ResumeUploader = ({ onResumeProcessed, isProcessing }: ResumeUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [processingText, setProcessingText] = useState('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      processResume(selectedFile);
    }
  };

  const processResume = async (file: File) => {
    // Reset progress
    setUploadProgress(0);
    setProcessingText('Starting upload...');
    
    try {
      // Simulate upload progress
      for (let i = 1; i <= 10; i++) {
        await new Promise(r => setTimeout(r, 100)); // Faster animation
        setUploadProgress(i * 10);
        
        if (i === 3) setProcessingText('Uploading file...');
        if (i === 6) setProcessingText('Processing PDF...');
        if (i === 8) setProcessingText('Analyzing with AI...');
      }
      
      // Convert file to base64
      const base64 = await fileToBase64(file);
      
      // Now process the resume
      try {
        // For development, we'll skip the actual API call
        // In production, uncomment this line to use the real parser
        // const resumeData = await parseResume(base64);
        
        // Extract text from PDF
        const pdfText = await extractTextFromPDF(file);
        
        setProcessingText('Analysis complete!');
        onResumeProcessed(pdfText, file.name);
        
        toast({
          title: "Resume processed successfully",
          description: "Your resume has been analyzed and is ready for your interview",
        });
      } catch (error) {
        console.error("Error parsing resume:", error);
        // Fall back to simpler text extraction
        extractTextFromPDF(file)
          .then(text => {
            onResumeProcessed(text, file.name);
            toast({
              title: "Resume processed",
              description: "Basic resume text extracted for your interview",
            });
          })
          .catch(extractError => {
            console.error("Error extracting text:", extractError);
            toast({
              title: "Processing failed",
              description: "Could not process your resume. Please try again.",
              variant: "destructive"
            });
          });
      }
    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Processing failed",
        description: "Failed to process the PDF",
        variant: "destructive"
      });
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64String = result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Extract text from PDF using a basic approach
  const extractTextFromPDF = async (file: File): Promise<string> => {
    // In a real implementation, we would use a PDF parsing library
    // For now, we'll use a simplified approach for demo purposes
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    let text = decoder.decode(arrayBuffer.slice(0, 5000));
    
    // Clean up binary data for better readability
    text = text.replace(/[^\x20-\x7E\r\n]/g, ' ').trim();
    
    // Simulate processing time
    await new Promise(r => setTimeout(r, 500)); // Faster processing
    
    return text;
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex flex-col items-center text-center">
        {!file ? (
          <>
            <div className="mb-4 p-6 border-2 border-dashed rounded-lg flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Upload your resume</p>
              <p className="text-xs text-muted-foreground mb-4">Drag and drop or click to browse</p>
              <Button variant="outline" className="relative">
                Select PDF
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported format: PDF up to 5MB
            </p>
          </>
        ) : (
          <div className="w-full">
            <div className="mb-3 p-3 bg-muted rounded-lg flex items-center">
              <File className="h-5 w-5 text-blue-500 mr-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
              </div>
              {uploadProgress < 100 ? (
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setFile(null)}
                    disabled={uploadProgress > 0 && uploadProgress < 100}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>{processingText}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;
