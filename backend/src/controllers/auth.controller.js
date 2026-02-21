import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/* ===============================
   REGISTER
============================== */
export const register = async (req, res) => {
  try {
    const { email, password, role, name, phone, company } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    // check existing user
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userExists.rowCount > 0) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
      (email,password_hash,role,name,phone,company)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING id,email,role,name,phone,company`,
      [
        email,
        hashed,
        role || "customer",
        name || null,
        phone || null,
        company || null,
      ]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({
      error: "Register failed",
    });
  }
};

/* ===============================
   LOGIN
============================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!valid) {
      return res.status(400).json({
        error: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name || user.email.split("@")[0],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || user.email.split("@")[0],
        phone: user.phone,
        company: user.company,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({
      error: "Login failed",
    });
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

    // security reason — don't reveal user existence
    if (result.rowCount === 0) {
      return res.json({
        success: true,
        message:
          "If email exists, reset link sent",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const resetExpires = new Date(
      Date.now() + 60 * 60 * 1000 // 1 hour
    );

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
      // REMOVE in production
      resetToken,
    });
  } catch (err) {
    console.error("FORGOT ERROR:", err.message);
    res.status(500).json({
      error: "Failed to process request",
    });
  }
};

/* ===============================
   RESET PASSWORD
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

    await pool.query(
      `UPDATE users
       SET password_hash=$1,
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
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const result = await pool.query(
      `SELECT id,email,role,name,phone,company,created_at
       FROM users
       WHERE id=$1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({
      error: "Failed to get profile",
    });
  }
};

/* ===============================
   UPDATE PROFILE
============================== */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      name,
      phone,
      company,
      currentPassword,
      newPassword,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // password update
    if (newPassword) {
      const userResult = await pool.query(
        "SELECT password_hash FROM users WHERE id=$1",
        [userId]
      );

      const valid = await bcrypt.compare(
        currentPassword,
        userResult.rows[0].password_hash
      );

      if (!valid) {
        return res.status(400).json({
          error: "Current password wrong",
        });
      }

      const hashed = await bcrypt.hash(
        newPassword,
        10
      );

      await pool.query(
        "UPDATE users SET password_hash=$1 WHERE id=$2",
        [hashed, userId]
      );
    }

    const result = await pool.query(
      `UPDATE users
       SET name=COALESCE($1,name),
           phone=COALESCE($2,phone),
           company=COALESCE($3,company)
       WHERE id=$4
       RETURNING id,email,role,name,phone,company`,
      [name, phone, company, userId]
    );

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err.message);
    res.status(500).json({
      error: "Failed to update profile",
    });
  }
};

/* ===============================
   GET ALL DEVELOPERS (for assignee selection)
   =============================== */
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
   GET ALL USERS (for user selection)
   =============================== */
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
