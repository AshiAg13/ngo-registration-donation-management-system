import express from "express";
import { generatePayHereHash, payHereNotify } from "../controllers/payhereController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 💳 PAYHERE PAYMENT GATEWAY ROUTES
 */

// @route   POST /api/payhere/hash
// @desc    Generate secure MD5 hash for frontend checkout
// @access  Protected (Only logged-in users can initiate a payment)
router.post("/hash", authMiddleware, generatePayHereHash);

// @route   POST /api/payhere/notify
// @desc    Webhook for PayHere to send payment confirmation (IPN)
// @access  Public (PayHere servers need to hit this without a JWT)
router.post("/notify", payHereNotify);

export default router;