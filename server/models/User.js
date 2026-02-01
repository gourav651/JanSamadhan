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
    profileImage: {
      type: String,
      default: null,
    },

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

    // Keep this OPTIONAL (not forced for citizens)
    notificationPrefs: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
