import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Donation must belong to a registered user"],
      index: true // 🚀 Optimization: Speeds up "My Donations" queries
    },
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Minimum donation amount is ₹1"] // Prevents zero or negative entries
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "CANCELED"],
      default: "PENDING",
      uppercase: true // 🛡️ Ensures consistency in DB (always "SUCCESS", never "success")
    },
    payhere_order_id: {
      type: String, // Optional: useful for cross-referencing with PayHere dashboard
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

// Pre-save middleware to ensure amount is always stored to 2 decimal places
// Old version (causing error):
// donationSchema.pre("save", function (next) { ... next(); });

// ✅ NEW CORRECTED VERSION:
donationSchema.pre("save", function () {
  if (this.amount) {
    this.amount = parseFloat(this.amount.toFixed(2));
  }
  // No need for next() here in modern Mongoose pre-save hooks
});
const Donation = mongoose.model("Donation", donationSchema);

export default Donation;