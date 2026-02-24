import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import { updateProfile } from "../controllers/auth.controller.js";
/* ===============================
   REGISTER
============================== */
export const register = async (req, res) => {
  console.log("REGISTER BODY:", req.body);
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)",
      [name, email, hashedPassword, role || "customer"]
    );

    res.status(201).json({ message: "Account created successfully" });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }

  console.log(error);
};


/* ===============================
   LOGIN  ✅ FIXED HERE
============================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ IMPORTANT CHANGE HERE
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


/* ===============================
   FORGOT PASSWORD
============================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.json({
        success: true,
        message: "If email exists, reset link sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      `UPDATE users
       SET reset_token=$1,
           reset_token_expires=$2
       WHERE email=$3`,
      [resetToken, resetExpires, email]
    );

    res.json({
      success: true,
      message: "Reset link generated",
      resetToken, // remove in production
    });

  } catch (err) {
    console.error("FORGOT ERROR:", err.message);
    res.status(500).json({
      error: "Failed to process request",
    });
  }
};


/* ===============================
   RESET PASSWORD  ✅ FIXED COLUMN
============================== */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: "Token and password required",
      });
    }

    const result = await pool.query(
      `SELECT * FROM users
       WHERE reset_token=$1
       AND reset_token_expires > NOW()`,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    const user = result.rows[0];
    const hashed = await bcrypt.hash(newPassword, 10);

    // ✅ fixed column name
    await pool.query(
      `UPDATE users
       SET password=$1,
           reset_token=NULL,
           reset_token_expires=NULL
       WHERE id=$2`,
      [hashed, user.id]
    );

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err) {
    console.error("RESET ERROR:", err.message);
    res.status(500).json({
      error: "Failed to reset password",
    });
  }
};


/* ===============================
   GET PROFILE
============================== */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `SELECT id,email,role,name,phone,company,created_at
       FROM users
       WHERE id=$1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({ error: "Failed to get profile" });
  }
};


/* ===============================
   GET ALL DEVELOPERS
============================== */
export const getDevelopers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE role = 'developer' ORDER BY name"
    );
    
    res.json(result.rows);

  } catch (err) {
    console.error("GET DEVELOPERS ERROR:", err.message);
    res.status(500).json({
      error: "Failed to fetch developers",
    });
  }
};


/* ===============================
   GET ALL USERS
============================== */
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY name"
    );
    
    res.json(result.rows);

  } catch (err) {
    console.error("GET USERS ERROR:", err.message);
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

// export const updateProfile = async (req, res) => {
//   try {
//     // your logic
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update profile" });
//   }
// };