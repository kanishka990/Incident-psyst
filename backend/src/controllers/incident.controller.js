import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * GET all incidents
 */
export const getIncidents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM incidents ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GET incidents failed:", err.message);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
};

/**
 * CREATE incident (single table)
 */
export const createIncident = async (req, res) => {
  try {
    const { title, description, severity } = req.body;

    // validation - only title is required
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = await pool.query(
      `INSERT INTO incidents (title, description, severity, status)
       VALUES ($1, $2, $3, 'OPEN')
       RETURNING *`,
      [title, description || "", severity || "MEDIUM"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Incident creation failed" });
  }
};

/**
 * UPDATE incident status
 */
export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, severity, status } = req.body;

    const result = await pool.query(
      `UPDATE incidents
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           severity = COALESCE($3, severity),
           status = COALESCE($4, status)
       WHERE id = $5
       RETURNING *`,
      [title, description, severity, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
};



/**
 * DELETE incident
 */
export const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM incidents WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.json({
      success: true,
      message: "Incident deleted",
    });

  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: "Delete failed" });
  }
};


/**
 * 🔥 CREATE incident + reporter (TWO TABLE TRANSACTION)
 * Tables: users + incidents
 */
export const CreateIncident = async (req, res) => {
  try {
    const { title, description, severity } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const result = await pool.query(
      `INSERT INTO incidents (title, description, severity, status)
       VALUES ($1, $2, $3, 'OPEN')
       RETURNING *`,
      [title, description || "", severity || "MEDIUM"]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Create Error:", err.message);
    res.status(500).json({ error: "Create failed" });
  }
};
 
