import pool from "../config/db.js";

async function updateSchema() {
  try {
    // Add priority column
    await pool.query(`
      ALTER TABLE incidents 
      ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'P2'
    `);
    console.log("✓ Added priority column");

    // Add closed_at column
    await pool.query(`
      ALTER TABLE incidents 
      ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP
    `);
    console.log("✓ Added closed_at column");

    // Add user_id column
    await pool.query(`
      ALTER TABLE incidents 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)
    `);
    console.log("✓ Added user_id column");

    console.log("\n✅ Schema update complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

updateSchema();
