
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, Camera, CameraOff, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SpeechControllerProps {
  isInterviewStarted: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleSpeech: () => void;
  isSpeechEnabled?: boolean;
  isCameraEnabled?: boolean;
  onToggleCamera?: () => void;
  interviewType?: 'technical' | 'behavioral' | 'mixed';
  difficulty?: 'easy' | 'medium' | 'hard';
}

const SpeechController: React.FC<SpeechControllerProps> = ({
  isInterviewStarted,
  isSpeaking,
  isListening,
  onStartListening,
  onStopListening,
  onToggleSpeech,
  isSpeechEnabled = true,
  isCameraEnabled = false,
  onToggleCamera,
  interviewType = 'mixed',
  difficulty = 'medium',
}) => {
  if (!isInterviewStarted) {
    return null;
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="border-t-0 rounded-t-none">
      <CardContent className="py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col xs:flex-row gap-1.5">
            <Badge variant="outline" className={`${getDifficultyColor(difficulty)}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
            </Badge>
            
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              {interviewType === 'technical' ? 'Technical' : 
               interviewType === 'behavioral' ? 'Behavioral' : 'Mixed'} Interview
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={onToggleSpeech}
            >
              {isSpeechEnabled ? (
                <Volume2 className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 mr-1.5" />
              )}
              {isSpeechEnabled ? 'Mute' : 'Unmute'}
            </Button>
            
            {onToggleCamera && (
              <Button 
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={onToggleCamera}
              >
                {isCameraEnabled ? (
                  <CameraOff className="h-3.5 w-3.5 mr-1.5" />
                ) : (
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                )}
                {isCameraEnabled ? 'Disable Camera' : 'Enable Camera'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-3 flex justify-between">
        <div className="flex items-center">
          <div className="mr-2 flex items-center">
            {isListening ? (
              <div className="flex flex-col">
                <span className="text-green-600 text-sm flex items-center">
                  <span className="h-2 w-2 bg-green-600 rounded-full mr-1 animate-pulse"></span>
                  Listening
                </span>
                <span className="text-xs text-muted-foreground">Speak clearly and confidently</span>
              </div>
            ) : (
              <span className="text-gray-500 text-sm flex items-center">
                <span className="h-2 w-2 bg-gray-400 rounded-full mr-1"></span>
                Microphone Off
              </span>
            )}
          </div>
          
          {isSpeaking && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 ml-2">
              <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
              Speaking
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={isListening ? "secondary" : "default"}
            size="sm"
            onClick={isListening ? onStopListening : onStartListening}
            className="relative"
            disabled={isSpeaking}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
            
            {isListening && (
              <span className="absolute -top-2 -right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SpeechController;
