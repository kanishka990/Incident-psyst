import express from "express";
import {
  getChatMessages,
  sendChatMessage,
  markMessagesAsRead,
  getUnreadCount
} from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get chat messages for an incident
router.get("/:incidentId", getChatMessages);

// Send a chat message
router.post("/:incidentId", sendChatMessage);

// Mark messages as read
router.put("/:incidentId/read", markMessagesAsRead);

// Get unread message count
router.get("/unread/count", getUnreadCount);

export default router;
