// Updates the image_url column for each Power Platform flow item with its sample SVG path.
// Matches existing rows by title. Run with: node scripts/update-power-platform-flow-images.cjs

const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ VITE_TURSO_DATABASE_URL is missing in .env');
  process.exit(1);
}

const db = createClient({ url, authToken });

// Map: item title → SVG id (must match constants.tsx + public/power-flows/*.svg)
const MAP = [
  ['Forms → OneDrive Upload Request',                          'pp-pa-1'],
  ['OneDrive Upload → SharePoint Link Sync',                   'pp-pa-2'],
  ['Vendor Onboarding Automation',                             'pp-pa-3'],
  ['Power Apps → SharePoint File Upload',                      'pp-pa-4'],
  ['Quotation Approval Flow',                                  'pp-pa-5'],
  ['Reportix — Dataverse to Word/PDF Report Generator',        'pp-pa-6'],
  ['AI Builder Email Auto-Reply',                              'pp-pa-7'],
  ['Excel Company Enrichment (CIN Lookup)',                    'pp-pa-8'],
  ['Excel CIN → Revenue Enrichment',                           'pp-pa-9'],
  ['Shared Mailbox → Planner + SharePoint + Teams',            'pp-pa-10'],
  ['Partner Center Customer Sync',                             'pp-pa-11'],
  ['External Email Allowance (Azure Automation)',              'pp-pa-12'],
  ['GDAP Invitation Automation',                               'pp-pa-13'],
  ['Manual Approval with Switch Routing',                      'pp-pa-14'],
  ['Subscription Renewal Reminder',                            'pp-pa-15'],
  ['Delegated Admin Onboarding (Graph)',                       'pp-pa-16'],
  ['Leave Approval Flow',                                      'pp-pa-17'],
  ['Event Registration → Calendar Event',                      'pp-pa-18'],
  ['Copilot Agent — SharePoint File Counter',                  'pp-cp-1'],
];

async function run() {
  let updated = 0;
  let missing = 0;
  for (const [title, id] of MAP) {
    const imagesJson = JSON.stringify([`/power-flows/${id}.svg`]);
    const res = await db.execute({
      sql: 'UPDATE power_platform SET image_url = ? WHERE title = ?',
      args: [imagesJson, title],
    });
    if (res.rowsAffected > 0) {
      console.log(`✅ ${id}  ← ${title}`);
      updated++;
    } else {
      console.log(`⚠️  no row found for: ${title}`);
      missing++;
    }
  }
  console.log(`\nDone. Updated ${updated}, missing ${missing}.`);
}

run().catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
