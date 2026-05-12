const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// ⚡ Use service role key for ALL server-side DB operations.
// This bypasses Row Level Security safely since the key is only on the backend server.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

let supabase;
let supabaseAuth;

if (supabaseUrl && supabaseAnonKey) {
    // Main DB client — uses service role key to bypass RLS for all writes
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    // Auth client — uses anon key to verify user JWTs safely
    supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

    console.log('✅ Connected to Supabase Engine (Fast PostgreSQL Cloud)');
    if (supabaseServiceRoleKey !== supabaseAnonKey) {
        console.log('🔐 Server using service role key — RLS bypassed for backend operations.');
    }
} else {
    console.warn('⚠️ Supabase URL or Anon Key is missing in .env. Database connection not initialized.');
}

module.exports = { supabase, supabaseAuth };
