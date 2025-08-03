
import { JobListing } from "@/types/job";

// API endpoint for Arbeitnow
const ARBEITNOW_API_URL = "https://www.arbeitnow.com/api/job-board-api";

interface JobSearchParams {
  query?: string;
  location?: string;
  page?: number;
  remote?: boolean;
  employment_type?: string;
  experience?: string;
}

// Helper function to strip HTML tags from a string
const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Function to search for jobs using the Arbeitnow API
export const fetchJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const query = params.query || "";
    const location = params.location || "";
    const page = params.page || 1;
    
    console.log(`Fetching jobs from Arbeitnow API for: ${query} in ${location}`);
    
    // Construct search query parameters
    let queryParams = new URLSearchParams();
    
    if (query) queryParams.append("search", query);
    if (location) queryParams.append("location", location);
    if (params.remote) queryParams.append("remote", "true");
    if (params.employment_type) queryParams.append("employment_type", params.employment_type);
    
    // Add pagination
    queryParams.append("page", page.toString());
    
    const url = `${ARBEITNOW_API_URL}?${queryParams.toString()}`;
    
    console.log("Requesting URL:", url);
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Arbeitnow API error with status: ${response.status}`);
      throw new Error(`API returned status code ${response.status}`);
    }

    const data = await response.json();
    console.log("Arbeitnow API response data:", data);
    
    if (!data.data || data.data.length === 0) {
      console.log("No jobs found from Arbeitnow API");
      return [];
    }
    
    // Map the Arbeitnow API response to our JobListing interface
    return data.data.map((job: any) => {
      // Extract tags from the tag array or create empty array if none
      const tags = job.tags || [];
      
      // Format the location - handle both string and array types
      let locationFormatted = "Not specified";
      if (job.location) {
        if (Array.isArray(job.location)) {
          locationFormatted = job.location.join(", ");
        } else if (typeof job.location === 'string') {
          locationFormatted = job.location;
        } else {
          locationFormatted = params.location || "Not specified";
        }
      }
      
      // Strip HTML tags from the description
      const cleanDescription = stripHtmlTags(job.description);
      
      return {
        id: job.slug || `job-${Math.random().toString(36).substring(7)}`,
        title: job.title || "Job Position",
        company: job.company_name || "Company",
        location: locationFormatted,
        description: cleanDescription || "No description available",
        date: job.created_at || new Date().toISOString(),
        url: job.url || job.application_url || "https://arbeitnow.com",
        tags: tags.slice(0, 10), // Limit to 10 tags for display purposes
        salary: job.salary || "Not specified",
        platform: 'arbeitnow'
      };
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Function to get job recommendations based on resume skills
export const getJobRecommendations = async (skills: string[], jobTitle: string, location?: string): Promise<JobListing[]> => {
  // Extract keywords from skills
  const skillsArray = Array.isArray(skills) ? 
    skills : 
    Object.values(skills).filter(Boolean) as string[];
  
  // Use job title as primary search and supplement with top skills
  const searchQuery = jobTitle || skillsArray.slice(0, 3).join(" ");
  
  try {
    console.log(`Getting job recommendations for query: ${searchQuery}`);
    
    // Do a regular search using the most relevant skills or job title
    const jobs = await fetchJobs({
      query: searchQuery,
      location: location,
      page: 1
    });
    
    return jobs;
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    throw error;
  }
};
