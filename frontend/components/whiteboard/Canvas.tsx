"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
  onReplayReady: (replay: () => void) => void;
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
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [cursors, setCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [isReplaying, setIsReplaying] = useState(false);

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

  // Replay feature
  const handleReplay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isReplaying) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsReplaying(true);
    const allStrokes = [...strokes];
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let strokeIdx = 0;
    let pointIdx = 0;
    const POINTS_PER_FRAME = 3;

    const replayFrame = () => {
      if (strokeIdx >= allStrokes.length) {
        setIsReplaying(false);
        return;
      }
      const stroke = allStrokes[strokeIdx];
      const end = Math.min(pointIdx + POINTS_PER_FRAME, stroke.points.length);
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
      requestAnimationFrame(replayFrame);
    };
    requestAnimationFrame(replayFrame);
  }, [strokes, isReplaying]);

  useEffect(() => {
    onReplayReady(handleReplay);
  }, [handleReplay, onReplayReady]);

  const cursorStyle =
    tool === "eraser"
      ? "cursor-cell"
      : "cursor-crosshair";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-white border-3 border-brand-border rounded-[24px] shadow-[0_8px_0px_#13141f]"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={cn("w-full h-full", cursorStyle)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
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
