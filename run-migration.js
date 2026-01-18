require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env.local');
        console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    console.log('🔄 Migration needs to be applied manually');
    console.log('');
    console.log('📝 Instructions:');
    console.log('   1. Go to your Supabase Dashboard: ' + supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql'));
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Copy and paste the contents of migrations/add_missing_url_columns.sql');
    console.log('   4. Click "Run"');
    console.log('');
    console.log('📄 Migration file location:');
    console.log('   ' + path.join(__dirname, 'migrations', 'add_missing_url_columns.sql'));
    console.log('');

    // Read and display the migration
    const migrationPath = path.join(__dirname, 'migrations', 'add_missing_url_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📋 Migration SQL:');
    console.log('━'.repeat(80));
    console.log(migrationSQL);
    console.log('━'.repeat(80));
}

runMigration().catch(console.error);
