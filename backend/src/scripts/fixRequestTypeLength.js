import pool from "../config/db.js";

/**
 * ==============================
 * FIX REQUEST_TYPE COLUMN LENGTH
 * ==============================
 */
async function fixRequestTypeLength() {
  try {
    console.log("🔧 Fixing request_type column length...");

    await pool.query(`
      ALTER TABLE incidents 
      ALTER COLUMN request_type TYPE VARCHAR(50);
    `);

    console.log("✅ request_type column length updated to VARCHAR(50)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to fix column:", err.message);
    process.exit(1);
  }
}

fixRequestTypeLength();
