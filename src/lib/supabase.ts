import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Helper function to check if error is a fetch error
export const isFetchError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch');
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: unknown): never => {
  if (isFetchError(error)) {
    throw new Error('Unable to connect to the database. Please check your internet connection.');
  }
  throw error;
};