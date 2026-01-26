import Issue from "../models/Issue.js";
import User from "../models/User.js";

/**
 * GET NEARBY ISSUES
 * /api/issues/nearby?lat=..&lng=..&radius=3000
 */
export const getNearbyIssues = async (req, res) => {
  try {
    const { lat, lng, radius = 3000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const issues = await Issue.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: Number(radius),
        },
      },
    });

    res.json({ success: true, issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

/**
 * CREATE ISSUE
 * POST /api/issues
 */
export const createIssue = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🔥 CRITICAL FIX
    const location = JSON.parse(req.body.location);

    const issue = await Issue.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,

      images: req.files?.map((f) => f.path) || [],

      location: {
        type: "Point",
        coordinates: [
          Number(location.lng),
          Number(location.lat),
        ],
        address: location.address,
      },

      reportedBy: user._id,

      status: "REPORTED",
      priority: "NORMAL",

      statusHistory: [
        {
          status: "REPORTED",
          changedBy: user._id,
        },
      ],
    });

    res.status(201).json({ success: true, issue });
  } catch (err) {
    console.error("CREATE ISSUE ERROR:", err);
    res.status(500).json({ success: false });
  }
};




/**
 * GET ISSUE BY ID
 * /api/issues/:id
 */
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      "assignedTo",
      "name email",
    );

    if (!issue) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/**
 * GET MY ISSUES
 * /api/issues/my
 */
export const getMyIssues = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const issues = await Issue.find({
      reportedBy: user._id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, issues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * ADD COMMENT
 */
export const addComment = async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.auth.userId });
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Comment required" });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    issue.comments.push({
      text,
      author: user._id,
      createdAt: new Date(),
    });

    await issue.save();

    res.json({ success: true, comments: issue.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

/**
 * UPVOTE ISSUE
 */
export const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true },
    );

    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, upvotes: issue.upvotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
