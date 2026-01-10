import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
    action: String,
    performedBy: String,
    role: String,
    metadata: Object
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
