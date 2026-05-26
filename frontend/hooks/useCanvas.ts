"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import type { AppSocket } from "@/lib/socket";
import type { Point, Stroke, Tool } from "@/types";
import { renderStrokes, getCanvasPoint } from "@/lib/canvas";
import { POINT_BATCH_INTERVAL, CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/constants";

interface UseCanvasOptions {
  socket: AppSocket | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  color: string;
  brushSize: number;
  tool: Tool;
  onCursorMove?: (x: number, y: number) => void;
}

/**
 * Core drawing hook. Manages:
 * - Local drawing via pointer events
 * - Batched point emission (throttled to POINT_BATCH_INTERVAL)
 * - Remote stroke rendering from socket events
 * - Full canvas re-render from stroke history via RAF loop
 */
export function useCanvas({
  socket,
  canvasRef,
  color,
  brushSize,
  tool,
  onCursorMove,
}: UseCanvasOptions) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef = useRef<Stroke[]>([]);

  // In-progress strokes (local + remote, keyed by strokeId)
  const activeStrokesRef = useRef<Map<string, Stroke>>(new Map());

  const currentStrokeRef = useRef<Stroke | null>(null);
  const isDrawingRef = useRef(false);

  // Batched point buffer for outgoing events
  const pointBatchRef = useRef<Point[]>([]);
  const batchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentStrokeIdRef = useRef<string>("");

  // RAF rendering
  const rafRef = useRef<number>(0);
  const dirtyRef = useRef(false);

  // ─── Render loop ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      if (dirtyRef.current) {
        renderStrokes(ctx, strokesRef.current, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (const s of activeStrokesRef.current.values()) {
          if (!s.complete) renderSingleStroke(ctx, s);
        }
        dirtyRef.current = false;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasRef]);

  // ─── Batch point flusher ──────────────────────────────────
  const startBatchTimer = useCallback(() => {
    if (batchTimerRef.current) return;
    batchTimerRef.current = setInterval(() => {
      if (pointBatchRef.current.length === 0 || !socket || !currentStrokeIdRef.current) return;
      socket.emit("stroke:point", {
        strokeId: currentStrokeIdRef.current,
        points: [...pointBatchRef.current],
      });
      pointBatchRef.current = [];
    }, POINT_BATCH_INTERVAL);
  }, [socket]);

  const stopBatchTimer = useCallback(() => {
    if (batchTimerRef.current) {
      clearInterval(batchTimerRef.current);
      batchTimerRef.current = null;
    }
    if (pointBatchRef.current.length > 0 && socket && currentStrokeIdRef.current) {
      socket.emit("stroke:point", {
        strokeId: currentStrokeIdRef.current,
        points: [...pointBatchRef.current],
      });
      pointBatchRef.current = [];
    }
  }, [socket]);

  // ─── Pointer handlers ─────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas || !socket) return;

      const point = getCanvasPoint(e.nativeEvent as MouseEvent, canvas);
      const strokeId = nanoid();
      currentStrokeIdRef.current = strokeId;

      const newStroke: Stroke = {
        id: strokeId,
        points: [point],
        color,
        size: brushSize,
        tool,
        userId: "local",
        timestamp: Date.now(),
        complete: false,
      };

      currentStrokeRef.current = newStroke;
      activeStrokesRef.current.set(strokeId, newStroke);
      isDrawingRef.current = true;

      socket.emit("stroke:start", { strokeId, color, size: brushSize, tool });
      pointBatchRef.current = [point];
      startBatchTimer();
      dirtyRef.current = true;
    },
    [canvasRef, socket, color, brushSize, tool, startBatchTimer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const point = getCanvasPoint(e.nativeEvent as MouseEvent, canvas);
      onCursorMove?.(point.x, point.y);
      if (!isDrawingRef.current || !currentStrokeRef.current) return;
      currentStrokeRef.current.points.push(point);
      pointBatchRef.current.push(point);
      dirtyRef.current = true;
    },
    [canvasRef, onCursorMove]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (!isDrawingRef.current || !currentStrokeRef.current) return;
      const strokeId = currentStrokeIdRef.current;
      stopBatchTimer();
      currentStrokeRef.current.complete = true;
      activeStrokesRef.current.delete(strokeId);
      const committed = [...strokesRef.current, currentStrokeRef.current];
      strokesRef.current = committed;
      setStrokes(committed);
      socket?.emit("stroke:end", { strokeId });
      currentStrokeRef.current = null;
      isDrawingRef.current = false;
      dirtyRef.current = true;
    },
    [socket, stopBatchTimer]
  );

  // ─── Remote stroke events ─────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleRemoteStart = ({
      strokeId, userId, color: c, size, tool: t, timestamp,
    }: { strokeId: string; userId: string; color: string; size: number; tool: Tool; timestamp: number }) => {
      activeStrokesRef.current.set(strokeId, {
        id: strokeId, points: [], color: c, size, tool: t,
        userId, timestamp, complete: false,
      });
      dirtyRef.current = true;
    };

    const handleRemotePoint = ({ strokeId, points }: { strokeId: string; points: Point[] }) => {
      const stroke = activeStrokesRef.current.get(strokeId);
      if (!stroke) return;
      stroke.points.push(...points);
      dirtyRef.current = true;
    };

    const handleRemoteEnd = ({ strokeId }: { strokeId: string }) => {
      const stroke = activeStrokesRef.current.get(strokeId);
      if (!stroke) return;
      stroke.complete = true;
      activeStrokesRef.current.delete(strokeId);
      const committed = [...strokesRef.current, stroke];
      strokesRef.current = committed;
      setStrokes(committed);
      dirtyRef.current = true;
    };

    socket.on("stroke:start", handleRemoteStart);
    socket.on("stroke:point", handleRemotePoint);
    socket.on("stroke:end", handleRemoteEnd);

    return () => {
      socket.off("stroke:start", handleRemoteStart);
      socket.off("stroke:point", handleRemotePoint);
      socket.off("stroke:end", handleRemoteEnd);
    };
  }, [socket]);

  // ─── Board actions ────────────────────────────────────────
  const clearBoard = useCallback(() => socket?.emit("board:clear"), [socket]);
  const undo = useCallback(() => socket?.emit("stroke:undo"), [socket]);
  const redo = useCallback(() => socket?.emit("stroke:redo"), [socket]);

  const syncStrokes = useCallback((serverStrokes: Stroke[]) => {
    activeStrokesRef.current.clear();
    strokesRef.current = serverStrokes;
    setStrokes(serverStrokes);
    dirtyRef.current = true;

    // Render synchronously immediately to guarantee instant visualization
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        renderStrokes(ctx, serverStrokes, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }
  }, [canvasRef]);

  return {
    strokes,
    syncStrokes,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearBoard,
    undo,
    redo,
  };
}

// ─── Internal render helper ──────────────────────────────────
function renderSingleStroke(ctx: CanvasRenderingContext2D, stroke: Stroke): void {
  if (stroke.points.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = stroke.tool === "eraser" ? "destination-out" : "source-over";
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (stroke.points.length === 1) {
    const { x, y } = stroke.points[0];
    ctx.arc(x, y, stroke.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = stroke.tool === "eraser" ? "rgba(0,0,0,1)" : stroke.color;
    ctx.fill();
  } else {
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length - 1; i++) {
      const cp = stroke.points[i];
      const nx = stroke.points[i + 1];
      ctx.quadraticCurveTo(cp.x, cp.y, (cp.x + nx.x) / 2, (cp.y + nx.y) / 2);
    }
    const last = stroke.points[stroke.points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }
  ctx.restore();
}
