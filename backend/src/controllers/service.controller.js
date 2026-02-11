import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();


export const getServices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET services failed:", err.message);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const result = await pool.query(
      `INSERT INTO services (name, description, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, status || 'OPERATIONAL']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Service creation failed:", err.message);
    res.status(500).json({ error: "Service creation failed" });
  }
};

export const updateService = async(req, res) => {
  try {
    const { name, description, status } = req.body;

    const result = await pool.query(
      `UPDATE services SET name=$1, description=$2, status=$3, updated_at=NOW()
       WHERE id=$4
       RETURNING *`,
      [name, description, status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Service update failed:", err.message);
    res.status(500).json({ error: "Service update failed" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM services WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({ message: "Service deleted", service: result.rows[0] });
  } catch (err) {
    console.error("Service delete failed:", err.message);
    res.status(500).json({ error: "Service delete failed" });
  }
};