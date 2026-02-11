import express from "express";
import incidentRoutes from "./routes/incident.routes.js";

const app = express();

app.use(express.json());

// register routes
app.use("/api/incidents", incidentRoutes);


// health test
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
