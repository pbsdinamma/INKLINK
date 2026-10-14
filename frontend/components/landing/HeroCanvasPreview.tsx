"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, Eraser, Trash2, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_COLORS = [
  { name: "Blue", color: "#1e6bf1" },
  { name: "Pink", color: "#ff2d55" },
  { name: "Orange", color: "#ff7e1b" },
  { name: "Green", color: "#00c853" },
  { name: "Black", color: "#13141f" },
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
  const [color, setColor] = useState("#1e6bf1");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<Point[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Redraw all strokes onto canvas
  const redraw = useCallback((allStrokes: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color;
        ctx.fill();
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length - 1; i++) {
          const midX = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
          const midY = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, midX, midY);
        }
        ctx.lineTo(
          stroke.points[stroke.points.length - 1].x,
          stroke.points[stroke.points.length - 1].y
        );
        ctx.stroke();
      }
      ctx.restore();
    }
  }, []);

  // Initialize friendly doodle artwork on first load
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set internal resolution
    canvas.width = 960;
    canvas.height = 540;

    const initialStrokes: Stroke[] = [
      // Smiley mascot body
      {
        tool: "pen",
        color: "#1e6bf1",
        size: 5,
        points: [
          { x: 260, y: 220 },
          { x: 265, y: 190 },
          { x: 290, y: 170 },
          { x: 320, y: 170 },
          { x: 345, y: 190 },
          { x: 350, y: 220 },
          { x: 345, y: 250 },
          { x: 320, y: 270 },
          { x: 290, y: 270 },
          { x: 265, y: 250 },
          { x: 260, y: 220 },
        ],
      },
      // Left eye
      {
        tool: "pen",
        color: "#13141f",
        size: 6,
        points: [{ x: 290, y: 210 }],
      },
      // Right eye
      {
        tool: "pen",
        color: "#13141f",
        size: 6,
        points: [{ x: 320, y: 210 }],
      },
      // Smile
      {
        tool: "pen",
        color: "#ff2d55",
        size: 4,
        points: [
          { x: 285, y: 235 },
          { x: 295, y: 248 },
          { x: 315, y: 248 },
          { x: 325, y: 235 },
        ],
      },
      // Arrow pointing to sketchpad
      {
        tool: "pen",
        color: "#ff7e1b",
        size: 4,
        points: [
          { x: 380, y: 220 },
          { x: 440, y: 210 },
          { x: 500, y: 230 },
          { x: 550, y: 220 },
        ],
      },
      // Arrowhead
      {
        tool: "pen",
        color: "#ff7e1b",
        size: 4,
        points: [
          { x: 535, y: 205 },
          { x: 552, y: 220 },
          { x: 535, y: 235 },
        ],
      },
      // Playful star
      {
        tool: "pen",
        color: "#00c853",
        size: 4,
        points: [
          { x: 720, y: 160 },
          { x: 735, y: 195 },
          { x: 770, y: 200 },
          { x: 745, y: 225 },
          { x: 750, y: 260 },
          { x: 720, y: 240 },
          { x: 690, y: 260 },
          { x: 695, y: 225 },
          { x: 670, y: 200 },
          { x: 705, y: 195 },
          { x: 720, y: 160 },
        ],
      },
    ];

    setStrokes(initialStrokes);
    redraw(initialStrokes);
  }, [redraw]);

  // Coordinate helper
  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
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
      size: tool === "eraser" ? 28 : 5,
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
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* App Window Frame with Neo-Brutalist Stitch styling */}
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="bg-white border-4 border-[#13141f] rounded-[28px] shadow-[0_12px_0px_#13141f] overflow-hidden relative"
      >
        {/* Window Titlebar */}
        <div className="bg-[#fbfcfe] border-b-3 border-[#13141f] px-4 py-3 flex items-center justify-between select-none">
          {/* Mac window dots */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#ff2d55] border-2 border-[#13141f]" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#ff7e1b] border-2 border-[#13141f]" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#00c853] border-2 border-[#13141f]" />
          </div>

          {/* Clean URL bar */}
          <div className="flex items-center gap-2 bg-[#f0f4ff] border-2 border-[#13141f]/30 rounded-xl px-3.5 py-1 text-xs font-mono text-[#13141f] font-bold shadow-[0_1px_0px_rgba(19,20,31,0.08)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00c853]" />
            <span>inklink.app/preview</span>
          </div>

          {/* Interactive Live badge */}
          <div className="flex items-center gap-1.5 text-xs font-black text-[#1e6bf1] bg-[#1e6bf1]/10 px-2.5 py-1 rounded-full border border-[#1e6bf1]/20">
            <span className="w-2 h-2 rounded-full bg-[#00c853] animate-ping" />
            <span className="hidden sm:inline">Interactive Canvas</span>
          </div>
        </div>

        {/* Canvas Drawing Surface */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/9] bg-white overflow-hidden cursor-crosshair"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(19, 20, 31, 0.08) 1.2px, transparent 1.2px)`,
            backgroundSize: "22px 22px",
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />

          {/* Initial Playful Hint Badge (fades out after user first draws) */}
          <AnimatePresence>
            {!hasInteracted && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 bg-[#13141f] text-white rounded-xl shadow-[0_4px_0px_rgba(0,0,0,0.25)] border-2 border-[#13141f]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ffdf00]" />
                <span className="text-xs font-black">
                  Interactive preview — Try doodling right here! 🎨
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Embedded Mini Floating Toolbar */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-md border-3 border-[#13141f] rounded-2xl shadow-[0_5px_0px_#13141f]">
            {/* Tool Toggles */}
            <div className="flex items-center gap-1 bg-[#f3f7ff] p-0.5 rounded-xl border-2 border-[#13141f]">
              <button
                type="button"
                onClick={() => setTool("pen")}
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer",
                  tool === "pen"
                    ? "bg-[#1e6bf1] text-white shadow-[0_1.5px_0px_#13141f]"
                    : "text-[#13141f]/60 hover:text-[#13141f]"
                )}
                title="Pen"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTool("eraser")}
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer",
                  tool === "eraser"
                    ? "bg-[#ff5c8a] text-white shadow-[0_1.5px_0px_#13141f]"
                    : "text-[#13141f]/60 hover:text-[#13141f]"
                )}
                title="Eraser"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Colors */}
            <div className="flex items-center gap-1.5 px-1.5">
              {DEMO_COLORS.map((c) => {
                const isSelected = color.toLowerCase() === c.color.toLowerCase() && tool === "pen";
                return (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => {
                      setColor(c.color);
                      setTool("pen");
                    }}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 border-[#13141f] cursor-pointer transition-transform relative",
                      isSelected && "scale-125"
                    )}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  >
                    {isSelected && (
                      <span className="absolute inset-[-3px] rounded-full border-2 border-[#13141f]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-[#ff2d55] hover:bg-[#ff2d55]/10 rounded-lg transition-colors cursor-pointer"
              title="Clear Canvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Subdued Caption */}
      <p className="mt-4 text-xs font-black text-[#13141f]/50 text-center select-none">
        Draw live on the interactive canvas above or create a full multiplayer room below!
      </p>
    </div>
  );
}
