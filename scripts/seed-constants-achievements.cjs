// Seeds initial ACHIEVEMENTS from constants into the DB.
// Run with: node scripts/seed-constants-achievements.cjs

const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ VITE_TURSO_DATABASE_URL is missing in .env');
  process.exit(1);
}

const db = createClient({ url, authToken });

const ACHIEVEMENTS = [
  { title: 'Midnight Summit Hackathon – 1st Place', issuer: 'Midnight Foundation (In-Person)', date: '2025', icon: '🏆', color: '#FFD600' },
  { title: 'Microsoft Hackathon & Ideathon – 1st Place', issuer: 'Microsoft', date: '2025', icon: '🥇', color: '#00A1FF' },
];

async function seed() {
  const existing = await db.execute('SELECT title FROM achievements');
  const existingTitles = new Set(existing.rows.map(r => r.title));

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < ACHIEVEMENTS.length; i++) {
    const a = ACHIEVEMENTS[i];
    if (existingTitles.has(a.title)) {
      console.log(`⏭️  Skipping (already exists): ${a.title}`);
      skipped++;
      continue;
    }
    await db.execute({
      sql: `INSERT INTO achievements (title, issuer, date, icon, color, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [a.title, a.issuer, a.date, a.icon, a.color, i + 1],
    });
    console.log(`✅ Inserted: ${a.title}`);
    inserted++;
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
