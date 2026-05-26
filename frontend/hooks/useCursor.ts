"use client";

import { useEffect, useRef, useCallback } from "react";
import type { AppSocket } from "@/lib/socket";
import { CURSOR_THROTTLE_MS } from "@/lib/constants";

export interface RemoteCursor {
  userId: string;
  username: string;
  color: string;
  x: number;
  y: number;
  lastSeen: number;
}

/**
 * Manages local cursor broadcasting and remote cursor tracking.
 * Throttles outgoing cursor:move events to ~30fps.
 */
export function useCursor(
  socket: AppSocket | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onCursorsChange: (cursors: Map<string, RemoteCursor>) => void
) {
  const cursors = useRef<Map<string, RemoteCursor>>(new Map());
  const lastEmit = useRef<number>(0);

  // Listen for remote cursor events
  useEffect(() => {
    if (!socket) return;

    const handleCursorUpdate = ({
      userId, username, color, x, y,
    }: { userId: string; username: string; color: string; x: number; y: number }) => {
      cursors.current.set(userId, { userId, username, color, x, y, lastSeen: Date.now() });
      onCursorsChange(new Map(cursors.current));
    };

    const handleCursorRemove = ({ userId }: { userId: string }) => {
      cursors.current.delete(userId);
      onCursorsChange(new Map(cursors.current));
    };

    socket.on("cursor:update", handleCursorUpdate);
    socket.on("cursor:remove", handleCursorRemove);
    return () => {
      socket.off("cursor:update", handleCursorUpdate);
      socket.off("cursor:remove", handleCursorRemove);
    };
  }, [socket, onCursorsChange]);

  // Stale cursor cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, cursor] of cursors.current) {
        if (now - cursor.lastSeen > 5000) {
          cursors.current.delete(id);
          changed = true;
        }
      }
      if (changed) onCursorsChange(new Map(cursors.current));
    }, 3000);
    return () => clearInterval(interval);
  }, [onCursorsChange]);

  const emitCursorMove = useCallback(
    (x: number, y: number) => {
      if (!socket) return;
      const now = Date.now();
      if (now - lastEmit.current < CURSOR_THROTTLE_MS) return;
      lastEmit.current = now;
      socket.emit("cursor:move", { x, y });
    },
    [socket]
  );

  return { emitCursorMove };
}
