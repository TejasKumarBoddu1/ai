
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, Video, MessageSquare, BarChart } from "lucide-react";
import { Link } from 'react-router-dom';

const InterviewCoachCard = () => {
  return (
    <Card className="overflow-hidden border shadow-md">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/40 to-purple-500/40 rounded-bl-full" />
      
      <CardHeader className="pb-2">
        <Badge className="w-fit mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200">New & Improved</Badge>
        <CardTitle className="flex items-center text-xl">
          <div className="mr-2 bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 rounded-full text-white">
            <Users className="h-5 w-5" />
          </div>
          QwiXed360 AI Interview Coach
        </CardTitle>
        <CardDescription>
          Practice for interviews with AI-powered feedback and coaching
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-5 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center p-2 bg-blue-50 rounded-lg">
            <Video className="h-4 w-4 text-blue-500 mb-1" />
            <span className="text-xs text-center font-medium text-blue-700">Voice Analysis</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-purple-50 rounded-lg">
            <MessageSquare className="h-4 w-4 text-purple-500 mb-1" />
            <span className="text-xs text-center font-medium text-purple-700">Custom Questions</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-teal-50 rounded-lg">
            <BarChart className="h-4 w-4 text-teal-500 mb-1" />
            <span className="text-xs text-center font-medium text-teal-700">Performance Report</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Practice completion</span>
            <span className="font-medium">75%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>
        
        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white">
          <Link to="/interview-coach" className="flex items-center justify-center">
            Continue Practice
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default InterviewCoachCard;
