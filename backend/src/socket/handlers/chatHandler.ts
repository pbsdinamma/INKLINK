import type { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  ChatMessage,
} from "../../../../shared/types";
import { checkRateLimit } from "../../middleware/rateLimit";
import { RoomManager } from "../../rooms/RoomManager";
import { censorText } from "../../utils/profanity";

type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

const roomManager = RoomManager.getInstance();

const MAX_MESSAGE_LENGTH = 500;

export function registerChatHandlers(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: AppSocket
): void {
  socket.on("chat:message", ({ message }) => {
    // Rate limit: max 5 messages per 3 seconds
    if (!checkRateLimit(socket.id, "chat:message", 5, 3000)) return;

    const { roomId, userId, username, userColor } = socket.data;
    const room = roomManager.get(roomId);
    if (!room) return;

    // Sanitize and validate
    const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmed) return;

    // Apply profanity censorship from censor-text/profanity-list dataset
    const censored = censorText(trimmed);

    const chatMessage: ChatMessage = {
      id: nanoid(),
      userId,
      username,
      userColor,
      message: censored,
      timestamp: Date.now(),
    };

    room.addChatMessage(chatMessage);

    // Broadcast to entire room (including sender)
    io.to(roomId).emit("chat:message", chatMessage);
  });
}
