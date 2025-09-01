
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { 
  UserProfile, 
  SocialLink, 
  Experience, 
  Education, 
  Skill, 
  Certification, 
  Project, 
  ResumeFile,
  ProfileAnalytics,
  JobMatch
} from '@/types/profile';

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resumeFiles, setResumeFiles] = useState<ResumeFile[]>([]);
  const [analytics, setAnalytics] = useState<ProfileAnalytics | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const targetUserId = userId || user?.id;

  const fetchProfile = async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        toast({
          title: 'Error fetching profile',
          description: profileError.message,
          variant: 'destructive',
        });
        return;
      }

      // Fetch social links
      const { data: socialData } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', targetUserId);

      // Fetch experiences
      const { data: experienceData } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', targetUserId)
        .order('start_date', { ascending: false });

      // Fetch education
      const { data: educationData } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', targetUserId)
        .order('start_date', { ascending: false });

      // Fetch skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', targetUserId);

      // Fetch certifications
      const { data: certificationsData } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', targetUserId)
        .order('issue_date', { ascending: false });

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', targetUserId)
        .order('start_date', { ascending: false });

      // Fetch resume files (only for own profile)
      if (targetUserId === user?.id) {
        const { data: resumeData } = await supabase
          .from('resume_files')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false });
        
        setResumeFiles(resumeData || []);

        // Fetch analytics
        const { data: analyticsData } = await supabase
          .from('profile_analytics')
          .select('*')
          .eq('user_id', targetUserId)
          .eq('date_recorded', new Date().toISOString().split('T')[0])
          .maybeSingle();

        setAnalytics(analyticsData);

        // Fetch job matches
        const { data: jobMatchesData } = await supabase
          .from('job_matches')
          .select('*')
          .eq('user_id', targetUserId)
          .order('match_score', { ascending: false })
          .limit(10);

        setJobMatches(jobMatchesData || []);
      }

      setProfile(profileData);
      setSocialLinks(socialData || []);
      setExperiences(experienceData || []);
      setEducation(educationData || []);
      setSkills(skillsData || []);
      setCertifications(certificationsData || []);
      setProjects(projectsData || []);

      // Track profile view if viewing someone else's profile
      if (targetUserId !== user?.id && user?.id) {
        await trackProfileView(targetUserId);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error fetching profile',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const trackProfileView = async (viewedUserId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Update or create analytics record
      const { error } = await supabase
        .from('profile_analytics')
        .upsert({
          user_id: viewedUserId,
          date_recorded: today,
          profile_views: 1
        }, {
          onConflict: 'user_id,date_recorded',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error tracking profile view:', error);
      }
    } catch (error) {
      console.error('Error tracking profile view:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to update your profile.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      await fetchProfile();
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const addExperience = async (experienceData: Omit<Experience, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('experiences')
        .insert({
          user_id: user.id,
          ...experienceData
        });

      if (error) throw error;

      await fetchProfile();
      toast({
        title: 'Experience added',
        description: 'Your experience has been added successfully.',
      });
    } catch (error: any) {
      console.error('Error adding experience:', error);
      toast({
        title: 'Error adding experience',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const addSkill = async (skillData: Omit<Skill, 'id' | 'user_id' | 'created_at' | 'endorsement_count'>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('skills')
        .insert({
          user_id: user.id,
          endorsement_count: 0,
          ...skillData
        });

      if (error) throw error;

      await fetchProfile();
      toast({
        title: 'Skill added',
        description: 'Your skill has been added successfully.',
      });
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast({
        title: 'Error adding skill',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const addCertification = async (certificationData: Omit<Certification, 'id' | 'user_id' | 'created_at'>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .insert({
          user_id: user.id,
          ...certificationData
        });

      if (error) throw error;

      await fetchProfile();
      toast({
        title: 'Certification added',
        description: 'Your certification has been added successfully.',
      });
    } catch (error: any) {
      console.error('Error adding certification:', error);
      toast({
        title: 'Error adding certification',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetUserId]);

  return {
    profile,
    socialLinks,
    experiences,
    education,
    skills,
    certifications,
    projects,
    resumeFiles,
    analytics,
    jobMatches,
    loading,
    updateProfile,
    addExperience,
    addSkill,
    addCertification,
    refetch: fetchProfile
  };
};
