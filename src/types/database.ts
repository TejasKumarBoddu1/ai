
export interface JobApplication {
  id: string;
  user_id: string;
  job_title: string;
  company: string;
  location: string | null;
  status: string;
  date_applied: string;
  next_step: string | null;
  progress: number;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserAnalytics {
  id: string;
  user_id: string;
  applications_count: number;
  interviews_count: number;
  response_rate: number;
  offers_count: number;
  updated_at: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
  salary_range: string | null;
  requirements: string | null;
  job_type: string | null;
  posted_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_name: string | null;
  title: string;
  description: string;
  skills_required: string[] | null;
  experience_level: string | null;
  employment_type: string | null;
  work_location: string | null;
  department: string | null;
  job_category: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  application_deadline: string | null;
  start_date: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  benefits: string | null;
  requirements: string | null;
  education_requirements: string | null;
  location: string | null;
  job_type: string | null;
  salary_range: string | null;
  company_id: string;
  assigned_hr_id: string | null;
  status: string | null;
  posted_date: string | null;
  ats_minimum_score: number;
  created_at: string;
  updated_at: string;
}
