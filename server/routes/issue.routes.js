import express from "express";
import {
  getNearbyIssues,
  createIssue,
  getIssueById,
  getMyIssues,
  upvoteIssue,
  addComment,
} from "../controllers/issue.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// PUBLIC
router.get("/nearby", getNearbyIssues);

// MY ISSUES
router.get("/my", getMyIssues);

// ISSUE DETAIL
router.get("/:id", getIssueById);

// ✅ CREATE ISSUE (multer must be here)
router.post(
  "/",
  upload.array("images", 5),
  (req, res, next) => {
    try {
      next();
    } catch (err) {
      console.error("🔥 MULTER ERROR:", err);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
  createIssue
);

router.post("/:id/comment", addComment);
router.post("/:id/upvote", upvoteIssue);

export default router;
