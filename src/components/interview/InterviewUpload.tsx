
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
  const [progress, setProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dynamically load an external script once
  const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      if ((existing as any).loaded) return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      (script as any).loaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });

  const ensurePdfJs = async () => {
    // pdf.js UMD build
    const pdfJsCdnBase = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build';
    await loadScript(`${pdfJsCdnBase}/pdf.min.js`);
    // Configure worker
    const w = window as any;
    if (w.pdfjsLib) {
      w.pdfjsLib.GlobalWorkerOptions.workerSrc = `${pdfJsCdnBase}/pdf.worker.min.js`;
    } else {
      throw new Error('pdfjsLib not available');
    }
  };

  const ensureTesseract = async () => {
    // Tesseract.js UMD build
    await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js');
    const w = window as any;
    if (!w.Tesseract) throw new Error('Tesseract not available');
  };

  const ocrPdfFile = async (file: File): Promise<string> => {
    setProgress('Loading libraries...');
    await ensurePdfJs();
    await ensureTesseract();
    const w = window as any;
    const pdfjsLib = w.pdfjsLib;
    const { Tesseract } = w;

    setProgress('Reading PDF...');
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      setProgress(`Rendering page ${pageNum} of ${pdf.numPages}...`);
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Failed to create canvas context');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;

      setProgress(`Extracting text (OCR) from page ${pageNum}...`);
      const dataUrl = canvas.toDataURL('image/png');
      const { data } = await Tesseract.recognize(dataUrl, 'eng', {
        logger: (m: any) => {
          if (m.status && m.progress != null) {
            setProgress(`${m.status} (page ${pageNum}): ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      fullText += (data?.text || '').trim() + '\n\n';
    }

    return fullText.trim();
  };
  
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
      } else if (file.type === 'application/pdf') {
        content = await ocrPdfFile(file);
      }

      if (!content || content.trim().length === 0) {
        throw new Error('No text could be extracted.');
      }

      onResumeTextChange(content.trim());
      toast({
        title: "Resume processed",
        description: `Extracted ${content.trim().length} characters of text from ${file.name}.`
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: (error as Error)?.message || "There was an error reading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setProgress("");
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
            <p className="text-xs text-muted-foreground mt-2">Max file size: 5MB</p>
            {isUploading && progress && (
              <p className="text-xs text-muted-foreground mt-2">{progress}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
