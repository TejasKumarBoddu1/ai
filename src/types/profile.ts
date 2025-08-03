
export interface UserProfile {
  id: string;
  user_id: string;
  cover_photo_url?: string;
  cover_video_url?: string;
  profile_photo_url?: string;
  professional_headline?: string;
  headline_tagline?: string;
  location?: string;
  website_url?: string;
  about_summary?: string;
  phone?: string;
  industry?: string;
  years_experience?: number;
  current_company?: string;
  current_position?: string;
  brand_logo_url?: string;
  profile_views_count?: number;
  last_profile_view?: string;
  verification_status?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: string;
  url: string;
  created_at: string;
}

export interface Experience {
  id: string;
  user_id: string;
  job_title: string;
  company_name: string;
  company_logo_url?: string;
  employment_type?: string;
  location?: string;
  is_remote: boolean;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  skills_used?: string[];
  team_size?: number;
  budget_managed?: number;
  revenue_impact?: string;
  cost_savings?: string;
  reporting_to?: string;
  direct_reports?: number;
  achievements?: string[];
  media_links?: string[];
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  user_id: string;
  institution_name: string;
  institution_logo_url?: string;
  degree: string;
  field_of_study?: string;
  gpa?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at: string;
}

export interface Skill {
  id: string;
  user_id: string;
  skill_name: string;
  category?: string;
  proficiency_level?: number;
  endorsement_count: number;
  verification_status?: string;
  assessment_score?: number;
  market_demand_score?: number;
  salary_impact_percentage?: number;
  last_used_date?: string;
  years_experience?: number;
  created_at: string;
}

export interface Certification {
  id: string;
  user_id: string;
  certification_name: string;
  issuing_organization: string;
  certificate_url?: string;
  certificate_file_path?: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  verification_url?: string;
  verification_status?: string;
  industry_category?: string;
  skill_level?: string;
  ce_credits?: number;
  blockchain_hash?: string;
  ai_extracted_data?: any;
  view_count?: number;
  thumbnail_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  project_name: string;
  description?: string;
  thumbnail_url?: string;
  technologies_used?: string[];
  start_date?: string;
  end_date?: string;
  team_size?: number;
  project_url?: string;
  repository_url?: string;
  created_at: string;
}

export interface ResumeFile {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  is_primary: boolean;
  ats_score?: number;
  version_number?: number;
  industry_optimized_for?: string;
  download_count?: number;
  last_downloaded?: string;
  keywords?: string[];
  thumbnail_url?: string;
  created_at: string;
}

export interface ProfileAnalytics {
  id: string;
  user_id: string;
  date_recorded: string;
  profile_views: number;
  resume_downloads: number;
  contact_requests: number;
  search_appearances: number;
  created_at: string;
  updated_at: string;
}

export interface JobMatch {
  id: string;
  user_id: string;
  job_title: string;
  company_name: string;
  match_score: number;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  job_type?: string;
  posted_date?: string;
  applicant_count?: number;
  match_reasons?: string[];
  missing_skills?: string[];
  external_job_id?: string;
  created_at: string;
}
