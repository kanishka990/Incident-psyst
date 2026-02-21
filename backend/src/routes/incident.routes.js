import express from "express";
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  addFeedback,
  closeTicket,
  addNote
} from "../controllers/incident.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import { uploadAttachment, getAttachments, downloadAttachment, deleteAttachment } from "../controllers/attachment.controller.js";


const router = express.Router();


/**
 * GET all incidents
 * GET /api/incidents
 * Query params: status, priority, search, sort, order
 */
router.get("/", authenticateToken, getIncidents);

/**
 * GET incident by ID (detailed)
 * GET /api/incidents/:id
 */
router.get("/:id", authenticateToken, getIncidentById);

/**
 * CREATE incident (single table)
 * POST /api/incidents
 */
router.post("/", authenticateToken, createIncident);


/**
 * UPDATE incident
 * PUT /api/incidents/:id
 */
router.put("/:id", authenticateToken, updateIncident);

/**
 * DELETE incident
 * DELETE /api/incidents/:id
 */
router.delete("/:id", authenticateToken, deleteIncident);

/**
 * ADD FEEDBACK/RATING
 * POST /api/incidents/:id/feedback
 */
router.post("/:id/feedback", authenticateToken, addFeedback);

/**
 * CLOSE TICKET
 * POST /api/incidents/:id/close
 */
router.post("/:id/close", authenticateToken, closeTicket);

/**
 * GET attachments for incident
 * GET /api/incidents/:id/attachments
 */
router.get("/:id/attachments", authenticateToken, getAttachments);

/**
 * UPLOAD attachment to incident
 * POST /api/incidents/:id/attachments
 */
router.post("/:id/attachments", authenticateToken, upload.single("file"), uploadAttachment);

/**
 * ADD NOTE to incident
 * POST /api/incidents/:id/notes
 */
router.post("/:id/notes", authenticateToken, addNote);

/**
 * DOWNLOAD attachment
 * GET /api/incidents/attachments/:attachmentId/download
 */
router.get("/attachments/:attachmentId/download", authenticateToken, downloadAttachment);

/**
 * DELETE attachment
 * DELETE /api/incidents/attachments/:attachmentId
 */
router.delete("/attachments/:attachmentId", authenticateToken, deleteAttachment);


export default router;
