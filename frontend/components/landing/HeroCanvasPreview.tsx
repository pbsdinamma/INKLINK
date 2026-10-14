"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pencil,
  Eraser,
  Trash2,
  ShieldCheck,
  Sparkles,
  Pin,
  Flag,
  Users,
} from "lucide-react";
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

interface DemoNote {
  id: string;
  x: number;
  y: number;
  color: "yellow" | "coral" | "purple" | "green";
  tag: string;
  author: string;
  avatar: string;
  text: string;
  badge?: string;
  likes: number;
  rotation: number;
}

const INITIAL_DEMO_NOTES: DemoNote[] = [
  {
    id: "demo-note-1",
    x: 24,
    y: 35,
    color: "yellow",
    tag: "Friction Point",
    author: "Alex (Design)",
    avatar: "AK",
    text: "User onboarding drop-off: Step 3 is confusing. Too many mandatory fields before seeing the canvas!",
    likes: 5,
    rotation: -2,
  },
  {
    id: "demo-note-2",
    x: 240,
    y: 30,
    color: "coral",
    tag: "New Feat",
    author: "Sarah Chen",
    avatar: "SC",
    text: "Idea: AI-assisted diagram generation from raw prompt (e.g. '@flow create checkout funnel').",
    badge: "P0 High",
    likes: 3,
    rotation: 2,
  },
  {
    id: "demo-note-3",
    x: 465,
    y: 40,
    color: "purple",
    tag: "Target Persona",
    author: "David K.",
    avatar: "DK",
    text: "User persona: Indie founders & design leads needing instant frictionless brain dumps.",
    badge: "Priority 1",
    likes: 4,
    rotation: -1.5,
  },
  {
    id: "demo-note-4",
    x: 435,
    y: 240,
    color: "green",
    tag: "Milestone",
    author: "Maya R.",
    avatar: "MR",
    text: "🚀 Target: launch public beta by July 15! All API contracts frozen by June 28.",
    badge: "Locked 🔒",
    likes: 8,
    rotation: 1.5,
  },
];

export function HeroCanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#2563eb");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<Point[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [notes, setNotes] = useState<DemoNote[]>(INITIAL_DEMO_NOTES);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Redraw all user strokes onto canvas
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
  }, []);

  // Fit canvas resolution to container
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
          className="relative w-full h-[470px] sm:h-[510px] canvas-dot-grid overflow-hidden cursor-crosshair select-none"
        >
          {/* Helper Banner Pill Inside Canvas */}
          <AnimatePresence>
            {!hasInteracted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute top-2.5 inset-x-0 flex justify-center pointer-events-none z-30"
              >
                <div className="bg-slate-900 text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2">
                  <span className="text-amber-400">✨</span>
                  <span>Drag cards, click notes, or doodle right here!</span>
                  <span>🎨</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Level 1: Curved Connector Flow Lines from Stitch ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="preview-arrow-primary"
                markerHeight="6"
                markerWidth="6"
                orient="auto-start-reverse"
                refX="6"
                refY="5"
                viewBox="0 0 10 10"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4648d4" />
              </marker>
              <marker
                id="preview-arrow-tertiary"
                markerHeight="6"
                markerWidth="6"
                orient="auto-start-reverse"
                refX="6"
                refY="5"
                viewBox="0 0 10 10"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#006c49" />
              </marker>
              <marker
                id="preview-arrow-secondary"
                markerHeight="6"
                markerWidth="6"
                orient="auto-start-reverse"
                refX="6"
                refY="5"
                viewBox="0 0 10 10"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ae2f34" />
              </marker>
            </defs>

            {/* Curve 1: Note 1 (Friction Point) to Wireframe Modal */}
            <path
              d="M 170 145 C 190 190, 195 210, 220 225"
              fill="none"
              markerEnd="url(#preview-arrow-primary)"
              opacity="0.8"
              stroke="#4648d4"
              strokeDasharray="6 4"
              strokeWidth="2.5"
            />

            {/* Curve 2: Note 2 (New Feat) to Note 3 (Target Persona) */}
            <path
              d="M 410 75 C 430 55, 450 60, 475 70"
              fill="none"
              markerEnd="url(#preview-arrow-tertiary)"
              opacity="0.8"
              stroke="#006c49"
              strokeWidth="2.5"
            />

            {/* Curve 3: Wireframe Modal to Note 4 (Milestone) */}
            <path
              d="M 330 300 C 370 330, 400 300, 440 310"
              fill="none"
              markerEnd="url(#preview-arrow-secondary)"
              opacity="0.8"
              stroke="#ae2f34"
              strokeDasharray="4 4"
              strokeWidth="2.5"
            />
          </svg>

          {/* ── Level 2: Vector Hand Sketches & Emojis from Stitch ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lightbulb Doodle above AI idea note */}
            <g transform="translate(295, 2)">
              <path
                d="M 18 26 C 7 22, 6 7, 18 3 C 30 7, 29 22, 18 26 Z"
                fill="none"
                stroke="#f59e0b"
                strokeLinecap="round"
                strokeWidth="2"
              />
              <path
                d="M 14 28 L 22 28 M 15 31 L 21 31"
                stroke="#d97706"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M 18 0 L 18 -5 M 28 7 L 33 3 M 8 7 L 3 3 M 30 18 L 36 20 M 6 18 L 0 20"
                stroke="#f59e0b"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </g>

            {/* Star burst highlight */}
            <g transform="translate(450, 10)">
              <path
                d="M 14 0 L 17 10 L 26 12 L 18 18 L 20 28 L 12 21 L 3 25 L 7 15 L 0 10 L 10 8 Z"
                fill="#fef08a"
                opacity="0.9"
                stroke="#ca8a04"
                strokeWidth="1.5"
              />
            </g>

            {/* Hand-drawn Smiley Stamp */}
            <g transform="translate(45, 240) rotate(-8)">
              <circle
                cx="16"
                cy="16"
                fill="#fef9c3"
                r="13"
                stroke="#eab308"
                strokeWidth="1.8"
              />
              <circle cx="12" cy="13" fill="#a16207" r="1.4" />
              <circle cx="20" cy="13" fill="#a16207" r="1.4" />
              <path
                d="M 11 18 Q 16 23 21 18"
                fill="none"
                stroke="#a16207"
                strokeLinecap="round"
                strokeWidth="1.6"
              />
            </g>
          </svg>

          {/* ── Level 3: Interactive Draggable Flash Cards & Wireframe ── */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {notes.map((note) => {
              const isYellow = note.color === "yellow";
              const isCoral = note.color === "coral";
              const isPurple = note.color === "purple";
              const isGreen = note.color === "green";

              const bgClass = isYellow
                ? "bg-[#fef9c3] text-[#713f12] border-[#fef08a]"
                : isCoral
                ? "bg-[#ffe4e6] text-[#881337] border-[#fecdd3]"
                : isPurple
                ? "bg-[#f3e8ff] text-[#581c87] border-[#e9d5ff]"
                : "bg-[#dcfce7] text-[#14532d] border-[#bbf7d0]";

              const tagColor = isYellow
                ? "text-[#a16207]"
                : isCoral
                ? "text-[#be123c]"
                : isPurple
                ? "text-[#7e22ce]"
                : "text-[#15803d]";

              const avatarBg = isYellow
                ? "bg-amber-400"
                : isCoral
                ? "bg-rose-500"
                : isPurple
                ? "bg-purple-600"
                : "bg-emerald-600";

              return (
                <motion.div
                  key={note.id}
                  drag
                  dragMomentum={false}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotate: note.rotation,
                  }}
                  whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
                  whileDrag={{ scale: 1.05, zIndex: 40, cursor: "grabbing" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{
                    position: "absolute",
                    left: note.x,
                    top: note.y,
                  }}
                  className={`w-48 sm:w-52 p-3 rounded-xl shadow-md border select-none pointer-events-auto cursor-grab group ${bgClass}`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9.5px] font-bold uppercase tracking-wider ${tagColor} flex items-center gap-1`}
                    >
                      {isCoral && <Sparkles className="w-2.5 h-2.5 text-[#f43f5e]" />}
                      {isPurple && <Users className="w-2.5 h-2.5 text-[#9333ea]" />}
                      {isGreen && <Flag className="w-2.5 h-2.5 text-[#16a34a]" />}
                      {note.tag}
                    </span>

                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-0.5 rounded hover:bg-black/10 transition-colors cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-2.5 h-2.5 text-red-500" />
                      </button>
                      <Pin className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <p className="text-[11px] font-semibold leading-snug mb-2 text-slate-800">
                    {note.text}
                  </p>

                  {/* Card Footer */}
                  <div className="pt-1.5 border-t border-black/10 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-4 h-4 rounded-full ${avatarBg} text-[8px] text-white flex items-center justify-center font-bold`}
                      >
                        {note.avatar}
                      </span>
                      <span className="font-bold opacity-80">{note.author}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {note.badge && (
                        <span className="text-[8.5px] bg-black/10 px-1 py-0.5 rounded font-bold">
                          {note.badge}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleLike(note.id, e)}
                        className="flex items-center gap-0.5 font-bold hover:scale-115 transition-transform cursor-pointer"
                      >
                        <span>👍</span>
                        <span>{note.likes}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Simplified Modal Wireframe Prototype Card */}
            <motion.div
              drag
              dragMomentum={false}
              whileHover={{ scale: 1.02, zIndex: 30 }}
              whileDrag={{ scale: 1.05, zIndex: 40, cursor: "grabbing" }}
              style={{ position: "absolute", left: 140, top: 220 }}
              className="w-56 rounded-xl bg-white border border-slate-200 shadow-md p-3 select-none pointer-events-auto cursor-grab"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-indigo-500 text-white flex items-center justify-center text-[8px] font-bold">
                    ◫
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">
                    Simplified Modal Wireframe
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">v0.3</span>
              </div>

              {/* Wireframe Mockup Interior */}
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/50 space-y-1.5">
                <div className="h-2 w-2/3 bg-slate-200 rounded" />
                <div className="h-6 w-full bg-white rounded border border-slate-200 flex items-center px-2">
                  <div className="h-1.5 w-1/3 bg-slate-300 rounded" />
                </div>
                <div className="flex gap-1.5 pt-0.5">
                  <div className="h-5 flex-1 bg-indigo-600 rounded flex items-center justify-center text-[9px] text-white font-bold shadow-xs">
                    One-Click Google
                  </div>
                  <div className="h-5 w-10 bg-slate-200 rounded flex items-center justify-center text-[9px] text-slate-500 font-semibold">
                    Skip
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[9.5px] text-slate-400">
                <span className="text-indigo-600 font-bold">
                  &quot;Cut steps down to 1&quot;
                </span>
                <span className="font-semibold text-slate-500">👁 3 reviews</span>
              </div>
            </motion.div>
          </div>

          {/* ── Level 1: Live Canvas Drawing Surface (Background drawing layer) ── */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block z-10 pointer-events-auto"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />

          {/* Floating Canvas Toolbar (Matching Stitch spec) */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-auto z-30">
            <div className="bg-white/95 backdrop-blur-md border-2 border-slate-900 rounded-2xl px-3 py-1.5 shadow-brutal flex items-center gap-2.5">
              {/* Pen Tool */}
              <button
                type="button"
                onClick={() => setTool("pen")}
                className={cn(
                  "p-1.5 rounded-lg transition-colors cursor-pointer",
                  tool === "pen"
                    ? "bg-blue-100 text-blue-600 border border-blue-300"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                title="Pen Tool (P)"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* Eraser Tool */}
              <button
                type="button"
                onClick={() => setTool("eraser")}
                className={cn(
                  "p-1.5 rounded-lg transition-colors cursor-pointer",
                  tool === "eraser"
                    ? "bg-blue-100 text-blue-600 border border-blue-300"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                title="Eraser (E)"
              >
                <Eraser className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-200" />

              {/* Color Swatches */}
              <div className="flex items-center gap-1.5">
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
                        "w-5 h-5 rounded-full transition-transform active:scale-90 cursor-pointer",
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

              <div className="w-px h-5 bg-slate-200" />

              {/* Clear Canvas Action */}
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Clear Board"
              >
                <Trash2 className="w-4 h-4" />
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
