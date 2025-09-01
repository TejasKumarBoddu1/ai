
import { toast } from "@/components/ui/use-toast";

/**
 * Send an email using the local mail client and attach a PDF
 */
export const sendEmailWithMailchimp = async (
  fromEmail: string,
  toEmail: string,
  subject: string,
  body: string,
  pdfBlob?: Blob,
  fileName?: string
): Promise<boolean> => {
  try {
    console.log("Preparing email with PDF attachment");
    
    if (!pdfBlob || !fileName) {
      console.error("Missing PDF data for attachment");
      toast({
        title: "Error",
        description: "Could not prepare PDF for attachment",
        variant: "destructive"
      });
      return false;
    }

    // First, download the PDF file
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Create a delay to ensure the file downloads
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Then create the mailto URL with the subject and body
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body + "\n\n-----\nIMPORTANT: Please attach the resume PDF file that was just downloaded to your device.");
    const mailtoUrl = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open the mail client
    window.location.href = mailtoUrl;
    
    toast({
      title: "Email Ready",
      description: "Your email draft has been created. Please attach the resume PDF that was just downloaded to your device.",
    });
    
    return true;
  } catch (error) {
    console.error("Error creating email draft:", error);
    
    toast({
      title: "Error Creating Email",
      description: "There was a problem creating your email draft. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Convert Blob to base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
