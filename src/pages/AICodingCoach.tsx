
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Zap, 
  Brain, 
  BookOpen, 
  Target, 
  Trophy,
  Play,
  CheckCircle2,
  Clock,
  Star
} from "lucide-react";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";

const AICodingCoach = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const skillProgression = [
    { name: "JavaScript Fundamentals", progress: 85, level: "Advanced" },
    { name: "React Components", progress: 70, level: "Intermediate" },
    { name: "API Integration", progress: 60, level: "Intermediate" },
    { name: "Database Design", progress: 40, level: "Beginner" },
  ];

  const practiceExercises = [
    { title: "Build a Todo App", difficulty: "Beginner", duration: "2 hours", completed: true },
    { title: "Create REST API", difficulty: "Intermediate", duration: "4 hours", completed: false },
    { title: "Real-time Chat App", difficulty: "Advanced", duration: "6 hours", completed: false },
  ];

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-modern-blue-600 to-soft-purple bg-clip-text text-transparent">
            AI Coding Coach
          </h1>
          <p className="text-gray-600">
            Accelerate your coding skills with personalized AI-powered learning and practice.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Skills Learned</CardTitle>
                  <Brain className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">24</div>
                  <p className="text-xs text-blue-600">+3 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Exercises Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">47</div>
                  <p className="text-xs text-green-600">+5 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Practice Hours</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">156</div>
                  <p className="text-xs text-purple-600">+8 this week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-modern-blue-600" />
                    Skill Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillProgression.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <Badge variant={skill.level === "Advanced" ? "default" : skill.level === "Intermediate" ? "secondary" : "outline"}>
                          {skill.level}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-modern-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{skill.progress}% complete</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-modern-blue-600" />
                    Recommended Practice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {practiceExercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{exercise.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {exercise.difficulty}
                          </Badge>
                          <span>{exercise.duration}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={exercise.completed ? "outline" : "default"}
                        className="flex items-center gap-1"
                      >
                        {exercise.completed ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Done
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coding Practice</CardTitle>
                <CardDescription>
                  Practice coding with AI-generated exercises tailored to your skill level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Start Coding Practice</h3>
                  <p className="text-gray-500 mb-4">Choose a topic and begin practicing with AI guidance</p>
                  <Button className="bg-modern-blue-600 hover:bg-modern-blue-700">
                    <Play className="mr-2 h-4 w-4" />
                    Start Practice Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Coding Challenges
                </CardTitle>
                <CardDescription>
                  Test your skills with progressively difficult coding challenges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Challenge Yourself</h3>
                  <p className="text-gray-500 mb-4">Take on coding challenges to earn points and badges</p>
                  <Button variant="outline">
                    <Zap className="mr-2 h-4 w-4" />
                    View Challenges
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Learning Progress
                </CardTitle>
                <CardDescription>
                  Track your coding journey and achievements over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Progress Analytics</h3>
                  <p className="text-gray-500 mb-4">Detailed insights into your learning progress</p>
                  <Button variant="outline">
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
};

export default AICodingCoach;
