export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          description: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          timestamp: string
          user_profile_id: string | null
        }
        Insert: {
          activity_type: string
          description?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_profile_id?: string | null
        }
        Update: {
          activity_type?: string
          description?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          timestamp?: string
          user_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          accuracy_rate: number | null
          agent_name: string
          agent_type: Database["public"]["Enums"]["ai_agent_type_option"] | null
          configuration: Json | null
          created_at: string
          id: string
          last_activity: string | null
          status: Database["public"]["Enums"]["ai_agent_status_option"] | null
          tasks_completed: number | null
          updated_at: string
        }
        Insert: {
          accuracy_rate?: number | null
          agent_name: string
          agent_type?:
            | Database["public"]["Enums"]["ai_agent_type_option"]
            | null
          configuration?: Json | null
          created_at?: string
          id?: string
          last_activity?: string | null
          status?: Database["public"]["Enums"]["ai_agent_status_option"] | null
          tasks_completed?: number | null
          updated_at?: string
        }
        Update: {
          accuracy_rate?: number | null
          agent_name?: string
          agent_type?:
            | Database["public"]["Enums"]["ai_agent_type_option"]
            | null
          configuration?: Json | null
          created_at?: string
          id?: string
          last_activity?: string | null
          status?: Database["public"]["Enums"]["ai_agent_status_option"] | null
          tasks_completed?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      analytics_metrics: {
        Row: {
          category: string | null
          company_id: string | null
          created_at: string
          date_recorded: string
          id: string
          metric_name: string
          metric_value: string | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          created_at?: string
          date_recorded: string
          id?: string
          metric_name: string
          metric_value?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          created_at?: string
          date_recorded?: string
          id?: string
          metric_name?: string
          metric_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          ai_score: number | null
          application_date: string | null
          candidate_id: string
          created_at: string
          hr_member_id: string | null
          id: string
          job_id: string
          notes: string | null
          pipeline_stage:
            | Database["public"]["Enums"]["candidate_pipeline_status_type"]
            | null
          status: Database["public"]["Enums"]["application_status_type"] | null
          updated_at: string
        }
        Insert: {
          ai_score?: number | null
          application_date?: string | null
          candidate_id: string
          created_at?: string
          hr_member_id?: string | null
          id?: string
          job_id: string
          notes?: string | null
          pipeline_stage?:
            | Database["public"]["Enums"]["candidate_pipeline_status_type"]
            | null
          status?: Database["public"]["Enums"]["application_status_type"] | null
          updated_at?: string
        }
        Update: {
          ai_score?: number | null
          application_date?: string | null
          candidate_id?: string
          created_at?: string
          hr_member_id?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          pipeline_stage?:
            | Database["public"]["Enums"]["candidate_pipeline_status_type"]
            | null
          status?: Database["public"]["Enums"]["application_status_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_hr_member_id_fkey"
            columns: ["hr_member_id"]
            isOneToOne: false
            referencedRelation: "hr_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          application_id: string | null
          assessment_type:
            | Database["public"]["Enums"]["assessment_type_option"]
            | null
          candidate_id: string
          completion_date: string | null
          created_at: string
          id: string
          job_id: string | null
          results: Json | null
          score: number | null
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          assessment_type?:
            | Database["public"]["Enums"]["assessment_type_option"]
            | null
          candidate_id: string
          completion_date?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          results?: Json | null
          score?: number | null
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          assessment_type?:
            | Database["public"]["Enums"]["assessment_type_option"]
            | null
          candidate_id?: string
          completion_date?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          results?: Json | null
          score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      ats_scan_results: {
        Row: {
          content_score: number
          created_at: string | null
          file_name: string
          file_size: number | null
          format_score: number
          id: string
          job_match: string | null
          keyword_score: number
          overall_score: number
          scan_date: string | null
          strengths: string[] | null
          suggestions: string[]
          updated_at: string | null
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          content_score: number
          created_at?: string | null
          file_name: string
          file_size?: number | null
          format_score: number
          id?: string
          job_match?: string | null
          keyword_score: number
          overall_score: number
          scan_date?: string | null
          strengths?: string[] | null
          suggestions: string[]
          updated_at?: string | null
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          content_score?: number
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          format_score?: number
          id?: string
          job_match?: string | null
          keyword_score?: number
          overall_score?: number
          scan_date?: string | null
          strengths?: string[] | null
          suggestions?: string[]
          updated_at?: string | null
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      candidates: {
        Row: {
          created_at: string
          current_status:
            | Database["public"]["Enums"]["candidate_pipeline_status_type"]
            | null
          email: string
          experience_years: number | null
          first_name: string
          id: string
          last_name: string
          overall_score: number | null
          phone: string | null
          profile_photo_url: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string
          user_profile_id: string | null
        }
        Insert: {
          created_at?: string
          current_status?:
            | Database["public"]["Enums"]["candidate_pipeline_status_type"]
            | null
          email: string
          experience_years?: number | null
          first_name: string
          id?: string
          last_name: string
          overall_score?: number | null
          phone?: string | null
          profile_photo_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_profile_id?: string | null
        }
        Update: {
          created_at?: string
          current_status?:
            | Database["public"]["Enums"]["candidate_pipeline_status_type"]
            | null
          email?: string
          experience_years?: number | null
          first_name?: string
          id?: string
          last_name?: string
          overall_score?: number | null
          phone?: string | null
          profile_photo_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          ai_extracted_data: Json | null
          blockchain_hash: string | null
          ce_credits: number | null
          certificate_file_path: string | null
          certificate_url: string | null
          certification_name: string
          created_at: string | null
          credential_id: string | null
          expiration_date: string | null
          id: string
          industry_category: string | null
          issue_date: string | null
          issuing_organization: string
          skill_level: string | null
          thumbnail_url: string | null
          user_id: string
          verification_status: string | null
          verification_url: string | null
          view_count: number | null
        }
        Insert: {
          ai_extracted_data?: Json | null
          blockchain_hash?: string | null
          ce_credits?: number | null
          certificate_file_path?: string | null
          certificate_url?: string | null
          certification_name: string
          created_at?: string | null
          credential_id?: string | null
          expiration_date?: string | null
          id?: string
          industry_category?: string | null
          issue_date?: string | null
          issuing_organization: string
          skill_level?: string | null
          thumbnail_url?: string | null
          user_id: string
          verification_status?: string | null
          verification_url?: string | null
          view_count?: number | null
        }
        Update: {
          ai_extracted_data?: Json | null
          blockchain_hash?: string | null
          ce_credits?: number | null
          certificate_file_path?: string | null
          certificate_url?: string | null
          certification_name?: string
          created_at?: string | null
          credential_id?: string | null
          expiration_date?: string | null
          id?: string
          industry_category?: string | null
          issue_date?: string | null
          issuing_organization?: string
          skill_level?: string | null
          thumbnail_url?: string | null
          user_id?: string
          verification_status?: string | null
          verification_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          company_size: string | null
          created_at: string
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          gpa: number | null
          id: string
          institution_logo_url: string | null
          institution_name: string
          start_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          gpa?: number | null
          id?: string
          institution_logo_url?: string | null
          institution_name: string
          start_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          gpa?: number | null
          id?: string
          institution_logo_url?: string | null
          institution_name?: string
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          achievements: string[] | null
          budget_managed: number | null
          company_logo_url: string | null
          company_name: string
          cost_savings: string | null
          created_at: string | null
          description: string | null
          direct_reports: number | null
          employment_type: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          is_remote: boolean | null
          job_title: string
          location: string | null
          media_links: string[] | null
          reporting_to: string | null
          revenue_impact: string | null
          skills_used: string[] | null
          start_date: string
          team_size: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: string[] | null
          budget_managed?: number | null
          company_logo_url?: string | null
          company_name: string
          cost_savings?: string | null
          created_at?: string | null
          description?: string | null
          direct_reports?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          is_remote?: boolean | null
          job_title: string
          location?: string | null
          media_links?: string[] | null
          reporting_to?: string | null
          revenue_impact?: string | null
          skills_used?: string[] | null
          start_date: string
          team_size?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: string[] | null
          budget_managed?: number | null
          company_logo_url?: string | null
          company_name?: string
          cost_savings?: string | null
          created_at?: string | null
          description?: string | null
          direct_reports?: number | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          is_remote?: boolean | null
          job_title?: string
          location?: string | null
          media_links?: string[] | null
          reporting_to?: string | null
          revenue_impact?: string | null
          skills_used?: string[] | null
          start_date?: string
          team_size?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hr_members: {
        Row: {
          bio: string | null
          company_id: string
          created_at: string
          department: string | null
          email: string
          first_name: string
          hire_date: string | null
          id: string
          last_name: string
          performance_score: number | null
          phone: string | null
          profile_photo_url: string | null
          role: Database["public"]["Enums"]["hr_member_role_option"] | null
          settings: Json | null
          specializations: string[] | null
          status: Database["public"]["Enums"]["hr_member_status_option"] | null
          updated_at: string
          user_profile_id: string | null
        }
        Insert: {
          bio?: string | null
          company_id: string
          created_at?: string
          department?: string | null
          email: string
          first_name: string
          hire_date?: string | null
          id?: string
          last_name: string
          performance_score?: number | null
          phone?: string | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["hr_member_role_option"] | null
          settings?: Json | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["hr_member_status_option"] | null
          updated_at?: string
          user_profile_id?: string | null
        }
        Update: {
          bio?: string | null
          company_id?: string
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string
          hire_date?: string | null
          id?: string
          last_name?: string
          performance_score?: number | null
          phone?: string | null
          profile_photo_url?: string | null
          role?: Database["public"]["Enums"]["hr_member_role_option"] | null
          settings?: Json | null
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["hr_member_status_option"] | null
          updated_at?: string
          user_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_members_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string
          duration_minutes: number | null
          feedback: string | null
          id: string
          interview_type:
            | Database["public"]["Enums"]["interview_type_option"]
            | null
          interviewer_id: string | null
          scheduled_date: string
          score: number | null
          status: Database["public"]["Enums"]["interview_status_type"] | null
          updated_at: string
          video_link: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type?:
            | Database["public"]["Enums"]["interview_type_option"]
            | null
          interviewer_id?: string | null
          scheduled_date: string
          score?: number | null
          status?: Database["public"]["Enums"]["interview_status_type"] | null
          updated_at?: string
          video_link?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type?:
            | Database["public"]["Enums"]["interview_type_option"]
            | null
          interviewer_id?: string | null
          scheduled_date?: string
          score?: number | null
          status?: Database["public"]["Enums"]["interview_status_type"] | null
          updated_at?: string
          video_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "hr_members"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          application_status: string | null
          company: string
          created_at: string
          date_applied: string
          feedback: string | null
          hr_notes: string | null
          id: string
          job_id: string | null
          job_title: string
          location: string | null
          next_step: string | null
          progress: number | null
          rating: number | null
          resume_file_name: string | null
          resume_file_path: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_status?: string | null
          company: string
          created_at?: string
          date_applied?: string
          feedback?: string | null
          hr_notes?: string | null
          id?: string
          job_id?: string | null
          job_title: string
          location?: string | null
          next_step?: string | null
          progress?: number | null
          rating?: number | null
          resume_file_name?: string | null
          resume_file_path?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_status?: string | null
          company?: string
          created_at?: string
          date_applied?: string
          feedback?: string | null
          hr_notes?: string | null
          id?: string
          job_id?: string | null
          job_title?: string
          location?: string | null
          next_step?: string | null
          progress?: number | null
          rating?: number | null
          resume_file_name?: string | null
          resume_file_path?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          company: string
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string | null
          posted_date: string
          requirements: string | null
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_date?: string
          requirements?: string | null
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_date?: string
          requirements?: string | null
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_matches: {
        Row: {
          applicant_count: number | null
          company_name: string
          created_at: string | null
          external_job_id: string | null
          id: string
          job_title: string
          job_type: string | null
          location: string | null
          match_reasons: string[] | null
          match_score: number
          missing_skills: string[] | null
          posted_date: string | null
          salary_max: number | null
          salary_min: number | null
          user_id: string
        }
        Insert: {
          applicant_count?: number | null
          company_name: string
          created_at?: string | null
          external_job_id?: string | null
          id?: string
          job_title: string
          job_type?: string | null
          location?: string | null
          match_reasons?: string[] | null
          match_score: number
          missing_skills?: string[] | null
          posted_date?: string | null
          salary_max?: number | null
          salary_min?: number | null
          user_id: string
        }
        Update: {
          applicant_count?: number | null
          company_name?: string
          created_at?: string | null
          external_job_id?: string | null
          id?: string
          job_title?: string
          job_type?: string | null
          location?: string | null
          match_reasons?: string[] | null
          match_score?: number
          missing_skills?: string[] | null
          posted_date?: string | null
          salary_max?: number | null
          salary_min?: number | null
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_deadline: string | null
          assigned_hr_id: string | null
          ats_minimum_score: number
          benefits: string | null
          company_id: string
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          currency: string | null
          department: string | null
          description: string
          education_requirements: string | null
          employment_type: string | null
          experience_level: string | null
          id: string
          job_category: string | null
          job_type: Database["public"]["Enums"]["job_type_option"] | null
          location: string | null
          min_ats_score: number | null
          posted_date: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          salary_range: string | null
          skills_required: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["job_status_type"] | null
          title: string
          updated_at: string
          work_location: string | null
        }
        Insert: {
          application_deadline?: string | null
          assigned_hr_id?: string | null
          ats_minimum_score?: number
          benefits?: string | null
          company_id: string
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string | null
          department?: string | null
          description: string
          education_requirements?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          job_category?: string | null
          job_type?: Database["public"]["Enums"]["job_type_option"] | null
          location?: string | null
          min_ats_score?: number | null
          posted_date?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_range?: string | null
          skills_required?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status_type"] | null
          title: string
          updated_at?: string
          work_location?: string | null
        }
        Update: {
          application_deadline?: string | null
          assigned_hr_id?: string | null
          ats_minimum_score?: number
          benefits?: string | null
          company_id?: string
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          currency?: string | null
          department?: string | null
          description?: string
          education_requirements?: string | null
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          job_category?: string | null
          job_type?: Database["public"]["Enums"]["job_type_option"] | null
          location?: string | null
          min_ats_score?: number | null
          posted_date?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_range?: string | null
          skills_required?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status_type"] | null
          title?: string
          updated_at?: string
          work_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_hr_id_fkey"
            columns: ["assigned_hr_id"]
            isOneToOne: false
            referencedRelation: "hr_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_application_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_application_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_application_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_analytics: {
        Row: {
          contact_requests: number | null
          created_at: string | null
          date_recorded: string
          id: string
          profile_views: number | null
          resume_downloads: number | null
          search_appearances: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_requests?: number | null
          created_at?: string | null
          date_recorded?: string
          id?: string
          profile_views?: number | null
          resume_downloads?: number | null
          search_appearances?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_requests?: number | null
          created_at?: string | null
          date_recorded?: string
          id?: string
          profile_views?: number | null
          resume_downloads?: number | null
          search_appearances?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          github_url: string | null
          id: string
          industry: string | null
          linkedin_url: string | null
          location: string | null
          occupation: string | null
          password_hash: string | null
          phone_number: string | null
          profile_picture: string | null
          role: string | null
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          industry?: string | null
          linkedin_url?: string | null
          location?: string | null
          occupation?: string | null
          password_hash?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          role?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          location?: string | null
          occupation?: string | null
          password_hash?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          role?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          project_name: string
          project_url: string | null
          repository_url: string | null
          start_date: string | null
          team_size: number | null
          technologies_used: string[] | null
          thumbnail_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          project_name: string
          project_url?: string | null
          repository_url?: string | null
          start_date?: string | null
          team_size?: number | null
          technologies_used?: string[] | null
          thumbnail_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          project_name?: string
          project_url?: string | null
          repository_url?: string | null
          start_date?: string | null
          team_size?: number | null
          technologies_used?: string[] | null
          thumbnail_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resume_files: {
        Row: {
          ats_score: number | null
          created_at: string | null
          download_count: number | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          industry_optimized_for: string | null
          is_primary: boolean | null
          keywords: string[] | null
          last_downloaded: string | null
          thumbnail_url: string | null
          user_id: string
          version_number: number | null
        }
        Insert: {
          ats_score?: number | null
          created_at?: string | null
          download_count?: number | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          industry_optimized_for?: string | null
          is_primary?: boolean | null
          keywords?: string[] | null
          last_downloaded?: string | null
          thumbnail_url?: string | null
          user_id: string
          version_number?: number | null
        }
        Update: {
          ats_score?: number | null
          created_at?: string | null
          download_count?: number | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          industry_optimized_for?: string | null
          is_primary?: boolean | null
          keywords?: string[] | null
          last_downloaded?: string | null
          thumbnail_url?: string | null
          user_id?: string
          version_number?: number | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          filename: string
          id: string
          is_primary: boolean | null
          parsed_content: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          filename: string
          id?: string
          is_primary?: boolean | null
          parsed_content?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          filename?: string
          id?: string
          is_primary?: boolean | null
          parsed_content?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          assessment_score: number | null
          category: string | null
          created_at: string | null
          endorsement_count: number | null
          id: string
          last_used_date: string | null
          market_demand_score: number | null
          proficiency_level: number | null
          salary_impact_percentage: number | null
          skill_name: string
          user_id: string
          verification_status: string | null
          years_experience: number | null
        }
        Insert: {
          assessment_score?: number | null
          category?: string | null
          created_at?: string | null
          endorsement_count?: number | null
          id?: string
          last_used_date?: string | null
          market_demand_score?: number | null
          proficiency_level?: number | null
          salary_impact_percentage?: number | null
          skill_name: string
          user_id: string
          verification_status?: string | null
          years_experience?: number | null
        }
        Update: {
          assessment_score?: number | null
          category?: string | null
          created_at?: string | null
          endorsement_count?: number | null
          id?: string
          last_used_date?: string | null
          market_demand_score?: number | null
          proficiency_level?: number | null
          salary_impact_percentage?: number | null
          skill_name?: string
          user_id?: string
          verification_status?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          applications_count: number | null
          id: string
          interviews_count: number | null
          offers_count: number | null
          response_rate: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applications_count?: number | null
          id?: string
          interviews_count?: number | null
          offers_count?: number | null
          response_rate?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applications_count?: number | null
          id?: string
          interviews_count?: number | null
          offers_count?: number | null
          response_rate?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          about_summary: string | null
          brand_logo_url: string | null
          cover_photo_url: string | null
          cover_video_url: string | null
          created_at: string | null
          current_company: string | null
          current_position: string | null
          headline_tagline: string | null
          id: string
          industry: string | null
          last_profile_view: string | null
          location: string | null
          phone: string | null
          professional_headline: string | null
          profile_photo_url: string | null
          profile_views_count: number | null
          updated_at: string | null
          user_id: string
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          about_summary?: string | null
          brand_logo_url?: string | null
          cover_photo_url?: string | null
          cover_video_url?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          headline_tagline?: string | null
          id?: string
          industry?: string | null
          last_profile_view?: string | null
          location?: string | null
          phone?: string | null
          professional_headline?: string | null
          profile_photo_url?: string | null
          profile_views_count?: number | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          about_summary?: string | null
          brand_logo_url?: string | null
          cover_photo_url?: string | null
          cover_video_url?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          headline_tagline?: string | null
          id?: string
          industry?: string | null
          last_profile_view?: string | null
          location?: string | null
          phone?: string | null
          professional_headline?: string | null
          profile_photo_url?: string | null
          profile_views_count?: number | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ai_agent_status_option:
        | "Active"
        | "Inactive"
        | "Training"
        | "Error"
        | "Maintenance"
      ai_agent_type_option:
        | "ResumeScreener"
        | "InterviewScheduler"
        | "FeedbackAnalyzer"
        | "CandidateSourcer"
      application_status_type:
        | "Received"
        | "Under Review"
        | "Shortlisted"
        | "Rejected"
        | "Interview Scheduled"
        | "Assessment Sent"
        | "Offer Extended"
        | "Hired"
        | "Withdrawn"
      assessment_type_option:
        | "Coding"
        | "Aptitude"
        | "Psychometric"
        | "Skills Test"
        | "Language Proficiency"
      candidate_pipeline_status_type:
        | "Applied"
        | "Screening"
        | "Assessment"
        | "Interviewing"
        | "Offer Extended"
        | "Offer Accepted"
        | "Offer Rejected"
        | "Hired"
        | "Rejected"
        | "On Hold"
        | "Withdrawn"
      employment_type_enum:
        | "Full-time"
        | "Part-time"
        | "Contract"
        | "Internship"
        | "Freelance"
      experience_level_enum:
        | "Entry Level"
        | "Mid-Level"
        | "Senior"
        | "Executive"
      hr_member_role_option:
        | "Recruiter"
        | "Sourcer"
        | "Coordinator"
        | "HR Manager"
        | "Hiring Manager"
        | "Admin"
      hr_member_status_option: "Active" | "Inactive" | "On Leave"
      interview_status_type:
        | "Scheduled"
        | "Completed"
        | "Cancelled"
        | "Rescheduled"
        | "No Show"
      interview_type_option:
        | "Technical"
        | "Behavioral"
        | "HR Round"
        | "Panel"
        | "Screening Call"
      job_status_type: "Open" | "Closed" | "Draft" | "Filled" | "On Hold"
      job_type_option:
        | "Full-time"
        | "Part-time"
        | "Contract"
        | "Internship"
        | "Temporary"
      user_role: "student" | "organization" | "admin"
      work_location_type_enum: "Remote" | "On-site" | "Hybrid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_agent_status_option: [
        "Active",
        "Inactive",
        "Training",
        "Error",
        "Maintenance",
      ],
      ai_agent_type_option: [
        "ResumeScreener",
        "InterviewScheduler",
        "FeedbackAnalyzer",
        "CandidateSourcer",
      ],
      application_status_type: [
        "Received",
        "Under Review",
        "Shortlisted",
        "Rejected",
        "Interview Scheduled",
        "Assessment Sent",
        "Offer Extended",
        "Hired",
        "Withdrawn",
      ],
      assessment_type_option: [
        "Coding",
        "Aptitude",
        "Psychometric",
        "Skills Test",
        "Language Proficiency",
      ],
      candidate_pipeline_status_type: [
        "Applied",
        "Screening",
        "Assessment",
        "Interviewing",
        "Offer Extended",
        "Offer Accepted",
        "Offer Rejected",
        "Hired",
        "Rejected",
        "On Hold",
        "Withdrawn",
      ],
      employment_type_enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Freelance",
      ],
      experience_level_enum: [
        "Entry Level",
        "Mid-Level",
        "Senior",
        "Executive",
      ],
      hr_member_role_option: [
        "Recruiter",
        "Sourcer",
        "Coordinator",
        "HR Manager",
        "Hiring Manager",
        "Admin",
      ],
      hr_member_status_option: ["Active", "Inactive", "On Leave"],
      interview_status_type: [
        "Scheduled",
        "Completed",
        "Cancelled",
        "Rescheduled",
        "No Show",
      ],
      interview_type_option: [
        "Technical",
        "Behavioral",
        "HR Round",
        "Panel",
        "Screening Call",
      ],
      job_status_type: ["Open", "Closed", "Draft", "Filled", "On Hold"],
      job_type_option: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Temporary",
      ],
      user_role: ["student", "organization", "admin"],
      work_location_type_enum: ["Remote", "On-site", "Hybrid"],
    },
  },
} as const
