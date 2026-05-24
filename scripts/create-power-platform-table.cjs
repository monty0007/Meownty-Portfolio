// Run with: node scripts/create-power-platform-table.cjs
// This creates the `power_platform` table in your Turso database.

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
      CREATE TABLE IF NOT EXISTS power_platform (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT    NOT NULL,
        description TEXT    NOT NULL DEFAULT '',
        category    TEXT    NOT NULL DEFAULT 'Power Automate',
        image_url   TEXT    NOT NULL DEFAULT '',
        color       TEXT    NOT NULL DEFAULT '#0066FF',
        link        TEXT    NOT NULL DEFAULT '',
        sort_order  INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log('✅ power_platform table created successfully!');
  } catch (err) {
    console.error('❌ Failed to create table:', err.message);
    process.exit(1);
  }
}

run();
