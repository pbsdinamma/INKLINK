"use client";

import { motion, AnimatePresence } from "motion/react";
import type { RemoteCursor } from "@/hooks/useCursor";

interface CursorOverlayProps {
  cursors: Map<string, RemoteCursor>;
  canvasWidth: number;
  canvasHeight: number;
  /** The displayed canvas element dimensions (CSS pixels) */
  displayWidth: number;
  displayHeight: number;
}

/**
 * SVG overlay that renders all remote user cursors with labels.
 * Positioned absolutely over the canvas element with buttery spring motion physics.
 */
export function CursorOverlay({
  cursors,
  canvasWidth,
  canvasHeight,
  displayWidth,
  displayHeight,
}: CursorOverlayProps) {
  const scaleX = displayWidth / canvasWidth;
  const scaleY = displayHeight / canvasHeight;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      width={displayWidth}
      height={displayHeight}
      style={{ overflow: "visible" }}
    >
      <AnimatePresence>
        {Array.from(cursors.values()).map((cursor) => {
          const cx = cursor.x * scaleX;
          const cy = cursor.y * scaleY;
          return (
            <motion.g
              key={cursor.userId}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                x: cx,
                y: cy,
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{
                x: { type: "spring", stiffness: 450, damping: 28, mass: 0.6 },
                y: { type: "spring", stiffness: 450, damping: 28, mass: 0.6 },
                opacity: { duration: 0.15 },
                scale: { type: "spring", stiffness: 400, damping: 20 },
              }}
            >
              {/* Cursor arrow */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 20 20"
                fill="none"
                style={{ overflow: "visible" }}
              >
                <path
                  d="M4 2L18 10L11 12L8 18L4 2Z"
                  fill={cursor.color}
                  stroke="#13141f"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Name label */}
              <g transform="translate(16, 16)">
                <rect
                  rx="6"
                  ry="6"
                  fill="#13141f"
                  x="-4"
                  y="-11"
                  width={cursor.username.length * 7 + 14}
                  height="18"
                />
                <text
                  fill="white"
                  fontSize="9"
                  fontFamily="var(--font-sans), sans-serif"
                  fontWeight="900"
                  dx="2"
                  dy="1"
                >
                  {cursor.username}
                </text>
              </g>
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
