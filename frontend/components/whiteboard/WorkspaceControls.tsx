"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ZoomIn, ZoomOut, Maximize2, Grid, RotateCcw } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="absolute bottom-3 left-4 z-30 hidden sm:flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md border-2 border-[#13141f] rounded-xl shadow-[0_3px_0px_#13141f] select-none pointer-events-auto"
    >
      {/* Zoom Out */}
      <motion.button
        whileHover={{ scale: 1.15, y: -1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleZoomOut}
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-bg transition-colors cursor-pointer text-[#13141f]"
        title="Zoom Out"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </motion.button>

      {/* Current Zoom */}
      <button
        onClick={handleResetZoom}
        className="px-2 py-0.5 text-[11px] font-mono font-black text-brand-border hover:text-brand-blue cursor-pointer transition-colors"
        title="Click to reset zoom"
      >
        {zoom}%
      </button>

      {/* Zoom In */}
      <motion.button
        whileHover={{ scale: 1.15, y: -1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleZoomIn}
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-bg transition-colors cursor-pointer text-[#13141f]"
        title="Zoom In"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </motion.button>

      <span className="w-px h-4 bg-[#13141f]/20 mx-0.5" />

      {/* Fullscreen */}
      <motion.button
        whileHover={{ scale: 1.15, y: -1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleFullscreen}
        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-bg transition-colors cursor-pointer text-[#13141f]"
        title="Toggle Fullscreen"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </motion.button>
    </motion.div>
  );
}
