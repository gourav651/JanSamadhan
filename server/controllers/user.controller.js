import User from "../models/User.js";

export const syncUser = async (req, res) => {
  try {
    const { clerkUserId, name, email } = req.body;

    if (!clerkUserId || !email) {
      return res.status(400).json({ success: false });
    }

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = await User.create({
        clerkUserId,
        name,
        email,
        role: "CITIZEN", // default
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};


export const getMe = async (req, res) => {
  try {
    const { userId: clerkUserId } = req.auth();

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
