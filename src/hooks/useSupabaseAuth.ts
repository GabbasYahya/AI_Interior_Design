import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  plan_type: 'free' | 'premium' | 'pro';
  credits: number;
  preferences: any;
  created_at: string;
  updated_at: string;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is properly configured
    const checkSupabaseConfig = () => {
      try {
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL === 'your-supabase-url' || SUPABASE_ANON_KEY === 'your-supabase-anon-key') {
          console.warn('Supabase environment variables not configured. Running in demo mode.');
          setLoading(false);
          setUser(null);
          setProfile(null);
          return false;
        }
        return true;
      } catch (error) {
        console.warn('Supabase configuration error:', error);
        setLoading(false);
        setUser(null);
        setProfile(null);
        return false;
      }
    };

    if (!checkSupabaseConfig()) {
      return;
    }

    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout reached, falling back to demo mode');
      setLoading(false);
    }, 5000);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(loadingTimeout);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      clearTimeout(loadingTimeout);
      console.error('Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        // Handle email confirmation
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          // Check if user was just confirmed (redirect to confirmation page)
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('type') === 'email' || window.location.pathname === '/email-confirmation') {
            // User just confirmed their email, show success page
            window.location.href = `/email-confirmation?email=${encodeURIComponent(session.user.email || '')}&type=confirmation`;
            return;
          }
        }
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Add timeout for profile fetch
      const profileTimeout = setTimeout(() => {
        console.warn('Profile fetch timeout, continuing without profile data');
        setLoading(false);
      }, 3000);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      clearTimeout(profileTimeout);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }
      
      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Continue without profile data instead of failing
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error: error as Error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });

      return { data: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { data: null, error: error as Error };
    }
  };

  return {
    user,
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    signOut: () => supabase.auth.signOut(),
    signInWithEmail: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signUpWithEmail: (email: string, password: string, metadata?: any) =>
      supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata
        }
      }),
    resetPassword: (email: string) =>
      supabase.auth.resetPasswordForEmail(email),
    resendConfirmation: (email: string) =>
      supabase.auth.resend({ 
        type: 'signup', 
        email 
      }),
  };
}
