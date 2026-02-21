import pool from "../config/db.js";

// Create chat messages table if not exists
const initChatTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      incident_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      sender_name VARCHAR(255) NOT NULL,
      sender_role VARCHAR(50) NOT NULL,
      receiver_id INTEGER NOT NULL,
      receiver_name VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("Chat messages table ready");
  } catch (err) {
    console.error("Error creating chat_messages table:", err.message);
  }
};

// Initialize table on module load
initChatTable();

// Get chat messages for an incident
export const getChatMessages = async (req, res) => {
  const { incidentId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      SELECT * FROM chat_messages 
      WHERE incident_id = $1
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query, [incidentId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching chat messages:", err.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Send a chat message
export const sendChatMessage = async (req, res) => {
  const { incidentId } = req.params;
  const { receiver_id, receiver_name, message } = req.body;
  const senderId = req.user?.id;
  const senderName = req.user?.name || req.user?.full_name || "User";
  const senderRole = req.user?.role || "customer";

  if (!senderId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    const query = `
      INSERT INTO chat_messages (incident_id, sender_id, sender_name, sender_role, receiver_id, receiver_name, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      incidentId,
      senderId,
      senderName,
      senderRole,
      receiver_id,
      receiver_name,
      message.trim()
    ];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error sending chat message:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  const { incidentId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      UPDATE chat_messages 
      SET is_read = TRUE 
      WHERE incident_id = $1 AND receiver_id = $2 AND is_read = FALSE
    `;
    await pool.query(query, [incidentId, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error marking messages as read:", err.message);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};

// Get unread message count for a user
export const getUnreadCount = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      SELECT COUNT(*) as count 
      FROM chat_messages 
      WHERE receiver_id = $1 AND is_read = FALSE
    `;
    const result = await pool.query(query, [userId]);
    res.json({ unreadCount: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("Error getting unread count:", err.message);
    res.status(500).json({ error: "Failed to get unread count" });
  }
};
