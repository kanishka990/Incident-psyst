import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import pool from "./config/db.js";
import incidentRoutes from "./routes/incident.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import authRoutes from "./routes/auth.routes.js";
import updateRoutes from "./routes/update.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import appConnectionRoutes from "./routes/app.connection.routes.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their user ID
  socket.on("join", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Handle sending chat messages
  socket.on("send_message", async (data) => {
    const { incidentId, senderId, senderName, senderRole, receiverId, receiverName, message } = data;
    
    // Save message to database
    try {
      const query = `
        INSERT INTO chat_messages (incident_id, sender_id, sender_name, sender_role, receiver_id, receiver_name, message)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [incidentId, senderId, senderName, senderRole, receiverId, receiverName, message];
      const result = await pool.query(query, values);
      const savedMessage = result.rows[0];

      // Emit message to sender
      socket.emit("new_message", savedMessage);

      // Emit message to receiver if online
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new_message", savedMessage);
        io.to(receiverSocketId).emit("unread_update", { incidentId });
      }

      // Also emit to the incident room
      socket.to(`incident_${incidentId}`).emit("new_message", savedMessage);
    } catch (err) {
      console.error("Error saving message:", err.message);
    }
  });

  // Join incident room
  socket.on("join_incident", (incidentId) => {
    socket.join(`incident_${incidentId}`);
    console.log(`Socket joined incident room ${incidentId}`);
  });

  // Leave incident room
  socket.on("leave_incident", (incidentId) => {
    socket.leave(`incident_${incidentId}`);
  });

  // Mark messages as read
  socket.on("mark_read", async (data) => {
    const { incidentId, userId } = data;
    try {
      await pool.query(
        "UPDATE chat_messages SET is_read = TRUE WHERE incident_id = $1 AND receiver_id = $2 AND is_read = FALSE",
        [incidentId, userId]
      );
      // Notify sender that messages were read
      socket.emit("messages_read", { incidentId });
    } catch (err) {
      console.error("Error marking messages as read:", err.message);
    }
  });

  socket.on("disconnect", () => {
    // Remove user from connected users
    for (let [key, value] of connectedUsers.entries()) {
      if (value === socket.id) {
        connectedUsers.delete(key);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

// ✅ MIDDLEWARE
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Incident Management API",
      version: "1.0.0",
      description: "API documentation for the Incident Management System",
      contact: {
        name: "API Support",
        email: "support@incidentmanagement.com"
      }
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/apps", appConnectionRoutes);

// ✅ OPTIONAL ROOT CHECK
app.get("/", (req, res) => {
  res.send("Incident Management API is running");
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ ok: true, db: "connected" });
  } catch (err) {
    return res.status(503).json({ ok: false, db: "down", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

// ✅ CREATE USERS TABLE IF NOT EXISTS
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => {
  console.log('Users table ready');
}).catch(err => {
  console.error('Error creating users table:', err.message);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
