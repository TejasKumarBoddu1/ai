
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2, Save, ArrowLeft, Briefcase, MapPin, DollarSign, Calendar, Users, Target, Brain } from "lucide-react";

type JobStatus = "Open" | "Closed" | "On Hold" | "Draft" | "Filled";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary_range: "",
    employment_type: "",
    experience_level: "",
    department: "",
    skills_required: [],
    application_deadline: "",
    ats_minimum_score: 70,
    status: "Open" as JobStatus
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch job details",
            variant: "destructive"
          });
          navigate('/hr-dashboard/jobs');
          return;
        }

        setJob(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          requirements: data.requirements || "",
          location: data.location || "",
          salary_range: data.salary_range || "",
          employment_type: data.employment_type || "",
          experience_level: data.experience_level || "",
          department: data.department || "",
          skills_required: data.skills_required || [],
          application_deadline: data.application_deadline || "",
          ats_minimum_score: data.ats_minimum_score || 70,
          status: (data.status as JobStatus) || "Open"
        });
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, navigate, toast]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (skillsText: string) => {
    const skills = skillsText.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skills_required: skills }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('jobs')
        .update({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          location: formData.location,
          salary_range: formData.salary_range,
          employment_type: formData.employment_type,
          experience_level: formData.experience_level,
          department: formData.department,
          skills_required: formData.skills_required,
          application_deadline: formData.application_deadline,
          ats_minimum_score: formData.ats_minimum_score,
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update job",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Job updated successfully"
      });

      navigate(`/hr-dashboard/jobs/${id}`);
    } catch (err) {
      console.error("Error updating job:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/hr-dashboard/jobs/${id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Job
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Job Position</h1>
              <p className="text-gray-600 mt-1">Update job details and requirements</p>
            </div>
          </div>
          <Badge className={`${formData.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {formData.status}
          </Badge>
        </div>

        {/* Main Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Job Information
            </CardTitle>
            <CardDescription>Update the basic job details and requirements</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold text-gray-700">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="e.g. Engineering"
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Salary Range
                </Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => handleInputChange('salary_range', e.target.value)}
                  placeholder="e.g. $120,000 - $180,000"
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Employment Type</Label>
                <Select value={formData.employment_type} onValueChange={(value) => handleInputChange('employment_type', value)}>
                  <SelectTrigger className="h-12 border-gray-200">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Experience Level</Label>
                <Select value={formData.experience_level} onValueChange={(value) => handleInputChange('experience_level', value)}>
                  <SelectTrigger className="h-12 border-gray-200">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                    <SelectItem value="Lead/Principal">Lead/Principal</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ATS Configuration */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border-2 border-cyan-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Label className="text-lg font-bold text-gray-900">ATS Configuration</Label>
                  <p className="text-sm text-gray-600">Set the minimum score for automatic screening</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ats_score" className="text-sm font-semibold text-gray-700">
                  Minimum ATS Score Required (0-100)
                </Label>
                <Input
                  id="ats_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.ats_minimum_score}
                  onChange={(e) => handleInputChange('ats_minimum_score', parseInt(e.target.value))}
                  className="h-12 border-gray-200 focus:border-cyan-500"
                />
                <p className="text-xs text-gray-500">
                  Applications scoring below this threshold will be automatically rejected
                </p>
              </div>
            </div>

            {/* Description and Requirements */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the role, responsibilities, and what the candidate will be working on..."
                  className="min-h-[120px] border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-semibold text-gray-700">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the required qualifications, experience, and skills needed for this position..."
                  className="min-h-[100px] border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-semibold text-gray-700">Required Skills</Label>
                <Input
                  id="skills"
                  value={formData.skills_required.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="e.g. JavaScript, React, Node.js, Python"
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">Separate skills with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Application Deadline
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                  className="h-12 border-gray-200 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Job Status</Label>
                <Select value={formData.status} onValueChange={(value: JobStatus) => handleInputChange('status', value)}>
                  <SelectTrigger className="h-12 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Filled">Filled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/hr-dashboard/jobs/${id}`)}
            className="px-8 py-3"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formData.title || !formData.description}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditJob;
