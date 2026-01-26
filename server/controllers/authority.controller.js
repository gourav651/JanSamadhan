import Issue from "../models/Issue.js";
import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";

/**
 * GET /api/authority/issues/assigned
 */
export const getAssignedIssues = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const authority = await User.findOne({ clerkUserId });
    if (!authority) {
      return res.status(404).json({ success: false });
    }

    const issues = await Issue.find({
      assignedTo: authority._id, // ✅ Mongo ObjectId
      status: { $ne: "RESOLVED" },
    }).sort({ createdAt: -1 });

    res.json({ success: true, issues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * GET /api/authority/issues/:id
 */
export const getIssueForAuthority = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * PATCH /api/authority/issues/:id/status
 */
export const updateStatus = async (req, res) => {
  try {
    // 1️⃣ Clerk user ID from token
    const clerkUserId = req.auth.userId;
    const { status, resolutionNotes } = req.body;

    // 2️⃣ Validate status
    const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // 3️⃣ Find authority (Mongo User) using clerkUserId
    const authority = await User.findOne({
      clerkUserId,
      role: "AUTHORITY",
    });

    if (!authority) {
      return res.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    // 4️⃣ Find issue
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    // 5️⃣ Security check: authority can update ONLY assigned issue
    if (!issue.assignedTo || !issue.assignedTo.equals(authority._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this issue",
      });
    }

    // 6️⃣ Prevent re-modifying resolved issues
    if (issue.status === "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: "Resolved issues cannot be modified",
      });
    }

    // s7️⃣ Update core fields
    issue.status = status;

    if (resolutionNotes) {
      issue.resolutionNotes = resolutionNotes;
    }

    // 8️⃣ Handle resolution images (if uploaded)
    const resolutionImages =
      req.files?.map((file) => file.path) || [];

    if (resolutionImages.length > 0) {
      issue.resolutionImages.push(...resolutionImages);
    }

    // 9️⃣ Status history (audit trail)
    issue.statusHistory.push({
      status,
      changedBy: authority._id,
      changedAt: new Date(),
    });

    await issue.save();

    // 🔟 Activity log (global audit)
    await ActivityLog.create({
      issueId: issue._id,
      action: "STATUS_UPDATED",
      performedBy: clerkUserId,
      role: "AUTHORITY",
      metadata: { status },
    });

    return res.json({
      success: true,
      issue,
    });
  } catch (error) {
    console.error("Authority updateStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update issue status",
    });
  }
};
