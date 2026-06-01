// ─────────────────────────────────────────────────────────────────────────────
// Migrate base64 images stored in the Turso DB to Cloudinary, replacing the
// heavy `data:image/...;base64,...` blobs with lightweight CDN URLs.
//
// SAFETY: Before touching anything, this script dumps a FULL backup of every
// affected table (including the original base64 images) to a timestamped folder
// under ./backups/. Nothing is deleted — rows are only UPDATED in place, and the
// migration is idempotent (values that are already https URLs are skipped).
//
// Affected image columns:
//   • projects.image_url        — single base64 image
//   • posts.image_url           — blog cover (single base64 image)
//   • posts.sections (JSON)     — inline base64 images in `content` / `content2`
//   • power_platform.image_url  — JSON array of base64 images
//
// Required env vars (.env):
//   VITE_TURSO_DATABASE_URL
//   VITE_TURSO_AUTH_TOKEN
//   CLOUDINARY_URL   (cloudinary://<api_key>:<api_secret>@<cloud_name>)
//
// Usage:
//   node scripts/migrate-images-to-cloudinary.cjs --backup-only   # just back up
//   node scripts/migrate-images-to-cloudinary.cjs --dry-run       # report only
//   node scripts/migrate-images-to-cloudinary.cjs                 # backup + migrate
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

const DRY_RUN = process.argv.includes('--dry-run');
const BACKUP_ONLY = process.argv.includes('--backup-only');

const TURSO_URL = process.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN;
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

function fail(msg) {
  console.error(`\u274c ${msg}`);
  process.exit(1);
}

if (!TURSO_URL) fail('VITE_TURSO_DATABASE_URL is missing in .env');
if (!TURSO_TOKEN) fail('VITE_TURSO_AUTH_TOKEN is missing in .env');
if (!BACKUP_ONLY && !DRY_RUN && !CLOUDINARY_URL) {
  fail('CLOUDINARY_URL is missing in .env');
}

// cloudinary SDK auto-reads CLOUDINARY_URL, but calling config({...}) replaces
// the whole config object — so we parse the URL and set credentials explicitly.
if (CLOUDINARY_URL) {
  try {
    const u = new URL(CLOUDINARY_URL);
    cloudinary.config({
      cloud_name: u.hostname,
      api_key: decodeURIComponent(u.username),
      api_secret: decodeURIComponent(u.password),
      secure: true,
    });
  } catch (e) {
    fail(`Invalid CLOUDINARY_URL: ${e.message}`);
  }
}

const db = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

const isBase64Image = (v) => typeof v === 'string' && v.startsWith('data:image');
const isHttpUrl = (v) => typeof v === 'string' && /^https?:\/\//i.test(v);

// Upload a single base64 data URL to Cloudinary. Idempotent via stable public_id
// + overwrite, so re-running won't create duplicates.
async function uploadDataUrl(dataUrl, folder, publicId) {
  const res = await cloudinary.uploader.upload(dataUrl, {
    folder,
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    resource_type: 'image',
  });
  return res.secure_url;
}

// ── Backup ──────────────────────────────────────────────────────────────────
async function dumpTable(name) {
  try {
    const res = await db.execute(`SELECT * FROM ${name}`);
    return res.rows.map((r) => ({ ...r }));
  } catch (e) {
    console.warn(`\u26a0\ufe0f  Could not read table "${name}": ${e.message}`);
    return null;
  }
}

async function runBackup() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = path.join(process.cwd(), 'backups', `db-${stamp}`);
  fs.mkdirSync(dir, { recursive: true });

  const tables = ['projects', 'posts', 'power_platform', 'achievements'];
  for (const t of tables) {
    const rows = await dumpTable(t);
    if (rows) {
      fs.writeFileSync(path.join(dir, `${t}.json`), JSON.stringify(rows, null, 2));
      console.log(`\ud83d\udcbe Backed up ${rows.length} rows from "${t}"`);
    }
  }
  console.log(`\u2705 Full backup written to: ${dir}\n`);
  return dir;
}

// ── Migrations ────────────────────────────────────────────────────────────────
let uploadCount = 0;

async function migrateProjects() {
  const res = await db.execute('SELECT id, image_url FROM projects');
  let changed = 0;
  for (const row of res.rows) {
    const img = row.image_url;
    if (!isBase64Image(img)) continue;
    changed++;
    if (DRY_RUN) {
      console.log(`  [projects #${row.id}] would upload cover image`);
      continue;
    }
    const url = await uploadDataUrl(img, 'portfolio/projects', `project_${row.id}`);
    uploadCount++;
    await db.execute({ sql: 'UPDATE projects SET image_url = ? WHERE id = ?', args: [url, row.id] });
    console.log(`  [projects #${row.id}] \u2192 ${url}`);
  }
  console.log(`\u2705 projects: ${changed} image(s) ${DRY_RUN ? 'to migrate' : 'migrated'}\n`);
}

async function migratePosts() {
  const res = await db.execute('SELECT id, image_url, sections FROM posts');
  let changed = 0;
  for (const row of res.rows) {
    let didChange = false;
    let newCover = row.image_url;

    // Cover image
    if (isBase64Image(row.image_url)) {
      didChange = true;
      if (!DRY_RUN) {
        newCover = await uploadDataUrl(row.image_url, 'portfolio/blog', `post_${row.id}_cover`);
        uploadCount++;
      }
    }

    // Inline section images
    let sections = [];
    try {
      sections = JSON.parse(row.sections || '[]');
    } catch {
      sections = [];
    }
    let secChanged = false;
    if (Array.isArray(sections)) {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (!s || typeof s !== 'object') continue;
        if (isBase64Image(s.content)) {
          didChange = true;
          secChanged = true;
          if (!DRY_RUN) {
            s.content = await uploadDataUrl(s.content, 'portfolio/blog', `post_${row.id}_sec_${i}_a`);
            uploadCount++;
          }
        }
        if (isBase64Image(s.content2)) {
          didChange = true;
          secChanged = true;
          if (!DRY_RUN) {
            s.content2 = await uploadDataUrl(s.content2, 'portfolio/blog', `post_${row.id}_sec_${i}_b`);
            uploadCount++;
          }
        }
      }
    }

    if (!didChange) continue;
    changed++;
    if (DRY_RUN) {
      console.log(`  [posts #${row.id}] would migrate cover/${secChanged ? ' section' : ''} image(s)`);
      continue;
    }
    await db.execute({
      sql: 'UPDATE posts SET image_url = ?, sections = ? WHERE id = ?',
      args: [newCover, JSON.stringify(sections), row.id],
    });
    console.log(`  [posts #${row.id}] migrated`);
  }
  console.log(`\u2705 posts: ${changed} post(s) ${DRY_RUN ? 'to migrate' : 'migrated'}\n`);
}

async function migratePowerPlatform() {
  let res;
  try {
    res = await db.execute('SELECT id, image_url FROM power_platform');
  } catch (e) {
    console.warn(`\u26a0\ufe0f  Skipping power_platform: ${e.message}\n`);
    return;
  }
  let changed = 0;
  for (const row of res.rows) {
    const raw = row.image_url || '';
    let images;
    try {
      const parsed = JSON.parse(raw);
      images = Array.isArray(parsed) ? parsed : [raw];
    } catch {
      images = raw ? [raw] : [];
    }
    if (!images.some(isBase64Image)) continue;
    changed++;
    if (DRY_RUN) {
      const n = images.filter(isBase64Image).length;
      console.log(`  [power_platform #${row.id}] would upload ${n} image(s)`);
      continue;
    }
    const newImages = [];
    for (let i = 0; i < images.length; i++) {
      if (isBase64Image(images[i])) {
        const url = await uploadDataUrl(images[i], 'portfolio/power', `pp_${row.id}_${i}`);
        uploadCount++;
        newImages.push(url);
      } else {
        newImages.push(images[i]);
      }
    }
    await db.execute({
      sql: 'UPDATE power_platform SET image_url = ? WHERE id = ?',
      args: [JSON.stringify(newImages), row.id],
    });
    console.log(`  [power_platform #${row.id}] migrated ${newImages.length} image(s)`);
  }
  console.log(`\u2705 power_platform: ${changed} item(s) ${DRY_RUN ? 'to migrate' : 'migrated'}\n`);
}

async function main() {
  console.log(`\n\ud83d\ude80 Cloudinary image migration ${DRY_RUN ? '(DRY RUN)' : ''}\n`);

  // Always back up first (even on dry-run) so there is a safety net.
  await runBackup();

  if (BACKUP_ONLY) {
    console.log('\ud83d\udce6 --backup-only: stopping after backup.');
    return;
  }

  await migrateProjects();
  await migratePosts();
  await migratePowerPlatform();

  if (DRY_RUN) {
    console.log('\ud83d\udd0d Dry run complete \u2014 no images uploaded, no rows changed.');
  } else {
    console.log(`\ud83c\udf89 Migration complete \u2014 ${uploadCount} image(s) uploaded to Cloudinary.`);
  }
}

main().catch((e) => fail(e.message || String(e)));
