"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Tool } from "@/types";
import { TOOLS } from "@/lib/constants";
import {
  MousePointer2,
  Hand,
  Pencil,
  Highlighter,
  StickyNote,
  Shapes,
  Type,
  Eraser,
  Sparkles,
  Trash2,
  Play,
  Square,
  Plus,
} from "lucide-react";

const STITCH_COLORS = [
  { name: "Jet Black", color: "#0f172a" },
  { name: "Electric Indigo", color: "#6366f1" },
  { name: "Sunset Coral", color: "#ff6b6b" },
  { name: "Mint Emerald", color: "#10b981" },
  { name: "Amber Gold", color: "#f59e0b" },
  { name: "Sky Blue", color: "#0ea5e9" },
];

interface ToolbarProps {
  color: string;
  brushSize: number;
  tool: Tool;
  canUndo: boolean;
  canRedo: boolean;
  onColorChange: (c: string) => void;
  onBrushSizeChange: (s: number) => void;
  onToolChange: (t: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
  onReplay: () => void;
  isReplaying: boolean;
  onAddStickyNote?: () => void;
}

export function Toolbar({
  color,
  brushSize,
  tool,
  onColorChange,
  onBrushSizeChange,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  onReplay,
  isReplaying,
  onAddStickyNote,
}: ToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "v" || e.key === "V") onToolChange(TOOLS.PEN);
      if (e.key === "p" || e.key === "P") onToolChange(TOOLS.PEN);
      if (e.key === "e" || e.key === "E") onToolChange(TOOLS.ERASER);
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }
      if (
        (e.metaKey && e.shiftKey && e.key === "z") ||
        (e.ctrlKey && e.key === "y")
      ) {
        e.preventDefault();
        onRedo();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onToolChange, onUndo, onRedo]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 max-w-[95vw] pointer-events-auto select-none">
      {/* ── Main Drawing Tools Capsule ── */}
      <nav
        aria-label="Whiteboard Drawing Tools"
        className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl"
      >
        {/* Select / Pointer */}
        <button
          onClick={() => onToolChange(TOOLS.PEN)}
          className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all cursor-pointer ${
            tool === TOOLS.PEN
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
          title="Select (V)"
        >
          <MousePointer2 className="w-4 h-4" />
          {tool === TOOLS.PEN && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-600" />
          )}
        </button>

        {/* Pan / Hand */}
        <button
          onClick={() => onToolChange(TOOLS.PEN)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
          title="Hand / Pan (H)"
        >
          <Hand className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-200 mx-0.5" />

        {/* Pen / Brush */}
        <button
          onClick={() => onToolChange(TOOLS.PEN)}
          className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all cursor-pointer ${
            tool === TOOLS.PEN
              ? "bg-indigo-50 text-indigo-600 font-bold"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
          title="Pen / Brush (P)"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Highlighter */}
        <button
          onClick={() => {
            onToolChange(TOOLS.PEN);
            onBrushSizeChange(24);
          }}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
          title="Highlighter"
        >
          <Highlighter className="w-4 h-4 text-amber-500" />
        </button>

        {/* Sticky Note Tool */}
        <div className="relative group">
          <button
            onClick={() => onAddStickyNote?.()}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
            title="Sticky Note (S)"
          >
            <StickyNote className="w-4 h-4 text-amber-500" />
          </button>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#fef08a] border border-amber-400" />
        </div>

        {/* Shapes Picker */}
        <button
          onClick={() => onToolChange(TOOLS.PEN)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
          title="Shapes (R)"
        >
          <Shapes className="w-4 h-4" />
        </button>

        {/* Text Tool */}
        <button
          onClick={() => onToolChange(TOOLS.PEN)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
          title="Text (T)"
        >
          <Type className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-200 mx-0.5" />

        {/* Eraser */}
        <button
          onClick={() => onToolChange(TOOLS.ERASER)}
          className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all cursor-pointer ${
            tool === TOOLS.ERASER
              ? "bg-rose-50 text-rose-600 font-bold"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
          title="Eraser (E)"
        >
          <Eraser className="w-4 h-4" />
        </button>

        {/* Laser Pointer / Sparkles */}
        <button
          onClick={() => onToolChange(TOOLS.PEN)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
          title="Laser Pointer (L)"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-200 mx-0.5" />

        {/* Single-click Clear Board */}
        <button
          onClick={onClear}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
          title="Clear Whiteboard"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </nav>

      {/* ── Quick Properties & Swatches Floating Pill ── */}
      <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl">
        {/* Color Palette Swatches */}
        <div className="flex items-center gap-1.5">
          {STITCH_COLORS.map((item) => {
            const isSelected = color === item.color;
            return (
              <button
                key={item.color}
                type="button"
                onClick={() => onColorChange(item.color)}
                className={`w-5 h-5 rounded-full transition-transform cursor-pointer relative ${
                  isSelected ? "scale-125 ring-2 ring-offset-2 ring-indigo-500" : "hover:scale-110"
                }`}
                style={{ backgroundColor: item.color }}
                title={item.name}
              />
            );
          })}

          {/* Custom Color Native Input */}
          <div className="relative flex items-center">
            <label
              htmlFor="native-color-picker"
              className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-gradient-to-tr from-rose-400 via-emerald-400 to-sky-400"
              title="Custom Color"
            >
              <Plus className="w-2.5 h-2.5 text-white" />
            </label>
            <input
              id="native-color-picker"
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="sr-only"
            />
          </div>
        </div>

        <span className="w-px h-4 bg-slate-200 mx-0.5" />

        {/* Stroke Thickness Selector (Thin, Medium, Bold) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onBrushSizeChange(4)}
            className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              brushSize === 4 ? "bg-slate-100" : "hover:bg-slate-50"
            }`}
            title="Thin (4px)"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                brushSize === 4 ? "bg-indigo-600" : "bg-slate-700"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => onBrushSizeChange(12)}
            className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              brushSize === 12 ? "bg-slate-100" : "hover:bg-slate-50"
            }`}
            title="Medium (12px)"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                brushSize === 12 ? "bg-indigo-600" : "bg-slate-700"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => onBrushSizeChange(24)}
            className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              brushSize === 24 ? "bg-slate-100" : "hover:bg-slate-50"
            }`}
            title="Bold (24px)"
          >
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                brushSize === 24 ? "bg-indigo-600" : "bg-slate-700"
              }`}
            />
          </button>
        </div>

        <span className="w-px h-4 bg-slate-200 mx-0.5" />

        {/* Replay Button */}
        <motion.button
          type="button"
          onClick={onReplay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isReplaying ? { scale: [1, 1.1, 1] } : {}}
          transition={
            isReplaying
              ? { repeat: Infinity, duration: 1.2 }
              : { type: "spring", stiffness: 450, damping: 14 }
          }
          className={`p-1 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
            isReplaying
              ? "bg-amber-500 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
          title={isReplaying ? "Stop Replay" : "Replay Board History (R)"}
        >
          {isReplaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="text-[11px] hidden md:inline">
            {isReplaying ? "Stop" : "Replay"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
