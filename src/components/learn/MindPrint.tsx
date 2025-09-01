
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Brain, BarChart2, Lightbulb, Circle, CheckCircle, Clock, BookOpen, Code } from "lucide-react";

export const MindPrint = () => {
  return (
    <div className="container max-w-7xl py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">MindPrint Assessment</h1>
          <p className="text-muted-foreground">
            Discover your unique cognitive profile and learning style preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Assessment Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  <CardTitle>Cognitive Assessment</CardTitle>
                </div>
                <CardDescription>
                  Complete the assessment to generate your personalized MindPrint profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="about">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-4 pt-4">
                    <div className="rounded-lg bg-muted p-6">
                      <h3 className="text-lg font-medium mb-3">What is MindPrint?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        MindPrint is a scientific cognitive assessment that identifies your unique learning profile across 
                        multiple cognitive domains. Understanding your cognitive strengths and challenges can help you
                        optimize your learning and career development approaches.
                      </p>
                      
                      <h4 className="font-medium mb-2">The assessment measures:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Circle className="h-2 w-2 text-indigo-600" />
                          <span>Memory & processing abilities</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Circle className="h-2 w-2 text-indigo-600" />
                          <span>Executive functioning skills</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Circle className="h-2 w-2 text-indigo-600" />
                          <span>Complex reasoning capabilities</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Circle className="h-2 w-2 text-indigo-600" />
                          <span>Verbal and spatial abilities</span>
                        </li>
                      </ul>
                      
                      <div className="mt-6 flex flex-col gap-2">
                        <p className="text-sm font-medium">Assessment details:</p>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Duration: Approximately 45-60 minutes</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Format: Interactive exercises and questions</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full">Start Assessment</Button>
                  </TabsContent>
                  
                  <TabsContent value="assessment" className="pt-4">
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span>Progress</span>
                        <span className="font-medium">2/8 sections completed</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      
                      <div className="grid grid-cols-8 gap-2 mt-2">
                        <div className="h-1 bg-primary rounded"></div>
                        <div className="h-1 bg-primary rounded"></div>
                        <div className="h-1 bg-muted rounded"></div>
                        <div className="h-1 bg-muted rounded"></div>
                        <div className="h-1 bg-muted rounded"></div>
                        <div className="h-1 bg-muted rounded"></div>
                        <div className="h-1 bg-muted rounded"></div>
                        <div className="h-1 bg-muted rounded"></div>
                      </div>
                    </div>
                    
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Section 3: Verbal Reasoning</CardTitle>
                        <CardDescription>
                          This section will assess your verbal reasoning abilities through a series of questions.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border p-4 rounded-lg">
                          <p className="font-medium mb-3">Question 1:</p>
                          <p className="mb-4">Select the word that best completes the analogy:</p>
                          <p className="mb-4 text-center font-medium">River is to Bank as Road is to _______</p>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="justify-start">Sidewalk</Button>
                            <Button variant="outline" className="justify-start">Street</Button>
                            <Button variant="outline" className="justify-start">Car</Button>
                            <Button variant="outline" className="justify-start">Traffic</Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">Previous</Button>
                        <Button>Next</Button>
                      </CardFooter>
                    </Card>
                    
                    <div className="flex justify-between">
                      <Button variant="outline">Save Progress</Button>
                      <Button variant="outline">Pause Assessment</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="results" className="space-y-4 pt-4">
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <BarChart2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-1">No Results Available</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete the assessment to view your personalized cognitive profile
                      </p>
                      <Button variant="outline" size="sm">Take Assessment</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Learning Strategies Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  <CardTitle>Personalized Learning Strategies</CardTitle>
                </div>
                <CardDescription>
                  Based on your cognitive profile, these strategies will help you learn more effectively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Learning Strategies Not Available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete the assessment to receive personalized learning strategies
                  </p>
                  <Button variant="outline" size="sm">Take Assessment</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Profile Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your MindPrint Profile</CardTitle>
                  <CardDescription>
                    A summary of your cognitive strengths
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
                      <span className="text-sm">Verbal Reasoning</span>
                    </div>
                    <span className="text-sm font-medium">--</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">Working Memory</span>
                    </div>
                    <span className="text-sm font-medium">--</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                      <span className="text-sm">Processing Speed</span>
                    </div>
                    <span className="text-sm font-medium">--</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-amber-600 rounded-full"></div>
                      <span className="text-sm">Spatial Perception</span>
                    </div>
                    <span className="text-sm font-medium">--</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                      <span className="text-sm">Executive Functions</span>
                    </div>
                    <span className="text-sm font-medium">--</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Skill Development Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Skill Development</CardTitle>
                  <CardDescription>
                    Based on your cognitive profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border p-4 rounded-lg flex items-start gap-3">
                    <div className="mt-0.5">
                      <Code className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Complete the assessment</p>
                      <p className="text-sm text-muted-foreground">
                        Personalized recommendations will appear after assessment completion
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* FAQ Card */}
              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b pb-3">
                    <p className="font-medium mb-1">How accurate is this assessment?</p>
                    <p className="text-sm text-muted-foreground">
                      Our assessment is backed by cognitive science research and has been validated with thousands of users.
                    </p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <p className="font-medium mb-1">How long does it take?</p>
                    <p className="text-sm text-muted-foreground">
                      The full assessment takes approximately 45-60 minutes to complete.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">Can I pause and resume?</p>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can pause at any time and your progress will be saved.
                    </p>
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

export default MindPrint;
