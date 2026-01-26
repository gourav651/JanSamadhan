import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import upload from "../middlewares/upload.js";

import {
  getAssignedIssues,
  getIssueForAuthority,
  updateStatus,
} from "../controllers/authority.controller.js";

const router = express.Router();

// 🔐 AUTHORITY ONLY (ORDER MATTERS)
router.use(requireAuth);
router.use(requireRole(["AUTHORITY"]));

// 📋 Assigned issues list
router.get("/issues/assigned", getAssignedIssues);

// 🔄 Update issue status + resolution proof
router.patch(
  "/issues/:id/status",
  upload.array("resolutionImages", 5),
  updateStatus
);

router.get("/issues/:id", getIssueForAuthority);



export default router;
