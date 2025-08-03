
import { supabase } from "@/integrations/supabase/client";

export const updateUserAnalytics = async (userId: string) => {
  try {
    // Get the number of applications
    const { data: applications, error: appError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId);
      
    if (appError) throw appError;
    
    // Count interviews
    const interviews = applications?.filter(app => app.status === 'Interview')?.length || 0;
    
    // Count offers
    const offers = applications?.filter(app => app.status === 'Offer')?.length || 0;
    
    // Calculate response rate
    const responseRate = applications?.length ? 
      Math.round((interviews / applications.length) * 100) : 
      0;
    
    // Update analytics
    const { data, error } = await supabase
      .from('user_analytics')
      .upsert({
        user_id: userId,
        applications_count: applications?.length || 0,
        interviews_count: interviews,
        offers_count: offers,
        response_rate: responseRate
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (err) {
    console.error("Error updating analytics:", err);
    throw err;
  }
};
