
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { InterviewFeedback } from "@/types/interview";
import { motion } from "framer-motion";

interface InterviewFeedbackCardProps {
  feedback: InterviewFeedback;
}

export const InterviewFeedbackCard = ({ feedback }: InterviewFeedbackCardProps) => {
  return (
    <Card className="border border-blue-200 dark:border-blue-900/60 shadow-lg">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-2">
        <CardTitle className="text-lg">AI Feedback</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-green-600 dark:text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-500">What Went Well</h4>
              <p className="text-sm text-muted-foreground">{feedback.strengths}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-red-600 dark:text-red-500">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-red-700 dark:text-red-500">Areas to Improve</h4>
              <p className="text-sm text-muted-foreground">{feedback.improvements}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-amber-600 dark:text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-amber-700 dark:text-amber-500">Suggestions</h4>
              <p className="text-sm text-muted-foreground">{feedback.suggestions}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-md text-center">
            <div 
              className="text-lg font-bold" 
              style={{ 
                color: getScoreColor(feedback.scores.relevance) 
              }}
            >
              {feedback.scores.relevance}%
            </div>
            <p className="text-xs text-muted-foreground">Relevance</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-md text-center">
            <div 
              className="text-lg font-bold" 
              style={{ 
                color: getScoreColor(feedback.scores.clarity) 
              }}
            >
              {feedback.scores.clarity}%
            </div>
            <p className="text-xs text-muted-foreground">Clarity</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-md text-center">
            <div 
              className="text-lg font-bold" 
              style={{ 
                color: getScoreColor(feedback.scores.depth) 
              }}
            >
              {feedback.scores.depth}%
            </div>
            <p className="text-xs text-muted-foreground">Technical Depth</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"; // Green for high scores
  if (score >= 60) return "#eab308"; // Yellow for medium scores
  return "#ef4444"; // Red for low scores
}
