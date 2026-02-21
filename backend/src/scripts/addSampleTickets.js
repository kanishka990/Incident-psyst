import pool from "../config/db.js";

/**
 * ==============================
 * ADD SAMPLE TICKETS WITH NEW FIELDS
 * ==============================
 */
async function addSampleTickets() {
  try {
    console.log("🎫 Adding sample tickets with ticketing features...");

    // Get a user ID for assignee (assuming users exist)
    const usersResult = await pool.query("SELECT id FROM users LIMIT 1");
    const userId = usersResult.rows[0]?.id || null;

    const sampleTickets = [
      {
        request_id: `REQ-${Date.now()}-001`,
        subject: "Critical Database Connection Issue",
        description: "Production database is experiencing intermittent connection timeouts. Users are unable to access the application.",
        severity: "CRITICAL",
        status: "IN_PROGRESS",
        priority: "P1",
        request_type: "INCIDENT",
        customer_email: "customer1@example.com",
        requester_email: "john.doe@company.com",
        assignee_id: userId,
        sla_hours: 4
      },
      {
        request_id: `REQ-${Date.now()}-002`,
        subject: "Feature Request: Add Export to Excel",
        description: "Users are requesting the ability to export reports to Excel format for easier data analysis.",
        severity: "MEDIUM",
        status: "PENDING",
        priority: "P2",
        request_type: "SERVICE",
        customer_email: "customer2@example.com",
        requester_email: "jane.smith@company.com",
        sla_hours: 24
      },
      {
        request_id: `REQ-${Date.now()}-003`,
        subject: "Login Page UI Enhancement",
        description: "Improve the login page design to match the new brand guidelines and make it more user-friendly.",
        severity: "LOW",
        status: "PENDING",
        priority: "P3",
        request_type: "SERVICE",
        customer_email: "customer3@example.com",
        requester_email: "mike.johnson@company.com",
        sla_hours: 48
      },
      {
        request_id: `REQ-${Date.now()}-004`,
        subject: "API Rate Limiting Issue",
        description: "API is returning 429 errors during peak hours. Need to investigate and increase rate limits.",
        severity: "HIGH",
        status: "PENDING",
        priority: "P1",
        request_type: "INCIDENT",
        customer_email: "customer4@example.com",
        requester_email: "sarah.williams@company.com",
        sla_hours: 8
      },
      {
        request_id: `REQ-${Date.now()}-005`,
        subject: "Email Notification Not Working",
        description: "Users are not receiving email notifications for password reset requests.",
        severity: "MEDIUM",
        status: "COMPLETED",
        priority: "P2",
        request_type: "INCIDENT",
        customer_email: "customer5@example.com",
        requester_email: "david.brown@company.com",
        assignee_id: userId,
        closed_by_id: userId,
        closed_date: new Date(),
        sla_hours: 12
      }
    ];

    for (const ticket of sampleTickets) {
      await pool.query(
        `INSERT INTO incidents 
         (request_id, title, subject, description, severity, status, priority, request_type, 
          customer_email, requester_email, assignee_id, closed_by_id, closed_date, sla_hours)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          ticket.request_id,
          ticket.subject, // Use subject as title
          ticket.subject,
          ticket.description,
          ticket.severity,
          ticket.status,
          ticket.priority,
          ticket.request_type,
          ticket.customer_email,
          ticket.requester_email,
          ticket.assignee_id || null,
          ticket.closed_by_id || null,
          ticket.closed_date || null,
          ticket.sla_hours
        ]
      );
      console.log(`✅ Added: ${ticket.request_id} - ${ticket.subject}`);
    }

    console.log("\n✅ Sample tickets added successfully!");
    console.log(`   Total tickets: ${sampleTickets.length}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to add sample tickets:", err.message);
    process.exit(1);
  }
}

addSampleTickets();
