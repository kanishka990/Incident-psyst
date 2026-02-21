import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import incidentRoutes from "./routes/incident.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import updateRoutes from "./routes/update.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import appConnectionRoutes from "./routes/app.connection.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api", commentRoutes);
app.use("/api", attachmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/apps", appConnectionRoutes);

// Health test
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
