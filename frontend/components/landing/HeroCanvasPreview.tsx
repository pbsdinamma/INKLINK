"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, Eraser, Trash2, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_COLORS = [
  { name: "Blue", color: "#2563eb" },
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Green", color: "#22c55e" },
  { name: "Slate", color: "#0f172a" },
];

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  tool: "pen" | "eraser";
  color: string;
  size: number;
  points: Point[];
}

export function HeroCanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#2563eb");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<Point[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Draw initial demo sketches from Stitch design
  const drawInitialSketches = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Relative coordinates
      const cx = width * 0.28;
      const cy = height * 0.5;

      // 1. Blue Smiley Face (exact Stitch spec)
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(cx - 13, cy - 10, 3.5, 0, Math.PI * 2);
      ctx.arc(cx + 13, cy - 10, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Smile in Red
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy + 5, 18, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.stroke();

      // 2. Curved Orange Arrow pointing right
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx + 65, cy);
      ctx.quadraticCurveTo(cx + 125, cy - 12, cx + 165, cy);
      ctx.stroke();

      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(cx + 152, cy - 10);
      ctx.lineTo(cx + 167, cy);
      ctx.lineTo(cx + 150, cy + 10);
      ctx.stroke();

      // 3. Green Hand-drawn 5-Point Star
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      const starX = cx + 245;
      const starY = cy - 6;
      const spikes = 5;
      const outerRadius = 32;
      const innerRadius = 16;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(starX, starY - outerRadius);
      for (let i = 0; i < spikes; i++) {
        const x1 = starX + Math.cos(rot) * outerRadius;
        const y1 = starY + Math.sin(rot) * outerRadius;
        ctx.lineTo(x1, y1);
        rot += step;

        const x2 = starX + Math.cos(rot) * innerRadius;
        const y2 = starY + Math.sin(rot) * innerRadius;
        ctx.lineTo(x2, y2);
        rot += step;
      }
      ctx.lineTo(starX, starY - outerRadius);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    },
    []
  );

  // Redraw all strokes onto canvas
  const redraw = useCallback(
    (allStrokes: Stroke[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Always draw the initial sketch in the background
      drawInitialSketches(ctx, canvas.width, canvas.height);

      // Draw user strokes
      for (const stroke of allStrokes) {
        if (stroke.points.length === 0) continue;
        ctx.save();
        ctx.globalCompositeOperation =
          stroke.tool === "eraser" ? "destination-out" : "source-over";
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        if (stroke.points.length === 1) {
          ctx.arc(
            stroke.points[0].x,
            stroke.points[0].y,
            stroke.size / 2,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = stroke.color;
          ctx.fill();
        } else {
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length - 1; i++) {
            const midX = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
            const midY = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
            ctx.quadraticCurveTo(
              stroke.points[i].x,
              stroke.points[i].y,
              midX,
              midY
            );
          }
          ctx.lineTo(
            stroke.points[stroke.points.length - 1].x,
            stroke.points[stroke.points.length - 1].y
          );
          ctx.stroke();
        }
        ctx.restore();
      }
    },
    [drawInitialSketches]
  );

  // Fit canvas resolution to container and initialize sketch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      redraw(strokes);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redraw, strokes]);

  // Coordinate helper
  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    setHasInteracted(true);
    const pt = getPoint(e);
    currentPointsRef.current = [pt];

    const newStroke: Stroke = {
      tool,
      color: tool === "eraser" ? "#ffffff" : color,
      size: tool === "eraser" ? 24 : 4,
      points: [pt],
    };

    setStrokes((prev) => {
      const updated = [...prev, newStroke];
      redraw(updated);
      return updated;
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const pt = getPoint(e);
    currentPointsRef.current.push(pt);

    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const last = { ...prev[prev.length - 1] };
      last.points = [...currentPointsRef.current];
      const updated = [...prev.slice(0, -1), last];
      redraw(updated);
      return updated;
    });
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    currentPointsRef.current = [];
  };

  const handleClear = () => {
    setStrokes([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      if (ctx) {
        drawInitialSketches(ctx, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* Window Container with Neo-Brutalist 2.5px border matching Stitch */}
      <div className="w-full bg-white rounded-3xl ink-shadow-window border-[2.5px] border-slate-900 overflow-hidden flex flex-col">
        {/* Window Chrome Header */}
        <div className="h-12 bg-white border-b-2 border-slate-900 px-4 flex items-center justify-between">
          {/* Mac traffic light dots */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#ef4444] border border-black/20" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#eab308] border border-black/20" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e] border border-black/20" />
          </div>

          {/* Address / Security pill */}
          <div className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>inklink.app/preview</span>
          </div>

          {/* Mode Tag */}
          <div className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
            Interactive Canvas
          </div>
        </div>

        {/* Main Interactive Drawing Canvas Area */}
        <div
          ref={containerRef}
          className="relative w-full h-[380px] sm:h-[440px] canvas-dot-grid overflow-hidden cursor-crosshair select-none"
        >
          {/* Helper Banner Pill Inside Canvas */}
          <AnimatePresence>
            {!hasInteracted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 inset-x-0 flex justify-center pointer-events-none z-10"
              >
                <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                  <span className="text-amber-400">✨</span>
                  <span>Interactive preview — Try doodling right here!</span>
                  <span>🎨</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actual HTML5 Canvas Element */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />

          {/* Floating Canvas Toolbar (Matching exact layout from Stitch spec) */}
          <div className="absolute bottom-5 inset-x-0 flex justify-center pointer-events-auto z-20">
            <div className="bg-white border-2 border-slate-900 rounded-2xl px-3 py-2 shadow-brutal flex items-center gap-3">
              {/* Pen Tool */}
              <button
                type="button"
                onClick={() => setTool("pen")}
                className={cn(
                  "p-2 rounded-lg transition-colors cursor-pointer",
                  tool === "pen"
                    ? "bg-blue-100 text-blue-600 border border-blue-300"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                title="Pen Tool (P)"
              >
                <Pencil className="w-5 h-5" />
              </button>

              {/* Eraser Tool */}
              <button
                type="button"
                onClick={() => setTool("eraser")}
                className={cn(
                  "p-2 rounded-lg transition-colors cursor-pointer",
                  tool === "eraser"
                    ? "bg-blue-100 text-blue-600 border border-blue-300"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                title="Eraser (E)"
              >
                <Eraser className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-slate-200" />

              {/* Color Swatches */}
              <div className="flex items-center gap-2">
                {DEMO_COLORS.map((c) => {
                  const isSelected =
                    color.toLowerCase() === c.color.toLowerCase() &&
                    tool === "pen";
                  return (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => {
                        setColor(c.color);
                        setTool("pen");
                      }}
                      className={cn(
                        "w-6 h-6 rounded-full transition-transform active:scale-90 cursor-pointer",
                        isSelected
                          ? "ring-2 ring-offset-2 ring-slate-900 scale-110"
                          : "hover:scale-110"
                      )}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  );
                })}
              </div>

              <div className="w-px h-6 bg-slate-200" />

              {/* Clear Canvas Action */}
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Clear Board"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle caption below canvas */}
      <p className="mt-4 text-xs font-semibold text-slate-500 text-center">
        Draw live on the interactive canvas above or create a full multiplayer room below!
      </p>
    </div>
  );
}
