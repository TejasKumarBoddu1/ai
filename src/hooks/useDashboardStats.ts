
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  resumeScore: number;
  jobsApplied: number;
  interviews: number;
  certifications: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    resumeScore: 0,
    jobsApplied: 0,
    interviews: 0,
    certifications: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get latest ATS score
      const { data: atsData } = await supabase
        .from('ats_scan_results')
        .select('overall_score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get job applications count
      const { data: applicationsData, error: appError } = await supabase
        .from('job_applications')
        .select('id')
        .eq('user_id', user.id);

      if (appError) {
        console.error('Error fetching applications:', appError);
      }

      // Get interviews count (applications with interview status)
      const { data: interviewsData, error: intError } = await supabase
        .from('job_applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'Interview');

      if (intError) {
        console.error('Error fetching interviews:', intError);
      }

      // For now, we'll use a placeholder for certifications since there's no cert table
      const certifications = 2; // This can be updated when certification system is implemented

      setStats({
        resumeScore: atsData?.overall_score || 0,
        jobsApplied: applicationsData?.length || 0,
        interviews: interviewsData?.length || 0,
        certifications
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error fetching dashboard data',
        description: 'Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return { stats, loading, refetch: fetchStats };
};
