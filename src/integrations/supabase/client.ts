// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://wutntuowayrorqysvrav.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dG50dW93YXlyb3JxeXN2cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMzI4NTAsImV4cCI6MjA0ODkwODg1MH0.z0wmBvE1tUOvOgRnpjEG8TcuxooSoKhOFnzr_-9k00E";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);