import express from "express";
import {
  getUpdates,
  createUpdate,
  updateUpdate,
  deleteUpdate,
  addUpdate,
} from "../controllers/update.controller.js";

const router = express.Router();

/**
 * GET all updates
 * GET /api/updates
 */
router.get("/", getUpdates);

/**
 * CREATE update
 * POST /api/updates
 */
router.post("/", createUpdate);

/**
 * UPDATE update
 * PUT /api/updates/:id
 */
router.put("/:id", updateUpdate);

/**
 * DELETE update
 * DELETE /api/updates/:id
 */
router.delete("/:id", deleteUpdate);

/**
 * ADD UPDATE TO INCIDENT (legacy route)
 * POST /api/updates/:id
 */
router.post("/:id", addUpdate);

export default router;
