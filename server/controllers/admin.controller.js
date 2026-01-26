import Issue from "../models/Issue.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";

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
