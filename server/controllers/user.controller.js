import User from "../models/User.js";

/**
 * POST /api/users/sync
 */
export const syncUser = async (req, res) => {
   console.log("🔥 /api/users/sync HIT");
  console.log("AUTH:", req.auth?.());
  console.log("BODY:", req.body);

  try {
    const { userId: clerkUserId } = req.auth();
    const { email, name } = req.body;

    if (!clerkUserId || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing clerkUserId or email",
      });
    }

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = await User.create({
        clerkUserId,
        email,
        name,
        role: "CITIZEN", // default role
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("SYNC USER ERROR:", err);
    res.status(500).json({ success: false });
  }
};

/**
 * GET /api/users/me
 */
export const getMe = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth(); // ✅ FIX

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        clerkUserId: user.clerkUserId,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
