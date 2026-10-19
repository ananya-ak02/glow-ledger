import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client.
 * Bypasses RLS — ONLY used for server-side cache management,
 * seed verification, and global rate limit counters.
 * NEVER expose this to the browser or client components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
