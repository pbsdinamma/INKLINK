import type { Server, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../../../../shared/types";
import { RoomManager } from "../../rooms/RoomManager";
import { checkRateLimit } from "../../middleware/rateLimit";

type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

const roomManager = RoomManager.getInstance();

export function registerDrawingHandlers(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: AppSocket
): void {
  // ─── stroke:start ─────────────────────────────────────────
  socket.on("stroke:start", ({ strokeId, color, size, tool }) => {
    if (!checkRateLimit(socket.id, "stroke:start", 20, 1000)) return;
    const { roomId, userId } = socket.data;
    const room = roomManager.get(roomId);
    if (!room) return;

    room.startStroke(strokeId, userId, color, size, tool);
    socket.to(roomId).emit("stroke:start", {
      strokeId, userId, color, size, tool, timestamp: Date.now(),
    });
  });

  // ─── stroke:point ─────────────────────────────────────────
  socket.on("stroke:point", ({ strokeId, points }) => {
    if (!checkRateLimit(socket.id, "stroke:point", 120, 1000)) return;
    const { roomId } = socket.data;
    const room = roomManager.get(roomId);
    if (!room) return;

    const ok = room.appendPoints(strokeId, points);
    if (!ok) return;
    socket.to(roomId).emit("stroke:point", { strokeId, points });
  });

  // ─── stroke:end ───────────────────────────────────────────
  socket.on("stroke:end", ({ strokeId }) => {
    const { roomId } = socket.data;
    const room = roomManager.get(roomId);
    if (!room) return;

    room.endStroke(strokeId);
    socket.to(roomId).emit("stroke:end", { strokeId });
  });

  // ─── stroke:undo ──────────────────────────────────────────
  // Now per-user: only undoes strokes drawn by the requesting user
  socket.on("stroke:undo", () => {
    if (!checkRateLimit(socket.id, "stroke:undo", 10, 1000)) return;
    const { roomId, userId } = socket.data;
    const room = roomManager.get(roomId);
    if (!room) return;

    const strokes = room.undo(userId);
    if (strokes === null) return; // Nothing to undo for this user

    // Broadcast updated stroke list to entire room
    io.to(roomId).emit("board:update", { strokes });
  });

  // ─── stroke:redo ──────────────────────────────────────────
  socket.on("stroke:redo", () => {
    if (!checkRateLimit(socket.id, "stroke:redo", 10, 1000)) return;
    const { roomId, userId } = socket.data;
    const room = roomManager.get(roomId);
    if (!room) return;

    const strokes = room.redo(userId);
    if (strokes === null) return;

    io.to(roomId).emit("board:update", { strokes });
  });

  // ─── board:clear ──────────────────────────────────────────
  socket.on("board:clear", () => {
    if (!checkRateLimit(socket.id, "board:clear", 3, 5000)) return;
    const { roomId, userId } = socket.data;
    const room = roomManager.get(roomId);
    if (!room) return;

    room.clear(userId);
    io.to(roomId).emit("board:clear");
  });
}
