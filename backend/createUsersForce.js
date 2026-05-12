const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
// The user just provided their powerful Service Role key
const SERVICE_ROLE_KEY = '***REMOVED_SERVICE_ROLE_KEY***';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function forceCreateUsers() {
    const usersToCreate = [
        { email: 'faculty@demo.com', password: 'password123', full_name: 'Dr. Priya Sharma', role: 'teacher' },
        { email: 'student@demo.com', password: 'password123', full_name: 'Jemin Vadgama', role: 'student' }
    ];

    console.log("🛠️ Using Service Role to perfectly force-create the remaining users...");

    for (const u of usersToCreate) {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true, // This skips the email verification completely!
            user_metadata: {
                full_name: u.full_name,
                role: u.role
            }
        });

        if (error) {
            console.log(`❌ Failed: ${u.email} -> ${error.message}`);
        } else {
            console.log(`✅ Success: Created verified account for ${u.email} as ${u.role}`);
        }
    }
}

forceCreateUsers();
