import express from "express";
import { requireRole } from "../middlewares/requireRole.js";
import { dashboardStats, getAllIssues } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", requireRole("ADMIN"), dashboardStats);
router.get("/issues", requireRole("ADMIN"), getAllIssues);

export default router;
