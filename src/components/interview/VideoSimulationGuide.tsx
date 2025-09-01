
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Users, FileText, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const VideoSimulationGuide = () => {
  const { toast } = useToast();
  
  const handleButtonClick = (action: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `The ${action} feature will be available in the next update.`,
    });
  };
  
  return (
    <Card className="shadow-md mt-6">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <CardTitle className="flex items-center">
          <Video className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Interview Preparation Tools
        </CardTitle>
        <CardDescription>
          Enhance your interview experience with these helpful resources
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">
                Watch expert-led videos on answering common interview questions effectively
              </p>
              <Button 
                variant="link" 
                className="px-0 text-blue-600 dark:text-blue-400"
                onClick={() => handleButtonClick("Video Tutorials")}
              >
                Watch Now
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Interview Guides</h3>
              <p className="text-sm text-muted-foreground">
                Download comprehensive guides for different interview types
              </p>
              <Button 
                variant="link" 
                className="px-0 text-purple-600 dark:text-purple-400"
                onClick={() => handleButtonClick("Interview Guides")}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Live Simulation</h3>
              <p className="text-sm text-muted-foreground">
                Practice with real-time AI feedback that simulates a live interview
              </p>
              <Button 
                variant="link" 
                className="px-0 text-green-600 dark:text-green-400"
                onClick={() => handleButtonClick("Live Simulation")}
              >
                Try Simulation
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
              <Download className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium">Performance Reports</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed PDF reports analyzing your interview performance
              </p>
              <Button 
                variant="link" 
                className="px-0 text-amber-600 dark:text-amber-400"
                onClick={() => handleButtonClick("Performance Reports")}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
