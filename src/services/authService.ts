import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { UserAccount } from '../types';

export const CONFIG_REQUIRED_MESSAGE =
  'Supabase project credentials not configured. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live authentication.';

/**
 * Validates basic email formatting.
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

/**
 * Transforms Supabase user object into UserAccount.
 */
const formatUser = (sbUser: any): UserAccount => {
  const metadata = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    email: sbUser.email || '',
    displayName: metadata.display_name || metadata.full_name || sbUser.email?.split('@')[0] || 'Kannada Learner',
    createdAt: sbUser.created_at,
    isGuest: false,
  };
};

/**
 * Gets the current active signed-in user or null if guest.
 */
export const getCurrentUser = async (): Promise<UserAccount | null> => {
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) return null;
    return formatUser(session.user);
  } catch (err) {
    console.warn('Error fetching current session:', err);
    return null;
  }
};

/**
 * Sign up a new user with email, password, and display name.
 */
export const signUpWithEmail = async (
  email: string,
  pass: string,
  displayName: string
): Promise<{ user: UserAccount | null; error: string | null; confirmationRequired?: boolean }> => {
  if (!validateEmail(email)) {
    return { user: null, error: 'Please enter a valid email address.' };
  }
  if (!pass || pass.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters long.' };
  }
  if (!displayName.trim()) {
    return { user: null, error: 'Please enter your name.' };
  }

  if (!supabase || !isSupabaseConfigured()) {
    return {
      user: null,
      error: CONFIG_REQUIRED_MESSAGE,
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
      options: {
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // If email confirmation is enabled on Supabase, session may be null until confirmed
      const hasSession = Boolean(data.session);
      return {
        user: formatUser(data.user),
        error: null,
        confirmationRequired: !hasSession,
      };
    }

    return { user: null, error: 'Unable to complete sign up. Please try again.' };
  } catch (err: any) {
    return { user: null, error: err?.message || 'Unexpected error during sign up.' };
  }
};

/**
 * Log in with email and password.
 */
export const signInWithEmail = async (
  email: string,
  pass: string
): Promise<{ user: UserAccount | null; error: string | null }> => {
  if (!validateEmail(email)) {
    return { user: null, error: 'Please enter a valid email address.' };
  }
  if (!pass) {
    return { user: null, error: 'Please enter your password.' };
  }

  if (!supabase || !isSupabaseConfigured()) {
    return {
      user: null,
      error: CONFIG_REQUIRED_MESSAGE,
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { user: null, error: 'Incorrect email or password. Please try again.' };
      }
      return { user: null, error: error.message };
    }

    if (data.user) {
      return { user: formatUser(data.user), error: null };
    }

    return { user: null, error: 'Login failed. Please check your credentials.' };
  } catch (err: any) {
    return { user: null, error: err?.message || 'Unexpected error during login.' };
  }
};

/**
 * Log out the current user.
 */
export const signOut = async (): Promise<{ error: string | null }> => {
  if (!supabase || !isSupabaseConfigured()) {
    return { error: null };
  }
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err?.message || 'Error signing out.' };
  }
};

/**
 * Send password reset email via Supabase.
 */
export const resetPasswordForEmail = async (
  email: string
): Promise<{ error: string | null; message: string | null }> => {
  if (!validateEmail(email)) {
    return { error: 'Please enter a valid email address.', message: null };
  }

  if (!supabase || !isSupabaseConfigured()) {
    return {
      error: CONFIG_REQUIRED_MESSAGE,
      message: null,
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    });

    if (error) {
      return { error: error.message, message: null };
    }

    return {
      error: null,
      message: 'Password reset instructions have been sent to your email address.',
    };
  } catch (err: any) {
    return { error: err?.message || 'Failed to send password reset email.', message: null };
  }
};

/**
 * Update the user's display name.
 */
export const updateUserDisplayName = async (
  displayName: string
): Promise<{ error: string | null; user?: UserAccount }> => {
  if (!displayName.trim()) {
    return { error: 'Display name cannot be empty.' };
  }

  if (!supabase || !isSupabaseConfigured()) {
    return { error: CONFIG_REQUIRED_MESSAGE };
  }

  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName.trim(),
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {
      error: null,
      user: data.user ? formatUser(data.user) : undefined,
    };
  } catch (err: any) {
    return { error: err?.message || 'Failed to update profile name.' };
  }
};

/**
 * Subscribes to Supabase Auth state changes.
 */
export const onAuthStateChange = (
  callback: (user: UserAccount | null) => void
): (() => void) => {
  if (!supabase || !isSupabaseConfigured()) {
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? formatUser(session.user) : null);
  });

  return () => {
    subscription.unsubscribe();
  };
};
