const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function verifyAll() {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) return console.log(error);

    for (const u of users) {
        if (!u.email_confirmed_at) {
            console.log(`Forcing email confirmation for ${u.email}...`);
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(u.id, { email_confirm: true });
            if (updateError) {
                console.log(`❌ Failed to verify ${u.email}:`, updateError.message);
            } else {
                console.log(`✅ Verified ${u.email}!`);
            }
        } else {
            console.log(`✅ ${u.email} is already verified.`);
        }
    }
}

verifyAll();
