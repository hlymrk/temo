import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDatabase } from "./config/database.js";
import { setupTableSockets } from "./sockets/tableSocket.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import tableSessionRoutes from "./routes/tableSessionRoutes.js";

const app = express();
const httpServer = createServer(app);

// Webhook routes BEFORE body parsing (Stripe needs raw body)
app.use(webhookRoutes);

// Socket.io setup with CORS for development
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// Make io available globally for routes
(global as any).io = io;

console.log("🚀 Starting temo server...");
console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(
  `📝 MongoDB URI configured: ${process.env.MONGODB_URI ? "Yes" : "No"}\n`,
);

app.use(express.json());

// Health check
app.get("/api/health", (_, res) => {
  res.json({
    status: "ok",
    service: "temo",
    mongodb: io.engine.clientsCount >= 0 ? "connected" : "disconnected",
    socketio: "active",
  });
});

// API routes
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", qrRoutes);
app.use("/api", tableSessionRoutes);

// Initialize database and sockets
await connectDatabase();
setupTableSockets(io);
console.log("✓ Socket.io initialized");

ViteExpress.config({
  mode: (process.env.NODE_ENV as "production" | "development") || "development",
});

const PORT = parseInt(process.env.PORT || "3000", 10);

// Use httpServer for Socket.io compatibility
httpServer.listen(PORT, () => {
  console.log(`\n✓ Server ready on http://localhost:${PORT}`);
  console.log(`  - API: http://localhost:${PORT}/api`);
  console.log(`  - Health: http://localhost:${PORT}/api/health`);
  console.log(`  - Socket.io: ws://localhost:${PORT}\n`);
});

ViteExpress.bind(app, httpServer);
