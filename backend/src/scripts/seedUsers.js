import pool from "../config/db.js";
import bcrypt from "bcrypt";

async function seedUsers() {
  try {
    console.log("🌱 Seeding users...");

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Users table created/verified");

    // Hash passwords
    const customerPassword = await bcrypt.hash("customer123", 10);
    const developerPassword = await bcrypt.hash("developer123", 10);
    const kanishkaPassword = await bcrypt.hash("12345678", 10);

    // Insert test users (using ON CONFLICT to avoid duplicates)
    await pool.query(`
      INSERT INTO users (email, password_hash, role)
      VALUES 
        ('customer@test.com', $1, 'customer'),
        ('developer@test.com', $2, 'developer'),
        ('kanishkashakya169@gmail.com', $3, 'customer')
      ON CONFLICT (email) DO NOTHING;
    `, [customerPassword, developerPassword, kanishkaPassword]);

    console.log("✅ Test users created:");
    console.log("   📧 customer@test.com / customer123 (role: customer)");
    console.log("   📧 developer@test.com / developer123 (role: developer)");
    console.log("   📧 kanishkashakya169@gmail.com / 12345678 (role: customer)");

    // Verify users
    const result = await pool.query("SELECT email, role FROM users");
    console.log("\n📋 All users in database:");
    result.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    process.exit(1);
  }
}

seedUsers();
