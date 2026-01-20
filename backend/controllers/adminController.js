import User from "../models/User.js";
import Donation from "../models/Donation.js";

/**
 * 1. Get All Registered Users
 * Optimized with .lean() for faster read-only performance
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean(); // Faster execution as it returns plain JS objects

    res.status(200).json(users || []);
  } catch (error) {
    console.error("Admin: Get Users Error:", error);
    res.status(500).json({ message: "Failed to retrieve user directory." });
  }
};

/**
 * 2. Get All Donations (Populating User Data)
 * Handles cases where users might have been deleted (null check)
 */
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(donations || []);
  } catch (error) {
    console.error("Admin: Get Donations Error:", error);
    res.status(500).json({ message: "Failed to retrieve donation records." });
  }
};

/**
 * 3. Admin Dashboard Statistics
 * Aggregation optimized to return 0 instead of null for cleaner frontend handling
 */
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, donationStats] = await Promise.all([
      User.countDocuments({ role: "USER" }), // Counts only donors, excludes admins
      Donation.aggregate([
        { $match: { status: "SUCCESS" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
      ])
    ]);

    const totalFunds = donationStats.length > 0 ? donationStats[0].totalAmount : 0;

    res.status(200).json({
      totalUsers,
      totalDonationAmount: totalFunds
    });
  } catch (error) {
    console.error("Admin: Stats Error:", error);
    res.status(500).json({ message: "Error calculating financial statistics." });
  }
};