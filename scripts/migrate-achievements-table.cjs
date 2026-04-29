// Run with: node scripts/migrate-achievements-table.cjs
// Adds any missing columns to the existing `achievements` table.

const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ VITE_TURSO_DATABASE_URL is missing in .env');
  process.exit(1);
}

const db = createClient({ url, authToken });

const REQUIRED_COLUMNS = [
  { name: 'title',      ddl: "ALTER TABLE achievements ADD COLUMN title TEXT NOT NULL DEFAULT ''" },
  { name: 'issuer',     ddl: "ALTER TABLE achievements ADD COLUMN issuer TEXT NOT NULL DEFAULT ''" },
  { name: 'date',       ddl: "ALTER TABLE achievements ADD COLUMN date TEXT NOT NULL DEFAULT ''" },
  { name: 'icon',       ddl: "ALTER TABLE achievements ADD COLUMN icon TEXT NOT NULL DEFAULT '🏆'" },
  { name: 'color',      ddl: "ALTER TABLE achievements ADD COLUMN color TEXT NOT NULL DEFAULT '#FFD600'" },
  { name: 'sort_order', ddl: "ALTER TABLE achievements ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0" },
];

async function run() {
  try {
    // Make sure the table exists at all
    await db.execute(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT
      )
    `);

    const info = await db.execute('PRAGMA table_info(achievements)');
    const existing = new Set(info.rows.map(r => r.name));
    console.log('Existing columns:', [...existing].join(', '));

    for (const col of REQUIRED_COLUMNS) {
      if (existing.has(col.name)) {
        console.log(`⏭️  Column already exists: ${col.name}`);
        continue;
      }
      await db.execute(col.ddl);
      console.log(`✅ Added column: ${col.name}`);
    }

    // Backfill sort_order for any rows that still have 0
    const rows = await db.execute('SELECT id FROM achievements WHERE sort_order = 0 OR sort_order IS NULL ORDER BY id ASC');
    if (rows.rows.length > 0) {
      console.log(`Backfilling sort_order for ${rows.rows.length} row(s)...`);
      for (let i = 0; i < rows.rows.length; i++) {
        await db.execute({
          sql: 'UPDATE achievements SET sort_order = ? WHERE id = ?',
          args: [i + 1, rows.rows[i].id],
        });
      }
    }

    console.log('\nDone! Schema is up to date.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

run();
