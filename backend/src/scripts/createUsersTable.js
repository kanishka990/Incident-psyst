import pool from "../config/db.js";

const createUsersTable = async () => {
  try {
    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table ready");
    
    // Add status column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending'`);
      console.log("✅ Status column added");
    } catch (e) {
      // Column might already exist
    }
    
    // Create default admin user if not exists
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await pool.query(`
      INSERT INTO users (email, password_hash, role, status)
      VALUES ('admin@company.com', $1, 'admin', 'approved')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);
    
    console.log("✅ Default admin user: admin@company.com / admin123");
    
    // Create default developer user if not exists
    const devHashedPassword = await bcrypt.hash("developer123", 10);
    await pool.query(`
      INSERT INTO users (email, password_hash, role, status)
      VALUES ('developer@company.com', $1, 'developer', 'approved')
      ON CONFLICT (email) DO NOTHING
    `, [devHashedPassword]);
    
    console.log("✅ Default developer user: developer@company.com / developer123");
    
    // Create default customer user if not exists
    const custHashedPassword = await bcrypt.hash("customer123", 10);
    await pool.query(`
      INSERT INTO users (email, password_hash, role, status)
      VALUES ('customer@gmail.com', $1, 'customer', 'approved')
      ON CONFLICT (email) DO NOTHING
    `, [custHashedPassword]);
    
    console.log("✅ Default customer user: customer@gmail.com / customer123");
    console.log("✅ Setup complete!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await pool.end();
  }
};

createUsersTable();
