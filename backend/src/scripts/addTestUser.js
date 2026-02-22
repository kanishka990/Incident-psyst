import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const addTestUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    
    await pool.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
      ["kanishkashakya169@gmail.com", hashedPassword, "developer"]
    );
    
    console.log("✅ Test user added: kanishkashakya169@gmail.com / 12345678 (developer)");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await pool.end();
  }
};

addTestUser();
