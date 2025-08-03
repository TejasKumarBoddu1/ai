
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

interface HrMember {
  // Define based on your hr_members table schema
  id?: string;
  company_id: string;
  user_profile_id?: string | null;
  role?: string | null; // Consider using an Enum type from your DB if defined
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  // Add other fields as necessary
}

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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized: " + (userError?.message || "User not found") }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean); // e.g., ['hr-members-handler', 'hr-members', 'member-id', 'performance']
    const resource = pathSegments[1]; // 'hr-members'
    const id = pathSegments[2]; // 'member-id' or undefined
    const subResource = pathSegments[3]; // 'performance' or undefined

    if (resource === "hr-members") {
      if (req.method === "GET") {
        if (id) {
          if (subResource === "performance") {
            // GET /api/hr-members/:id/performance
            // For now, this returns the full HR member record, including performance_score
            // RLS: "Authenticated users can view HR members" & "Users can manage their own HR member record"
            const { data, error } = await supabase
              .from("hr_members")
              .select("*")
              .eq("id", id)
              .single();
            if (error) {
              if (error.code === 'PGRST116') { // Not found
                return new Response(JSON.stringify({ error: "HR Member not found" }), {
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
                  status: 404,
                });
              }
              throw error;
            }
            return new Response(JSON.stringify(data), { // data includes performance_score
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          } else {
            // GET /api/hr-members/:id
            // RLS: "Authenticated users can view HR members" & "Users can manage their own HR member record"
            const { data, error } = await supabase
              .from("hr_members")
              .select("*")
              .eq("id", id)
              .single();
            if (error) {
               if (error.code === 'PGRST116') {
                return new Response(JSON.stringify({ error: "HR Member not found" }), {
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
        } else {
          // GET /api/hr-members (List all HR members with pagination)
          // RLS: "Authenticated users can view HR members"
          const page = parseInt(url.searchParams.get("page") || "1");
          const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
          const offset = (page - 1) * pageSize;

          const { data, error, count } = await supabase
            .from("hr_members")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + pageSize - 1);

          if (error) throw error;
          return new Response(JSON.stringify({ data, count }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      } else if (req.method === "POST") {
        // POST /api/hr-members (Add new HR member)
        // RLS: "Users can manage their own HR member record" (if user_profile_id is set to auth.uid())
        // Or a broader policy for HR Admins to add new members.
        // Current RLS "Authenticated users can view HR members" applies to SELECT.
        // For INSERT, the "Users can manage their own HR member record" with `user_profile_id = auth.uid()` might be too restrictive if an admin is adding another HR.
        // Assuming for now that creating an HR member might also link to auth.uid() or be done by an admin.
        // For an HR admin to create other HR members, a specific RLS policy allowing that role to insert into hr_members would be needed.
        // For simplicity, we'll assume the creating user has privileges via RLS.
        const newMemberData = await req.json() as HrMember;
        
        // Ensure company_id is provided
        if (!newMemberData.company_id) {
            return new Response(JSON.stringify({ error: "company_id is required" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { data, error } = await supabase
          .from("hr_members")
          .insert(newMemberData)
          .select()
          .single();
        if (error) {
          // Check for RLS violation or other specific errors
          if (error.message.includes("violates row-level security policy")) {
             return new Response(JSON.stringify({ error: "Forbidden: You might not have permission to add this HR member or required fields are missing for RLS." }), {
                status: 403, // Forbidden
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          throw error;
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });
      } else if (req.method === "PUT" && id) {
        // PUT /api/hr-members/:id (Update HR member)
        // RLS: "Users can manage their own HR member record"
        const updates = await req.json();
        const { data, error } = await supabase
          .from("hr_members")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (error) {
          if (error.code === 'PGRST116' || error.message.includes("violates row-level security policy")) { // Not found or RLS violation
             return new Response(JSON.stringify({ error: "HR Member not found or permission denied" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: error.code === 'PGRST116' ? 404 : 403,
            });
          }
          throw error;
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } else if (req.method === "DELETE" && id) {
        // DELETE /api/hr-members/:id (Delete HR member)
        // RLS: "Users can manage their own HR member record"
        const { error } = await supabase
          .from("hr_members")
          .delete()
          .eq("id", id);
        if (error) {
           if (error.code === 'PGRST116' || error.message.includes("violates row-level security policy")) {
             return new Response(JSON.stringify({ error: "HR Member not found or permission denied" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: error.code === 'PGRST116' ? 404 : 403,
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

    return new Response(JSON.stringify({ error: "Not Found or Method Not Allowed for hr-members" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });

  } catch (error) {
    console.error("Error in HR Members Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
