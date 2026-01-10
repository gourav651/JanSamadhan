import Issue from "../models/Issue.js";

export const dashboardStats = async (req, res) => {
  const totalIssues = await Issue.countDocuments();
  const resolved = await Issue.countDocuments({ status: "RESOLVED" });
  const open = await Issue.countDocuments({ status: "OPEN" });

  res.json({
    totalIssues,
    open,
    resolved
  });
};

export const getAllIssues = async (req, res) => {
  const issues = await Issue.find().limit(20);
  res.json({ issues });
};
