import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../../shared/types";
import { initSocketHandlers } from "./socket/index";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

// ─── Express App ─────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── HTTP Server ──────────────────────────────────────────────────────────────
const httpServer = createServer(app);

// ─── Socket.IO ───────────────────────────────────────────────────────────────
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Increase ping timeout for slow connections
  pingTimeout: 60000,
  pingInterval: 25000,
  // Enable compression
  perMessageDeflate: {
    threshold: 1024,
  },
  // Max payload size: 1MB
  maxHttpBufferSize: 1e6,
});

// ─── Optional: Redis Adapter ──────────────────────────────────────────────────
// Uncomment and install @socket.io/redis-adapter + ioredis to enable scaling:
//
// import { createAdapter } from "@socket.io/redis-adapter";
// import { createClient } from "ioredis";
// if (process.env.REDIS_URL) {
//   const pubClient = createClient({ url: process.env.REDIS_URL });
//   const subClient = pubClient.duplicate();
//   await Promise.all([pubClient.connect(), subClient.connect()]);
//   io.adapter(createAdapter(pubClient, subClient));
//   console.log("[Server] Redis adapter enabled");
// }

// ─── Socket Handlers ─────────────────────────────────────────────────────────
initSocketHandlers(io);

// ─── Start ───────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`[Server] Whiteboard backend running on http://localhost:${PORT}`);
  console.log(`[Server] CORS allowed from: ${CORS_ORIGIN}`);
});

export { io };
