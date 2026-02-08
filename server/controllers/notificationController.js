import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  const { userId } = req.auth(); // ✅ correct Clerk usage

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20);
    console.log("FETCH NOTIFS FOR:", req.auth.userId);
  res.json({ notifications });
};

export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
};

export const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { userId: req.auth.userId, isRead: false },
    { $set: { isRead: true } },
  );
  res.json({ success: true });
};
