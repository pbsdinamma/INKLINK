import type { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  User,
} from "../../../shared/types";
import { RoomManager } from "../rooms/RoomManager";
import { clearRateLimit } from "../middleware/rateLimit";
import { registerDrawingHandlers } from "./handlers/drawingHandler";
import { registerCursorHandlers } from "./handlers/cursorHandler";
import { registerChatHandlers } from "./handlers/chatHandler";

type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

/** Predefined avatar colors for users */
const USER_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E9", "#82E0AA", "#F0B27A",
];

const roomManager = RoomManager.getInstance();

export function initSocketHandlers(io: AppServer): void {
  io.on("connection", (socket: AppSocket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // ─── room:join ───────────────────────────────────────────
    socket.on("room:join", ({ roomId, username }) => {
      if (!roomId || !username) {
        socket.emit("room:error", { message: "roomId and username are required" });
        return;
      }

      // Clean up previous session if this socket is re-joining or already in a room
      const oldRoomId = socket.data.roomId;
      const oldUserId = socket.data.userId;
      if (oldRoomId && oldUserId) {
        const oldRoom = roomManager.get(oldRoomId);
        if (oldRoom) {
          oldRoom.removeUser(oldUserId);
          socket.leave(oldRoomId);
          console.log(`[Socket] Re-join cleanup: removed previous user ${oldUserId} from room ${oldRoomId}`);
        }
      }

      // Sanitize
      const safeUsername = username.trim().slice(0, 24) || "Anonymous";
      const userId = nanoid(10);
      const userColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

      // Store on socket data for use in all handlers
      socket.data.userId = userId;
      socket.data.username = safeUsername;
      socket.data.roomId = roomId;
      socket.data.userColor = userColor;

      // Join Socket.IO room
      socket.join(roomId);

      // Add user to room state
      const room = roomManager.getOrCreate(roomId);
      const user: User = { id: userId, username: safeUsername, color: userColor };
      room.addUser(user);

      console.log(`[Socket] ${safeUsername} (${userId}) joined room: ${roomId}`);

      // Send full room state to the joining client (late-joiner sync)
      socket.emit("room:state", {
        roomId,
        strokes: room.getCommittedStrokes(),
        users: room.getUsers(),
        chat: room.getChat(),
        yourUserId: userId,
      });

      // Notify everyone else about updated user list
      io.to(roomId).emit("room:users", room.getUsers());

      // Register all domain handlers now that socket.data is populated
      registerDrawingHandlers(io, socket);
      registerCursorHandlers(io, socket);
      registerChatHandlers(io, socket);
    });

    // ─── disconnect ──────────────────────────────────────────
    socket.on("disconnect", (reason) => {
      const { roomId, userId, username } = socket.data;
      console.log(`[Socket] ${username ?? socket.id} disconnected: ${reason}`);

      if (roomId && userId) {
        const room = roomManager.get(roomId);
        if (room) {
          room.removeUser(userId);

          // Notify remaining users
          io.to(roomId).emit("room:users", room.getUsers());

          // Notify others that this cursor should be removed
          socket.to(roomId).emit("cursor:remove", { userId });

          // GC: delete room if empty
          if (room.userCount === 0) {
            roomManager.delete(roomId);
          }
        }
      }

      // Clean up rate limit state
      clearRateLimit(socket.id);
    });
  });
}
