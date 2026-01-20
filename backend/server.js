import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import payhereRoutes from "./routes/payhereRoutes.js";

dotenv.config();

// Initialize Database
connectDB();

const app = express();

// Middleware
app.use(cors());
// Critical for PayHere Notifications (Webhook)
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payhere", payhereRoutes);

// Base Route
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "UnityFund API is live",
    status: "Healthy" 
  });
});

// VERCEL CONFIGURATION
// We only call app.listen if we are NOT running on Vercel (local testing)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// Export for Vercel
export default app;