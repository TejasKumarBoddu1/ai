
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, MessageSquare, TrendingUp, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { collectStudentContext } from '@/utils/ai/studentContextCollector';
import { analyzeStudentWithAI } from '@/utils/ai/contextAnalyzer';
import { selectOptimalQuestion } from '@/utils/ai/questionSelector';
import { generateFollowUpQuestion } from '@/utils/ai/followUpGenerator';
import { evaluateAnswerWithAI } from '@/utils/ai/answerEvaluator';
import { StudentContext, AIGeneratedQuestion, AnswerEvaluation } from '@/types/aiQuestions';

interface AIInterviewEngineProps {
  mediaMetrics?: any;
  voiceMetrics?: any;
  userProfile?: any;
  onSessionComplete?: (results: any) => void;
}

const AIInterviewEngine: React.FC<AIInterviewEngineProps> = ({
  mediaMetrics,
  voiceMetrics,
  userProfile,
  onSessionComplete
}) => {
  const { toast } = useToast();
  const [sessionState, setSessionState] = useState<'initializing' | 'questioning' | 'evaluating' | 'complete'>('initializing');
  const [currentQuestion, setCurrentQuestion] = useState<AIGeneratedQuestion | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [studentContext, setStudentContext] = useState<StudentContext | null>(null);
  const [evaluationHistory, setEvaluationHistory] = useState<AnswerEvaluation[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);

  useEffect(() => {
    initializeAISession();
  }, []);

  const initializeAISession = async () => {
    try {
      // Collect student context
      const context = collectStudentContext(
        mediaMetrics,
        voiceMetrics,
        { goal: 'practice', questionCount: 0, timeSpent: 0 },
        userProfile
      );
      setStudentContext(context);

      // Get AI analysis
      const analysis = await analyzeStudentWithAI(context);
      
      // Generate first question
      const firstQuestion = await selectOptimalQuestion(analysis, context);
      setCurrentQuestion(firstQuestion);
      setSessionState('questioning');

      toast({
        title: "AI Interview Started",
        description: `Personalized ${firstQuestion.difficulty} level ${firstQuestion.category} question generated.`,
      });

    } catch (error) {
      console.error('AI session initialization failed:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to start AI interview. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentQuestion || !studentAnswer.trim() || !studentContext) return;

    setSessionState('evaluating');

    try {
      // Evaluate the answer
      const evaluation = await evaluateAnswerWithAI(
        currentQuestion.question,
        studentAnswer,
        studentContext
      );

      // Update evaluation history
      const newHistory = [...evaluationHistory, evaluation];
      setEvaluationHistory(newHistory);

      // Calculate updated session score
      const avgScore = newHistory.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / newHistory.length;
      setSessionScore(Math.round(avgScore));

      // Update student context with new performance data
      const updatedContext = {
        ...studentContext,
        averageAnswerScore: avgScore,
        questionsAskedToday: questionCount + 1,
        confidenceLevel: Math.min(100, studentContext.confidenceLevel + (evaluation.overallScore > 70 ? 5 : -3))
      };
      setStudentContext(updatedContext);
      setQuestionCount(prev => prev + 1);

      // Show evaluation feedback
      toast({
        title: "Answer Evaluated",
        description: `Score: ${evaluation.overallScore}/100. ${evaluation.strengths[0]}`,
      });

      // Decide next step
      if (questionCount >= 7) {
        // Session complete
        setSessionState('complete');
        onSessionComplete?.({
          totalQuestions: questionCount + 1,
          averageScore: avgScore,
          evaluations: newHistory,
          finalContext: updatedContext
        });
      } else {
        // Generate next question or follow-up
        const shouldFollowUp = evaluation.overallScore < 65 || studentAnswer.length < 150;
        
        if (shouldFollowUp && Math.random() > 0.5) {
          const followUp = await generateFollowUpQuestion(
            currentQuestion.question,
            studentAnswer,
            updatedContext
          );
          setCurrentQuestion({
            question: followUp.followUpQuestion,
            category: currentQuestion.category,
            difficulty: currentQuestion.difficulty,
            expectedAnswerLength: '1-2 minutes',
            evaluationCriteria: ['depth', 'specificity', 'examples']
          });
        } else {
          const analysis = await analyzeStudentWithAI(updatedContext);
          const nextQuestion = await selectOptimalQuestion(analysis, updatedContext);
          setCurrentQuestion(nextQuestion);
        }

        setStudentAnswer('');
        setSessionState('questioning');
      }

    } catch (error) {
      console.error('Answer evaluation failed:', error);
      toast({
        title: "Evaluation Error",
        description: "Failed to evaluate answer. Please try again.",
        variant: "destructive"
      });
      setSessionState('questioning');
    }
  };

  const renderSessionProgress = () => (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-semibold">AI Interview Session</span>
        </div>
        <Badge variant="outline">
          Question {questionCount + 1} of 8
        </Badge>
      </div>
      
      <Progress value={(questionCount / 8) * 100} className="h-2" />
      
      {sessionScore > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm">Current Score: {sessionScore}/100</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Confidence: {studentContext?.confidenceLevel}%</span>
          </div>
        </div>
      )}
    </div>
  );

  if (sessionState === 'initializing') {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">AI Analyzing Your Profile</h3>
            <p className="text-muted-foreground">Generating personalized questions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessionState === 'complete') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Session Complete!
          </CardTitle>
          <CardDescription>
            Great job! Here's your performance summary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{sessionScore}/100</div>
              <p className="text-muted-foreground">Overall Session Score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-semibold">{questionCount}</div>
                <div className="text-sm text-muted-foreground">Questions Completed</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-semibold">{studentContext?.confidenceLevel}%</div>
                <div className="text-sm text-muted-foreground">Final Confidence</div>
              </div>
            </div>

            <Button onClick={() => window.location.reload()} className="w-full">
              Start New Session
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {renderSessionProgress()}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Interview Question
          </CardTitle>
          <CardDescription>
            {currentQuestion && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{currentQuestion.category}</Badge>
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
                <span className="text-sm text-muted-foreground">
                  Expected: {currentQuestion.expectedAnswerLength}
                </span>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg">{currentQuestion?.question}</p>
            </div>

            <Textarea
              placeholder="Type your answer here... Take your time to think and provide specific examples."
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              className="min-h-32"
            />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {studentAnswer.length} characters
              </span>
              
              <Button 
                onClick={handleAnswerSubmit}
                disabled={!studentAnswer.trim() || sessionState === 'evaluating'}
              >
                {sessionState === 'evaluating' ? 'AI Evaluating...' : 'Submit Answer'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {evaluationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {evaluationHistory.slice(-2).map((evaluation, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Answer {evaluationHistory.length - 1 + index}</span>
                    <Badge variant={evaluation.overallScore >= 70 ? "default" : "secondary"}>
                      {evaluation.overallScore}/100
                    </Badge>
                  </div>
                  <p className="text-sm text-green-600 mb-1">
                    ✓ {evaluation.strengths[0]}
                  </p>
                  <p className="text-sm text-orange-600">
                    → {evaluation.improvements[0]}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIInterviewEngine;
