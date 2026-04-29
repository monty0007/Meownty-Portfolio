// Run with: node scripts/create-achievements-table.cjs
// Creates the `achievements` table in your Turso database.

const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ VITE_TURSO_DATABASE_URL is missing in .env');
  process.exit(1);
}

const db = createClient({ url, authToken });

async function run() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS achievements (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        title      TEXT    NOT NULL,
        issuer     TEXT    NOT NULL DEFAULT '',
        date       TEXT    NOT NULL DEFAULT '',
        icon       TEXT    NOT NULL DEFAULT '🏆',
        color      TEXT    NOT NULL DEFAULT '#FFD600',
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('✅ achievements table created (or already exists)');
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

run();
