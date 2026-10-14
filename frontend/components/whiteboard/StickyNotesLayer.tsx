"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pin, Sparkles, Flag, Users, Heart, Trash2 } from "lucide-react";

export interface StickyNoteItem {
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

const INITIAL_NOTES: StickyNoteItem[] = [
  {
    id: "note-1",
    x: 160,
    y: 120,
    color: "yellow",
    tag: "Friction Point",
    author: "Alex (Design)",
    avatar: "AK",
    text: "User onboarding drop-off: Step 3 is confusing. Too many mandatory fields before seeing the live workspace canvas!",
    likes: 5,
    rotation: -2,
  },
  {
    id: "note-2",
    x: 540,
    y: 140,
    color: "coral",
    tag: "New Feat",
    author: "Sarah Chen",
    avatar: "SC",
    text: "Idea: AI-assisted diagram generation from raw user prompt (e.g. '@flow create user checkout funnel').",
    badge: "P0 High",
    likes: 3,
    rotation: 2.5,
  },
  {
    id: "note-3",
    x: 880,
    y: 160,
    color: "purple",
    tag: "Target Persona",
    author: "David K.",
    avatar: "DK",
    text: "User persona: Indie founders & design leads needing instant frictionless brain dumps without complex setup.",
    badge: "Priority 1",
    likes: 4,
    rotation: -1.5,
  },
  {
    id: "note-4",
    x: 820,
    y: 430,
    color: "green",
    tag: "Milestone",
    author: "Maya R.",
    avatar: "MR",
    text: "🚀 Target: launch public beta by July 15! All API contracts frozen by June 28.",
    badge: "Locked 🔒",
    likes: 8,
    rotation: 1.8,
  },
];

interface StickyNotesLayerProps {
  onNoteCountChange?: (count: number) => void;
}

export function StickyNotesLayer({ onNoteCountChange }: StickyNotesLayerProps) {
  const [notes, setNotes] = useState<StickyNoteItem[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      onNoteCountChange?.(next.length);
      return next;
    });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* ── Connectors Layer (Curved Flow Lines from Stitch) ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrow-primary"
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
            id="arrow-tertiary"
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
            id="arrow-secondary"
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

        {/* Curved arrows connecting whiteboard elements */}
        <path
          d="M 390 240 C 470 250, 480 300, 520 320"
          fill="none"
          markerEnd="url(#arrow-primary)"
          opacity="0.8"
          stroke="#4648d4"
          strokeDasharray="6 4"
          strokeWidth="2.5"
        />
        <path
          d="M 720 200 C 790 170, 830 180, 880 220"
          fill="none"
          markerEnd="url(#arrow-tertiary)"
          opacity="0.75"
          stroke="#006c49"
          strokeWidth="2.5"
        />
        <path
          d="M 710 470 C 770 500, 800 450, 840 470"
          fill="none"
          markerEnd="url(#arrow-secondary)"
          opacity="0.8"
          stroke="#ae2f34"
          strokeDasharray="4 4"
          strokeWidth="2.5"
        />
      </svg>

      {/* ── Vector Hand Sketches & Doodles from Stitch ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lightbulb Doodle above AI idea note */}
        <g transform="translate(620, 75)">
          <path
            d="M 25 35 C 10 30, 8 10, 25 5 C 42 10, 40 30, 25 35 Z"
            fill="none"
            stroke="#f59e0b"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M 20 38 L 30 38 M 22 42 L 28 42"
            stroke="#d97706"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M 25 0 L 25 -8 M 40 10 L 48 4 M 10 10 L 2 4 M 43 25 L 51 28 M 7 25 L -1 28"
            stroke="#f59e0b"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>

        {/* Star burst highlight */}
        <g transform="translate(860, 110)">
          <path
            d="M 20 0 L 24 14 L 38 18 L 26 26 L 28 40 L 18 30 L 4 36 L 10 22 L 0 14 L 14 12 Z"
            fill="#fef08a"
            opacity="0.9"
            stroke="#ca8a04"
            strokeWidth="1.8"
          />
        </g>

        {/* Hand-drawn Smiley Stamp */}
        <g transform="translate(370, 440) rotate(-10)">
          <circle cx="20" cy="20" fill="#fef9c3" r="16" stroke="#eab308" strokeWidth="2" />
          <circle cx="15" cy="16" fill="#a16207" r="1.8" />
          <circle cx="25" cy="16" fill="#a16207" r="1.8" />
          <path
            d="M 14 23 Q 20 29 26 23"
            fill="none"
            stroke="#a16207"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>
      </svg>

      {/* ── Interactive Draggable Sticky Notes ── */}
      <AnimatePresence>
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: note.rotation,
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
              whileDrag={{ scale: 1.05, zIndex: 40, cursor: "grabbing" }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              style={{
                position: "absolute",
                left: note.x,
                top: note.y,
              }}
              className={`w-64 p-4 rounded-xl shadow-lg border backdrop-blur-xs select-none pointer-events-auto cursor-grab group ${bgClass}`}
            >
              {/* Note Header */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${tagColor} flex items-center gap-1`}
                >
                  {isCoral && <Sparkles className="w-3 h-3 text-[#f43f5e]" />}
                  {isPurple && <Users className="w-3 h-3 text-[#9333ea]" />}
                  {isGreen && <Flag className="w-3 h-3 text-[#16a34a]" />}
                  {note.tag}
                </span>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="p-0.5 rounded hover:bg-black/10 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                  <Pin className="w-3 h-3" />
                </div>
              </div>

              {/* Note Body */}
              <p className="text-xs font-semibold leading-relaxed mb-3">
                {note.text}
              </p>

              {/* Note Footer */}
              <div className="pt-2 border-t border-black/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full ${avatarBg} text-[10px] text-white flex items-center justify-center font-bold`}
                  >
                    {note.avatar}
                  </span>
                  <span className="text-[11px] font-bold opacity-80">
                    {note.author}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {note.badge && (
                    <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-full font-bold">
                      {note.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => handleLike(note.id, e)}
                    className="flex items-center gap-1 text-[11px] font-bold hover:scale-115 transition-transform"
                  >
                    <span>👍</span>
                    <span>{note.likes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ── Wireframe Mockup Prototype Card from Stitch ── */}
      <motion.div
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.02, zIndex: 30 }}
        whileDrag={{ scale: 1.05, zIndex: 40, cursor: "grabbing" }}
        style={{ position: "absolute", left: 500, top: 340 }}
        className="w-72 rounded-2xl bg-white border border-slate-200/80 shadow-xl p-4 select-none pointer-events-auto cursor-grab"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
              ◫
            </div>
            <span className="text-xs font-bold text-slate-800">
              Simplified Modal Wireframe
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">v0.3</span>
        </div>

        {/* Mini Wireframe Mockup */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/50 space-y-2">
          <div className="h-2.5 w-2/3 bg-slate-200 rounded" />
          <div className="h-8 w-full bg-white rounded-lg border border-slate-200 flex items-center px-2.5">
            <div className="h-2 w-1/3 bg-slate-300 rounded" />
          </div>
          <div className="flex gap-2 pt-1">
            <div className="h-6 flex-1 bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] text-white font-bold shadow-xs">
              One-Click Google
            </div>
            <div className="h-6 w-14 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-500 font-semibold">
              Skip
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-handwriting text-indigo-600 font-bold text-sm">
            &quot;Cut steps down to 1&quot;
          </span>
          <span className="text-[10px] font-semibold text-slate-500">
            👁 3 reviews
          </span>
        </div>
      </motion.div>
    </div>
  );
}
