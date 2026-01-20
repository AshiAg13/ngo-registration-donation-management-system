import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true, // Removes accidental leading/trailing spaces
      maxLength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true, // Prevents duplicate accounts
      lowercase: true, // 🛡️ Always stores as "test@gmail.com" even if user types "Test@GMAIL.com"
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
      type: String,
      enum: {
        values: ["USER", "ADMIN"],
        message: "{VALUE} is not a valid role"
      },
      default: "USER",
      uppercase: true // Ensures "ADMIN" vs "admin" consistency
    }
  },
  {
    timestamps: true // Tracks "Joined Date" automatically for your Admin Dashboard
  }
);

// Optional: Add a text index for the Admin Dashboard search feature
userSchema.index({ name: 'text', email: 'text' });

const User = mongoose.model("User", userSchema);

export default User;