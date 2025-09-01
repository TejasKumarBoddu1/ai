
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, CheckCircle, ArrowRight } from "lucide-react";
import { TestInfo } from "@/types/certification";
import { Link } from 'react-router-dom';

interface MCQTestListProps {
  tests: TestInfo[];
  userCertificates?: string[]; // IDs of tests the user has certificates for
}

const MCQTestList = ({ tests, userCertificates = [] }: MCQTestListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.map((test) => {
        const hasCertificate = userCertificates.includes(test.id);
        
        return (
          <Card key={test.id} className="h-full flex flex-col">
            <CardHeader className={`pb-3 ${hasCertificate ? 'bg-gradient-to-r from-green-50 to-green-100' : ''}`}>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{test.title}</CardTitle>
                {hasCertificate && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    <Trophy className="h-3 w-3 mr-1" />
                    Certified
                  </Badge>
                )}
              </div>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {test.timeLimit} minutes
                  </span>
                  <span>{test.questionCount} questions</span>
                </div>
                
                <ul className="space-y-2 text-sm">
                  {test.topics.map((topic, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2">
              <Button 
                asChild 
                variant={hasCertificate ? "outline" : "default"} 
                className="w-full"
              >
                <Link to={`/certification/${test.id}`}>
                  {hasCertificate ? (
                    <>View Certificate</>
                  ) : (
                    <>
                      Start Test
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default MCQTestList;
