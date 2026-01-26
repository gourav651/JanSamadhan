import express from "express";
import { getMe, syncUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/sync", requireAuth, syncUser);
router.get("/me", requireAuth, getMe);


export default router;
