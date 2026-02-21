/**
 * Database Schema Update Script
 * Adds tables for comments, attachments, feedback, notifications, and SLA
 */

import pool from "../config/db.js";

const schemaUpdates = async () => {
  const client = await pool.connect();
  
  try {
    console.log("🔄 Starting database schema updates...");
    
    // 1. Add SLA columns to incidents table
    console.log("📋 Adding SLA columns to incidents table...");
    await client.query(`
      ALTER TABLE incidents 
      ADD COLUMN IF NOT EXISTS sla_due_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS rating INTEGER,
      ADD COLUMN IF NOT EXISTS feedback TEXT,
      ADD COLUMN IF NOT EXISTS first_response_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP
    `);
    console.log("✅ SLA columns added");
    
    // 2. Create incident_comments table
    console.log("📋 Creating incident_comments table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS incident_comments (
        id SERIAL PRIMARY KEY,
        incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        user_name VARCHAR(255),
        user_role VARCHAR(50),
        comment TEXT NOT NULL,
        is_internal BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ incident_comments table created");
    
    // 3. Create incident_attachments table
    console.log("📋 Creating incident_attachments table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS incident_attachments (
        id SERIAL PRIMARY KEY,
        incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER,
        file_type VARCHAR(100),
        uploaded_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ incident_attachments table created");
    
    // 4. Create notifications table
    console.log("📋 Creating notifications table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ notifications table created");
    
    // 5. Add name column to users if not exists
    console.log("📋 Adding name column to users table...");
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS company VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP
    `);
    console.log("✅ users table updated");
    
    // 6. Create indexes for better performance
    console.log("📋 Creating indexes...");
    await client.query(`CREATE INDEX IF NOT EXISTS idx_comments_incident ON incident_comments(incident_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_attachments_incident ON incident_attachments(incident_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_incidents_sla ON incidents(sla_due_at)`);
    console.log("✅ Indexes created");
    
    console.log("🎉 All database schema updates completed successfully!");
    
  } catch (err) {
    console.error("❌ Schema update failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

// Run if called directly
schemaUpdates()
  .then(() => {
    console.log("Schema update script completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Schema update script failed:", err);
    process.exit(1);
  });

export default schemaUpdates;
