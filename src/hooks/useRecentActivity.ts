
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RecentApplication {
  id: string;
  job_title: string;
  company: string;
  date_applied: string;
  status: string;
}

interface UpcomingInterview {
  id: string;
  job_title: string;
  company: string;
  date_applied: string;
  status: string;
}

interface RecentActivity {
  applications: RecentApplication[];
  interviews: UpcomingInterview[];
}

export const useRecentActivity = () => {
  const [activity, setActivity] = useState<RecentActivity>({
    applications: [],
    interviews: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchActivity = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get recent applications
      const { data: applicationsData, error: appError } = await supabase
        .from('job_applications')
        .select('id, job_title, company, date_applied, status')
        .eq('user_id', user.id)
        .order('date_applied', { ascending: false })
        .limit(5);

      if (appError) {
        console.error('Error fetching recent applications:', appError);
      }

      // Get upcoming interviews (applications with interview status)
      const { data: interviewsData, error: intError } = await supabase
        .from('job_applications')
        .select('id, job_title, company, date_applied, status')
        .eq('user_id', user.id)
        .eq('status', 'Interview')
        .order('date_applied', { ascending: false })
        .limit(3);

      if (intError) {
        console.error('Error fetching interviews:', intError);
      }

      setActivity({
        applications: applicationsData || [],
        interviews: interviewsData || []
      });

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      toast({
        title: 'Error fetching activity data',
        description: 'Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [user]);

  return { activity, loading, refetch: fetchActivity };
};
