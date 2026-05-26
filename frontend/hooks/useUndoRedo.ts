"use client";

import { useCallback } from "react";
import type { Stroke } from "@/types";

/**
 * Manages client-side undo/redo state.
 * The server is authoritative — this hook only emits events.
 */
export function useUndoRedo(socket: { emit: Function } | null) {
  const undo = useCallback(() => {
    if (!socket) return;
    socket.emit("stroke:undo");
  }, [socket]);

  const redo = useCallback(() => {
    if (!socket) return;
    socket.emit("stroke:redo");
  }, [socket]);

  return { undo, redo };
}
