import express from "express";
import upload from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  getNearbyIssues,
  createIssue,
  getIssueById,
  getMyIssues,
  upvoteIssue,
  addComment,
} from "../controllers/issue.controller.js";

const router = express.Router();

// PUBLIC
router.get("/nearby", getNearbyIssues);

// 🔐 AUTHENTICATED ROUTES (THIS WAS MISSING)
router.post("/", requireAuth, upload.array("images", 5), createIssue);
router.get("/my", requireAuth, getMyIssues);
router.get("/:id", getIssueById);
router.post("/:id/comment", requireAuth, addComment);
router.post("/:id/upvote", requireAuth, upvoteIssue);

export default router;
