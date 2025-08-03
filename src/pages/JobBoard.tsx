
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign,
  Briefcase,
  Filter,
  BookmarkPlus,
  ExternalLink
} from "lucide-react";
import StudentDashboardLayout from "@/components/layout/StudentDashboardLayout";

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const jobListings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      posted: "2 days ago",
      description: "Join our growing engineering team to build scalable web applications...",
      skills: ["React", "Node.js", "TypeScript", "AWS"]
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $150k",
      posted: "1 week ago",
      description: "Lead product strategy and roadmap for our flagship product...",
      skills: ["Product Strategy", "Agile", "Analytics", "User Research"]
    },
    {
      id: 3,
      title: "UX Designer",
      company: "DesignStudio",
      location: "New York, NY",
      type: "Contract",
      salary: "$80k - $120k",
      posted: "3 days ago",
      description: "Create beautiful and intuitive user experiences for web and mobile...",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "DataCorp",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$110k - $160k",
      posted: "5 days ago",
      description: "Analyze large datasets to derive insights and build predictive models...",
      skills: ["Python", "Machine Learning", "SQL", "Tableau"]
    }
  ];

  const filteredJobs = jobListings.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-modern-blue-600 to-soft-purple bg-clip-text text-transparent">
            Job Board
          </h1>
          <p className="text-gray-600">
            Discover opportunities that match your skills and career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">1,234</div>
              <p className="text-xs text-blue-600">+45 new today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Applied</CardTitle>
              <BookmarkPlus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">23</div>
              <p className="text-xs text-green-600">+3 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Saved</CardTitle>
              <BookmarkPlus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">56</div>
              <p className="text-xs text-purple-600">For later review</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Interviews</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">4</div>
              <p className="text-xs text-orange-600">Scheduled</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-modern-blue-600" />
              Search Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.posted}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-modern-blue-100 text-modern-blue-700 mb-2">
                        {job.type}
                      </Badge>
                      <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {job.salary}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{job.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <BookmarkPlus className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" className="bg-modern-blue-600 hover:bg-modern-blue-700">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default JobBoard;
