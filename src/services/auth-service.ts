import { User } from '@/types';
import { supabase } from '@/lib/supabase';

export const authService = {
  // Check if user is currently authenticated
  getCurrentUser: async (): Promise<User> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
    };
  },
  
  // Login with email and password
  login: async (email: string, password: string): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!user) {
      throw new Error('Login failed');
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
    };
  },
  
  // Register a new user
  register: async (name: string, email: string, password: string): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    
    if (error) {
      if (error.message === 'User already registered') {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      }
      throw new Error(error.message);
    }
    
    if (!user) {
      throw new Error('Registration failed');
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email,
        full_name: name,
      });
    
    if (profileError) {
      throw new Error(profileError.message);
    }
    
    return {
      id: user.id,
      name,
      email,
      createdAt: new Date().toISOString(),
    };
  },
  
  // Update user profile
  updateProfile: async (data: { name: string; avatarUrl?: string }): Promise<User> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        full_name: data.name,
        avatar_url: data.avatarUrl,
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
    };
  },
  
  // Update password
  updatePassword: async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      throw new Error(error.message);
    }
  },
  
  // Delete account
  deleteAccount: async (): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call the delete-account edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete account');
      }

      // Sign out after successful deletion
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
  
  // Logout the current user
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    // We intentionally don't throw errors during logout since we want to clear the session
    // regardless of the server response
    if (error) {
      console.debug('Logout completed with cleanup:', error.message);
    }
  }
};