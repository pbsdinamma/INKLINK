import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types";
import { RECONNECT_ATTEMPTS, RECONNECT_DELAY } from "./constants";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

/**
 * Returns a singleton Socket.IO client instance.
 * Creates the connection on first call.
 */
export function getSocket(): AppSocket {
  if (!socket) {
    const url =
      process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

    socket = io(url, {
      autoConnect: false, // connect manually after setting up listeners
      reconnection: true,
      reconnectionAttempts: RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionDelayMax: 5000,
      transports: ["websocket", "polling"],
    }) as AppSocket;

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket!.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("[Socket] Disconnected:", reason);
    });
  }
  return socket;
}

/** Disconnect and destroy the singleton (call on logout/unmount) */
export function destroySocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
