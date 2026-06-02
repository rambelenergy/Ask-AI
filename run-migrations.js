#!/usr/bin/env node
// Run Supabase migrations and seed data directly via PostgreSQL
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Connect to the shared Supabase Postgres on port 54322
const client = new Client({
  host: '127.0.0.1',
  port: 54322,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres'
});

async function runMigration(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`Running ${path.basename(filePath)}...`);
  try {
    await client.query(sql);
    console.log(`  ✅ ${path.basename(filePath)} applied successfully`);
  } catch (err) {
    console.error(`  ❌ ${path.basename(filePath)} failed:`);
    console.error(err.message);
    throw err;
  }
}

async function main() {
  try {
    console.log('Connecting to PostgreSQL at 127.0.0.1:54322...');
    await client.connect();
    console.log('Connected!\n');

    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        await runMigration(path.join(migrationsDir, file));
      }
    }

    console.log('\n=== All migrations applied successfully! ===');
    console.log('Tables created: articles, publications');
    console.log('Seed data: 4 articles, 3 publications inserted');
    
    // Verify
    const articlesRes = await client.query('SELECT COUNT(*) FROM articles');
    const pubsRes = await client.query('SELECT COUNT(*) FROM publications');
    console.log(`\n📊 Database state:`);
    console.log(`   Articles: ${articlesRes.rows[0].count}`);
    console.log(`   Publications: ${pubsRes.rows[0].count}`);

  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
