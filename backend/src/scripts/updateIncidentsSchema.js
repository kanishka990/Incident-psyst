import pool from "../config/db.js";

/**
 * ==============================
 * UPDATE INCIDENTS TABLE SCHEMA
 * Adds ticketing system fields
 * ==============================
 */
async function updateIncidentsSchema() {
  try {
    console.log("🔧 Updating incidents table schema...");

    // Add new columns if they don't exist
    await pool.query(`
      ALTER TABLE incidents 
      ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'P2',
      ADD COLUMN IF NOT EXISTS request_type VARCHAR(20) DEFAULT 'INCIDENT',
      ADD COLUMN IF NOT EXISTS assignee_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS closed_by_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS requester_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS sla_hours INTEGER DEFAULT 24;
    `);

    console.log("✅ Incidents table schema updated successfully!");
    console.log("   - Added priority (P1, P2, P3)");
    console.log("   - Added request_type (INCIDENT, SERVICE)");
    console.log("   - Added assignee_id (developer assigned)");
    console.log("   - Added closed_by_id (who closed the ticket)");
    console.log("   - Added customer_email");
    console.log("   - Added requester_email");
    console.log("   - Added sla_hours");

    process.exit(0);
  } catch (err) {
    console.error("❌ Schema update failed:", err.message);
    process.exit(1);
  }
}

updateIncidentsSchema();
