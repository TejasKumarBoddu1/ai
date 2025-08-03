
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface JobApplication {
  id: string;
  user_id: string;
  job_id?: string;
  job_title: string;
  company: string;
  location?: string;
  status: string;
  next_step?: string;
  feedback?: string;
  progress: number;
  date_applied: string;
  created_at: string;
  updated_at: string;
  resume_file_path?: string;
  resume_file_name?: string;
  hr_notes?: string;
  rating?: number;
  application_status?: string;
}

export const useApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);

      if (!user) {
        setApplications([]);
        return;
      }

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('date_applied', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error fetching applications',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setApplications(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  return { 
    applications, 
    loading,
    refetch: fetchApplications,
    applicationCount: applications.length 
  };
};
