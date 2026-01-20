import Donation from "../models/Donation.js";

/**
 * 1. Create a donation attempt (PENDING)
 * Formats amount to 2 decimal places to match PayHere/Gateway requirements
 */
export const createDonation = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.userId; // Provided by Auth Middleware

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "A valid donation amount is required." });
    }

    // Standardize amount to 2 decimal places (e.g., 100.00)
    const formattedAmount = parseFloat(amount).toFixed(2);

    const donation = await Donation.create({
      user: userId,
      amount: formattedAmount,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Donation initialized.",
      donationId: donation._id,
      status: donation.status,
    });
  } catch (error) {
    console.error("Create Donation Error:", error);
    res.status(500).json({ message: "Failed to initialize donation record." });
  }
};

/**
 * 2. Update donation status (SUCCESS / FAILED)
 * Securely updates status after payment gateway confirmation
 */
export const updateDonationStatus = async (req, res) => {
  try {
    const { donationId, status } = req.body;

    if (!donationId || !status) {
      return res.status(400).json({ message: "Missing required tracking parameters." });
    }

    const allowedStatuses = ["SUCCESS", "FAILED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update requested." });
    }

    const donation = await Donation.findById(donationId);
    
    if (!donation) {
      return res.status(404).json({ message: "Donation record not found." });
    }

    // Prevent overwriting a SUCCESS state (Security check)
    if (donation.status === "SUCCESS") {
      return res.status(400).json({ message: "Cannot modify a completed transaction." });
    }

    donation.status = status;
    await donation.save();

    res.status(200).json({
      message: `Transaction ${status.toLowerCase()}ly recorded.`,
      donationId: donation._id,
      status: donation.status,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Error updating transaction status." });
  }
};

/**
 * 3. Get logged-in user's donation history
 * Optimized with .lean() for faster dashboard rendering
 */
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean(); // Faster performance for read-only history

    res.status(200).json(donations || []);
  } catch (error) {
    console.error("History Retrieval Error:", error);
    res.status(500).json({ message: "Failed to load donation history." });
  }
};

/**
 * Check specific donation status (Polling endpoint for frontend)
 * Used by the "PaymentResult" page to know when to stop the pulse animation
 */
export const getDonationStatus = async (req, res) => {
  try {
    const { order_id } = req.query; // Matches your ?order_id=... from the PHP version

    if (!order_id) {
      return res.status(400).json({ error: "Missing order_id" });
    }

    const donation = await Donation.findById(order_id).lean();

    if (!donation) {
      return res.status(200).json({ status: "NOT_FOUND" });
    }

    // Return the status in uppercase (SUCCESS, PENDING, FAILED)
    res.status(200).json({ status: donation.status });
  } catch (error) {
    console.error("Status Check Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};