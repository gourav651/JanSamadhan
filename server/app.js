import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express"; // 👈 ADD THIS

import issueRoutes from "./routes/issue.routes.js";
import authorityRoutes from "./routes/authority.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import supportRoutes from "./routes/support.routes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// 🔥 VERY IMPORTANT — MUST COME BEFORE ROUTES
app.use(clerkMiddleware());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/issues", issueRoutes);
app.use("/api/authority", authorityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/notifications", notificationRoutes);

// Global Error
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
