import pool from '../config/db.js';

async function createAppConnectionsTable() {
  try {
    console.log('Creating user_connected_apps table...');
    
    // Create the table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_connected_apps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        app_id VARCHAR(50) NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        token_expires_at TIMESTAMP,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        connected_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, app_id)
      )
    `);
    
    console.log('✅ user_connected_apps table created successfully');
    
    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_connected_apps_user_id 
      ON user_connected_apps(user_id)
    `);
    
    console.log('✅ Index created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating table:', error);
    process.exit(1);
  }
}

createAppConnectionsTable();
