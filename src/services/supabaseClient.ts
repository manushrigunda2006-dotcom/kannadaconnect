import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Safe environment accessor for Vite, SSR, and testing runtimes
const env = (import.meta as any).env || (globalThis as any).process?.env || {};

const rawUrl = ((env.VITE_SUPABASE_URL as string) || '').trim();
const rawKey = ((env.VITE_SUPABASE_ANON_KEY as string) || '').trim();

/**
 * Checks if the environment contains real, non-placeholder Supabase configuration.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!rawUrl || !rawKey) return false;
  if (rawUrl.includes('your-project') || rawUrl.includes('example.supabase.co')) return false;
  if (rawKey.includes('your-anon-key') || rawKey.includes('placeholder')) return false;
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

export const getSupabaseConfigStatus = () => {
  return {
    isConfigured: isSupabaseConfigured(),
    urlConfigured: Boolean(rawUrl && !rawUrl.includes('your-project')),
    keyConfigured: Boolean(rawKey && !rawKey.includes('your-anon-key')),
    url: rawUrl,
  };
};

/**
 * Supabase client instance. Will be null if credentials are not configured.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
