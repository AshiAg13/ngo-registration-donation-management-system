import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

/**
 * 🔑 AUTHENTICATION ROUTES
 * These routes are public (no middleware required) 
 * as they are the starting point for user sessions.
 */

// @route   POST /api/auth/register
// @desc    Create a new donor account
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
router.post("/login", loginUser);

export default router;