import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Play, Pause, RotateCcw, Download, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useInterviewSimulator } from '@/hooks/useInterviewSimulator';
import EnhancedInterviewSetup from './EnhancedInterviewSetup';
import InterviewFeedbackDisplay from './InterviewFeedbackDisplay';
import { Textarea } from "@/components/ui/textarea";
import { InterviewSettings } from '@/types/interview';

const AIInterviewSimulator: React.FC = () => {
  const { toast } = useToast();
  const [showSetup, setShowSetup] = useState(true);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);

  const {
    jobRole,
    questions,
    currentQuestionIndex,
    interviewStarted,
    interviewCompleted,
    answers,
    feedback,
    isListening,
    isLoading,
    progress,
    timeRemaining,
    startInterview,
    endInterview,
    nextQuestion,
    previousQuestion,
    toggleListening,
    handleAnswerChange,
    submitAnswer,
    generateReport
  } = useInterviewSimulator();

  const handleSetupSubmit = async (settings: InterviewSettings) => {
    setShowSetup(false);
    // Start interview with the provided settings
    await startInterview();
    toast({
      title: "AI Interview Started",
      description: "Your personalized interview session has begun.",
    });
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please provide an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    submitAnswer(currentAnswer);
    setCurrentAnswer('');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Update current answer when switching questions
  useEffect(() => {
    if (answers[currentQuestionIndex]) {
      setCurrentAnswer(answers[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, answers]);

  if (showSetup) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Interview Agent Setup
          </CardTitle>
          <CardDescription>
            Configure your AI-powered interview session with personalized questions and real-time feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedInterviewSetup 
            onSubmit={handleSetupSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    );
  }

  if (interviewCompleted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Bot className="h-6 w-6" />
              Interview Completed!
            </CardTitle>
            <CardDescription>
              Congratulations! You've completed your AI interview session. Review your performance below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={generateReport} disabled={isLoading}>
                <Download className="mr-2 h-4 w-4" />
                {isLoading ? "Generating..." : "Download Report"}
              </Button>
              <Button variant="outline" onClick={() => {
                endInterview();
                setShowSetup(true);
              }}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Start New Interview
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Display feedback for all questions */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <InterviewFeedbackDisplay
              key={index}
              question={question}
              answer={answers[index] || "No answer provided"}
              feedback={feedback[index]}
              questionNumber={index + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Configure your interview settings to begin.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Progress and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Interview in Progress
              </CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {questions.length} • {jobRole}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Time: {formatTime(timeRemaining)}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {currentQuestionIndex + 1}
            </span>
            {currentQuestion?.type && (
              <Badge variant="outline">{currentQuestion.type}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-lg font-medium">
                {currentQuestion?.question || "Loading question..."}
              </p>
            </div>
            
            {/* Answer Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Your Answer:</label>
                <div className="flex gap-2">
                  <Button
                    variant={isListening ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleListening}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isListening ? "Stop Recording" : "Voice Input"}
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={currentAnswer}
                onChange={(e) => {
                  setCurrentAnswer(e.target.value);
                  handleAnswerChange(e.target.value, currentQuestionIndex);
                }}
                placeholder="Type your answer here or use voice input..."
                className="min-h-[120px]"
              />
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Skip
                  </Button>
                </div>
                
                <Button 
                  onClick={handleAnswerSubmit}
                  disabled={isLoading || !currentAnswer.trim()}
                >
                  {isLoading ? "Processing..." : "Submit Answer"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Feedback */}
      {feedback[currentQuestionIndex] && (
        <InterviewFeedbackDisplay
          question={currentQuestion}
          answer={answers[currentQuestionIndex] || ""}
          feedback={feedback[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
        />
      )}

      {/* Interview Controls */}
      <Card>
        <CardContent className="flex justify-center gap-4 p-4">
          <Button variant="outline" onClick={() => {
            endInterview();
            setShowSetup(true);
          }}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Interview
          </Button>
          <Button variant="destructive" onClick={endInterview}>
            End Interview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInterviewSimulator;
