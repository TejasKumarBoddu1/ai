
import React, { useState, useEffect } from "react";
import { Users, Search, Eye, CheckCircle, XCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Application {
  id: string;
  user_id: string;
  job_id?: string;
  job_title: string;
  company: string;
  location?: string;
  status: string;
  progress: number;
  resume_file_path?: string;
  resume_file_name?: string;
  hr_notes?: string;
  rating?: number;
  application_status?: string;
  date_applied: string;
  user_profile?: {
    full_name?: string;
    email?: string;
  };
}

const Candidates = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Get all applications from job_applications table
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*')
        .order('date_applied', { ascending: false });

      if (applicationsError) {
        console.error("Error fetching applications:", applicationsError);
        toast({
          title: "Error",
          description: "Failed to fetch applications",
          variant: "destructive"
        });
        return;
      }

      // Get user profiles for each application
      const applicationsWithProfiles = await Promise.all(
        (applicationsData || []).map(async (app) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', app.user_id)
            .single();

          return {
            ...app,
            user_profile: profileData || undefined
          };
        })
      );

      setApplications(applicationsWithProfiles);
    } catch (error) {
      console.error("Error in fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ application_status: newStatus })
        .eq('id', applicationId);

      if (error) {
        throw error;
      }

      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, application_status: newStatus }
            : app
        )
      );

      // Create notification for applicant
      const application = applications.find(app => app.id === applicationId);
      if (application) {
        await supabase
          .from('notifications')
          .insert({
            user_id: application.user_id,
            title: 'Application Status Update',
            message: `Your application for ${application.job_title} has been ${newStatus}`,
            type: newStatus === 'accepted' ? 'success' : newStatus === 'rejected' ? 'error' : 'info',
            related_application_id: applicationId
          });
      }

      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const handleNotesUpdate = async (applicationId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ hr_notes: notes })
        .eq('id', applicationId);

      if (error) {
        throw error;
      }

      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, hr_notes: notes }
            : app
        )
      );

      toast({
        title: "Notes saved",
        description: "HR notes have been updated",
      });
    } catch (error) {
      console.error("Error updating notes:", error);
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive"
      });
    }
  };

  const handleRatingUpdate = async (applicationId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ rating })
        .eq('id', applicationId);

      if (error) {
        throw error;
      }

      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, rating }
            : app
        )
      );

      toast({
        title: "Rating updated",
        description: `Rating set to ${rating} stars`,
      });
    } catch (error) {
      console.error("Error updating rating:", error);
      toast({
        title: "Error",
        description: "Failed to update rating",
        variant: "destructive"
      });
    }
  };

  const viewResume = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(filePath, 60);

      if (error) {
        throw error;
      }

      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error("Error viewing resume:", error);
      toast({
        title: "Error",
        description: "Failed to open resume",
        variant: "destructive"
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const candidateName = app.user_profile?.full_name?.toLowerCase() || '';
    const email = app.user_profile?.email?.toLowerCase() || '';
    const jobTitle = app.job_title?.toLowerCase() || '';
    
    return candidateName.includes(searchLower) || 
           email.includes(searchLower) ||
           jobTitle.includes(searchLower);
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const pipelineStats = [
    { name: 'Pending', count: applications.filter(app => app.application_status === 'pending').length, color: 'bg-yellow-500' },
    { name: 'Reviewed', count: applications.filter(app => app.application_status === 'reviewed').length, color: 'bg-blue-500' },
    { name: 'Accepted', count: applications.filter(app => app.application_status === 'accepted').length, color: 'bg-green-500' },
    { name: 'Rejected', count: applications.filter(app => app.application_status === 'rejected').length, color: 'bg-red-500' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users className="h-6 w-6" />
              Job Applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage candidate applications and resumes
            </p>
          </div>
        </div>

        {/* Application Pipeline Stats */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Application Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading pipeline data...</div>
            ) : (
              <div className="flex items-center justify-between overflow-x-auto py-2">
                {pipelineStats.map(stage => (
                  <div key={stage.name} className="flex flex-col items-center px-3 min-w-[100px]">
                    <div className={`w-full h-1.5 ${stage.color} rounded-full mb-2`}></div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{stage.name}</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{stage.count}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search applications by candidate name, email, or job title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10">Loading applications...</div>
          ) : filteredApplications.length > 0 ? (
            filteredApplications.map(application => (
              <Card key={application.id} className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Candidate Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                              {application.user_profile?.full_name ? 
                                application.user_profile.full_name.split(' ').map(n => n[0]).join('') : '??'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {application.user_profile?.full_name || 'Unknown Candidate'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {application.user_profile?.email}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(application.application_status || 'pending')}`}>
                          {application.application_status || 'pending'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Position:</span> {application.job_title}</p>
                        <p><span className="font-medium">Applied:</span> {new Date(application.date_applied).toLocaleDateString()}</p>
                        {application.resume_file_name && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Resume:</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewResume(application.resume_file_path!)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              {application.resume_file_name}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & Rating */}
                    <div className="lg:w-80 space-y-4">
                      {/* Rating */}
                      <div>
                        <Label className="text-sm font-medium">Rating</Label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`h-5 w-5 cursor-pointer ${
                                star <= (application.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                              onClick={() => handleRatingUpdate(application.id, star)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Status Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(application.id, 'accepted')}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>

                      {/* Notes */}
                      <div>
                        <Label className="text-sm font-medium">HR Notes</Label>
                        <Textarea
                          placeholder="Add notes about this candidate..."
                          value={application.hr_notes || ''}
                          onChange={(e) => handleNotesUpdate(application.id, e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              No applications found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Candidates;
