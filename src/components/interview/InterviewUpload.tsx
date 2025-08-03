
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InterviewUploadProps {
  resumeText: string;
  onResumeTextChange: (text: string) => void;
}

export const InterviewUpload = ({
  resumeText,
  onResumeTextChange
}: InterviewUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or TXT file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      let content = "";
      
      if (file.type === 'text/plain') {
        content = await file.text();
      } else {
        // For PDF files, we'll use a simulated extraction
        // In a real implementation, you'd use a PDF extraction library
        toast({
          title: "PDF Extraction",
          description: "Extracting text from PDF (simulated for demo)",
        });
        
        // Simulate PDF text extraction with a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        content = `Extracted from ${file.name} (this is a simulation).\n\nSkills: JavaScript, React, TypeScript, Node.js\nExperience: 3 years of frontend development\nEducation: Bachelor's in Computer Science`;
      }
      
      onResumeTextChange(content);
      
      toast({
        title: "Resume uploaded",
        description: "Your resume content has been loaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "There was an error reading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your Resume or Experience (Optional)</label>
      
      <Tabs defaultValue="text">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Paste Text</TabsTrigger>
          <TabsTrigger value="upload">Upload File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-4">
          <Textarea
            placeholder="Paste your resume or describe your experience here to get tailored interview questions..."
            value={resumeText}
            onChange={(e) => onResumeTextChange(e.target.value)}
            className="min-h-32 resize-none"
          />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-4">
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            
            <h4 className="font-medium mb-2">Upload your Resume</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your resume in PDF or TXT format
            </p>
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Max file size: 5MB
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
