import express from "express";
import { getComments, addComment, deleteComment } from "../controllers/comment.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get comments for an incident
router.get("/incidents/:incidentId/comments", authenticateToken, getComments);

// Add comment to an incident
router.post("/incidents/:incidentId/comments", authenticateToken, addComment);

// Delete comment
router.delete("/comments/:commentId", authenticateToken, deleteComment);

export default router;
