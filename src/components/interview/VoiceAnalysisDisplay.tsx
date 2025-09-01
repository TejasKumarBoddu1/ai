
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { VoiceAnalysis } from '@/types/interview';
import { Mic, Volume, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface VoiceAnalysisDisplayProps {
  analysis: VoiceAnalysis | null;
}

const VoiceAnalysisDisplay: React.FC<VoiceAnalysisDisplayProps> = ({ analysis }) => {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [tipLevel, setTipLevel] = useState<'success' | 'warning' | 'error'>('warning');
  
  // Process analysis updates to show tips
  useEffect(() => {
    if (!analysis) return;
    
    // Clear any existing timeout
    const timeoutId = setTimeout(() => {
      if (analysis.suggestions.length > 0) {
        // Show a tip
        setCurrentTip(analysis.suggestions[0]);
        setShowTip(true);
        
        // Determine tip level
        if (analysis.paceScore < 50 || analysis.toneScore < 50 || analysis.fillerWordCount > 8) {
          setTipLevel('error');
        } else if (analysis.paceScore < 70 || analysis.toneScore < 70 || analysis.fillerWordCount > 5) {
          setTipLevel('warning');
        } else {
          setTipLevel('success');
        }
        
        // Hide the tip after 8 seconds
        setTimeout(() => {
          setShowTip(false);
        }, 8000);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [analysis]);
  
  if (!analysis) {
    return (
      <Card className="mt-3">
        <CardContent className="p-3 text-center text-sm text-muted-foreground">
          <Mic className="h-4 w-4 mx-auto mb-1" />
          Waiting for voice analysis...
        </CardContent>
      </Card>
    );
  }
  
  const getProgressColor = (score: number) => {
    if (score > 80) return "bg-green-600";
    if (score > 60) return "bg-amber-500"; 
    return "bg-red-500";
  };

  return (
    <>
      {/* Voice tip notification */}
      {showTip && (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-3 rounded-lg shadow-lg border animate-fade-in ${
          tipLevel === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          tipLevel === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex items-start gap-2">
            {tipLevel === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
            {tipLevel === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
            {tipLevel === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="font-medium mb-1">Voice Feedback</p>
              <p className="text-sm">{currentTip}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main analysis display */}
      <Card className="mt-3">
        <CardContent className="p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Voice Analysis</h3>
            <Badge variant="outline" className={`
              ${analysis.toneScore > 80 && analysis.paceScore > 80 && analysis.fillerWordCount < 3 
                ? 'bg-green-100 text-green-800' 
                : analysis.toneScore < 60 || analysis.paceScore < 60 || analysis.fillerWordCount > 7
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }
            `}>
              {analysis.toneScore > 80 && analysis.paceScore > 80 && analysis.fillerWordCount < 3 
                ? 'Excellent' 
                : analysis.toneScore < 60 || analysis.paceScore < 60 || analysis.fillerWordCount > 7
                  ? 'Needs Improvement'
                  : 'Good'
              }
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Tone & Confidence</span>
                <span className={`font-medium ${
                  analysis.toneScore > 80 ? "text-green-600" : 
                  analysis.toneScore > 60 ? "text-amber-600" : "text-red-600"
                }`}>
                  {analysis.toneScore}%
                </span>
              </div>
              <Progress 
                value={analysis.toneScore} 
                className={`h-1.5 ${getProgressColor(analysis.toneScore)}`} 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Speech Pace</span>
                <span className={`font-medium ${
                  analysis.paceScore > 80 ? "text-green-600" : 
                  analysis.paceScore > 60 ? "text-amber-600" : "text-red-600"
                }`}>
                  {analysis.paceScore}%
                </span>
              </div>
              <Progress 
                value={analysis.paceScore} 
                className={`h-1.5 ${getProgressColor(analysis.paceScore)}`} 
              />
            </div>
            
            {analysis.fillerWordCount > 0 && (
              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Filler Words:</span>
                  <span className={`font-medium ${
                    analysis.fillerWordCount > 7 ? "text-red-600" : 
                    analysis.fillerWordCount > 3 ? "text-amber-600" : "text-muted-foreground"
                  }`}>
                    {analysis.fillerWordCount} detected
                  </span>
                </div>
                {analysis.fillerWords.length > 0 && (
                  <div className="bg-slate-50 p-1.5 rounded-sm text-muted-foreground">
                    {analysis.fillerWords.slice(0, 3).join(', ')}
                    {analysis.fillerWords.length > 3 && '...'}
                  </div>
                )}
              </div>
            )}
            
            {analysis.suggestions.length > 0 && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-md">
                <div className="flex gap-1.5">
                  <Volume className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Voice Tip:</strong> {analysis.suggestions[0]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default VoiceAnalysisDisplay;
