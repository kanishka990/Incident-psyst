import express from "express";
import {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
  CreateIncident
} from "../controllers/incident.controller.js";

const router = express.Router();


/**
 * GET all incidents
 * GET /api/incidents
 */
router.get("/", getIncidents);

/**
 * CREATE incident (single table)
 * POST /api/incidents
 */
router.post("/", createIncident);

/**
 * 🔥 CREATE incident + user (transaction)
 * POST /api/incidents/with-user
 */
router.post("/with-user", CreateIncident);

/**
 * UPDATE incident status
 * PUT /api/incidents/:id
 */
router.put("/:id", updateIncident);

/**
 * DELETE incident
 * DELETE /api/incidents/:id
 */
router.delete("/:id", deleteIncident);

export default router;
