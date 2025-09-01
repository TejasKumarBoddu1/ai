
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  date: string;
  url: string;
  tags?: string[];
  salary?: string;
  platform: 'arbeitnow'; // Changed from 'indeed' to 'arbeitnow'
}

export interface JobFilter {
  jobType?: string;
  experience?: string[];
  datePosted?: string;
  remote?: boolean;
  keywordMatch?: string[]; // For matching with resume skills
  employmentType?: string; // For API parameter
  salary?: string; // For filtering by salary range
}
