import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: String,          // Clerk userId
    role: String,            // ADMIN | AUTHORITY | CITIZEN
    title: String,
    message: String,
    type: String,            // ISSUE, SYSTEM, SUPPORT
    link: String,            // redirect URL
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
