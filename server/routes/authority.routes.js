import express from "express";
import { requireRole } from "../middlewares/requireRole.js";
import { getAssignedIssues, updateStatus } from "../controllers/authority.controller.js";

const router = express.Router();

router.get("/issues",requireRole("AUTHORITY"), getAssignedIssues);
router.patch("/issues/:id/status", requireRole("AUTHORITY"), updateStatus);

export default router;
