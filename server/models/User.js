import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,
    email: String,

    role: {
      type: String,
      enum: ["CITIZEN", "AUTHORITY", "ADMIN"],
      default: "CITIZEN",
    },

    // ===== AUTHORITY MANAGEMENT FIELDS =====
    department: {
      type: String,
      default: null,
    },

    assignedArea: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "ON_LEAVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
