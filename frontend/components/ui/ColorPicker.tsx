"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// Extended palette: 8 rows × 8 cols = 64 colors grouped by hue
const PALETTE: string[][] = [
  // Neutrals
  ["#FFFFFF", "#D4D4D8", "#A1A1AA", "#71717A", "#52525B", "#3F3F46", "#27272A", "#18181B"],
  // Warm reds / pinks
  ["#FFF1F2", "#FFE4E6", "#FECDD3", "#FDA4AF", "#FB7185", "#F43F5E", "#E11D48", "#9F1239"],
  // Orange / amber
  ["#FFF7ED", "#FFEDD5", "#FED7AA", "#FDBA74", "#FB923C", "#F97316", "#EA580C", "#9A3412"],
  // Yellow / lime
  ["#FEFCE8", "#FEF9C3", "#FEF08A", "#FDE047", "#FACC15", "#EAB308", "#CA8A04", "#854D0E"],
  // Green / emerald
  ["#F0FDF4", "#DCFCE7", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A", "#15803D", "#14532D"],
  // Cyan / sky
  ["#ECFEFF", "#CFFAFE", "#67E8F9", "#22D3EE", "#06B6D4", "#0891B2", "#0E7490", "#164E63"],
  // Blue / indigo
  ["#EFF6FF", "#DBEAFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E3A8A"],
  // Violet / purple
  ["#F5F3FF", "#EDE9FE", "#C4B5FD", "#A78BFA", "#8B5CF6", "#7C3AED", "#6D28D9", "#4C1D95"],
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Keep hex input in sync when value changes externally
  useEffect(() => {
    setHexInput(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHexChange = useCallback(
    (raw: string) => {
      setHexInput(raw);
      if (/^#[0-9A-Fa-f]{6}$/.test(raw)) onChange(raw);
    },
    [onChange]
  );

  const isLight = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Swatch trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2 py-1.5 transition-all"
        title="Color picker"
        aria-label="Open color picker"
      >
        <div
          className="w-5 h-5 rounded-md shadow-inner border border-white/20 transition-all group-hover:scale-110"
          style={{ backgroundColor: value }}
        />
        <span className="text-xs font-mono text-white/50 group-hover:text-white/70 transition-colors min-w-[52px]">
          {value.toUpperCase()}
        </span>
      </button>

      {/* Popover palette */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 left-0 z-50 p-3 rounded-2xl bg-[#1a1a2e] border border-white/10 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ width: "224px" }}
        >
          {/* Grid palette */}
          <div className="grid gap-0.5 mb-3" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
            {PALETTE.flat().map((c) => (
              <button
                key={c}
                onClick={() => { onChange(c); setHexInput(c); }}
                className={cn(
                  "w-6 h-6 rounded-md transition-all hover:scale-125 hover:z-10 relative border-2",
                  value.toLowerCase() === c.toLowerCase()
                    ? "border-white scale-110 shadow-lg z-10"
                    : "border-transparent"
                )}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Custom input row */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <input
              type="color"
              value={value}
              onChange={(e) => { onChange(e.target.value); setHexInput(e.target.value); }}
              className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0 flex-shrink-0"
              title="Custom color"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full bg-white/5 text-white text-xs px-2 py-1.5 rounded-lg border border-white/10 font-mono focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400/50"
                maxLength={7}
                placeholder="#ffffff"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
