import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * GET all updates
 */
export const getUpdates = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM incident_updates ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GET updates failed:", err.message);
    res.status(500).json({ error: "Failed to fetch updates" });
  }
};

/**
 * CREATE update
 */
export const createUpdate = async (req, res) => {
  try {
    const { incident_id, message, update_type } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await pool.query(
      `INSERT INTO incident_updates (incident_id, message, update_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [incident_id || null, message, update_type || "GENERAL"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Update creation failed:", err.message);
    res.status(500).json({ error: "Update creation failed" });
  }
};

/**
 * UPDATE update
 */
export const updateUpdate = async (req, res) => {
  try {
    const { message, update_type } = req.body;

    const result = await pool.query(
      `UPDATE incident_updates 
       SET message = $1, update_type = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [message, update_type, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Update not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update failed:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
};

/**
 * DELETE update
 */
export const deleteUpdate = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM incident_updates WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Update not found" });
    }

    res.json({ message: "Update deleted", update: result.rows[0] });
  } catch (err) {
    console.error("Delete failed:", err.message);
    res.status(500).json({ error: "Delete failed" });
  }
};

/**
 * ADD UPDATE TO INCIDENT (original function)
 */
export const addUpdate = async (req, res) => {
  try {
    const { message } = req.body;

    const result = await pool.query(
      "INSERT INTO incident_updates(incident_id,message) VALUES($1,$2) RETURNING *",
      [req.params.id, message]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Add update failed:", err.message);
    res.status(500).json({ error: "Failed to add update" });
  }
};
