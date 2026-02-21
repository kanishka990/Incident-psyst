import pool from "../config/db.js";

/* ===============================
   GET USER NOTIFICATIONS
============================== */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `SELECT n.*, i.subject as incident_subject
       FROM notifications n
       LEFT JOIN incidents i ON n.incident_id = i.id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

/* ===============================
   GET UNREAD NOTIFICATION COUNT
============================== */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false",
      [userId]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch count" });
  }
};

/* ===============================
   MARK NOTIFICATION AS READ
============================== */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2",
      [notificationId, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

/* ===============================
   MARK ALL NOTIFICATIONS AS READ
============================== */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    await pool.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1",
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};

/* ===============================
   DELETE NOTIFICATION
============================== */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    await pool.query(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2",
      [notificationId, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

/* ===============================
   CREATE NOTIFICATION (Helper function)
============================== */
export const createNotification = async (userId, incidentId, type, title, message) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, incident_id, type, title, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, incidentId, type, title, message]
    );
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
};
