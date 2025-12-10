
const { createClient } = require('@supabase/supabase-js');

const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid adding dotenv dependency
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local...');
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
            process.env[key] = value;
        }
    });
} else {
    console.log('.env.local not found.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('--- Configuration Check ---');
console.log('Supabase URL Present:', !!supabaseUrl);
console.log('Supabase Key Present:', !!supabaseKey);
console.log('Key Type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role (Preferred for Admin)' : 'Anon (Public)');

if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Missing Supabase environment variables.');
    console.log('Please create a .env.local file with:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=...');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
    console.log('SUPABASE_SERVICE_ROLE_KEY=... (Optional but recommended for server-side operations)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
    console.log('\n--- Connection Check ---');
    try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Connection failed or table "users" does not exist.');
            console.error('Error details:', error.message);
            if (error.code === '42P01') {
                console.log('\nIt looks like the tables do not exist. Please run the schema in supabase_schema.sql in your Supabase SQL Editor.');
            }
        } else {
            console.log('Success! Connected to Supabase.');
            console.log('Accessed "users" table successfully.');
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

checkConnection();
