import User from "../models/User.js";

export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const clerkUserId = req.auth.userId;

      const user = await User.findOne({ clerkUserId });

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = user; // optional, useful later
      next();
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  };
};
