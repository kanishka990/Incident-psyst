import pool from "../config/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/* ===============================
   GET ATTACHMENTS FOR INCIDENT
   =============================== */
export const getAttachments = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const userEmail = req.headers.user;
    const userRole = req.headers.role;
    
    // Check if user is customer - only allow viewing attachments on their own incidents
    if (userRole === 'customer') {
      const checkResult = await pool.query(
        "SELECT id FROM incidents WHERE id = $1 AND requester_email = $2",
        [incidentId, userEmail]
      );
      
      if (checkResult.rowCount === 0) {
        return res.status(403).json({ error: "You can only view attachments on your own tickets" });
      }
    }
    
    const result = await pool.query(
      `SELECT a.*, u.name as uploaded_by_name
       FROM incident_attachments a
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.incident_id = $1
       ORDER BY a.uploaded_at DESC`,
      [incidentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attachments" });
  }
};

/* ===============================
   UPLOAD ATTACHMENT
   =============================== */
export const uploadAttachment = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const userEmail = req.headers.user;
    const userRole = req.headers.role;
    
    // Check if user is customer - only allow uploading to their own incidents
    if (userRole === 'customer') {
      const checkResult = await pool.query(
        "SELECT id FROM incidents WHERE id = $1 AND requester_email = $2",
        [incidentId, userEmail]
      );
      
      if (checkResult.rowCount === 0) {
        return res.status(403).json({ error: "You can only upload attachments to your own tickets" });
      }
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get user ID from email
    let userId = null;
    if (userEmail) {
      const userResult = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [userEmail]
      );
      userId = userResult.rows[0]?.id || null;
    }
    
    const result = await pool.query(
      `INSERT INTO incident_attachments (incident_id, user_id, file_name, file_path, file_size, file_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        incidentId,
        userId,
        req.file.originalname,
        req.file.path,
        req.file.size,
        req.file.mimetype
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload attachment" });
  }
};

/* ===============================
   DOWNLOAD ATTACHMENT
   =============================== */
export const downloadAttachment = async (req, res) => {
  try {
    const { attachmentId } = req.params;
    const userEmail = req.headers.user;
    const userRole = req.headers.role;
    
    const result = await pool.query(
      "SELECT * FROM incident_attachments WHERE id = $1",
      [attachmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    const attachment = result.rows[0];
    
    // Check if user is customer - only allow downloading from their own incidents
    if (userRole === 'customer') {
      const checkResult = await pool.query(
        "SELECT id FROM incidents WHERE id = $1 AND requester_email = $2",
        [attachment.incident_id, userEmail]
      );
      
      if (checkResult.rowCount === 0) {
        return res.status(403).json({ error: "You can only download attachments from your own tickets" });
      }
    }
    
    // Check if file exists
    if (!fs.existsSync(attachment.file_path)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.download(attachment.file_path, attachment.file_name);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to download attachment" });
  }
};

/* ===============================
   DELETE ATTACHMENT
   =============================== */
export const deleteAttachment = async (req, res) => {
  try {
    const { attachmentId } = req.params;
    const userEmail = req.headers.user;
    const userRole = req.headers.role;
    
    // Get attachment details first
    const result = await pool.query(
      "SELECT * FROM incident_attachments WHERE id = $1",
      [attachmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    const attachment = result.rows[0];
    
    // Check if user is customer - only allow deleting from their own incidents
    if (userRole === 'customer') {
      const checkResult = await pool.query(
        "SELECT id FROM incidents WHERE id = $1 AND requester_email = $2",
        [attachment.incident_id, userEmail]
      );
      
      if (checkResult.rowCount === 0) {
        return res.status(403).json({ error: "You can only delete attachments from your own tickets" });
      }
    }
    
    // Delete file from filesystem
    if (fs.existsSync(attachment.file_path)) {
      fs.unlinkSync(attachment.file_path);
    }

    // Delete from database
    await pool.query(
      "DELETE FROM incident_attachments WHERE id = $1",
      [attachmentId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete attachment" });
  }
};
