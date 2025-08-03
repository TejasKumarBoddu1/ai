
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Video, Users, BarChart3, CheckCircle2, Clock } from "lucide-react";

export const InterviewCoachComponent: React.FC = () => {
  return (
    <div className="container max-w-7xl py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Interview Coach</h1>
          <p className="text-muted-foreground">
            Practice and improve your interview skills with our AI-powered interview coach
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Practice Interview</CardTitle>
                <CardDescription>Select a mode to start practicing</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                            <MessageSquare className="h-6 w-6 text-blue-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Text-based Interview</h3>
                            <p className="text-muted-foreground mb-4">
                              Practice answering common interview questions through text
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-indigo-100 p-3 rounded-full w-fit mb-4">
                            <Video className="h-6 w-6 text-indigo-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Video Interview</h3>
                            <p className="text-muted-foreground mb-4">
                              Practice with video recording and get feedback on your body language
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
                            <Users className="h-6 w-6 text-purple-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Mock Interview</h3>
                            <p className="text-muted-foreground mb-4">
                              Simulate a full interview experience with our AI interviewer
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-green-100 p-3 rounded-full w-fit mb-4">
                            <MessageSquare className="h-6 w-6 text-green-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Frontend Development</h3>
                            <p className="text-muted-foreground mb-4">
                              Practice technical questions for frontend development roles
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-teal-100 p-3 rounded-full w-fit mb-4">
                            <MessageSquare className="h-6 w-6 text-teal-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Backend Development</h3>
                            <p className="text-muted-foreground mb-4">
                              Practice technical questions for backend development roles
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-amber-100 p-3 rounded-full w-fit mb-4">
                            <MessageSquare className="h-6 w-6 text-amber-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Data Science</h3>
                            <p className="text-muted-foreground mb-4">
                              Practice technical questions for data science and analytics roles
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="behavioral">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-rose-100 p-3 rounded-full w-fit mb-4">
                            <MessageSquare className="h-6 w-6 text-rose-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Leadership & Teamwork</h3>
                            <p className="text-muted-foreground mb-4">
                              Practice behavioral questions about leadership and teamwork
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-cyan-100 p-3 rounded-full w-fit mb-4">
                            <MessageSquare className="h-6 w-6 text-cyan-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Problem Solving</h3>
                            <p className="text-muted-foreground mb-4">
                              Practice behavioral questions about handling challenges
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-6">
                        <div className="flex flex-col h-full">
                          <div className="bg-fuchsia-100 p-3 rounded-full w-fit mb-4">
                            <MessageSquare className="h-6 w-6 text-fuchsia-700" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">Cultural Fit</h3>
                            <p className="text-muted-foreground mb-4">
                              Practice behavioral questions about values and cultural alignment
                            </p>
                            <Button className="w-full mt-auto">Start Practice</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your interview practice progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Sessions completed</span>
                        <span className="text-sm font-bold">12/20</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Communication skills</span>
                        <span className="text-sm font-bold">70%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Technical knowledge</span>
                        <span className="text-sm font-bold">85%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-purple-600 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>Your last interview practice sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mt-0.5">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Frontend Developer Interview</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Yesterday</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-green-600">Score: 8/10</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mt-0.5">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Behavioral Interview</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>3 days ago</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-green-600">Score: 7/10</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mt-0.5">
                        <CheckCircle2 className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-medium">Technical Assessment</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>1 week ago</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span className="text-xs text-yellow-600">Score: 6/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCoachComponent;
