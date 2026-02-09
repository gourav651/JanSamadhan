import Issue from "../models/Issue.js";
import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { io } from "../server.js";

/**
 * GET /api/authority/issues/assigned
 */
export const getAssignedIssues = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { status, category, priority, page = 1, limit = 5 } = req.query;

    // 1️⃣ Find authority
    const authority = await User.findOne({
      clerkUserId,
      role: "AUTHORITY",
    });

    if (!authority) {
      return res.status(404).json({ success: false });
    }

    // 2️⃣ Build query
    const query = {
      assignedTo: authority._id,
    };

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    // 3️⃣ Pagination calculations
    const skip = (Number(page) - 1) * Number(limit);

    const [issues, total] = await Promise.all([
      Issue.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),

      Issue.countDocuments(query),
    ]);

    // 4️⃣ Send response with pagination
    res.json({
      success: true,
      issues,
      pagination: {
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
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
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name department");

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
    const allowedStatuses = ["ASSIGNED", "IN_PROGRESS", "RESOLVED"];
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
    const resolutionImages = req.files?.map((file) => file.path) || [];

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

    await Notification.create({
      userId: issue.reportedByClerkId, // store this in Issue model
      role: "CITIZEN",
      title: "Issue Status Updated",
      message: `Your issue "${issue.title}" is now ${status.replace("_", " ")}`,
      type: "ISSUE",
      link: `/citizen/issues/${issue._id}`,
    });

    io.to(issue.reportedByClerkId).emit("notification", {
      title: "Issue Status Updated",
      message: `Your issue "${issue.title}" is now ${status.replace("_", " ")}`,
      link: `/citizen/issues/${issue._id}`,
      isRead: false,
      createdAt: new Date(),
    });

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

/**
 * GET /api/authority/dashboard/stats
 */
export const getAuthorityDashboardStats = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const authority = await User.findOne({ clerkUserId });
    if (!authority) {
      return res.status(404).json({ success: false });
    }

    const [totalAssigned, inProgress, resolved, open] = await Promise.all([
      Issue.countDocuments({ assignedTo: authority._id }),
      Issue.countDocuments({
        assignedTo: authority._id,
        status: "IN_PROGRESS",
      }),
      Issue.countDocuments({ assignedTo: authority._id, status: "RESOLVED" }),
      Issue.countDocuments({ assignedTo: authority._id, status: "ASSIGNED" }),
    ]);

    res.json({
      success: true,
      data: {
        totalAssigned,
        open,
        inProgress,
        resolved,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * GET /api/authority/issues/recent
 * Returns latest 5 assigned issues
 */
export const getRecentAssignedIssues = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const authority = await User.findOne({
      clerkUserId,
      role: "AUTHORITY",
    });

    if (!authority) {
      return res.status(404).json({ success: false });
    }

    const issues = await Issue.find({
      assignedTo: authority._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      issues,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * GET /api/authority/issues/map
 * Lightweight geo payload for map view
 */

export const getAuthorityMapIssues = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { status, category, radius, lat, lng } = req.query;

    const authority = await User.findOne({
      clerkUserId,
      role: "AUTHORITY",
    });

    if (!authority) {
      return res.status(403).json({ success: false });
    }

    const query = {
      assignedTo: authority._id,
    };

    // 🔹 Status filter
    if (status) query.status = status;

    // 🔹 Category filter
    if (category) query.category = category;

    // 🔹 Radius filter (geo)
    if (lat && lng && radius) {
      query.location = {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(radius) * 1000, // km → meters
        },
      };
    }

    const issues = await Issue.find(query).select(
      "title status category location",
    );

    res.json({ success: true, issues });
  } catch (err) {
    console.error("Map issues error:", err);
    res.status(500).json({ success: false });
  }
};

/**
 * GET /api/authority/settings
 */
export const getAuthoritySettings = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const authority = await User.findOne({
      clerkUserId,
      role: "AUTHORITY",
    }).select("name clerkUserId department assignedArea notificationPrefs");

    if (!authority) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      data: authority,
    });
  } catch (err) {
    console.error("Get authority settings error:", err);
    res.status(500).json({ success: false });
  }
};

/**
 * PATCH /api/authority/settings/notifications
 */
export const updateAuthorityNotifications = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const updates = req.body; // { email, push, sms }

    const authority = await User.findOne({
      clerkUserId,
      role: "AUTHORITY",
    });

    if (!authority) {
      return res.status(404).json({ success: false });
    }

    authority.notificationPrefs = {
      ...authority.notificationPrefs,
      ...updates,
    };

    await authority.save();

    // OPTIONAL: activity log
    await ActivityLog.create({
      action: "AUTHORITY_SETTINGS_UPDATED",
      performedBy: clerkUserId,
      role: "AUTHORITY",
      metadata: updates,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Update notification settings error:", err);
    res.status(500).json({ success: false });
  }
};
