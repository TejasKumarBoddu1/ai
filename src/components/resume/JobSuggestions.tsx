
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Building, MapPin, ExternalLink, Search, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { JobListing } from "@/types/job";
import { getJobRecommendations } from "@/utils/jobBoardApi";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface JobSuggestionsProps {
  skills: string[];
  jobTitle: string;
  location?: string;
}

const JobSuggestions = ({ skills, jobTitle, location }: JobSuggestionsProps) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Extract all skills from different skill categories
        const allSkills = Array.isArray(skills) ? 
          skills : 
          Object.values(skills).filter(Boolean) as string[];
        
        console.log("Loading job recommendations with skills:", allSkills, "jobTitle:", jobTitle);
        
        if (!allSkills.length && !jobTitle) {
          setJobs([]);
          setLoading(false);
          return;
        }
        
        const jobRecommendations = await getJobRecommendations(allSkills, jobTitle, location);
        console.log("Job recommendations loaded:", jobRecommendations?.length || 0);
        setJobs(jobRecommendations.slice(0, 5)); // Only show top 5 recommendations
      } catch (error) {
        console.error("Error loading job recommendations:", error);
        setError("Failed to load job recommendations. Please try again later.");
        toast({
          title: "Error loading jobs",
          description: "Could not load job recommendations. Please check your connection and try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (skills && (Array.isArray(skills) ? skills.length > 0 : Object.values(skills).some(Boolean)) || jobTitle) {
      loadJobs();
    } else {
      setLoading(false);
    }
  }, [skills, jobTitle, location]);

  if (loading) {
    return (
      <Card className="border shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <p className="text-muted-foreground">{error}</p>
            <Link to="/job-board">
              <Button variant="link" className="mt-2">
                <Search className="h-4 w-4 mr-2" />
                Browse all jobs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="border shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No matching jobs found</p>
            <Link to="/job-board">
              <Button variant="link" className="mt-2">
                <Search className="h-4 w-4 mr-2" />
                Browse all jobs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle>Recommended Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm text-black dark:text-black">{job.title}</h3>
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center text-xs"
                >
                  Apply
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                <span className="inline-flex items-center text-black dark:text-black">
                  <Building className="h-3 w-3 mr-1" />
                  {job.company}
                </span>
                <span className="inline-flex items-center text-black dark:text-black">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </span>
                <Badge 
                  variant="outline" 
                  className="text-xs px-1.5 py-0 h-5 bg-blue-100 text-blue-800"
                >
                  <span className="flex items-center">
                    <Briefcase className="h-3 w-3 mr-1" />
                    <span className="ml-1">Arbeitnow</span>
                  </span>
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/job-board">
            <Button variant="outline" size="sm" className="w-full bg-white text-black hover:bg-gray-100">
              <Search className="h-4 w-4 mr-2" />
              View More Jobs
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSuggestions;
