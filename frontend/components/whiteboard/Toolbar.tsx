"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Tool } from "@/types";
import { TOOLS } from "@/lib/constants";
import {
  Pencil,
  Eraser,
  Trash2,
  Download,
  Play,
  Square,
  Undo2,
  Redo2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_BRUSH = 2;
const MAX_BRUSH = 50;

const PALETTE = [
  { name: "Black", color: "#000000" },
  { name: "Red", color: "#ff2d55" },
  { name: "Blue", color: "#1e6bf1" },
  { name: "Green", color: "#00c853" },
  { name: "Yellow", color: "#ffdf00" },
  { name: "Orange", color: "#ff7e1b" },
  { name: "Purple", color: "#8e2de2" },
  { name: "Pink", color: "#ff5c8a" },
  { name: "Cyan", color: "#00e5ff" },
  { name: "Brown", color: "#795548" },
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
}

interface TooltipProps {
  content: string;
  shortcut?: string;
  children: React.ReactNode;
}

function Tooltip({ content, shortcut, children }: TooltipProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            className="absolute bottom-full mb-3 px-2.5 py-1.5 bg-[#13141f] text-white text-[10px] font-black rounded-lg border-2 border-[#13141f] shadow-[0_4px_0px_#13141f] flex items-center gap-1.5 whitespace-nowrap z-50 pointer-events-none"
          >
            <span>{content}</span>
            {shortcut && (
              <span className="px-1 py-0.2 bg-white/15 rounded border border-white/10 font-mono text-[9px]">
                {shortcut}
              </span>
            )}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#13141f]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Toolbar({
  color,
  brushSize,
  tool,
  canUndo,
  canRedo,
  onColorChange,
  onBrushSizeChange,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  onReplay,
  isReplaying,
}: ToolbarProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "p" || e.key === "P") onToolChange(TOOLS.PEN);
      if (e.key === "e" || e.key === "E") onToolChange(TOOLS.ERASER);
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        onRedo();
      }
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        onDownload();
      }
      if (e.key === "[") onBrushSizeChange(Math.max(MIN_BRUSH, brushSize - 2));
      if (e.key === "]") onBrushSizeChange(Math.min(MAX_BRUSH, brushSize + 2));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onToolChange, onUndo, onRedo, onBrushSizeChange, brushSize, onDownload]);

  const previewSize = Math.max(4, Math.min(brushSize * 0.8, 32));
  const isCustomColor = !PALETTE.some((c) => c.color.toLowerCase() === color.toLowerCase()) && tool !== TOOLS.ERASER;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none px-4 select-none">
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        whileHover={{ y: -2 }}
        className="pointer-events-auto max-w-[95vw] md:max-w-max bg-white/95 backdrop-blur-xl border-4 border-brand-border rounded-[32px] shadow-[0_10px_0px_#13141f] px-5 py-3.5 flex flex-col md:flex-row items-center gap-3.5 md:gap-4 flex-nowrap overflow-x-auto md:overflow-visible scrollbar-none"
      >
        {/* ── Pod 1: Drawing Tools (Animated Sliding Pill) ──── */}
        <div className="relative flex items-center gap-1.5 p-1 bg-[#f3f7ff] border-2 border-brand-border rounded-2xl shrink-0 shadow-[inset_0_2px_4px_rgba(19,20,31,0.04)]">
          <ToolBtn
            active={tool === TOOLS.PEN}
            onClick={() => onToolChange(TOOLS.PEN)}
            title="Pen Tool"
            shortcut="P"
            activeColor="bg-brand-blue"
            activeGlow="shadow-[0_0_12px_rgba(30,107,241,0.4)]"
          >
            <Pencil className="w-4 h-4" />
          </ToolBtn>
          <ToolBtn
            active={tool === TOOLS.ERASER}
            onClick={() => onToolChange(TOOLS.ERASER)}
            title="Eraser Tool"
            shortcut="E"
            activeColor="bg-brand-pink"
            activeGlow="shadow-[0_0_12px_rgba(255,92,138,0.4)]"
          >
            <Eraser className="w-4 h-4" />
          </ToolBtn>
        </div>

        {/* ── Pod 2: Color Swatches + Custom Picker ──────────── */}
        <div className="grid grid-cols-6 md:flex md:flex-row gap-1.5 p-1 bg-[#f8fafc] border-2 border-brand-border rounded-2xl shrink-0 shadow-[inset_0_2px_4px_rgba(19,20,31,0.02)] items-center">
          {PALETTE.map((c) => {
            const isSelected = color.toLowerCase() === c.color.toLowerCase() && tool !== TOOLS.ERASER;
            return (
              <Tooltip key={c.color} content={c.name}>
                <motion.button
                  onClick={() => {
                    onColorChange(c.color);
                    if (tool === TOOLS.ERASER) onToolChange(TOOLS.PEN);
                  }}
                  whileHover={{ scale: 1.25, y: -2 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 450, damping: 14 }}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 border-brand-border cursor-pointer relative transition-transform duration-100",
                    isSelected && "scale-105"
                  )}
                  style={{ 
                    backgroundColor: c.color,
                    boxShadow: isSelected ? `0 0 16px 2px ${c.color}, inset 0 0 0 2px white` : "none",
                  }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeColorBorder"
                      className="absolute inset-[-4px] border-2 border-[#13141f] rounded-full pointer-events-none"
                      transition={{ type: "spring", stiffness: 450, damping: 16 }}
                    />
                  )}
                </motion.button>
              </Tooltip>
            );
          })}

          {/* Custom Color Swatch with Native Color Picker */}
          <Tooltip content="Custom Color Picker">
            <motion.label
              whileHover={{ scale: 1.25, y: -2 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
              className={cn(
                "w-7 h-7 rounded-full border-2 border-brand-border cursor-pointer relative flex items-center justify-center transition-transform duration-100 overflow-hidden",
                isCustomColor && "scale-105"
              )}
              style={{
                background: isCustomColor
                  ? color
                  : "conic-gradient(from 0deg, #ff2d55, #ff7e1b, #ffdf00, #00c853, #00e5ff, #1e6bf1, #8e2de2, #ff5c8a, #ff2d55)",
                boxShadow: isCustomColor
                  ? `0 0 16px 2px ${color}, inset 0 0 0 2px white`
                  : "none",
              }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  onColorChange(e.target.value);
                  if (tool === TOOLS.ERASER) onToolChange(TOOLS.PEN);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Pick custom color"
              />
              {!isCustomColor && (
                <Plus className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] pointer-events-none" />
              )}
              {isCustomColor && (
                <motion.div
                  layoutId="activeColorBorder"
                  className="absolute inset-[-4px] border-2 border-[#13141f] rounded-full pointer-events-none"
                  transition={{ type: "spring", stiffness: 450, damping: 16 }}
                />
              )}
            </motion.label>
          </Tooltip>
        </div>

        {/* ── Pod 3: Brush Size & Presets ───────────────────── */}
        <div className="flex items-center gap-3.5 shrink-0 px-3 py-1.5 bg-[#f3f7ff] border-2 border-brand-border rounded-2xl shadow-[inset_0_2px_4px_rgba(19,20,31,0.04)]">
          {/* Dynamic preview dot */}
          <div className="flex items-center justify-center w-8 h-8 border-2 border-[#13141f] rounded-xl bg-white relative overflow-hidden shrink-0">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="rounded-full transition-colors duration-100"
              style={{
                width: previewSize,
                height: previewSize,
                backgroundColor: tool === TOOLS.ERASER ? "#e5e7eb" : color,
                border: tool === TOOLS.ERASER ? "2px dashed #9ca3af" : "none",
              }}
            />
          </div>

          {/* Quick Preset Buttons with animated sliding indicator */}
          <div className="flex items-center gap-1.5 shrink-0 bg-white/50 border border-brand-border/10 p-0.5 rounded-lg relative">
            {[4, 12, 24].map((size) => {
              const isActive = brushSize === size;
              const dotSize = size === 4 ? "w-1.5 h-1.5" : size === 12 ? "w-3 h-3" : "w-4 h-4";
              const label = size === 4 ? "Tiny" : size === 12 ? "Medium" : "Chunky";
              return (
                <Tooltip key={size} content={`${label} Size (${size}px)`}>
                  <motion.button
                    type="button"
                    onClick={() => onBrushSizeChange(size)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center relative cursor-pointer z-10 transition-colors",
                      !isActive && "hover:bg-brand-border/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSizePill"
                        className="absolute inset-0 bg-brand-blue border-2 border-brand-border rounded-md shadow-[0_1.5px_0px_#13141f] -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 22 }}
                      />
                    )}
                    <div
                      className={cn(
                        "rounded-full shrink-0 transition-colors",
                        isActive ? "bg-white" : "bg-brand-border/60",
                        dotSize
                      )}
                    />
                  </motion.button>
                </Tooltip>
              );
            })}
          </div>

          {/* Custom playful range slider */}
          <div className="relative flex items-center w-20 sm:w-24">
            <input
              type="range"
              min={MIN_BRUSH}
              max={MAX_BRUSH}
              value={brushSize}
              onChange={(e) => onBrushSizeChange(Number(e.target.value))}
              className="brush-slider w-full h-2 appearance-none rounded-full cursor-pointer bg-white border border-brand-border/15"
              title={`Brush size: ${brushSize}px  [ ] to adjust`}
            />
          </div>

          {/* Numeric display */}
          <span className="text-xs font-black text-brand-border/60 font-mono w-5 text-right select-none shrink-0">
            {brushSize}
          </span>
        </div>

        {/* ── Pod 4: Action Buttons ──────────────────────────── */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f8fafc] border-2 border-brand-border rounded-2xl shrink-0 shadow-[inset_0_2px_4px_rgba(19,20,31,0.02)]">
          <IconBtn
            onClick={onUndo}
            title="Undo"
            shortcut="Ctrl+Z"
            disabled={!canUndo}
          >
            <Undo2 className="w-4 h-4" />
          </IconBtn>

          <IconBtn
            onClick={onRedo}
            title="Redo"
            shortcut="Ctrl+Y"
            disabled={!canRedo}
          >
            <Redo2 className="w-4 h-4" />
          </IconBtn>

          <IconBtn onClick={onDownload} title="Download Canvas" shortcut="D">
            <Download className="w-4 h-4" />
          </IconBtn>

          {/* Replay Button with breathing pulse when active */}
          <Tooltip content={isReplaying ? "Stop Replay" : "Replay Canvas"} shortcut="R">
            <motion.button
              onClick={onReplay}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.9 }}
              animate={isReplaying ? { scale: [1, 1.08, 1] } : {}}
              transition={isReplaying ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } : { type: "spring", stiffness: 450, damping: 14 }}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center select-none cursor-pointer border-2 transition-all",
                isReplaying
                  ? "text-white bg-brand-orange border-brand-border shadow-[0_2px_0px_#13141f] shadow-[0_0_16px_rgba(255,126,27,0.6)]"
                  : "text-brand-border/60 hover:text-brand-border hover:bg-brand-border/5 hover:border-brand-border hover:shadow-[0_2.5px_0px_#13141f] bg-white border-transparent"
              )}
            >
              {isReplaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </motion.button>
          </Tooltip>

          {/* Single-click immediate Clear button with spring bounce */}
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 14 }}
            onClick={onClear}
            className="skribbl-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-black select-none cursor-pointer h-9 shrink-0 bg-white text-brand-pink hover:bg-brand-pink hover:text-white border-2 border-brand-border transition-colors duration-100 shadow-[0_2.5px_0px_#13141f]"
            title="Clear Board"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-black">Clear</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function ToolBtn({
  active,
  onClick,
  title,
  shortcut,
  activeColor,
  activeGlow,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  shortcut?: string;
  activeColor: string;
  activeGlow: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip content={title} shortcut={shortcut}>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.12, y: -1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 450, damping: 16 }}
        className={cn(
          "relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors select-none cursor-pointer z-10",
          active
            ? "text-white"
            : "text-brand-border/40 hover:text-brand-border hover:bg-brand-border/5"
        )}
      >
        {active && (
          <motion.div
            layoutId="activeToolPill"
            className={cn(
              "absolute inset-0 rounded-xl border-2 border-[#13141f] shadow-[0_2.5px_0px_#13141f] -z-10",
              activeColor,
              activeGlow
            )}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          />
        )}
        {children}
      </motion.button>
    </Tooltip>
  );
}

function IconBtn({
  onClick,
  title,
  shortcut,
  children,
  disabled,
  className,
  activeGlow,
}: {
  onClick: () => void;
  title: string;
  shortcut?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  activeGlow?: string;
}) {
  return (
    <Tooltip content={title} shortcut={shortcut}>
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.15, y: -2 }}
        whileTap={disabled ? {} : { scale: 0.9 }}
        transition={{ type: "spring", stiffness: 450, damping: 14 }}
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center select-none transition-all cursor-pointer",
          disabled
            ? "opacity-25 cursor-not-allowed text-brand-border/40 bg-transparent border-2 border-transparent"
            : cn(
                "text-brand-border/60 hover:text-brand-border hover:bg-brand-border/5 hover:border-brand-border hover:shadow-[0_2.5px_0px_#13141f] bg-white border-2 border-transparent",
                className,
                activeGlow
              )
        )}
      >
        {children}
      </motion.button>
    </Tooltip>
  );
}
