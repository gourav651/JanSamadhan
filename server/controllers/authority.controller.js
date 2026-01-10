import Issue from "../models/Issue.js";
import ActivityLog from "../models/ActivityLog.js";

export const getAssignedIssues = async (req, res) => {
  const issues = await Issue.find({ assignedAuthority: req.auth.userId });
  res.json({ issues });
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  await ActivityLog.create({
    issueId: issue._id,
    action: "STATUS_UPDATED",
    performedBy: req.auth.userId,
    role: "AUTHORITY",
    metadata: { status }
  });

  res.json({ success: true });
};
