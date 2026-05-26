import type { Server, Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../../../../shared/types";
import { checkRateLimit } from "../../middleware/rateLimit";
import { RoomManager } from "../../rooms/RoomManager";

type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

const roomManager = RoomManager.getInstance();

/**
 * Registers cursor tracking event handler.
 * Throttled server-side to prevent broadcast storms.
 */
export function registerCursorHandlers(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: AppSocket
): void {
  socket.on("cursor:move", ({ x, y }) => {
    // Server-side throttle: max 30 cursor events/sec per socket
    if (!checkRateLimit(socket.id, "cursor:move", 30, 1000)) return;

    const { roomId, userId, username, userColor } = socket.data;

    // Update cursor position in room state
    const room = roomManager.get(roomId);
    if (!room) return;

    const user = room.getUser(userId);
    if (user) {
      user.cursor = { x, y };
    }

    // Broadcast to everyone else
    socket.to(roomId).emit("cursor:update", {
      userId,
      username,
      color: userColor,
      x,
      y,
    });
  });
}
