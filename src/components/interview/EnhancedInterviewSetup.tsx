
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, User, Briefcase, Clock, Target } from "lucide-react";
import { InterviewSettings } from '@/types/interview';

interface EnhancedInterviewSetupProps {
  onSubmit: (settings: InterviewSettings) => void;
  isLoading: boolean;
}

const EnhancedInterviewSetup: React.FC<EnhancedInterviewSetupProps> = ({ onSubmit, isLoading }) => {
  const [settings, setSettings] = useState<InterviewSettings>({
    jobTitle: '',
    jobLevel: 'mid',
    targetCompany: '',
    difficulty: 'medium',
    interviewType: 'mixed',
    yearsOfExperience: '3-5',
    duration: 15,
    enableRealTimeFeedback: true,
    resumeText: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Tell us about yourself and your career goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={settings.resumeText || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, resumeText: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Select 
              value={settings.yearsOfExperience} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, yearsOfExperience: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                <SelectItem value="2-3">2-3 years (Junior)</SelectItem>
                <SelectItem value="3-5">3-5 years (Mid Level)</SelectItem>
                <SelectItem value="5-8">5-8 years (Senior)</SelectItem>
                <SelectItem value="8+">8+ years (Lead/Principal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Information
          </CardTitle>
          <CardDescription>
            Specify the role and company you're targeting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="job-title">Job Title *</Label>
            <Select 
              value={settings.jobTitle} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, jobTitle: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the position you're applying for" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                <SelectItem value="UX Designer">UX Designer</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Customer Success Manager">Customer Success Manager</SelectItem>
                <SelectItem value="HR Specialist">HR Specialist</SelectItem>
                <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="job-level">Job Level</Label>
            <Select 
              value={settings.jobLevel} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, jobLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Lead/Principal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="company">Target Company (Optional)</Label>
            <Input
              id="company"
              placeholder="e.g., Google, Microsoft, Amazon"
              value={settings.targetCompany || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, targetCompany: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Interview Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Interview Configuration
          </CardTitle>
          <CardDescription>
            Customize your interview experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="duration">Interview Duration</Label>
            <Select 
              value={settings.duration?.toString()} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, duration: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Interview Difficulty</Label>
            <Select 
              value={settings.difficulty} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, difficulty: value as 'easy' | 'medium' | 'hard' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy - Basic questions</SelectItem>
                <SelectItem value="medium">Medium - Standard difficulty</SelectItem>
                <SelectItem value="hard">Hard - Challenging questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="interview-type">Interview Type</Label>
            <Select 
              value={settings.interviewType} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, interviewType: value as 'technical' | 'behavioral' | 'mixed' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="behavioral">Behavioral - Soft skills focused</SelectItem>
                <SelectItem value="technical">Technical - Hard skills focused</SelectItem>
                <SelectItem value="mixed">Mixed - Balanced approach</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !settings.jobTitle || !settings.resumeText}
      >
        {isLoading ? (
          "Starting Interview..."
        ) : (
          <>
            <Clock className="mr-2 h-4 w-4" />
            Start Enhanced AI Interview
          </>
        )}
      </Button>
    </form>
  );
};

export default EnhancedInterviewSetup;
