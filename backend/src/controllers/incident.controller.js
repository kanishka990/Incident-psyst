import pool from "../config/db.js";

/* ===============================
   GET ALL INCIDENTS
   =============================== */
export const getIncidents = async (req, res) => {
  try {

    const role = req.headers.role;
    const email = req.headers.user;

    let result;

    // 👨‍💻 Developer → ALL tickets
    if (role === "developer") {
      result = await pool.query(
        `SELECT i.*, 
         u.id as user_id, u.name as user_name, u.email as user_email,
         d.id as developer_id, d.name as developer_name, d.email as developer_email
         FROM incidents i
         LEFT JOIN users u ON i.requester_email = u.email
         LEFT JOIN users d ON i.assigned_to = d.email
         ORDER BY i.created_at DESC`
      );
    }

    // 👤 Customer → ONLY OWN tickets
    else {
      result = await pool.query(
        `SELECT i.*, 
         u.id as user_id, u.name as user_name, u.email as user_email,
         d.id as developer_id, d.name as developer_name, d.email as developer_email
         FROM incidents i
         LEFT JOIN users u ON i.requester_email = u.email
         LEFT JOIN users d ON i.assigned_to = d.email
         WHERE i.requester_email=$1
         ORDER BY i.created_at DESC`,
        [email]
      );
    }

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to load incidents",
    });
  }
};


/* ===============================
   GET INCIDENT BY ID
   =============================== */
export const getIncidentById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT i.*, 
       u.id as user_id, u.name as user_name, u.email as user_email,
       d.id as developer_id, d.name as developer_name, d.email as developer_email
       FROM incidents i
       LEFT JOIN users u ON i.requester_email = u.email
       LEFT JOIN users d ON i.assigned_to = d.email
       WHERE i.id=$1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Incident not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to load incident",
    });
  }
};


/* ===============================
   CREATE INCIDENT
   =============================== */
export const createIncident = async (req, res) => {
  try {

    const {
      subject,
      description,
      severity,
      priority,
      request_type,
      requester_email,
      customer_email,
      assignee_email,
    } = req.body;

    // Generate request_id
    const requestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Get assignee user ID from email
    let assigneeId = null;
    if (assignee_email) {
      const assigneeResult = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [assignee_email]
      );
      assigneeId = assigneeResult.rows[0]?.id || null;
    }

    const result = await pool.query(
      `INSERT INTO incidents
      (request_id, title, subject, description, severity, priority, request_type, status, requester_email, customer_email, assignee_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'OPEN',$8,$9,$10)
      RETURNING *`,
      [
        requestId,
        subject,
        subject,
        description,
        severity || "MEDIUM",
        priority || "P2",
        request_type || "INCIDENT",
        requester_email,
        customer_email || requester_email,
        assigneeId,
      ]
    );

    const newIncident = result.rows[0];

    // Get user name from database
    const userResult = await pool.query(
      "SELECT name, email FROM users WHERE email = $1",
      [requester_email]
    );
    
    const userName = userResult.rows[0]?.name || requester_email.split('@')[0];
    const userEmail = userResult.rows[0]?.email || requester_email;

    // Get assignee info if specified
    let assigneeName = null;
    let assigneeEmail = null;
    if (assignee_email) {
      const assigneeResult = await pool.query(
        "SELECT name, email FROM users WHERE email = $1",
        [assignee_email]
      );
      assigneeName = assigneeResult.rows[0]?.name || assignee_email.split('@')[0];
      assigneeEmail = assigneeResult.rows[0]?.email || assignee_email;
    }

    // Create notification for the user
    await pool.query(
      `INSERT INTO notifications (user_id, incident_id, type, title, message)
       SELECT id, $1, 'TICKET_CREATED', $2, $3
       FROM users WHERE email = $4`,
      [newIncident.id, `Ticket Created: ${subject}`, `Your ticket ${requestId} has been created successfully.`, requester_email]
    );

    // Create notification for developers
    await pool.query(
      `INSERT INTO notifications (user_id, incident_id, type, title, message)
       SELECT id, $1, 'NEW_TICKET', $2, $3
       FROM users WHERE role = 'developer'`,
      [newIncident.id, `New Ticket: ${requestId}`, `A new ticket has been created by ${userName} (${userEmail}). Priority: ${priority || 'P2'}`]
    );

    // Simulate sending email to CUSTOMER (confirmation)
    console.log("\n========================================");
    console.log("📧 EMAIL NOTIFICATION - CUSTOMER CONFIRMATION");
    console.log("========================================");
    console.log(`To: ${userName} <${userEmail}>`);
    console.log(`Subject: Ticket Created - ${requestId}`);
    console.log(`\nDear ${userName},\n`);
    console.log(`Your ticket has been created successfully!\n`);
    console.log(`Ticket Details:`);
    console.log(`  - Ticket ID: ${requestId}`);
    console.log(`  - Subject: ${subject}`);
    console.log(`  - Priority: ${priority || "P2"}`);
    console.log(`  - Status: OPEN\n`);
    console.log(`We will review your ticket and get back to you soon.\n`);
    console.log("========================================\n");

    // Get developer emails
    const devResult = await pool.query(
      "SELECT name, email FROM users WHERE role = 'developer'"
    );

    // Simulate sending email to DEVELOPERS
    if (devResult.rows.length > 0) {
      console.log("\n========================================");
      console.log("📧 EMAIL NOTIFICATION - DEVELOPERS");
      console.log("========================================");
      devResult.rows.forEach(dev => {
        console.log(`To: ${dev.name} <${dev.email}>`);
      });
      console.log(`Subject: New Ticket Assigned - ${requestId}`);
      console.log(`\nDear Team,\n`);
      console.log(`A new ticket has been created and requires your attention.\n`);
      console.log(`Ticket Details:`);
      console.log(`  - Ticket ID: ${requestId}`);
      console.log(`  - Subject: ${subject}`);
      console.log(`  - Priority: ${priority || "P2"}`);
      console.log(`  - Type: ${request_type || "INCIDENT"}`);
      console.log(`  - Created By: ${userName} (${userEmail})\n`);
      console.log(`Please review and assign this ticket accordingly.\n`);
      console.log("========================================\n");
    }

    // Simulate sending email to ASSIGNED DEVELOPER (if specified)
    if (assigneeEmail) {
      console.log("\n========================================");
      console.log("📧 EMAIL NOTIFICATION - ASSIGNED DEVELOPER");
      console.log("========================================");
      console.log(`To: ${assigneeName} <${assigneeEmail}>`);
      console.log(`Subject: Ticket Assigned to You - ${requestId}`);
      console.log(`\nDear ${assigneeName},\n`);
      console.log(`A ticket has been assigned to you.\n`);
      console.log(`Ticket Details:`);
      console.log(`  - Ticket ID: ${requestId}`);
      console.log(`  - Subject: ${subject}`);
      console.log(`  - Priority: ${priority || "P2"}`);
      console.log(`  - Type: ${request_type || "INCIDENT"}`);
      console.log(`  - Created By: ${userName} (${userEmail})\n`);
      console.log(`Please review and resolve this ticket.\n`);
      console.log("========================================\n");
    }

    res.status(201).json(newIncident);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Create failed",
    });
  }
};


/* ===============================
   UPDATE INCIDENT
   =============================== */
export const updateIncident = async (req, res) => {
  try {

    const { id } = req.params;
    const {
      status,
      severity,
      priority,
      subject,
      description,
    } = req.body;

    const result = await pool.query(
      `UPDATE incidents
       SET subject = COALESCE($1,subject),
           description = COALESCE($2,description),
           status = COALESCE($3,status),
           severity = COALESCE($4,severity),
           priority = COALESCE($5,priority)
       WHERE id=$6
       RETURNING *`,
      [
        subject,
        description,
        status,
        severity,
        priority,
        id,
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Update failed",
    });
  }
};


/* ===============================
   DELETE INCIDENT
   =============================== */
export const deleteIncident = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM incidents WHERE id=$1",
      [id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Delete failed",
    });
  }
};


/* ===============================
   CLOSE TICKET
   =============================== */
export const closeTicket = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `UPDATE incidents
       SET status='CLOSED',
           closed_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to close ticket",
    });
  }
};

/* ===============================
   ADD FEEDBACK
   =============================== */
export const addFeedback = async (req, res) => {
  try {

    const { id } = req.params;
    const { rating, feedback } = req.body;

    if (!rating) {
      return res.status(400).json({
        error: "Rating required"
      });
    }

    const result = await pool.query(
      `UPDATE incidents
       SET rating=$1,
           feedback=$2,
           status='CLOSED'
       WHERE id=$3
       RETURNING *`,
      [rating, feedback || null, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Feedback failed"
    });
  }
};


/* ===============================
   UPLOAD ATTACHMENT
============================== */
export const uploadAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await pool.query(
      `INSERT INTO incident_attachments
      (incident_id, file_name, file_path)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [id, req.file.originalname, req.file.filename]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

/* ===============================
   ADD NOTE TO INCIDENT
============================== */
export const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_internal } = req.body;
    const email = req.headers.user;

    if (!content) {
      return res.status(400).json({ error: "Note content required" });
    }

    // Check if incident_notes table exists, if not use comments table
    const tableCheck = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'incident_notes'
      )`
    );

    let result;
    if (tableCheck.rows[0].exists) {
      result = await pool.query(
        `INSERT INTO incident_notes (incident_id, content, author_email, is_internal)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [id, content, email, is_internal || false]
      );
    } else {
      // Fallback to comments table with note type
      result = await pool.query(
        `INSERT INTO comments (incident_id, content, author_email, is_note)
         VALUES ($1, $2, $3, true)
         RETURNING *`,
        [id, content, email]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add note" });
  }
};
