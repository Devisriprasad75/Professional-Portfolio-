import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The app must keep working (read-only, from local fallback data) even if
// Supabase hasn't been configured yet, so we don't throw here — we just
// flag it. See src/lib/content.js for how reads fall back gracefully.
export const isSupabaseConfigured = Boolean(url && anonKey && !url.includes('your-project-ref'))

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
