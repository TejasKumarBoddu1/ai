import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClockIcon, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Question } from "@/types/certification";

interface MCQTestProps {
  testId: string;
  testTitle: string;
  questions: Question[];
  timeLimit: number; // in minutes
  passingScore: number;
  onTestComplete: (score: number, passed: boolean, answers: Record<number, string>) => void;
}

const MCQTest = ({ 
  testId, 
  testTitle, 
  questions, 
  timeLimit, 
  passingScore, 
  onTestComplete 
}: MCQTestProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timeRemaining <= 0 || isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, isCompleted]);

  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Your test is being submitted automatically.",
      variant: "destructive"
    });
    
    handleSubmitTest();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
    return scorePercentage;
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const score = calculateScore();
      const passed = score >= passingScore;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsCompleted(true);
      onTestComplete(score, passed, answers);
      
      if (!passed) {
        const cooldownEnd = new Date();
        cooldownEnd.setHours(cooldownEnd.getHours() + 24);
        localStorage.setItem(`test_cooldown_${testId}`, cooldownEnd.toISOString());
      }
      
    } catch (error) {
      toast({
        title: "Error submitting test",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isTimeWarning = timeRemaining <= 60; // Warning when 1 minute left

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{testTitle}</CardTitle>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isTimeWarning ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
          }`}>
            <ClockIcon className="h-4 w-4" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
          
          <RadioGroup 
            value={answers[currentQuestionIndex] || ''} 
            onValueChange={handleSelectAnswer}
          >
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex items-start space-x-2 mb-3">
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="font-normal text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {isTimeWarning && !isCompleted && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Time is running out!</AlertTitle>
            <AlertDescription>
              You have less than a minute remaining to complete the test.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button 
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          Previous
        </Button>
        
        <div>
          {isLastQuestion ? (
            <Button 
              onClick={handleSubmitTest} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Test
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion} 
              disabled={!answers[currentQuestionIndex]}
            >
              Next Question
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MCQTest;
