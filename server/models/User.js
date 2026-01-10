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
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
