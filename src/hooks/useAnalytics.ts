
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { UserAnalytics } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      if (!user) {
        setAnalytics(null);
        return;
      }

      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error fetching analytics:', error);
        toast({
          title: 'Error fetching analytics',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        setAnalytics(data);
      } else {
        // Create default analytics for new user
        const { data: newAnalytics, error: insertError } = await supabase
          .from('user_analytics')
          .insert([{
            user_id: user.id,
            applications_count: 0,
            interviews_count: 0,
            response_rate: 0,
            offers_count: 0
          }])
          .select('*')
          .single();

        if (insertError) {
          console.error('Error creating analytics:', insertError);
          toast({
            title: 'Error creating analytics record',
            description: insertError.message,
            variant: 'destructive',
          });
          return;
        }

        setAnalytics(newAnalytics);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  return { analytics, loading, refetch: fetchAnalytics };
};
