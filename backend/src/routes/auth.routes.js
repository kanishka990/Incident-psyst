import express from "express";
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword,
  getProfile,
  // updateProfile
  getDevelopers,
  getAllUsers
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register new user
router.post("/register", register);

// Login
router.post("/login", login);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

// Get user profile (protected)
router.get("/profile", authenticateToken, getProfile);

// Update user profile (protected)
// router.put("/profile", authenticateToken, updateProfile);

// Get all developers (for assignee selection)
router.get("/developers", authenticateToken, getDevelopers);

// Get all users (for user selection)
router.get("/users", authenticateToken, getAllUsers);

export default router;
