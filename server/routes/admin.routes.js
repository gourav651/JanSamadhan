import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

import {
  dashboardStats,
  getAllIssues,
  getUnassignedIssues,
  assignIssueToAuthority,
  getAuthorities,
  getIssueById,
  createAuthority,
  updateAuthority,
  assignAuthorityArea,
  updateAuthorityStatus,
  getDashboardAnalytics,
  getAnalyticsInsights,
  exportDashboardReport,
  getAdminProfile,
  getSystemSettings,
  updateSystemSettings,
  resetSystemSettings,
  updateAdminProfile,
} from "../controllers/admin.controller.js";
import { getAllSupportTickets, updateTicketStatus } from "../controllers/support.controller.js";


const router = express.Router();

/* =====================
   ADMIN MIDDLEWARE
===================== */
router.use(requireAuth);
router.use(requireRole(["ADMIN"]));

/* =====================
   DASHBOARD
   Used by: AdminDashboard.jsx
===================== */
router.get("/dashboard", dashboardStats);

/* =====================
   ISSUES
   Used by: AdminIssues.jsx
===================== */
router.get("/issues", getAllIssues);
router.get("/issues/:id", getIssueById);

/* =====================
   UNASSIGNED ISSUES
   Used by: Assign Authority flow
===================== */
router.get("/issues/unassigned", getUnassignedIssues);

/* =====================
   ASSIGN ISSUE
   Used by: Assign Authority button
===================== */
router.patch("/issues/:id/assign", assignIssueToAuthority);
router.get("/authorities", getAuthorities);
router.get("/support/tickets", getAllSupportTickets);
router.get("/analytics/dashboard",getDashboardAnalytics);
router.get("/analytics/insights", getAnalyticsInsights);
router.get("/analytics/export", exportDashboardReport);

router.get("/settings", getSystemSettings);
router.patch("/settings", updateSystemSettings);
router.post("/settings/reset", resetSystemSettings);

router.patch("/profile", updateAdminProfile);
router.get("/profile", getAdminProfile);


router.post("/authorities", createAuthority);
router.patch("/authorities/:id", updateAuthority);
router.patch("/authorities/:id/status", updateAuthorityStatus);
router.patch("/authorities/:id/assign-area", assignAuthorityArea);
router.patch("/support/tickets/:id/status", updateTicketStatus);

export default router;
