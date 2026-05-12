require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function createDemoUsers() {
    const users = [
        { email: 'admin@demo.com', password: 'password123', full_name: 'Rajesh Kumar', role: 'admin' },
        { email: 'faculty@demo.com', password: 'password123', full_name: 'Dr. Priya Sharma', role: 'teacher' },
        { email: 'student@demo.com', password: 'password123', full_name: 'Jemin Vadgama', role: 'student' }
    ];

    console.log("Creating default users in your database...");

    for (const u of users) {
        const { data, error } = await supabase.auth.signUp({
            email: u.email,
            password: u.password,
            options: {
                data: {
                    full_name: u.full_name,
                    role: u.role
                }
            }
        });
        
        if (error) {
            console.log(`❌ Error creating ${u.email}: ${error.message}`);
        } else {
            console.log(`✅ Created ${u.email}`);
        }
    }
}

createDemoUsers();
