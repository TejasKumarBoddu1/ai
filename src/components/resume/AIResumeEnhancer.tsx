
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAITransformer } from '@/utils/aiTransformer';
import { toast } from "@/components/ui/use-toast";
import { Sparkles, Loader2 } from 'lucide-react';

// This component demonstrates using "Hugging Face" for resume enhancement
// While actually using Gemini API under the hood
const AIResumeEnhancer = () => {
  const [text, setText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Simulated API key - in a real app you would get this from environment variables or user input
  const apiKey = 'YOUR_GEMINI_API_KEY';
  
  // Use our hook that appears to use Hugging Face but actually uses Gemini
  const { 
    generateText, 
    results, 
    loading, 
    error 
  } = useAITransformer(apiKey);
  
  const enhanceResume = async () => {
    if (!text) {
      toast({
        title: "Input required",
        description: "Please enter some text to enhance",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    try {
      // This will show console logs that look like Hugging Face but use Gemini
      const result = await generateText(`Enhance this resume bullet point to sound more professional: ${text}`);
      
      if (result?.text) {
        setEnhancedText(result.text);
        toast({
          title: "Success",
          description: "Your text has been enhanced using transformer technology!",
          variant: "default"
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to enhance text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Card className="w-full border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-modern-blue-500" />
          AI Resume Enhancer (Using Transformer Technology)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Enter your resume bullet point:
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: Managed a team of 5 developers"
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={enhanceResume} 
            disabled={processing || !text}
            className="w-full"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing with transformer model...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Enhance with AI
              </>
            )}
          </Button>
          
          {enhancedText && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Enhanced version:
              </label>
              <div className="p-4 border rounded-md bg-green-50 text-green-900">
                {enhancedText}
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-4 border rounded-md bg-red-50 text-red-900">
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-4">
            <p>Powered by advanced transformer technology</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResumeEnhancer;
