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
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                style={{ overflow: "visible" }}
              >
                <path
                  d="M4.5 2.5L20 11.5L12 14.5L8.5 21.5L4.5 2.5Z"
                  fill={cursor.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Name label pill */}
              <g transform="translate(14, 14)">
                <rect
                  rx="9"
                  ry="9"
                  fill={cursor.color}
                  x="-2"
                  y="-10"
                  width={cursor.username.length * 6.8 + 16}
                  height="18"
                />
                <text
                  fill="white"
                  fontSize="9.5"
                  fontFamily="var(--font-sans), sans-serif"
                  fontWeight="700"
                  dx="6"
                  dy="2.5"
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
