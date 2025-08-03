
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Calendar, 
  Award,
  BookOpen,
  Users,
  Clock
} from "lucide-react";

interface StudentDashboardProps {
  studentData?: {
    totalSessions: number;
    averageScore: number;
    confidenceLevel: number;
    weakAreas: string[];
    strongAreas: string[];
    nextGoal: string;
    recentScores: number[];
  };
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentData }) => {
  const defaultData = {
    totalSessions: 12,
    averageScore: 73,
    confidenceLevel: 68,
    weakAreas: ['Technical Questions', 'Specific Examples'],
    strongAreas: ['Communication', 'Enthusiasm'],
    nextGoal: 'Improve technical question responses',
    recentScores: [65, 72, 68, 76, 81]
  };

  const data = studentData || defaultData;
  const improvementTrend = data.recentScores.length > 1 ? 
    data.recentScores[data.recentScores.length - 1] - data.recentScores[0] : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Sessions</span>
            </div>
            <div className="text-2xl font-bold">{data.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Avg Score</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(data.averageScore)}`}>
              {data.averageScore}/100
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Confidence</span>
            </div>
            <div className="text-2xl font-bold">{data.confidenceLevel}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Trend</span>
            </div>
            <div className={`text-2xl font-bold ${improvementTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {improvementTrend >= 0 ? '+' : ''}{improvementTrend}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Progress
          </CardTitle>
          <CardDescription>Track your interview skills development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Interview Readiness</span>
                <span className="text-sm font-bold">{data.averageScore}%</span>
              </div>
              <Progress value={data.averageScore} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Confidence Level</span>
                <span className="text-sm font-bold">{data.confidenceLevel}%</span>
              </div>
              <Progress value={data.confidenceLevel} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Sessions Goal (20 total)</span>
                <span className="text-sm font-bold">{data.totalSessions}/20</span>
              </div>
              <Progress value={(data.totalSessions / 20) * 100} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths & Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Skills Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Strong Areas</h4>
                <div className="space-y-1">
                  {data.strongAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-orange-600 mb-2">Focus Areas</h4>
                <div className="space-y-1">
                  {data.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Current Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-medium mb-2">Next Goal</h4>
                <p className="text-sm text-muted-foreground">{data.nextGoal}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Recommended Actions</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Practice 3 technical questions this week</li>
                  <li>• Record yourself answering behavioral questions</li>
                  <li>• Focus on providing specific examples with metrics</li>
                </ul>
              </div>

              <Button className="w-full">
                Start Focused Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentScores.slice(-5).reverse().map((score, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getProgressColor(score)}`} />
                  <span className="text-sm">Session {data.totalSessions - index}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={score >= 70 ? "default" : "secondary"}>
                    {score}/100
                  </Badge>
                  {index === 0 && (
                    <Badge variant="outline">Latest</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
