// ============================================================
// Shared types — used by both frontend (Next.js) and backend
// ============================================================

// --------------- Primitives ---------------

export interface Point {
  x: number;
  y: number;
}

export type Tool = "pen" | "eraser";

// --------------- Stroke ---------------

export interface Stroke {
  /** Unique stroke identifier (nanoid) */
  id: string;
  /** Ordered array of canvas points */
  points: Point[];
  color: string;
  size: number;
  tool: Tool;
  userId: string;
  timestamp: number;
  /** Whether the stroke has been finalized (stroke:end received) */
  complete: boolean;
}

// --------------- User ---------------

export interface User {
  id: string;
  username: string;
  /** Assigned cursor/avatar color */
  color: string;
  cursor?: Point;
}

// --------------- Chat ---------------

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  userColor: string;
  message: string;
  timestamp: number;
}

// --------------- Room ---------------

export interface RoomState {
  roomId: string;
  strokes: Stroke[];
  users: User[];
  chat: ChatMessage[];
  yourUserId?: string;
}

// ============================================================
// Socket.IO event maps — typed for client ↔ server safety
// ============================================================

/** Events emitted FROM the client TO the server */
export interface ClientToServerEvents {
  "room:join": (data: { roomId: string; username: string }) => void;
  "room:leave": () => void;

  "stroke:start": (data: {
    strokeId: string;
    color: string;
    size: number;
    tool: Tool;
  }) => void;
  "stroke:point": (data: { strokeId: string; points: Point[] }) => void;
  "stroke:end": (data: { strokeId: string }) => void;
  "stroke:undo": () => void;
  "stroke:redo": () => void;

  "board:clear": () => void;

  "cursor:move": (data: { x: number; y: number }) => void;

  "chat:message": (data: { message: string }) => void;
}

/** Events emitted FROM the server TO the client */
export interface ServerToClientEvents {
  "room:state": (state: RoomState) => void;
  "room:users": (users: User[]) => void;
  "room:error": (data: { message: string }) => void;

  "stroke:start": (data: {
    strokeId: string;
    userId: string;
    color: string;
    size: number;
    tool: Tool;
    timestamp: number;
  }) => void;
  "stroke:point": (data: { strokeId: string; points: Point[] }) => void;
  "stroke:end": (data: { strokeId: string }) => void;
  "board:update": (data: { strokes: Stroke[] }) => void;
  "board:clear": () => void;

  "cursor:update": (data: {
    userId: string;
    username: string;
    color: string;
    x: number;
    y: number;
  }) => void;
  "cursor:remove": (data: { userId: string }) => void;

  "chat:message": (message: ChatMessage) => void;
}

/** Inter-server events (for Redis adapter / multi-node) */
export interface InterServerEvents {
  ping: () => void;
}

/** Per-socket data stored on the server */
export interface SocketData {
  userId: string;
  username: string;
  roomId: string;
  userColor: string;
}
