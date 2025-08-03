
// supabase Edge Function to create a profile when a new user is created
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const body = await req.json()
    const { record } = body

    if (!record?.id) {
      return new Response(
        JSON.stringify({ error: 'No user data found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Extract user metadata for profile creation
    const { id, email, user_metadata, raw_user_meta_data } = record
    const metadata = user_metadata || raw_user_meta_data || {}
    const role = metadata.role || 'student'
    const full_name = metadata.full_name || email?.split('@')[0] || ''

    // Create a profile for the new user
    const { error } = await supabaseClient
      .from('profiles')
      .insert({
        id,
        email,
        full_name,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error creating profile:', error)
      return new Response(
        JSON.stringify({ error: 'Error creating profile' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Profile created successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
