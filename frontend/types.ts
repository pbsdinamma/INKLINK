// Re-export all shared types for use within the frontend.
// This allows imports like: import type { Stroke } from "@/types"
export type {
  Point,
  Tool,
  Stroke,
  User,
  ChatMessage,
  RoomState,
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../shared/types";
