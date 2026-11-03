import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { UserAccount } from '../types';

export const CONFIG_REQUIRED_MESSAGE =
  'Supabase project credentials not configured. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live authentication.';

/**
 * Official Preconfigured Demo User Credentials for Hackathon Judges & Evaluators
 */
export const DEMO_USER = {
  email: 'judge@kannadaconnect.demo',
  password: 'KannadaDemo@2026',
  displayName: 'Hackathon Judge (Demo)',
  id: 'demo-judge-account-2026',
} as const;

const ACTIVE_SESSION_KEY = 'kannadaconnect_active_session';
const LOCAL_USERS_KEY = 'kannadaconnect_local_registered_users';

interface LocalStoredUser {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: string;
}

// In-memory auth listeners
const authListeners = new Set<(user: UserAccount | null) => void>();

const notifyAuthListeners = (user: UserAccount | null) => {
  authListeners.forEach((callback) => {
    try {
      callback(user);
    } catch (e) {
      console.warn('Auth listener notification error:', e);
    }
  });
};

/**
 * Validates basic email formatting.
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

/**
 * Simple obfuscation / hash for fallback local accounts (never used for demo account).
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${str.length}`;
};

const getLocalUsers = (): LocalStoredUser[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users: LocalStoredUser[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save local users store:', e);
  }
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
    isDemo: false,
    role: 'user',
  };
};

/**
 * Gets the current active signed-in user or null if guest.
 */
export const getCurrentUser = async (): Promise<UserAccount | null> => {
  // 1. Check local persisted session (handles Demo Judge and active browser session)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (stored) {
        const parsed: UserAccount = JSON.parse(stored);
        if (parsed && parsed.id && !parsed.isGuest) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read active session from localStorage:', e);
    }
  }

  // 2. Check Supabase session if configured
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user) {
        const authed = formatUser(session.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authed));
        }
        return authed;
      }
    } catch (err) {
      console.warn('Error fetching Supabase session:', err);
    }
  }

  return null;
};

/**
 * Sign up a new user with email, password, and display name.
 */
export const signUpWithEmail = async (
  email: string,
  pass: string,
  displayName: string
): Promise<{ user: UserAccount | null; error: string | null; confirmationRequired?: boolean }> => {
  const cleanEmail = email.trim().toLowerCase();

  if (!validateEmail(cleanEmail)) {
    return { user: null, error: 'Please enter a valid email address.' };
  }
  if (!pass || pass.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters long.' };
  }
  if (!displayName.trim()) {
    return { user: null, error: 'Please enter your name.' };
  }

  // Prevent overwriting official demo judge identity
  if (cleanEmail === DEMO_USER.email.toLowerCase()) {
    return {
      user: null,
      error: 'This email is reserved for the preconfigured Demo Judge Account. Please click "Login as Demo User" or sign in directly.',
    };
  }

  // Supabase Signup flow (if Supabase credentials provided)
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
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
        const authedUser = formatUser(data.user);
        const hasSession = Boolean(data.session);
        if (hasSession && typeof window !== 'undefined') {
          localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authedUser));
          notifyAuthListeners(authedUser);
        }
        return {
          user: authedUser,
          error: null,
          confirmationRequired: !hasSession,
        };
      }

      return { user: null, error: 'Unable to complete sign up. Please try again.' };
    } catch (err: any) {
      return { user: null, error: err?.message || 'Unexpected error during sign up.' };
    }
  }

  // Resilient Local Authentication Provider (when Supabase is not configured)
  const users = getLocalUsers();
  if (users.some((u) => u.email === cleanEmail)) {
    return { user: null, error: 'An account with this email address already exists. Please log in.' };
  }

  const newLocalUser: LocalStoredUser = {
    id: `local-user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    passwordHash: simpleHash(pass),
    displayName: displayName.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(newLocalUser);
  saveLocalUsers(users);

  const account: UserAccount = {
    id: newLocalUser.id,
    email: newLocalUser.email,
    displayName: newLocalUser.displayName,
    createdAt: newLocalUser.createdAt,
    isGuest: false,
    isDemo: false,
    role: 'user',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(account));
  }
  notifyAuthListeners(account);

  return { user: account, error: null };
};

/**
 * Log in with email and password.
 * Supports:
 * 1. Preconfigured Demo Judge Account (judge@kannadaconnect.demo / KannadaDemo@2026)
 * 2. Supabase Auth (when environment credentials exist)
 * 3. Lightweight Local Auth Store (ensures full registration & login work seamlessly in any deployment)
 */
export const signInWithEmail = async (
  email: string,
  pass: string
): Promise<{ user: UserAccount | null; error: string | null }> => {
  const cleanEmail = email.trim().toLowerCase();

  if (!validateEmail(cleanEmail)) {
    return { user: null, error: 'Please enter a valid email address.' };
  }
  if (!pass) {
    return { user: null, error: 'Please enter your password.' };
  }

  // 1. Verify Preconfigured Demo Judge Account
  if (cleanEmail === DEMO_USER.email.toLowerCase()) {
    if (pass !== DEMO_USER.password) {
      return { user: null, error: 'Incorrect email or password. Please try again.' };
    }

    const demoAccount: UserAccount = {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      displayName: DEMO_USER.displayName,
      createdAt: '2026-01-01T00:00:00.000Z',
      isGuest: false,
      isDemo: true,
      role: 'judge',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(demoAccount));
    }
    notifyAuthListeners(demoAccount);

    return { user: demoAccount, error: null };
  }

  // 2. Supabase Authentication (if configured)
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { user: null, error: 'Incorrect email or password. Please try again.' };
        }
        return { user: null, error: error.message };
      }

      if (data.user) {
        const authedUser = formatUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authedUser));
        }
        notifyAuthListeners(authedUser);
        return { user: authedUser, error: null };
      }

      return { user: null, error: 'Login failed. Please check your credentials.' };
    } catch (err: any) {
      return { user: null, error: err?.message || 'Unexpected error during login.' };
    }
  }

  // 3. Resilient Local Authentication Provider
  const users = getLocalUsers();
  const existing = users.find((u) => u.email === cleanEmail);

  if (!existing) {
    return {
      user: null,
      error: 'Account not found. Please click Sign Up to register, or use the Judge Demo Account above.',
    };
  }

  if (existing.passwordHash !== simpleHash(pass)) {
    return { user: null, error: 'Incorrect email or password. Please try again.' };
  }

  const localAccount: UserAccount = {
    id: existing.id,
    email: existing.email,
    displayName: existing.displayName,
    createdAt: existing.createdAt,
    isGuest: false,
    isDemo: false,
    role: 'user',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(localAccount));
  }
  notifyAuthListeners(localAccount);

  return { user: localAccount, error: null };
};

/**
 * Log out the current user.
 */
export const signOut = async (): Promise<{ error: string | null }> => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (e) {
      console.warn('Failed to clear active session:', e);
    }
  }

  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      console.warn('Supabase sign out error:', err);
    }
  }

  notifyAuthListeners(null);
  return { error: null };
};

/**
 * Send password reset email via Supabase or simulated confirmation.
 */
export const resetPasswordForEmail = async (
  email: string
): Promise<{ error: string | null; message: string | null }> => {
  const cleanEmail = email.trim().toLowerCase();

  if (!validateEmail(cleanEmail)) {
    return { error: 'Please enter a valid email address.', message: null };
  }

  if (cleanEmail === DEMO_USER.email.toLowerCase()) {
    return {
      error: null,
      message: `Demo password is fixed: ${DEMO_USER.password}. You can log in directly using the "Login as Demo User" button!`,
    };
  }

  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
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
  }

  return {
    error: null,
    message: 'If an account exists for this email, password reset instructions have been recorded.',
  };
};

/**
 * Update the user's display name.
 */
export const updateUserDisplayName = async (
  displayName: string
): Promise<{ error: string | null; user?: UserAccount }> => {
  const cleanName = displayName.trim();
  if (!cleanName) {
    return { error: 'Display name cannot be empty.' };
  }

  const currentUser = await getCurrentUser();
  if (currentUser?.isDemo) {
    return { error: 'Demo judge account name is locked for evaluation consistency.' };
  }

  if (currentUser && typeof window !== 'undefined') {
    const updatedUser: UserAccount = {
      ...currentUser,
      displayName: cleanName,
    };
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(updatedUser));
    notifyAuthListeners(updatedUser);

    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.auth.updateUser({
          data: { display_name: cleanName },
        });
      } catch (err) {
        console.warn('Supabase profile update warning:', err);
      }
    }

    return { error: null, user: updatedUser };
  }

  return { error: 'No active user found to update.' };
};

/**
 * Subscribes to Auth state changes.
 */
export const onAuthStateChange = (
  callback: (user: UserAccount | null) => void
): (() => void) => {
  authListeners.add(callback);

  let sbUnsubscribe: (() => void) | null = null;
  if (supabase && isSupabaseConfigured()) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback(formatUser(session.user));
      } else {
        // Only emit null if no local session exists
        if (typeof window !== 'undefined' && !localStorage.getItem(ACTIVE_SESSION_KEY)) {
          callback(null);
        }
      }
    });
    sbUnsubscribe = () => subscription.unsubscribe();
  }

  return () => {
    authListeners.delete(callback);
    if (sbUnsubscribe) {
      sbUnsubscribe();
    }
  };
};
