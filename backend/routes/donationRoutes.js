import express from "express";
import {
  createDonation,
  updateDonationStatus,
  getMyDonations,
  getDonationStatus
} from "../controllers/donationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 💰 DONATION MANAGEMENT ROUTES
 * All routes are PROTECTED. A valid JWT must be provided 
 * in the Authorization header to access these endpoints.
 */

// @route   POST /api/donation/create
// @desc    Initialize a PENDING donation record
router.post("/create", authMiddleware, createDonation);

// @route   POST /api/donation/update-status
// @desc    Update a specific donation after payment confirmation
// Note: This is primarily used for local manual testing/simulations
router.post("/update-status", authMiddleware, updateDonationStatus);

// @route   GET /api/donation/my-donations
// @desc    Retrieve the contribution history for the logged-in donor
router.get("/my-donations", authMiddleware, getMyDonations);
// Add this line to your existing donationRoutes file
router.get("/status", getDonationStatus);
export default router;