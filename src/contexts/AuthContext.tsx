import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signOut: () => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  resendConfirmation: (email: string) => Promise<any>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
  uploadAvatar: (file: File) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Check if Supabase is properly configured
  const checkSupabaseConfig = () => {
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || 
          SUPABASE_URL === 'your-supabase-url' || 
          SUPABASE_URL === 'demo-mode' ||
          SUPABASE_ANON_KEY === 'your-supabase-anon-key' || 
          SUPABASE_ANON_KEY === 'demo-mode') {
        console.warn('🔧 Supabase environment variables not configured. Running in demo mode.');
        return false;
      }
      console.log('✅ Supabase configuration found');
      return true;
    } catch (error) {
      console.warn('⚠️ Supabase configuration error:', error);
      return false;
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    console.log('🚀 Starting auth initialization...');

    const initializeAuth = async () => {
      if (!checkSupabaseConfig()) {
        console.log('📱 Demo mode: Setting initialized to true');
        if (mounted) {
          setLoading(false);
          setUser(null);
          setProfile(null);
          setInitialized(true);
        }
        return;
      }

      // Get initial session with better error handling and retries
      try {
        console.log('🔍 Checking for existing session...');
        
        // Add a small delay to ensure Supabase client is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        console.log('📋 Initial session check result:', {
          hasSession: !!session,
          userEmail: session?.user?.email || 'No user',
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'No expiry'
        });

        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            console.log('👤 Fetching user profile...');
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
          setLoading(false);
          setInitialized(true);
          console.log('✅ Auth initialization complete');
        }
      } catch (error) {
        console.error('💥 Error in getInitialSession:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Add a maximum timeout to ensure initialization always completes
    const timeoutId = setTimeout(() => {
      if (mounted && !initialized) {
        console.warn('⏰ Auth initialization timeout - forcing completion');
        setLoading(false);
        setInitialized(true);
      }
    }, 5000); // 5 second timeout

    initializeAuth();

    // Only set up auth listener if Supabase is configured
    let subscription: any = null;
    if (checkSupabaseConfig()) {
      // Listen for auth changes
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event, {
            userEmail: session?.user?.email || 'No user',
            mounted,
            initialized
          });
          
          if (!mounted) return;

          // Handle different auth events
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('✅ User signed in or token refreshed');
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchProfile(session.user.id);
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            setUser(null);
            setProfile(null);
          } else if (event === 'INITIAL_SESSION') {
            console.log('🚀 Initial session detected');
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchProfile(session.user.id);
            }
          }
          
          // Only set loading to false after we've processed the auth change
          if (initialized) {
            setLoading(false);
          }
        }
      );
      subscription = authSubscription;
    }

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // Remove initialized from dependencies to prevent re-initialization

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

      await updateProfile({ avatar_url: publicUrl });

      return { data: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  const value = {
    user,
    profile,
    loading,
    initialized,
    signOut,
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
    updateProfile,
    uploadAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
