import { createClient } from '@supabase/supabase-js';

// Public Supabase client configuration. Environment variables override these
// values in deployed environments. Publishable keys are designed for browser use.
const DEFAULT_SUPABASE_URL = 'https://ehndzjelkcploxyrmdyo.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_PpqgipMjiQ2x7dlW3Igadg_a8SvL2c-';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
