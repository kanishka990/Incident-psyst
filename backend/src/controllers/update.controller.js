import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

/* ==================================================
   GET ALL UPDATES
================================================== */
export const getUpdates = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM incident_updates ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error("GET updates failed:", err.message);
    res.status(500).json({
      error: "Failed to fetch updates",
    });
  }
};


/* ==================================================
   CREATE NEW UPDATE
================================================== */
export const createUpdate = async (req, res) => {
  try {

    const { incident_id, message, update_type } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO incident_updates
       (incident_id, message, update_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        incident_id || null,
        message,
        update_type || "GENERAL",
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Create update failed:", err.message);
    res.status(500).json({
      error: "Update creation failed",
    });
  }
};


/* ==================================================
   UPDATE EXISTING UPDATE
================================================== */
export const updateUpdate = async (req, res) => {
  try {

    const { message, update_type } = req.body;
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE incident_updates
       SET message = COALESCE($1,message),
           update_type = COALESCE($2,update_type),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [message, update_type, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Update not found",
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error("Update failed:", err.message);
    res.status(500).json({
      error: "Update failed",
    });
  }
};


/* ==================================================
   DELETE UPDATE
================================================== */
export const deleteUpdate = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM incident_updates WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Update not found",
      });
    }

    res.status(200).json({
      message: "Update deleted",
      update: result.rows[0],
    });

  } catch (err) {
    console.error("Delete failed:", err.message);
    res.status(500).json({
      error: "Delete failed",
    });
  }
};


/* ==================================================
   ADD UPDATE TO INCIDENT (COMMENT STYLE)
================================================== */
export const addUpdate = async (req, res) => {
  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message required",
      });
    }

    const result = await pool.query(
      `INSERT INTO incident_updates
       (incident_id, message)
       VALUES ($1,$2)
       RETURNING *`,
      [req.params.id, message]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Add update failed:", err.message);
    res.status(500).json({
      error: "Failed to add update",
    });
  }
};


/* ==================================================
   UPDATE INCIDENT (DEVELOPER TICKETING)
================================================== */
export const updateIncident = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      status,
      priority,
      assignee,
      closed_by,
      request_type,
      sla
    } = req.body;

    let closedDate = null;

    if (status === "CLOSED") {
      closedDate = new Date();
    }

    const result = await pool.query(
      `UPDATE incidents
       SET status = COALESCE($1,status),
           priority = COALESCE($2,priority),
           assignee = COALESCE($3,assignee),
           closed_by = COALESCE($4,closed_by),
           request_type = COALESCE($5,request_type),
           sla = COALESCE($6,sla),
           closed_date = COALESCE($7,closed_date)
       WHERE id=$8
       RETURNING *`,
      [
        status,
        priority,
        assignee,
        closed_by,
        request_type,
        sla,
        closedDate,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Incident not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error("Incident update failed:", err.message);
    res.status(500).json({
      error: "Update failed",
    });
  }
};
