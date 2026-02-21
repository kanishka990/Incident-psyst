import pool from "../config/db.js";

/* ===============================
   GET COMMENTS FOR INCIDENT
============================== */
export const getComments = async (req, res) => {
  try {
    const { incidentId } = req.params;
    
    // Check if user is customer - only allow viewing comments on their own incidents
    if (req.user?.role === 'customer') {
      const checkResult = await pool.query(
        "SELECT id FROM incidents WHERE id = $1 AND user_id = $2",
        [incidentId, req.user.id]
      );
      
      if (checkResult.rowCount === 0) {
        return res.status(403).json({ error: "You can only view comments on your own tickets" });
      }
    }
    
    const result = await pool.query(
      `SELECT c.*, u.name as author_name, u.email as author_email
       FROM incident_comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.incident_id = $1
       ORDER BY c.created_at ASC`,
      [incidentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

/* ===============================
   ADD COMMENT TO INCIDENT
============================== */
export const addComment = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { comment, isInternal } = req.body;
    const userId = req.user?.id || null;
    const userRole = req.user?.role || 'customer';
    
    // Get user name
    let userName = 'Anonymous';
    if (userId) {
      const userResult = await pool.query(
        "SELECT name FROM users WHERE id = $1",
        [userId]
      );
      if (userResult.rowCount > 0) {
        userName = userResult.rows[0].name || userRole;
      }
    }

    const result = await pool.query(
      `INSERT INTO incident_comments (incident_id, user_id, user_name, user_role, comment, is_internal)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [incidentId, userId, userName, userRole, comment, isInternal || false]
    );

    // Create notification for the comment
    const incidentResult = await pool.query(
      "SELECT user_id, subject FROM incidents WHERE id = $1",
      [incidentId]
    );
    
    if (incidentResult.rowCount > 0) {
      const incident = incidentResult.rows[0];
      
      // Notify the ticket owner if commenter is different
      if (incident.user_id && incident.user_id !== userId) {
        await pool.query(
          `INSERT INTO notifications (user_id, incident_id, type, title, message)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            incident.user_id,
            incidentId,
            'new_comment',
            'New Comment on Your Ticket',
            `${userName} commented on "${incident.subject}"`
          ]
        );
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

/* ===============================
   DELETE COMMENT
============================== */
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    await pool.query(
      "DELETE FROM incident_comments WHERE id = $1",
      [commentId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
