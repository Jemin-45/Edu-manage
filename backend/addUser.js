require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function addRealUser() {
    const { data, error } = await supabase.auth.signUp({
        email: '***REMOVED_EMAIL***',
        password: '***REMOVED***',
        options: {
            data: {
                full_name: 'Jemin Vadgama',
                role: 'admin'
            }
        }
    });

    if (error) {
        console.log(`❌ Error: ${error.message}`);
    } else {
        console.log(`✅ User ***REMOVED_EMAIL*** created successfully!`);
    }
}

addRealUser();
