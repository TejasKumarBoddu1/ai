
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // Use if admin actions are needed

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized: " + (userError?.message || "User not found") }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean); // e.g., ['jobs-handler', 'jobs', 'job-id', 'applications']
    const resource = pathSegments[1]; // 'jobs'
    const id = pathSegments[2]; // 'job-id' or undefined
    const subResource = pathSegments[3]; // 'applications' or undefined

    // Helper function to get company_id for the current HR user
    const getHrCompanyId = async (userId: string) => {
      const { data: hrMember, error } = await supabase
        .from("hr_members")
        .select("company_id")
        .eq("user_profile_id", userId)
        .single();
      if (error || !hrMember) {
        throw new Error("HR member not found or not associated with a company.");
      }
      return hrMember.company_id;
    };
    
    if (resource === "jobs") {
      if (req.method === "GET") {
        if (id && subResource === "applications") {
          // GET /api/jobs/:id/applications
          const { data, error } = await supabase
            .from("applications")
            .select(`
              *,
              candidates:candidates_candidate_id_fkey (id, first_name, last_name, email)
            `)
            .eq("job_id", id);

          if (error) throw error;
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        } else if (id) {
          // GET /api/jobs/:id
          const { data, error } = await supabase
            .from("jobs")
            .select(`
              *, 
              companies:company_id (name, logo_url),
              hr_members:assigned_hr_id (first_name, last_name, email)
            `)
            .eq("id", id)
            .single();
          if (error) {
            if (error.code === 'PGRST116') { // PostgREST error for "Normalized result contains 0 rows"
               return new Response(JSON.stringify({ error: "Job not found" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 404,
              });
            }
            throw error;
          }
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        } else {
          // GET /api/jobs (List all jobs with pagination and filters)
          const page = parseInt(url.searchParams.get("page") || "1");
          const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
          const offset = (page - 1) * pageSize;

          // Basic filtering examples (can be expanded)
          const statusFilter = url.searchParams.get("status");
          const companyFilter = url.searchParams.get("companyId");

          let query = supabase
            .from("jobs")
            .select(`
              *, 
              companies:company_id (name, logo_url),
              hr_members:assigned_hr_id (first_name, last_name, email)
            `, { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + pageSize - 1);

          if (statusFilter) {
            query = query.eq("status", statusFilter);
          }
          if (companyFilter) {
            query = query.eq("company_id", companyFilter);
          }
          
          const { data, error, count } = await query;

          if (error) throw error;
          return new Response(JSON.stringify({ data, count }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      } else if (req.method === "POST") {
        // POST /api/jobs (Create new job)
        const jobData = await req.json();
        
        // Ensure company_id is set, RLS will check if user belongs to this company
        if (!jobData.company_id) {
          // Attempt to fetch company_id for the current HR user
          try {
            jobData.company_id = await getHrCompanyId(user.id);
          } catch (e: any) {
             return new Response(JSON.stringify({ error: "Failed to determine company: " + e.message }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
        }

        const { data, error } = await supabase
          .from("jobs")
          .insert(jobData)
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });
      } else if (req.method === "PUT" && id) {
        // PUT /api/jobs/:id (Update job)
        const jobUpdates = await req.json();
        const { data, error } = await supabase
          .from("jobs")
          .update(jobUpdates)
          .eq("id", id)
          .select()
          .single();
        if (error) {
            if (error.code === 'PGRST116') {
               return new Response(JSON.stringify({ error: "Job not found or you don't have permission to update it" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 404,
              });
            }
            throw error;
          }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else if (req.method === "DELETE" && id) {
        // DELETE /api/jobs/:id (Delete job)
        const { error } = await supabase
          .from("jobs")
          .delete()
          .eq("id", id);
        if (error) {
           if (error.code === 'PGRST116') { // This might indicate RLS prevented or item not found
               return new Response(JSON.stringify({ error: "Job not found or you don't have permission to delete it" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 404,
              });
            }
          throw error;
        }
        return new Response(null, {
          headers: { ...corsHeaders },
          status: 204, // No Content
        });
      }
    }

    return new Response(JSON.stringify({ error: "Not Found or Method Not Allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });

  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
