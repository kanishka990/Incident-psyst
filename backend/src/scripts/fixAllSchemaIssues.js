import pool from "../config/db.js";

/**
 * ==============================
 * FIX ALL SCHEMA ISSUES
 * ==============================
 */
async function fixAllSchemaIssues() {
  try {
    console.log("🔧 Fixing all schema issues...");

    // 1. Fix request_id length
    console.log("1. Fixing request_id column length...");
    await pool.query(`
      ALTER TABLE incidents 
      ALTER COLUMN request_id TYPE VARCHAR(100);
    `);
    console.log("   ✅ request_id updated to VARCHAR(100)");

    // 2. Add name column to users table if it doesn't exist
    console.log("2. Adding name column to users table...");
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS name VARCHAR(255);
    `);
    console.log("   ✅ name column added to users table");

    // 3. Update existing users to have a name (use email as name if null)
    console.log("3. Updating existing users with names...");
    await pool.query(`
      UPDATE users 
      SET name = COALESCE(name, SPLIT_PART(email, '@', 1))
      WHERE name IS NULL;
    `);
    console.log("   ✅ Existing users updated with names");

    console.log("\n✅ All schema issues fixed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to fix schema:", err.message);
    process.exit(1);
  }
}

fixAllSchemaIssues();
