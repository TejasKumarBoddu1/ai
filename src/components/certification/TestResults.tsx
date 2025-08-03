
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClockIcon, Award, Trophy, AlertTriangle, Lock, ExternalLink, User, Download } from "lucide-react";
import { Question } from "@/types/certification";
import { Link } from 'react-router-dom';

interface TestResultsProps {
  testId: string;
  testTitle: string;
  score: number;
  passingScore: number;
  questions: Question[];
  userAnswers: Record<number, string>;
  onGenerate?: () => void;
  onRetry?: () => void;
}

const TestResults = ({ 
  testId, 
  testTitle, 
  score, 
  passingScore, 
  questions, 
  userAnswers,
  onGenerate,
  onRetry
}: TestResultsProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const isPassed = score >= passingScore;
  
  // Calculate cooldown info if test failed
  const cooldownEndISOString = localStorage.getItem(`test_cooldown_${testId}`);
  const cooldownEnd = cooldownEndISOString ? new Date(cooldownEndISOString) : null;
  const cooldownActive = cooldownEnd && cooldownEnd > new Date();
  
  const formatCooldownTime = () => {
    if (!cooldownEnd) return '';
    
    const now = new Date();
    const diffMs = cooldownEnd.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{testTitle} Results</span>
          <Badge variant={isPassed ? "default" : "destructive"} className="ml-2">
            {isPassed ? "PASSED" : "FAILED"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {isPassed 
            ? "Congratulations! You've passed the certification test."
            : "You didn't pass this time. Review your answers below and try again later."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score display */}
        <div className="relative pt-5">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Your Score</span>
            <span className="text-sm font-medium">{score}%</span>
          </div>
          <Progress value={score} className="h-3" />
          {/* Passing score marker */}
          <div 
            className="absolute bottom-0 w-0.5 h-3 bg-red-500" 
            style={{ left: `${passingScore}%` }}
          />
          <div 
            className="absolute -bottom-5 text-xs text-red-500" 
            style={{ left: `${passingScore}%`, transform: 'translateX(-50%)' }}
          >
            Pass ({passingScore}%)
          </div>
        </div>
        
        {/* Passed view */}
        {isPassed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-green-800 mb-1">Certification Achievement Unlocked!</h3>
            <p className="text-sm text-green-700 mb-4">
              You've demonstrated proficiency in this topic. 
              Generate your blockchain certificate to showcase your verified skills.
            </p>
            <Button 
              onClick={onGenerate}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Award className="mr-2 h-4 w-4" />
              Generate Blockchain Certificate
            </Button>
          </div>
        )}
        
        {/* Failed view with cooldown */}
        {!isPassed && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-md font-bold text-red-800 mb-1">Test Failed</h3>
                <p className="text-sm text-red-700 mb-2">
                  You need to score at least {passingScore}% to receive a certificate.
                </p>
                
                {cooldownActive ? (
                  <div className="flex items-center mt-3 bg-white/50 rounded p-2">
                    <Lock className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm text-red-700">
                      Retry available in <span className="font-mono">{formatCooldownTime()}</span>
                    </span>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                    onClick={onRetry}
                  >
                    Retry Test
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Toggle answers button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide" : "Show"} Detailed Results
        </Button>
        
        {/* Answers detail */}
        {showDetails && (
          <div className="border rounded-lg divide-y">
            {questions.map((question, idx) => {
              const userAnswer = userAnswers[idx] || "Not answered";
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={idx} className={`p-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="font-medium mb-2">Question {idx + 1}: {question.text}</p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Your answer:</span>
                      <span className={isCorrect ? 'text-green-700 font-medium' : 'text-red-700'}>
                        {userAnswer}
                      </span>
                    </div>
                    
                    {!isCorrect && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Correct answer:</span>
                        <span className="text-green-700 font-medium">{question.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button variant="outline" asChild>
          <Link to="/certification-center">
            Back to Certification Center
          </Link>
        </Button>
        
        {isPassed && (
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              View in Dashboard 
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default TestResults;
