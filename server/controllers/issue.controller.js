import Issue from "../models/Issue.js";

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
            coordinates: [Number(lng), Number(lat)], // lng first
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
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const title = req.body?.title?.trim();
    const description = req.body?.description?.trim();
    const category = req.body?.category?.trim();

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, category and description are required",
      });
    }

    // Images uploaded by Cloudinary
    const images = req.files?.map((file) => file.path) || [];

    // ✅ SAFE location parsing
    let locationData;
    try {
      locationData = JSON.parse(req.body.location);
    } catch (err) {
      console.error("❌ Location parse error:", err);
      return res.status(400).json({
        success: false,
        message: "Invalid location data",
      });
    }

    const lat = Number(locationData.lat);
    const lng = Number(locationData.lng);

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      images,
      location: {
        type: "Point",
        coordinates: [lng, lat],
        address: locationData.address || "",
      },
      reportedBy: "PUBLIC_USER",
      status: "OPEN",
      upvotes: 0,
    });

    return res.status(201).json({ success: true, issue });
  } catch (err) {
    console.error("🔥 CREATE ISSUE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};


// GET /api/issues/:id

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    res.json({ success: true, issue });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      reportedBy: "PUBLIC_USER",
    }).sort({ createdAt: -1 });

    res.json({ success: true, issues });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// POST /api/issues/:id/comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
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
      author: "PUBLIC_USER", // later Clerk user
      createdAt: new Date(),
    });

    await issue.save();

    res.json({ success: true, comments: issue.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

// POST /api/issues/:id/upvote
export const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } }, // increment by 1
      { new: true }
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
