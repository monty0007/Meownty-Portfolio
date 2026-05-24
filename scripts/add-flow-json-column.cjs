const { createClient } = require('@libsql/client');
require('dotenv').config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
    console.error("Error: VITE_TURSO_DATABASE_URL is not set in .env");
    process.exit(1);
}

const db = createClient({ url, authToken });

async function migrate() {
    try {
        console.log("Adding 'flow_json' column to power_platform table...");
        await db.execute(`ALTER TABLE power_platform ADD COLUMN flow_json TEXT DEFAULT NULL;`);
        console.log("✅ Migration complete! 'flow_json' column added.");
    } catch (err) {
        if (err.message && err.message.includes('duplicate column name')) {
            console.log("ℹ️ Column 'flow_json' already exists. No migration needed.");
        } else {
            console.error("❌ Migration failed:", err);
            process.exit(1);
        }
    }
}

migrate();
