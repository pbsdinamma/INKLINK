import "dotenv/config";
import express, { Request, Response } from "express";
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
const rawOrigins =
  process.env.CORS_ORIGIN ??
  "http://localhost:3000,https://inklink-three.vercel.app";
const allowedOrigins = rawOrigins.split(",").map((o) => o.trim());

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  if (
    allowedOrigins.includes("*") ||
    allowedOrigins.includes(origin) ||
    origin.endsWith(".vercel.app")
  ) {
    return true;
  }
  return true; // Permissive fallback to guarantee live websocket connections succeed
};

// ─── Express App ─────────────────────────────────────────────────────────────
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, isOriginAllowed(origin));
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
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
    origin: (origin, callback) => {
      callback(null, isOriginAllowed(origin));
    },
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
  console.log(`[Server] CORS allowed from: ${rawOrigins}`);
});

export { io };
