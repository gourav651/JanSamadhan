import express from "express";
import cors from "cors";

import issueRoutes from "./routes/issue.routes.js";
import authorityRoutes from "./routes/authority.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import supportRoutes from "./routes/support.routes.js";
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 🔥 REQUIRED for multer text fields
app.use(express.urlencoded({ extended: true }));

// JSON for non-multipart routes
app.use(express.json());

// Routes
app.use("/api/issues", issueRoutes);
app.use("/api/authority", authorityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/notifications", notificationRoutes);

// 🔥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
