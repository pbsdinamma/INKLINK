"use client";

import { RoomForm } from "@/components/landing/RoomForm";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-[#13141f] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* ── Playful Floating Doodles (Background) ──────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Floating Shapes */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 md:left-24 w-12 h-12 border-4 border-[#ff7e1b] rounded-xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-20 md:left-40 w-16 h-16 border-4 border-[#1e6bf1] rounded-full opacity-20"
        />
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 20, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-40 right-10 md:right-32 w-14 h-14 border-4 border-[#00c853] rounded-[12px] opacity-25"
        />
        <motion.div
          animate={{
            y: [0, 18, 0],
            rotate: [0, -8, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-32 right-20 md:right-48 w-12 h-12 border-4 border-[#ffdf00] rounded-full opacity-35"
        />
      </div>

      {/* ── Main Landing Box ───────────────────────────────────── */}
      <div className="relative w-full max-w-md text-center z-10">
        {/* Playful bouncing logo */}
        <motion.div
          initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 6, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 15 }}
          whileHover={{ rotate: 0, scale: 1.05 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-[#1e6bf1] border-4 border-[#13141f] rounded-[22px] shadow-[0_6px_0px_#13141f] mb-6 cursor-pointer"
        >
          <Pencil className="w-10 h-10 text-white" />
        </motion.div>

        {/* Big playful title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="text-5xl md:text-6xl font-black mb-3 select-none text-[#13141f] tracking-tight leading-none"
        >
          Ink<span className="text-[#1e6bf1]">Link</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#13141f]/60 text-sm md:text-base font-black max-w-xs mx-auto mb-10 leading-relaxed select-none"
        >
          Draw, sketch, and play with friends in real time. Fast, free, and instant! 🎨
        </motion.p>

        {/* Joining form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.3 }}
        >
          <RoomForm />
        </motion.div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.6 }}
        className="relative mt-16 text-[#13141f]/40 text-xs font-black select-none tracking-wide"
      >
        Next.js · Socket.IO · HTML5 Canvas
      </motion.p>
    </main>
  );
}
