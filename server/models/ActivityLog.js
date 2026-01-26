import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    action: {
      type: String,
      enum: ["STATUS_UPDATED", "ASSIGNED"],
      required: true,
    },
    performedBy: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["CITIZEN", "AUTHORITY", "ADMIN"],
      required: true,
    },
    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
