"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, Grid, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface WorkspaceControlsProps {
  onToggleGrid?: () => void;
  isGridVisible?: boolean;
}

export function WorkspaceControls({
  onToggleGrid,
  isGridVisible = true,
}: WorkspaceControlsProps) {
  const [zoom, setZoom] = useState(100);
  const [showMinimap, setShowMinimap] = useState(true);

  const handleZoomIn = () => {
    setZoom((z) => Math.min(200, z + 10));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(50, z - 10));
  };

  const handleResetZoom = () => {
    setZoom(100);
    toast("Zoom reset to 100%", { icon: "🔍", duration: 1500 });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:flex flex-col gap-2 select-none pointer-events-auto">
      {/* ── Mini-Map Thumbnail Panel (from Stitch design) ── */}
      <AnimatePresence>
        {showMinimap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-48 h-32 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg p-2.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                Mini-map
              </span>
              <button
                onClick={() => setShowMinimap(false)}
                className="hover:text-slate-800 transition-colors p-0.5"
                title="Hide Minimap"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>

            {/* Canvas Schematic Representation with artifact dots & viewport indicator */}
            <div className="relative w-full h-20 bg-slate-100/80 rounded-lg border border-slate-200/60 overflow-hidden">
              {/* Colored note representations */}
              <span className="absolute left-4 top-3 w-4 h-3 bg-amber-300 rounded-[2px] opacity-85 shadow-2xs" />
              <span className="absolute left-14 top-4 w-5 h-3 bg-rose-300 rounded-[2px] opacity-85 shadow-2xs" />
              <span className="absolute left-13 top-9 w-6 h-5 bg-indigo-300 rounded-[2px] opacity-85 shadow-2xs" />
              <span className="absolute left-26 top-4 w-4 h-3 bg-purple-300 rounded-[2px] opacity-85 shadow-2xs" />
              <span className="absolute left-24 top-10 w-5 h-3 bg-emerald-300 rounded-[2px] opacity-85 shadow-2xs" />

              {/* Viewport active indicator */}
              <div className="absolute inset-x-2 inset-y-1 border-2 border-indigo-600 bg-indigo-500/10 rounded-[3px] cursor-move" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quick Zoom & Grid Toggles Dock (from Stitch design) ── */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md self-start text-xs font-semibold">
        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Zoom Out (-)"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Zoom % text */}
        <button
          onClick={handleResetZoom}
          className="px-2 font-mono text-xs font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
          title="Reset to 100%"
        >
          {zoom}%
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Zoom In (+)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-3.5 bg-slate-200 mx-0.5" />

        {/* Toggle Minimap or Grid */}
        <button
          onClick={() => setShowMinimap(!showMinimap)}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            showMinimap
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          }`}
          title="Toggle Mini-map"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreen}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Fit to Screen / Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
