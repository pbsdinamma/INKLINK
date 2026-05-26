// ─── Tool types ──────────────────────────────────────────────
export const TOOLS = {
  PEN: "pen",
  ERASER: "eraser",
} as const;

// ─── Drawing defaults ─────────────────────────────────────────
export const DEFAULT_COLOR = "#FFFFFF";
export const DEFAULT_BRUSH_SIZE = 4;
export const DEFAULT_TOOL = TOOLS.PEN;

export const BRUSH_SIZES = [2, 4, 8, 16, 24, 36] as const;

export const PRESET_COLORS = [
  "#FFFFFF", "#000000",
  "#FF6B6B", "#FF8E53",
  "#FFE66D", "#A8E063",
  "#4ECDC4", "#45B7D1",
  "#96CEB4", "#DDA0DD",
  "#BB8FCE", "#F7DC6F",
] as const;

// ─── Canvas ───────────────────────────────────────────────────
export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

// ─── Timing ───────────────────────────────────────────────────
/** How often to flush batched points (ms) */
export const POINT_BATCH_INTERVAL = 16; // ~60fps
/** Cursor broadcast throttle (ms) */
export const CURSOR_THROTTLE_MS = 33; // ~30fps

// ─── Reconnect ────────────────────────────────────────────────
export const RECONNECT_ATTEMPTS = 5;
export const RECONNECT_DELAY = 1000;

// ─── Chat ─────────────────────────────────────────────────────
export const MAX_MESSAGE_LENGTH = 500;
