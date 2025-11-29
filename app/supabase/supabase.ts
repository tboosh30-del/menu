import { createClient } from '@supabase/supabase-js';

// Get environment variables - will throw error if missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log(supabaseUrl, supabaseKey);
// Initialize Supabase client (now guaranteed to be strings)
export const supabase = createClient(supabaseUrl!, supabaseKey!);
