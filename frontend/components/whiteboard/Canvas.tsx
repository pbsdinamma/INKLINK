"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import type { AppSocket } from "@/lib/socket";
import type { Stroke, Tool } from "@/types";
import { useCanvas } from "@/hooks/useCanvas";
import { useCursor, type RemoteCursor } from "@/hooks/useCursor";
import { CursorOverlay } from "./CursorOverlay";
import { downloadCanvasAsPng, renderStrokes } from "@/lib/canvas";
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULT_COLOR, DEFAULT_BRUSH_SIZE, DEFAULT_TOOL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CanvasProps {
  socket: AppSocket | null;
  initialStrokes: Stroke[];
  color: string;
  brushSize: number;
  tool: Tool;
  onUndoRedoReady: (undo: () => void, redo: () => void) => void;
  onClearReady: (clear: () => void) => void;
  onDownloadReady: (download: () => void) => void;
  onReplayReady: (startReplay: () => boolean, stopReplay: () => void) => void;
  onReplayEnd?: () => void;
  onStrokesChange?: (strokes: Stroke[]) => void;
}

export function Canvas({
  socket,
  initialStrokes,
  color,
  brushSize,
  tool,
  onUndoRedoReady,
  onClearReady,
  onDownloadReady,
  onReplayReady,
  onReplayEnd,
  onStrokesChange,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [cursors, setCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [isReplaying, setIsReplaying] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Track canvas display size for cursor overlay scaling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDisplaySize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const handleCursorsChange = useCallback(
    (updated: Map<string, RemoteCursor>) => {
      setCursors(new Map(updated));
    },
    []
  );

  const { emitCursorMove } = useCursor(socket, canvasRef, handleCursorsChange);

  const {
    strokes,
    syncStrokes,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearBoard,
    undo,
    redo,
  } = useCanvas({
    socket,
    canvasRef,
    color,
    brushSize,
    tool,
    onCursorMove: emitCursorMove,
    onStrokesChange,
  });

  // Sync initial strokes into canvas
  useEffect(() => {
    syncStrokes(initialStrokes);
  }, [initialStrokes, syncStrokes]);

  // Expose undo/redo/clear/download to parent toolbar
  useEffect(() => {
    onUndoRedoReady(undo, redo);
  }, [undo, redo, onUndoRedoReady]);

  useEffect(() => {
    onClearReady(clearBoard);
  }, [clearBoard, onClearReady]);

  useEffect(() => {
    onDownloadReady(() => {
      if (canvasRef.current) downloadCanvasAsPng(canvasRef.current);
    });
  }, [onDownloadReady]);

  // Replay feature with start/stop and cancelAnimationFrame support
  const stopReplay = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsReplaying(false);
    onReplayEnd?.();

    // Restore full canvas with current strokes
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        renderStrokes(ctx, strokes, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }
  }, [strokes, onReplayEnd]);

  const startReplay = useCallback((): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    if (strokes.length === 0) {
      toast("No drawings to replay yet!", { icon: "🎨" });
      onReplayEnd?.();
      return false;
    }

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setIsReplaying(true);
    const allStrokes = [...strokes];
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let strokeIdx = 0;
    let pointIdx = 0;
    const totalPoints = allStrokes.reduce((acc, s) => acc + s.points.length, 0);
    const pointsPerFrame = Math.max(3, Math.ceil(totalPoints / 180));

    const replayFrame = () => {
      if (strokeIdx >= allStrokes.length) {
        animFrameRef.current = null;
        setIsReplaying(false);
        renderStrokes(ctx, allStrokes, CANVAS_WIDTH, CANVAS_HEIGHT);
        onReplayEnd?.();
        return;
      }
      const stroke = allStrokes[strokeIdx];
      const end = Math.min(pointIdx + pointsPerFrame, stroke.points.length);
      const partial: Stroke = { ...stroke, points: stroke.points.slice(0, end) };

      // Re-render all committed strokes up to this point
      renderStrokes(
        ctx,
        [...allStrokes.slice(0, strokeIdx), partial],
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );

      pointIdx = end;
      if (pointIdx >= stroke.points.length) {
        strokeIdx++;
        pointIdx = 0;
      }
      animFrameRef.current = requestAnimationFrame(replayFrame);
    };

    animFrameRef.current = requestAnimationFrame(replayFrame);
    return true;
  }, [strokes, onReplayEnd]);

  useEffect(() => {
    onReplayReady(startReplay, stopReplay);
  }, [startReplay, stopReplay, onReplayReady]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const cursorStyle =
    tool === "eraser"
      ? "cursor-cell"
      : "cursor-crosshair";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-dot-matrix cursor-default"
    >
      {/* Ambient Grid & Metric Subdivisions SVG Overlay from Stitch */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern height="100" id="grid-major" patternUnits="userSpaceOnUse" width="100">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e0dbe3" strokeDasharray="2 3" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect fill="url(#grid-major)" height="100%" width="100%" />
      </svg>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={cn("w-full h-full relative z-0", cursorStyle)}
        onPointerDown={isReplaying ? undefined : handlePointerDown}
        onPointerMove={isReplaying ? undefined : handlePointerMove}
        onPointerUp={isReplaying ? undefined : handlePointerUp}
        onPointerLeave={isReplaying ? undefined : handlePointerUp}
        style={{ touchAction: "none" }}
      />
      {displaySize.width > 0 && (
        <CursorOverlay
          cursors={cursors}
          canvasWidth={CANVAS_WIDTH}
          canvasHeight={CANVAS_HEIGHT}
          displayWidth={displaySize.width}
          displayHeight={displaySize.height}
        />
      )}
    </div>
  );
}
