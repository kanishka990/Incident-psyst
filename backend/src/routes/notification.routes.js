import express from "express";
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from "../controllers/notification.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all notifications for current user
router.get("/", authenticateToken, getNotifications);

// Get unread notification count
router.get("/unread-count", authenticateToken, getUnreadCount);

// Mark notification as read
router.put("/:notificationId/read", authenticateToken, markAsRead);

// Mark all notifications as read
router.put("/read-all", authenticateToken, markAllAsRead);

// Delete notification
router.delete("/:notificationId", authenticateToken, deleteNotification);

export default router;
