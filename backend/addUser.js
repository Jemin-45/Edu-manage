require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Usage: node addUser.js <email> <password> <full_name> <role>
async function addRealUser() {
    const email = process.argv[2];
    const password = process.argv[3];
    const full_name = process.argv[4] || 'New User';
    const role = process.argv[5] || 'admin';

    if (!email || !password) {
        console.log('Usage: node addUser.js <email> <password> <full_name> <role>');
        process.exit(1);
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name, role }
        }
    });

    if (error) {
        console.log(`❌ Error: ${error.message}`);
    } else {
        console.log(`✅ User ${email} created successfully!`);
    }
}

addRealUser();

