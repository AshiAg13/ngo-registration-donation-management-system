import express from "express";
import {
  getAllUsers,
  getAllDonations,
  getAdminStats
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * 🔒 ADMIN ONLY ROUTES
 * Logic: 
 * 1. authMiddleware: Verifies the JWT and extracts user info.
 * 2. adminMiddleware: Checks if the extracted role is 'ADMIN'.
 * 3. Controller: Executes the data retrieval.
 */

// Fetch all registered donor profiles
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// Fetch all donation history records (including donor details)
router.get("/donations", authMiddleware, adminMiddleware, getAllDonations);

// Fetch high-level NGO financial and user statistics
router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

export default router;