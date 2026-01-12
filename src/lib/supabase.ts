import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ewhtbwzrzjvqvtcobkzz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aHRid3pyemp2cXZ0Y29ia3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3ODE0NTYsImV4cCI6MjA4MzM1NzQ1Nn0.gxj_HJUBQ0tSImJKKfsPH1HxyXVlWli9C6catFz2Fds';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
