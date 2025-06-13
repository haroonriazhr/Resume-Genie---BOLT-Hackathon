import { createClient } from 'npm:@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the user from the auth header
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Delete user's data (resumes, profile, etc.)
    const { error: resumesError } = await supabaseAdmin
      .from('resumes')
      .delete()
      .eq('user_id', user.id);

    if (resumesError) {
      throw new Error('Failed to delete user data');
    }

    // Delete user's avatar from storage if it exists
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_url) {
      const avatarPath = profile.avatar_url.split('/').pop();
      if (avatarPath) {
        await supabaseAdmin.storage
          .from('avatars')
          .remove([avatarPath]);
      }
    }

    // Delete the user's auth account
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      throw new Error('Failed to delete account');
    }

    return new Response(
      JSON.stringify({ message: 'Account deleted successfully' }), 
      { headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: true,
        message: error.message 
      }), 
      { 
        headers: corsHeaders,
        status: 400
      }
    );
  }
});