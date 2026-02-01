import Issue from "../models/Issue.js";
import User from "../models/User.js";
import SystemSettings from "../models/SystemSettings.js";
import cloudinary from "../config/cloudinary.js";

/* =====================
   DASHBOARD STATS
   Used by: AdminDashboard.jsx
   Route: GET /api/admin/dashboard/stats
===================== */
export const dashboardStats = async (req, res) => {
  try {
    const [totalIssues, resolved, reported, inProgress] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: "RESOLVED" }),
      Issue.countDocuments({ status: "REPORTED" }),
      Issue.countDocuments({ status: "IN_PROGRESS" }),
    ]);

    return res.json({
      success: true,
      data: {
        totalIssues,
        reported,
        inProgress,
        resolved,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

/* =====================
   ALL ISSUES (ADMIN)
   Used by: AdminIssues.jsx (table)
   Route: GET /api/admin/issues
===================== */

// GET /api/admin/issues
export const getAllIssues = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 15,
      search = "",
      status,
      category,
      priority,
      startDate,
      endDate,
    } = req.query;

    const andConditions = [];

    // 🔍 SEARCH (NO reportedBy)
    if (search) {
      const orConditions = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];

      if (search.length <= 6) {
        orConditions.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: search + "$",
              options: "i",
            },
          },
        });
      }

      andConditions.push({ $or: orConditions });
    }

    if (status && status !== "ALL") andConditions.push({ status });
    if (category && category !== "ALL") andConditions.push({ category });

    if (priority && priority !== "ALL") {
      andConditions.push({ priority });
    }

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      andConditions.push({ createdAt: dateFilter });
    }

    const query = andConditions.length ? { $and: andConditions } : {};

    const total = await Issue.countDocuments(query);

    const issues = await Issue.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: issues,
      pagination: {
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// GET /api/admin/issues/:id
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email clerkUserId")
      .populate("assignedTo", "name email");

    if (!issue) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* =====================
   UNASSIGNED ISSUES
   Used by: Assign Authority flow
   Route: GET /api/admin/issues/unassigned
===================== */
export const getUnassignedIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      assignedTo: { $in: [null, undefined] },
      status: { $ne: "RESOLVED" },
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    console.error("Unassigned Issues Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unassigned issues",
    });
  }
};

/* =====================
   ASSIGN ISSUE TO AUTHORITY
   Used by: AdminIssues → "Assign Authority"
   Route: PATCH /api/admin/issues/:id/assign
===================== */
export const assignIssueToAuthority = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorityId } = req.body;

    // 1️⃣ Find issue
    const issue = await Issue.findById(id);
    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    // 2️⃣ Prevent reassignment if resolved
    if (issue.status === "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: "Resolved issues cannot be reassigned",
      });
    }

    // 3️⃣ Find authority FIRST
    const authority = await User.findOne({
      _id: authorityId,
      role: "AUTHORITY",
    });

    if (!authority) {
      return res.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    // 4️⃣ Validate authority status
    if (authority.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: `Authority is ${authority.status.toLowerCase().replace("_", " ")}`,
      });
    }

    // 5️⃣ Assign issue
    issue.assignedTo = authority._id;
    issue.status = "ASSIGNED";

    issue.statusHistory.push({
      status: "ASSIGNED",
      changedBy: authority._id,
    });

    await issue.save();

    return res.json({
      success: true,
      issue,
    });
  } catch (err) {
    console.error("ASSIGN ISSUE ERROR:", err);
    return res.status(500).json({ success: false });
  }
};

export const getAuthorities = async (req, res) => {
  try {
    const {
      status,
      department,
      assignedArea,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { role: "AUTHORITY" };

    if (status) query.status = status;
    if (department) query.department = department;
    if (assignedArea) query.assignedArea = assignedArea;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);

    const authorities = await User.find(query)
      .select("name email clerkUserId department assignedArea status createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      authorities,
      pagination: {
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (err) {
    console.error("GET AUTHORITIES ERROR:", err);
    res.status(500).json({ success: false });
  }
};

export const createAuthority = async (req, res) => {
  try {
    const { clerkUserId, department, assignedArea } = req.body;

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.role = "AUTHORITY";
    user.department = department;
    user.assignedArea = assignedArea;
    user.status = "ACTIVE";

    await user.save();

    res.json({ success: true, authority: user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// EDIT DETAILS ONLY (no status here)
export const updateAuthority = async (req, res) => {
  try {
    const { id } = req.params;
    const { department, assignedArea } = req.body;

    const authority = await User.findOne({ _id: id, role: "AUTHORITY" });
    if (!authority) {
      return res.status(404).json({ success: false });
    }

    if (department) authority.department = department;
    if (assignedArea) authority.assignedArea = assignedArea;

    await authority.save();
    res.json({ success: true, authority });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const updateAuthorityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["ACTIVE", "SUSPENDED", "ON_LEAVE"];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const authority = await User.findOne({
      _id: id,
      role: "AUTHORITY",
    });

    if (!authority) {
      return res
        .status(404)
        .json({ success: false, message: "Authority not found" });
    }

    authority.status = status;
    await authority.save();

    res.json({
      success: true,
      authority,
    });
  } catch (err) {
    console.error("UPDATE AUTHORITY STATUS ERROR:", err);
    res.status(500).json({ success: false });
  }
};

export const assignAuthorityArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { department, assignedArea } = req.body;

    const authority = await User.findOne({
      _id: id,
      role: "AUTHORITY",
    });

    if (!authority) {
      return res.status(404).json({ success: false });
    }

    authority.department = department || authority.department;
    authority.assignedArea = assignedArea || authority.assignedArea;

    await authority.save();

    res.json({
      success: true,
      authority,
    });
  } catch (err) {
    console.error("ASSIGN AUTHORITY AREA ERROR:", err);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   ADMIN ANALYTICS (READ-ONLY)
   Used by: Admin Dashboard & Analytics Pages
===================================================== */
/**
 * GET /api/admin/analytics/dashboard
 * Used by: AdminDashboard.jsx
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    const prev7Days = new Date();
    prev7Days.setDate(now.getDate() - 14);

    /* =====================
       BASIC COUNTS
    ===================== */
    const [totalIssues, resolvedIssues, activeCitizens] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: "RESOLVED" }),
      User.countDocuments({ role: "CITIZEN" }),
    ]);

    /* =====================
       AVG RESOLUTION TIME
       (LAST 7 DAYS vs PREVIOUS 7 DAYS)
    ===================== */
    const getAvgResolution = async (from, to) => {
      const issues = await Issue.find({
        status: "RESOLVED",
        createdAt: { $gte: from, $lt: to },
        "statusHistory.status": "RESOLVED",
      }).select("statusHistory");

      let totalMs = 0;
      let count = 0;

      issues.forEach((issue) => {
        const reported = issue.statusHistory.find(
          (s) => s.status === "REPORTED",
        );
        const resolved = issue.statusHistory.find(
          (s) => s.status === "RESOLVED",
        );

        if (reported && resolved) {
          totalMs +=
            new Date(resolved.changedAt) - new Date(reported.changedAt);
          count++;
        }
      });

      return count ? totalMs / count : 0;
    };

    const currentAvgMs = await getAvgResolution(last7Days, now);
    const previousAvgMs = await getAvgResolution(prev7Days, last7Days);

    const avgResolutionHours = currentAvgMs
      ? Math.round(currentAvgMs / (1000 * 60 * 60))
      : 0;

    let avgResolutionTrend = "SAME";
    if (previousAvgMs > 0) {
      if (currentAvgMs < previousAvgMs) avgResolutionTrend = "DOWN";
      else if (currentAvgMs > previousAvgMs) avgResolutionTrend = "UP";
    }

    /* =====================
       ISSUES TREND (LAST 30 DAYS)
    ===================== */
    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    const trend = await Issue.aggregate([
      {
        $match: { createdAt: { $gte: last30Days } },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
          reported: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    /* =====================
       ISSUE BREAKDOWN
    ===================== */
    const categoryBreakdown = await Issue.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    /* =====================
       RECENT ISSUES (LAST 7 DAYS)
    ===================== */
    const recentIssues = await Issue.find({
      createdAt: { $gte: last7Days },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category location.address createdAt status");

    return res.json({
      success: true,
      data: {
        cards: {
          totalIssues,
          resolvedIssues,
          avgResolutionHours,
          avgResolutionTrend, // 👈 IMPORTANT
          activeCitizens,
        },
        trend,
        categoryBreakdown,
        recentIssues,
      },
    });
  } catch (error) {
    console.error("DASHBOARD ANALYTICS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard analytics",
    });
  }
};

/* =====================================================
   ADMIN ANALYTICS & INSIGHTS (READ-ONLY)
   Used by: AdminAnalytics.jsx
===================================================== */
/**
 * GET /api/admin/analytics/insights
 * Query params:
 *  - from (optional)
 *  - to (optional)
 */
export const getAnalyticsInsights = async (req, res) => {
  try {
    const { from, to, severity, district, department } = req.query;

    const matchStage = {};

    if (from || to) {
      matchStage.createdAt = {};
      if (from) matchStage.createdAt.$gte = new Date(from);
      if (to) matchStage.createdAt.$lte = new Date(to);
    }

    if (severity && severity !== "ALL") {
      matchStage.severity = severity;
    }

    if (district && district !== "ALL") {
      matchStage["location.district"] = district;
    }

    /* =====================
       TREND (FILTERED)
    ===================== */
    const trend = await Issue.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
          reported: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    /* =====================
       KPI CALCULATIONS
    ===================== */
    const totalIssues = await Issue.countDocuments(matchStage);

    const resolvedCount = await Issue.countDocuments({
      ...matchStage,
      status: "RESOLVED",
    });

    const resolutionRate = totalIssues
      ? Math.round((resolvedCount / totalIssues) * 1000) / 10
      : 0;

    const criticalBacklog = await Issue.countDocuments({
      ...matchStage,
      severity: { $in: ["HIGH", "CRITICAL"] },
      status: { $ne: "RESOLVED" },
    });

    /* =====================
   AUTHORITY UTILIZATION
===================== */
    const totalAuthorities = await User.countDocuments({
      role: "AUTHORITY",
      status: "ACTIVE",
    });

    const activeAuthorities = await Issue.distinct("assignedTo", {
      ...matchStage,
      assignedTo: { $ne: null },
    });

    const authorityUtilization = totalAuthorities
      ? Math.round((activeAuthorities.length / totalAuthorities) * 100)
      : 0;

    /* =====================
       AVG RESOLUTION TIME
    ===================== */
    const resolvedIssues = await Issue.find({
      ...matchStage,
      status: "RESOLVED",
      "statusHistory.status": "RESOLVED",
    }).select("statusHistory");

    let totalMs = 0;
    let count = 0;

    resolvedIssues.forEach((issue) => {
      const reported = issue.statusHistory.find((s) => s.status === "REPORTED");
      const resolved = issue.statusHistory.find((s) => s.status === "RESOLVED");
      if (reported && resolved) {
        totalMs += new Date(resolved.changedAt) - new Date(reported.changedAt);
        count++;
      }
    });

    const avgResolutionDays = count
      ? Math.round((totalMs / count / 86400000) * 10) / 10
      : 0;

    /* =====================
   ISSUE STATUS BY DEPARTMENT
===================== */
    const issueStatusByDepartment = await Issue.aggregate([
      { $match: matchStage }, // ✅ use filters properly

      {
        $group: {
          _id: "$department",
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0] },
          },
          inProgress: {
            $sum: {
              $cond: [{ $in: ["$status", ["ASSIGNED", "IN_PROGRESS"]] }, 1, 0],
            },
          },
          open: {
            $sum: { $cond: [{ $eq: ["$status", "REPORTED"] }, 1, 0] },
          },
        },
      },

      {
        $project: {
          _id: 0,
          department: "$_id",
          resolved: 1,
          inProgress: 1,
          open: 1,
          total: { $add: ["$resolved", "$inProgress", "$open"] },
        },
      },

      { $sort: { total: -1 } },
    ]);

    /* =====================
   AUTHORITY PERFORMANCE
===================== */
    const authorityPerformance = await Issue.aggregate([
      { $match: { assignedTo: { $ne: null } } },

      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "authority",
        },
      },
      { $unwind: "$authority" },

      {
        $group: {
          _id: "$authority._id",
          name: { $first: "$authority.name" },
          department: { $first: "$authority.department" },

          assigned: { $sum: 1 },

          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0] },
          },

          totalResolutionMs: {
            $sum: {
              $cond: [
                { $eq: ["$status", "RESOLVED"] },
                {
                  $subtract: [
                    { $arrayElemAt: ["$statusHistory.changedAt", -1] },
                    { $arrayElemAt: ["$statusHistory.changedAt", 0] },
                  ],
                },
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          authorityName: "$name",
          department: 1,
          assigned: 1,

          resolvedPercent: {
            $cond: [
              { $gt: ["$assigned", 0] },
              {
                $round: [
                  { $multiply: [{ $divide: ["$resolved", "$assigned"] }, 100] },
                  1,
                ],
              },
              0,
            ],
          },

          avgResolutionDays: {
            $cond: [
              { $gt: ["$resolved", 0] },
              {
                $round: [
                  {
                    $divide: [
                      "$totalResolutionMs",
                      { $multiply: ["$resolved", 86400000] },
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
        },
      },

      { $sort: { resolvedPercent: -1 } },
    ]);

    return res.json({
      success: true,
      data: {
        kpis: {
          resolutionRate,
          criticalBacklog,
          avgResolutionDays,
          authorityUtilization,
        },
        trend,
        issueStatusByDepartment,
        authorityPerformance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * GET /api/admin/analytics/export
 * Exports dashboard report as CSV
 */
export const exportDashboardReport = async (req, res) => {
  try {
    const now = new Date();

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    // 1️⃣ Summary numbers
    const [totalIssues, resolvedIssues, activeCitizens] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: "RESOLVED" }),
      User.countDocuments({ role: "CITIZEN" }),
    ]);

    // 2️⃣ Issues list (last 30 days)
    const issues = await Issue.find({
      createdAt: { $gte: last30Days },
    })
      .sort({ createdAt: -1 })
      .select("title category status createdAt location.address");

    // 3️⃣ Build CSV
    let csv = "ADMIN DASHBOARD REPORT\n\n";

    csv += "SUMMARY\n";
    csv += "Total Issues,Resolved Issues,Active Citizens\n";
    csv += `${totalIssues},${resolvedIssues},${activeCitizens}\n\n`;

    csv += "ISSUES (Last 30 Days)\n\n";
    csv += "Title,Category,Status,Created Date,Location\n\n";

    issues.forEach((issue) => {
      csv += `"${issue.title}","${issue.category}","${issue.status}","${issue.createdAt.toISOString()}","${issue.location?.address || ""}"\n`;
    });

    // 4️⃣ Send as downloadable file
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=dashboard-report.csv",
    );

    return res.send(csv);
  } catch (error) {
    console.error("EXPORT REPORT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export report",
    });
  }
};

/* ======================
   GET SYSTEM SETTINGS
   GET /api/admin/settings
====================== */
export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    // Create defaults if not exists (first run)
    if (!settings) {
      settings = await SystemSettings.create({});
    }

    res.json({ success: true, data: settings });
  } catch (err) {
    console.error("GET SETTINGS ERROR:", err);
    res.status(500).json({ success: false });
  }
};

/* ======================
   UPDATE SYSTEM SETTINGS
   PATCH /api/admin/settings
====================== */
export const updateSystemSettings = async (req, res) => {
  try {
    const updated = await SystemSettings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true },
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("UPDATE SETTINGS ERROR:", err);
    res.status(500).json({ success: false });
  }
};

/* ======================
   RESET SETTINGS
   POST /api/admin/settings/reset
====================== */
export const resetSystemSettings = async (req, res) => {
  try {
    await SystemSettings.deleteMany({});
    const defaults = await SystemSettings.create({});

    res.json({ success: true, data: defaults });
  } catch (err) {
    console.error("RESET SETTINGS ERROR:", err);
    res.status(500).json({ success: false });
  }
};

/* ======================
   ADMIN PROFILE
   GET /api/admin/profile
====================== */
// GET /api/admin/profile
export const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      clerkUserId: req.auth.userId,
      role: "ADMIN",
    }).select("name email profileImage");

    if (!user) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("ADMIN PROFILE ERROR", err);
    res.status(500).json({ success: false });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      clerkUserId: req.auth.userId,
      role: "ADMIN",
    });

    if (!user) {
      return res.status(404).json({ success: false });
    }

    const { name, email, image } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (image) user.profileImage = image;

    await user.save();

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("UPDATE ADMIN PROFILE ERROR", err);
    res.status(500).json({ success: false });
  }
};
