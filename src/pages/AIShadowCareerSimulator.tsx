
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  Clock,
  MapPin,
  DollarSign,
  Star,
  Play,
  Settings
} from "lucide-react";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";

const AIShadowCareerSimulator = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  
  const careerRoles = [
    "Software Engineer",
    "Product Manager", 
    "Data Scientist",
    "UX Designer",
    "Marketing Manager",
    "Sales Representative"
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance", 
    "Education",
    "Retail",
    "Manufacturing"
  ];

  const shadowExperiences = [
    {
      role: "Senior Software Engineer",
      company: "TechCorp",
      duration: "4 hours",
      rating: 4.8,
      participants: 156,
      description: "Experience a day in the life of a senior software engineer, from morning standups to code reviews."
    },
    {
      role: "Product Manager",
      company: "StartupXYZ",
      duration: "6 hours",
      rating: 4.9,
      participants: 89,
      description: "Shadow a product manager through strategy meetings, user research, and roadmap planning."
    },
    {
      role: "UX Designer",
      company: "DesignStudio",
      duration: "5 hours",
      rating: 4.7,
      participants: 203,
      description: "Follow a UX designer through user interviews, wireframing, and design reviews."
    }
  ];

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-modern-blue-600 to-soft-purple bg-clip-text text-transparent">
            AI Shadow Career Simulator
          </h1>
          <p className="text-gray-600">
            Experience real workplace scenarios through AI-powered career shadowing simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Experiences Completed</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">12</div>
              <p className="text-xs text-blue-600">+2 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Hours Shadowed</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">48</div>
              <p className="text-xs text-green-600">+8 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Roles Explored</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">8</div>
              <p className="text-xs text-purple-600">+1 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">4.8</div>
              <p className="text-xs text-orange-600">Excellent feedback</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-modern-blue-600" />
                Simulation Preferences
              </CardTitle>
              <CardDescription>
                Customize your shadowing experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerRoles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-modern-blue-600 hover:bg-modern-blue-700">
                Find Matching Experiences
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-modern-blue-600" />
                Available Shadow Experiences
              </CardTitle>
              <CardDescription>
                Choose from AI-powered workplace simulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shadowExperiences.map((experience, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{experience.role}</h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {experience.company}
                      </p>
                    </div>
                    <Badge className="bg-modern-blue-100 text-modern-blue-700">
                      {experience.duration}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{experience.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {experience.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {experience.participants} completed
                      </span>
                    </div>
                    <Button size="sm" className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Start Experience
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default AIShadowCareerSimulator;
