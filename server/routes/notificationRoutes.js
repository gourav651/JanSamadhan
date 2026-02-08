import express from "express";
import { requireAuth } from "@clerk/express";
import { getMyNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/my", requireAuth(), getMyNotifications);
router.patch("/:id/read", requireAuth(), markAsRead);

export default router;
