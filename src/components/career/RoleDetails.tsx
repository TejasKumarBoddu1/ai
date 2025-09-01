
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CareerNode } from "@/types/career";
import { Briefcase, DollarSign, BookOpen, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RoleDetailsProps {
  role: CareerNode;
}

export const RoleDetails = ({ role }: RoleDetailsProps) => {
  // Calculate a compatibility score between 0-100
  const calculateCompatibility = () => {
    return Math.floor(Math.random() * (95 - 65) + 65);
  };

  const compatibilityScore = calculateCompatibility();

  return (
    <Card className="border shadow-lg animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{role.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {role.yearsFromNow > 0 ? `${role.yearsFromNow} years from now` : "Current position"}
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Clock className="h-3 w-3 mr-1" />
            {role.stage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-modern-blue-500" />
            Role Description
          </h4>
          <p className="text-sm text-muted-foreground">
            {role.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-green-600" />
            Expected Salary Range
          </h4>
          <div className="bg-green-50 text-green-800 px-4 py-3 rounded-md text-center">
            <span className="text-lg font-semibold">{role.salaryRange}</span>
            <p className="text-xs text-green-700 mt-1">Annual compensation (may vary by location)</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Key Skill Requirements</h4>
          <div className="grid grid-cols-2 gap-3">
            {role.requiredSkills.map((skill, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-semibold text-gray-700">{skill.name}</p>
                <Progress value={skill.level * 20} className="h-1 mt-2" />
              </div>
            ))}
          </div>
        </div>

        {role.skillGaps && role.skillGaps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-soft-purple" />
              Skills to Develop
            </h4>
            <div className="space-y-2">
              {role.skillGaps.map((gap, index) => (
                <div key={index} className="flex flex-col p-3 bg-purple-50 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-purple-800">{gap.skill}</span>
                    {gap.resourceUrl && (
                      <a 
                        href={gap.resourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-purple-700 mt-1">{gap.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2">Current Resume Compatibility</h4>
          <div className="flex items-center gap-3">
            <Progress value={compatibilityScore} className="h-2 flex-1" />
            <span className="text-sm font-semibold">{compatibilityScore}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Estimated compatibility based on your current resume and the role requirements
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
