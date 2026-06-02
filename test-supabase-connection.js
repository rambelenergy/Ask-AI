#!/usr/bin/env node
// Test Supabase connection with current credentials
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
}

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Supabase Connection Test ===\n');
console.log('URL:', SUPABASE_URL);
console.log('Anon Key:', ANON_KEY ? 'Present (' + ANON_KEY.slice(0, 20) + '...)' : 'Missing');

async function testConnection() {
  try {
    // Test 1: Basic API connectivity
    console.log('\nTest 1: API Root');
    const rootRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { 'apikey': ANON_KEY }
    });
    console.log('  Status:', rootRes.status, rootRes.statusText);
    
    // Test 2: Try to query articles table
    console.log('\nTest 2: Query articles table');
    const articlesRes = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*`, {
      headers: { 'apikey': ANON_KEY }
    });
    const articlesBody = await articlesRes.text();
    console.log('  Status:', articlesRes.status);
    console.log('  Response:', articlesBody.slice(0, 200));
    
    if (articlesRes.status === 404 || articlesBody.includes('Could not find the table')) {
      console.log('\n  ⚠️  Migrations not applied! Tables do not exist yet.');
      console.log('  Run: supabase db reset');
    }
    
    // Test 3: Try to query publications table
    console.log('\nTest 3: Query publications table');
    const pubsRes = await fetch(`${SUPABASE_URL}/rest/v1/publications?select=*`, {
      headers: { 'apikey': ANON_KEY }
    });
    const pubsBody = await pubsRes.text();
    console.log('  Status:', pubsRes.status);
    console.log('  Response:', pubsBody.slice(0, 200));
    
    if (pubsRes.status === 404 || pubsBody.includes('Could not find the table')) {
      console.log('\n  ⚠️  Migrations not applied! Tables do not exist yet.');
    }
    
    // Summary
    console.log('\n=== Summary ===');
    if (articlesRes.status === 200 && pubsRes.status === 200) {
      console.log('✅ All tables exist and are accessible!');
    } else {
      console.log('⚠️  Supabase is running but tables are missing.');
      console.log('   The app will fall back to local demo data.');
      console.log('   To create tables, you need to apply migrations.');
    }
    
  } catch (err) {
    console.error('\n❌ Connection failed:', err.message);
    console.log('   Supabase is not running at', SUPABASE_URL);
    console.log('   The app will fall back to local demo data.');
  }
}

testConnection();
