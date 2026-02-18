import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

// Supabase client — null if credentials not configured
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null

if (!supabase) {
  console.info('ℹ️ Supabase not configured — running with localStorage only.')
}

// Keep getSupabase() for backwards compat with persistence.ts
export async function getSupabase() {
  return supabase
}
