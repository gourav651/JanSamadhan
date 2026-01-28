import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import upload from "../middlewares/upload.js";

import {
  getAssignedIssues,
  getAuthorityDashboardStats,
  getAuthorityMapIssues,
  getAuthoritySettings,
  getIssueForAuthority,
  getRecentAssignedIssues,
  updateAuthorityNotifications,
  updateStatus,
} from "../controllers/authority.controller.js";

const router = express.Router();

// 🔐 AUTHORITY ONLY 
router.use(requireAuth);
router.use(requireRole(["AUTHORITY"]));

// 📋 Assigned issues list
router.get("/issues/assigned", getAssignedIssues);
router.get("/dashboard/stats", getAuthorityDashboardStats);
router.get("/issues/recent", getRecentAssignedIssues);
router.get("/issues/map", getAuthorityMapIssues);
router.get(
  "/settings",
  requireAuth,
  requireRole(["AUTHORITY"]),
  getAuthoritySettings,
);
// 🔄 Update issue status + resolution proof
router.patch(
  "/issues/:id/status",
  upload.array("resolutionImages", 5),
  updateStatus,
);

router.patch(
  "/settings/notifications",
  requireAuth,
  requireRole(["AUTHORITY"]),
  updateAuthorityNotifications,
);
router.get("/issues/:id", getIssueForAuthority);

export default router;
