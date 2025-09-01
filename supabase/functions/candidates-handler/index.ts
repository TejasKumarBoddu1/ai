
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

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
    const pathSegments = url.pathname.split("/").filter(Boolean); // e.g., ['candidates-handler', 'candidates', 'candidate-id', 'status']
    const resource = pathSegments[1]; // 'candidates'
    const id = pathSegments[2]; // 'candidate-id' or undefined
    const subResource = pathSegments[3]; // 'status' or undefined

    if (resource === "candidates") {
      if (req.method === "GET") {
        if (id) {
          // GET /api/candidates/:id
          const { data, error } = await supabase
            .from("candidates")
            .select("*")
            .eq("id", id)
            .single();
          if (error) {
            if (error.code === 'PGRST116') {
              return new Response(JSON.stringify({ error: "Candidate not found" }), {
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
          // GET /api/candidates (List all candidates with pagination and search)
          const page = parseInt(url.searchParams.get("page") || "1");
          const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
          const searchQuery = url.searchParams.get("search");
          const offset = (page - 1) * pageSize;

          let query = supabase
            .from("candidates")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + pageSize - 1);

          if (searchQuery) {
            // Search in first_name, last_name, email
            // Note: for more complex search, consider a dedicated search function or view in Postgres
            query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
          }
          
          const { data, error, count } = await query;

          if (error) throw error;
          return new Response(JSON.stringify({ data, count }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      } else if (req.method === "POST") {
        // POST /api/candidates (Create new candidate)
        const candidateData = await req.json();
        // RLS Policy "Candidates can manage their own profile" applies if user_profile_id is set to auth.uid().
        // If an HR is creating a candidate, a broader RLS policy for HR roles might be needed,
        // or candidateData.user_profile_id should be null/undefined if not self-created.
        const { data, error } = await supabase
          .from("candidates")
          .insert(candidateData)
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });
      } else if (req.method === "PUT" && id) {
        if (subResource === "status") {
          // PUT /api/candidates/:id/status (Update candidate pipeline status)
          const { status } = await req.json();
          if (!status) {
            return new Response(JSON.stringify({ error: "Status is required" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          const { data, error } = await supabase
            .from("candidates")
            .update({ current_status: status, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();
          if (error) {
            if (error.code === 'PGRST116') {
               return new Response(JSON.stringify({ error: "Candidate not found or permission denied" }), {
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
          // PUT /api/candidates/:id (Update candidate profile)
          const candidateUpdates = await req.json();
          const { data, error } = await supabase
            .from("candidates")
            .update(candidateUpdates)
            .eq("id", id)
            .select()
            .single();
          if (error) {
            if (error.code === 'PGRST116') {
               return new Response(JSON.stringify({ error: "Candidate not found or permission denied" }), {
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
        }
      } else if (req.method === "DELETE" && id) {
        // DELETE /api/candidates/:id (Delete candidate)
        const { error } = await supabase
          .from("candidates")
          .delete()
          .eq("id", id);
        if (error) {
           if (error.code === 'PGRST116') {
               return new Response(JSON.stringify({ error: "Candidate not found or permission denied" }), {
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

    return new Response(JSON.stringify({ error: "Not Found or Method Not Allowed for candidates" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });

  } catch (error) {
    console.error("Error in Candidates Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
