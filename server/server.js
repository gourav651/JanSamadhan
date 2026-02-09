import app from "./app.js";
import { connectDB } from "./config/db.js";
import http from "http";
import { Server } from "socket.io";

connectDB();

const PORT = process.env.PORT || 5000;

/**
 * 1️⃣ Create HTTP server from Express app
 */
const server = http.createServer(app);

/**
 * 2️⃣ Attach Socket.IO to HTTP server
 */
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

/**
 * 3️⃣ Socket connection logic
 */
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", ({ userId }) => {
    socket.join(userId); // one room per user
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

/**
 * 4️⃣ Start server (IMPORTANT: server.listen, not app.listen)
 */
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
