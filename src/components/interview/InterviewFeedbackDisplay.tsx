
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Lightbulb, TrendingUp, MessageSquare, User } from "lucide-react";
import { InterviewQuestion, InterviewFeedback } from '@/types/interview';

interface InterviewFeedbackDisplayProps {
  question: InterviewQuestion;
  answer: string;
  feedback: InterviewFeedback | null;
  questionNumber: number;
}

const InterviewFeedbackDisplay: React.FC<InterviewFeedbackDisplayProps> = ({
  question,
  answer,
  feedback,
  questionNumber
}) => {
  if (!feedback) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {questionNumber}
            </span>
            Question {questionNumber}
            <Badge variant="outline">{question.type}</Badge>
          </CardTitle>
          {feedback.overall && (
            <Badge variant={getScoreVariant(feedback.overall.score)} className="text-lg px-3 py-1">
              {feedback.overall.score}%
            </Badge>
          )}
        </div>
        <CardDescription className="mt-2">
          <div className="bg-muted p-3 rounded-lg mb-3">
            <p className="font-medium text-foreground">{question.question}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Your Answer:</span>
            </div>
            <p className="text-sm">{answer}</p>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Scores */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(feedback.scores.relevance)}`}>
              {feedback.scores.relevance}%
            </div>
            <div className="text-sm text-muted-foreground">Relevance</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(feedback.scores.clarity)}`}>
              {feedback.scores.clarity}%
            </div>
            <div className="text-sm text-muted-foreground">Clarity</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(feedback.scores.depth)}`}>
              {feedback.scores.depth}%
            </div>
            <div className="text-sm text-muted-foreground">Depth</div>
          </div>
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-800">{feedback.strengths}</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
                <AlertCircle className="h-4 w-4" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-800">{feedback.improvements}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback Sections */}
        {feedback.technical && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Technical Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Technical Score:</span>
                <Badge variant={getScoreVariant(feedback.technical.score)}>
                  {feedback.technical.score}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-sm text-green-700">Strengths:</h4>
                  <ul className="text-sm text-muted-foreground ml-4">
                    {feedback.technical.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-orange-700">Weaknesses:</h4>
                  <ul className="text-sm text-muted-foreground ml-4">
                    {feedback.technical.weaknesses.map((weakness, index) => (
                      <li key={index}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {feedback.communication && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Communication Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Voice Pace:</span>
                    <span className="text-sm font-medium">{feedback.communication.voice.paceScore}%</span>
                  </div>
                  <Progress value={feedback.communication.voice.paceScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Voice Tone:</span>
                    <span className="text-sm font-medium">{feedback.communication.voice.toneScore}%</span>
                  </div>
                  <Progress value={feedback.communication.voice.toneScore} className="h-2" />
                </div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">Filler Words: </span>
                <Badge variant="outline">{feedback.communication.voice.fillerWordCount}</Badge>
                {feedback.communication.voice.fillerWords.length > 0 && (
                  <span className="text-muted-foreground ml-2">
                    ({feedback.communication.voice.fillerWords.join(', ')})
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggestions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
              <Lightbulb className="h-4 w-4" />
              Suggestions for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">{feedback.suggestions}</p>
            
            {feedback.overall?.nextSteps && (
              <div className="mt-3">
                <h4 className="font-medium text-sm mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {feedback.overall.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default InterviewFeedbackDisplay;
