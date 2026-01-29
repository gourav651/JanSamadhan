import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { createSupportTicket } from "../controllers/support.controller.js";

const router = express.Router();

router.post(
  "/tickets",
  requireAuth,
  requireRole(["AUTHORITY"]),
  createSupportTicket,
);

export default router;
