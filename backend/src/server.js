import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import  pool  from "./config/db.js";
import incidentRoutes from "./routes/incident.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import authRoutes from "./routes/auth.routes.js";
import updateRoutes from "./routes/update.routes.js";

dotenv.config();
const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ ROUTES (THIS IS WHERE YOU ADD THEM)
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/updates", updateRoutes);


// ✅ OPTIONAL ROOT CHECK
app.get("/", (req, res) => {
  res.send("Incident Management API is running");
});


app.get("/incidents", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ ok: true, db: "connected" });
  } catch (err) {
    return res.status(503).json({ ok: false, db: "down", error: err.message });
  }
    //const result = await pool.query("SELECT * FROM incidents");
    //res.status(200).json(result.rows);
  //} catch (error) {
    //console.error(error);
    //res.status(500).json({ error: "Failed to fetch incidents" });
  
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
