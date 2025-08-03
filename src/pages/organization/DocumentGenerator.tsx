
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Printer, Share2, Save, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface DocumentData {
  candidateName: string;
  position: string;
  department: string;
  ctc: string;
  joiningDate: string;
  reportingManager: string;
  probationPeriod: string;
  companyName: string;
  companyAddress: string;
  hrName: string;
  hrDesignation: string;
}

const DocumentGenerator = () => {
  const [activeTab, setActiveTab] = useState('offer-letter');
  const [documentData, setDocumentData] = useState<DocumentData>({
    candidateName: '',
    position: '',
    department: '',
    ctc: '',
    joiningDate: '',
    reportingManager: '',
    probationPeriod: '3 months',
    companyName: 'QwiX Technologies',
    companyAddress: '123 Tech Park, Innovation District, Bangalore - 560001',
    hrName: 'Sarah Johnson',
    hrDesignation: 'HR Manager'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentGenerated, setDocumentGenerated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Template options
  const templates = {
    offer: ['Standard Offer Letter', 'Senior Role Offer', 'Contract Offer'],
    appointment: ['Full-time Employment', 'Contract Employment', 'Internship']
  };

  const handleInputChange = (field: keyof DocumentData, value: string) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDocument = () => {
    // Validation
    const requiredFields: (keyof DocumentData)[] = ['candidateName', 'position', 'ctc', 'joiningDate'];
    const missingFields = requiredFields.filter(field => !documentData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate document generation
    setTimeout(() => {
      setIsGenerating(false);
      setDocumentGenerated(true);
      
      toast({
        title: "Document generated",
        description: activeTab === 'offer-letter' 
          ? "Offer letter has been generated successfully" 
          : "Appointment letter has been generated successfully"
      });
    }, 1500);
  };

  const downloadDocument = () => {
    toast({
      title: "Document downloaded",
      description: "The document has been downloaded successfully"
    });
  };

  const saveToBlockchain = () => {
    toast({
      title: "Saved to blockchain",
      description: "Document has been securely stored in QwixVault blockchain storage"
    });
  };

  const resetForm = () => {
    setDocumentData({
      candidateName: '',
      position: '',
      department: '',
      ctc: '',
      joiningDate: '',
      reportingManager: '',
      probationPeriod: '3 months',
      companyName: 'QwiX Technologies',
      companyAddress: '123 Tech Park, Innovation District, Bangalore - 560001',
      hrName: 'Sarah Johnson',
      hrDesignation: 'HR Manager'
    });
    setDocumentGenerated(false);
  };

  const renderOfferLetterPreview = () => {
    const currentDate = format(new Date(), 'MMMM dd, yyyy');
    
    return (
      <div className="p-8 border min-h-[600px] bg-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">{documentData.companyName}</h1>
          <p className="text-sm text-gray-600">{documentData.companyAddress}</p>
        </div>
        
        <div className="mb-4">
          <p>Date: {currentDate}</p>
          <p className="mt-4">To,</p>
          <p className="font-medium">{documentData.candidateName || '[Candidate Name]'}</p>
        </div>
        
        <div className="mb-4">
          <p className="font-bold mb-2">Subject: Offer of Employment</p>
          
          <p>Dear {documentData.candidateName || '[Candidate Name]'},</p>
          
          <p className="mt-4">
            We are pleased to offer you the position of <span className="font-medium">{documentData.position || '[Position]'}</span> at {documentData.companyName}. 
            This letter confirms our offer of employment under the following terms:
          </p>
        </div>
        
        <div className="mb-4">
          <ol className="list-decimal ml-6 space-y-2">
            <li>
              <span className="font-medium">Position:</span> {documentData.position || '[Position]'}
              {documentData.department && ` in the ${documentData.department} department`}
            </li>
            <li>
              <span className="font-medium">Compensation:</span> Annual CTC of {documentData.ctc || '[CTC]'}
            </li>
            <li>
              <span className="font-medium">Start Date:</span> {documentData.joiningDate || '[Date]'}
            </li>
            <li>
              <span className="font-medium">Probation Period:</span> {documentData.probationPeriod}
            </li>
            {documentData.reportingManager && (
              <li>
                <span className="font-medium">Reporting To:</span> {documentData.reportingManager}
              </li>
            )}
          </ol>
        </div>
        
        <div className="mb-4">
          <p>
            This offer is contingent upon the successful completion of background verification and reference checks.
            Please sign and return this letter by [Response Date] to indicate your acceptance of this offer.
          </p>
          
          <p className="mt-4">
            We are excited about the possibility of you joining our team and look forward to working with you.
          </p>
        </div>
        
        <div className="mt-8">
          <p>Sincerely,</p>
          <p className="mt-4 font-medium">{documentData.hrName}</p>
          <p>{documentData.hrDesignation}</p>
          <p>{documentData.companyName}</p>
        </div>
        
        <div className="mt-12 border-t pt-4">
          <p className="font-medium">Acceptance:</p>
          <p>I accept the terms of employment outlined above.</p>
          
          <div className="mt-4 flex justify-between">
            <div>
              <div className="border-b border-black w-48 h-8"></div>
              <p>Signature</p>
            </div>
            
            <div>
              <div className="border-b border-black w-48 h-8"></div>
              <p>Date</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentLetterPreview = () => {
    const currentDate = format(new Date(), 'MMMM dd, yyyy');
    
    return (
      <div className="p-8 border min-h-[600px] bg-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">{documentData.companyName}</h1>
          <p className="text-sm text-gray-600">{documentData.companyAddress}</p>
        </div>
        
        <div className="mb-4">
          <p>Ref: HR/APT/{new Date().getFullYear()}/{Math.floor(Math.random() * 1000)}</p>
          <p>Date: {currentDate}</p>
        </div>
        
        <div className="mb-4">
          <p className="font-bold text-xl mb-2">APPOINTMENT LETTER</p>
          
          <p>Dear {documentData.candidateName || '[Candidate Name]'},</p>
          
          <p className="mt-4">
            With reference to your application and subsequent interviews with us, we are pleased to appoint you as 
            <span className="font-medium"> {documentData.position || '[Position]'}</span> in our organization effective from {documentData.joiningDate || '[Date]'}.
          </p>
        </div>
        
        <div className="mb-4">
          <p className="font-medium mt-4 mb-2">Terms and Conditions:</p>
          
          <ol className="list-decimal ml-6 space-y-2">
            <li>
              You will be paid a total gross compensation (CTC) of {documentData.ctc || '[CTC]'} per annum.
            </li>
            <li>
              You will be on probation for a period of {documentData.probationPeriod}.
            </li>
            <li>
              You will be reporting to {documentData.reportingManager || 'your Department Head'}.
            </li>
            <li>
              Your appointment is subject to the company's policies as may be applicable from time to time.
            </li>
            <li>
              During your employment with the company, you will devote full time to the work of the company.
            </li>
            <li>
              Your appointment is subject to verification of your documents and background checks.
            </li>
          </ol>
        </div>
        
        <div className="mb-4">
          <p>
            Please sign the duplicate copy of this letter as a token of your acceptance of the above terms and conditions
            and return the same to us.
          </p>
          
          <p className="mt-4">
            We welcome you to {documentData.companyName} and look forward to a long and mutually beneficial association.
          </p>
        </div>
        
        <div className="mt-8">
          <p>For {documentData.companyName}</p>
          <p className="mt-6 font-medium">{documentData.hrName}</p>
          <p>{documentData.hrDesignation}</p>
        </div>
        
        <div className="mt-8 border-t pt-4">
          <p>I accept the terms and conditions of employment.</p>
          
          <div className="mt-4 flex justify-between">
            <div>
              <div className="border-b border-black w-48 h-8"></div>
              <p>Signature of {documentData.candidateName || 'Employee'}</p>
            </div>
            
            <div>
              <div className="border-b border-black w-48 h-8"></div>
              <p>Date</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Generator</h1>
          <p className="text-muted-foreground">Create offer letters and appointment letters for candidates</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="offer-letter" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Offer Letter
          </TabsTrigger>
          <TabsTrigger value="appointment-letter" className="flex-1">
            <FileCheck className="h-4 w-4 mr-2" />
            Appointment Letter
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'offer-letter' ? 'Offer Letter Generator' : 'Appointment Letter Generator'}
              </CardTitle>
              <CardDescription>
                Fill in the details to generate a personalized {activeTab === 'offer-letter' ? 'offer letter' : 'appointment letter'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">Template</Label>
                <Select defaultValue={activeTab === 'offer-letter' ? templates.offer[0] : templates.appointment[0]}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {(activeTab === 'offer-letter' ? templates.offer : templates.appointment).map(template => (
                      <SelectItem key={template} value={template}>
                        {template}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidateName">Candidate Name*</Label>
                  <Input 
                    id="candidateName"
                    value={documentData.candidateName}
                    onChange={(e) => handleInputChange('candidateName', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position*</Label>
                  <Input 
                    id="position"
                    value={documentData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department"
                    value={documentData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Department"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ctc">CTC (Annual)*</Label>
                  <Input 
                    id="ctc"
                    value={documentData.ctc}
                    onChange={(e) => handleInputChange('ctc', e.target.value)}
                    placeholder="e.g. ₹8,00,000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="joiningDate">Joining Date*</Label>
                  <Input 
                    id="joiningDate"
                    type="date"
                    value={documentData.joiningDate}
                    onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportingManager">Reporting Manager</Label>
                  <Input 
                    id="reportingManager"
                    value={documentData.reportingManager}
                    onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                    placeholder="Manager name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="probationPeriod">Probation Period</Label>
                  <Select 
                    value={documentData.probationPeriod}
                    onValueChange={(value) => handleInputChange('probationPeriod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyDetails">Company Details</Label>
                <div className="grid grid-cols-1 gap-4">
                  <Input 
                    id="companyName"
                    value={documentData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Company name"
                  />
                  <Textarea 
                    id="companyAddress"
                    value={documentData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    placeholder="Company address"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hrDetails">HR Details</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    id="hrName"
                    value={documentData.hrName}
                    onChange={(e) => handleInputChange('hrName', e.target.value)}
                    placeholder="HR name"
                  />
                  <Input 
                    id="hrDesignation"
                    value={documentData.hrDesignation}
                    onChange={(e) => handleInputChange('hrDesignation', e.target.value)}
                    placeholder="HR designation"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button onClick={generateDocument} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                    Generating...
                  </>
                ) : (
                  'Generate Document'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
                <CardDescription>
                  {documentGenerated 
                    ? 'Your document has been generated successfully' 
                    : 'Fill in the form and generate to see a preview'}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-auto border rounded-md">
                <div ref={previewRef}>
                  {activeTab === 'offer-letter' ? renderOfferLetterPreview() : renderAppointmentLetterPreview()}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    disabled={!documentGenerated}
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button 
                    variant="outline"
                    disabled={!documentGenerated}
                    onClick={saveToBlockchain}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save to QwixVault
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    disabled={!documentGenerated}
                    onClick={() => {
                      toast({
                        title: "Document shared",
                        description: "Share link has been copied to clipboard"
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    disabled={!documentGenerated}
                    onClick={downloadDocument}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default DocumentGenerator;
