"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Tool } from "@/types";
import { TOOLS } from "@/lib/constants";
import {
  Pencil,
  Eraser,
  Trash2,
  Download,
  Play,
  Square,
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
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleClearClick = () => {
    if (showClearConfirm) {
      onClear();
      setShowClearConfirm(false);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    } else {
      setShowClearConfirm(true);
      clearTimerRef.current = setTimeout(() => setShowClearConfirm(false), 2500);
    }
  };

  const previewSize = Math.max(4, Math.min(brushSize * 0.8, 32));

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none px-4 select-none">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ y: -2 }}
        className="pointer-events-auto max-w-[95vw] md:max-w-max bg-white/95 backdrop-blur-md border-4 border-brand-border rounded-[32px] shadow-[0_8px_0px_#13141f] px-5 py-3.5 flex flex-col md:flex-row items-center gap-3.5 md:gap-4 flex-nowrap overflow-x-auto md:overflow-visible scrollbar-none"
      >
        {/* ── Pod 1: Drawing Tools ────────────────────────────── */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f3f7ff] border-2 border-brand-border rounded-2xl shrink-0 shadow-[inset_0_2px_4px_rgba(19,20,31,0.04)]">
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

        {/* ── Pod 2: Color Swatches ──────────────────────────── */}
        <div className="grid grid-cols-5 md:flex md:flex-row gap-1.5 p-1 bg-[#f8fafc] border-2 border-brand-border rounded-2xl shrink-0 shadow-[inset_0_2px_4px_rgba(19,20,31,0.02)]">
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
                    "w-7 h-7 rounded-full border-2 border-brand-border cursor-pointer relative transition-all duration-100",
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
                      transition={{ type: "spring", stiffness: 450, damping: 14 }}
                    />
                  )}
                </motion.button>
              </Tooltip>
            );
          })}
        </div>

        {/* ── Pod 3: Brush Size & Presets ───────────────────── */}
        <div className="flex items-center gap-3.5 shrink-0 px-3 py-1.5 bg-[#f3f7ff] border-2 border-brand-border rounded-2xl shadow-[inset_0_2px_4px_rgba(19,20,31,0.04)]">
          {/* Dynamic preview dot */}
          <div className="flex items-center justify-center w-8 h-8 border-2 border-[#13141f] rounded-xl bg-white relative overflow-hidden shrink-0">
            <div
              className="rounded-full transition-all duration-100"
              style={{
                width: previewSize,
                height: previewSize,
                backgroundColor: tool === TOOLS.ERASER ? "#e5e7eb" : color,
                border: tool === TOOLS.ERASER ? "2px dashed #9ca3af" : "none",
              }}
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 bg-white/50 border border-brand-border/10 p-0.5 rounded-lg">
            {[4, 12, 24].map((size) => {
              const isActive = brushSize === size;
              const dotSize = size === 4 ? "w-1.5 h-1.5" : size === 12 ? "w-3 h-3" : "w-4 h-4";
              const label = size === 4 ? "Tiny" : size === 12 ? "Medium" : "Chunky";
              return (
                <Tooltip key={size} content={`${label} Size (${size}px)`}>
                  <motion.button
                    type="button"
                    onClick={() => onBrushSizeChange(size)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center border-2 border-transparent transition-all cursor-pointer relative",
                      isActive
                        ? "bg-brand-blue border-brand-border shadow-[0_1.5px_0px_#13141f]"
                        : "bg-transparent hover:bg-brand-border/5"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full shrink-0",
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
          <IconBtn onClick={onDownload} title="Download Canvas" shortcut="D">
            <Download className="w-4 h-4" />
          </IconBtn>

          <IconBtn
            onClick={onReplay}
            title={isReplaying ? "Stop Replay" : "Replay Canvas"}
            className={isReplaying ? "text-white bg-brand-orange border-brand-border shadow-[0_2px_0px_#13141f]" : ""}
            activeGlow={isReplaying ? "shadow-[0_0_12px_rgba(255,126,27,0.5)] animate-pulse" : ""}
          >
            {isReplaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </IconBtn>

          {/* Playful Clear with animated confirm */}
          <AnimatePresence mode="wait">
            <motion.button
              key={showClearConfirm ? "confirm" : "idle"}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={handleClearClick}
              className={cn(
                "skribbl-button flex items-center gap-1 px-3 py-1 text-xs font-black select-none cursor-pointer h-9 shrink-0",
                showClearConfirm
                  ? "bg-brand-pink text-white border-brand-border shadow-[0_2.5px_0px_#13141f]"
                  : "bg-white text-brand-pink hover:bg-brand-pink/5 hover:border-brand-border hover:shadow-[0_2.5px_0px_#13141f]"
              )}
              title={showClearConfirm ? "Click again to confirm clear" : "Clear Board"}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black">{showClearConfirm ? "Sure?" : "Clear"}</span>
            </motion.button>
          </AnimatePresence>
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
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 450, damping: 14 }}
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center border-2 border-transparent transition-all select-none cursor-pointer",
          active
            ? cn(activeColor, "text-white border-[#13141f] shadow-[0_2.5px_0px_#13141f]", activeGlow)
            : "text-brand-border/40 hover:text-brand-border hover:bg-brand-border/5"
        )}
      >
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
