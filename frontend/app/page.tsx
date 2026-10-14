"use client";

import Image from "next/image";
import { RoomForm } from "@/components/landing/RoomForm";
import { motion } from "motion/react";
import {
  Pencil,
  Zap,
  Users,
  MessageSquare,
  Play,
  ShieldCheck,
  Sparkles,
  Command,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-[#13141f] flex flex-col justify-between selection:bg-brand-blue/15 relative overflow-hidden bg-brand-bg">
      {/* ── Ambient Floating Glows & Doodles (Motion.dev subtle background depth) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -right-24 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl"
        />

        {/* Playful Floating Background Doodles */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 12, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 left-8 md:left-20 w-10 h-10 border-3 border-brand-orange rounded-xl opacity-20"
        />
        <motion.div
          animate={{
            y: [0, 22, 0],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-12 md:left-28 w-14 h-14 border-3 border-brand-blue rounded-full opacity-15"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 18, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-48 right-8 md:right-24 w-12 h-12 border-3 border-brand-green rounded-2xl opacity-20"
        />
      </div>

      {/* ── Top Header / Brand Bar ──────────────────────────────── */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: [-2, 4, -2] }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-[0_3px_0px_#13141f] border-2 border-brand-border cursor-pointer"
          >
            <Pencil className="w-5 h-5" />
          </motion.div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-[#13141f]">
              Ink<span className="text-brand-blue">Link</span>
            </h1>
            <p className="text-[10px] font-black text-brand-border/40 uppercase tracking-wider mt-0.5">
              Collaborative Whiteboard
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="flex items-center gap-3"
        >
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border-2 border-brand-border rounded-full text-xs font-black text-brand-border shadow-[0_2.5px_0px_#13141f]">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            No sign-up required · Free & instant
          </div>
        </motion.div>
      </header>

      {/* ── Hero Section: Intro + Form + Product Visual ─────────── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Description, Clean Feature Row & CTA Form */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 border-2 border-brand-blue/30 rounded-full text-xs font-black text-brand-blue w-max mb-4 shadow-[0_2px_0px_rgba(30,107,241,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Real-time Collaborative Canvas
            </motion.div>

            {/* Clean, Bold Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-4xl sm:text-5xl font-black text-[#13141f] tracking-tight leading-[1.1] mb-4"
            >
              Draw, sketch & collaborate together in{" "}
              <span className="text-brand-blue underline decoration-brand-orange decoration-wavy decoration-3 underline-offset-4">
                real time.
              </span>
            </motion.h2>

            {/* Product Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="text-brand-border/70 text-sm sm:text-base font-bold leading-relaxed mb-6"
            >
              InkLink is a lightweight, real-time multiplayer whiteboard built for brainstorming, rapid sketching, and team work sessions. Jump in with zero setup — draw simultaneously, view live cursors, chat with room members, and replay board history.
            </motion.p>

            {/* Clean Feature Highlights with Staggered Entrance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-7 text-xs font-black text-brand-border"
            >
              <div className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>60 FPS Sync</span>
              </div>
              <span className="text-brand-border/30">•</span>
              <div className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>Multiplayer Cursors</span>
              </div>
              <span className="text-brand-border/30">•</span>
              <div className="inline-flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>Room Chat</span>
              </div>
              <span className="text-brand-border/30">•</span>
              <div className="inline-flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>Replay & PNG Export</span>
              </div>
            </motion.div>

            {/* Functional & Prominent CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.28 }}
              className="w-full"
            >
              <RoomForm />
            </motion.div>
          </div>

          {/* Right Column: Authentic Product Visual (Clean, unadorned app frame with subtle float) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col items-center"
          >
            <div className="w-full">
              {/* Clean App Window Frame */}
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white border-3 border-brand-border rounded-[24px] shadow-[0_12px_0px_#13141f] overflow-hidden"
              >
                {/* Minimal Window Header */}
                <div className="bg-[#fbfcfe] border-b-2 border-brand-border px-4 py-3 flex items-center justify-between select-none">
                  {/* Window dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-brand-pink border border-brand-border" />
                    <span className="w-3 h-3 rounded-full bg-brand-orange border border-brand-border" />
                    <span className="w-3 h-3 rounded-full bg-brand-green border border-brand-border" />
                  </div>

                  {/* Clean URL bar */}
                  <div className="flex items-center gap-1.5 bg-brand-bg border-2 border-brand-border/30 rounded-lg px-3 py-1 text-[11px] font-mono text-brand-border font-bold">
                    <ShieldCheck className="w-3 h-3 text-brand-green" />
                    <span>inklink.app/room/art-studio</span>
                  </div>

                  {/* Live status with pulsing badge */}
                  <div className="flex items-center gap-1.5 text-[11px] font-black text-brand-blue">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    <span>Live Session</span>
                  </div>
                </div>

                {/* Actual Product Screenshot */}
                <div className="relative w-full aspect-[16/9] bg-slate-100 overflow-hidden">
                  <Image
                    src="/whiteboard-preview.png"
                    alt="InkLink Real-time Collaborative Whiteboard"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-top select-none"
                  />
                </div>
              </motion.div>

              {/* Subdued Caption */}
              <p className="mt-4 text-xs font-bold text-brand-border/50 text-center select-none">
                Live product preview with real-time multiplayer drawing, cursors, chat, and toolbar.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Clean 3-Column Feature Grid with Viewport Reveal ───── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t-2 border-brand-border/10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-2xl sm:text-3xl font-black text-[#13141f] tracking-tight">
            Built for speed and effortless collaboration
          </h3>
          <p className="text-sm font-bold text-brand-border/60 mt-2">
            Every feature is designed to make drawing and brainstorming with others as immediate as sketching on real paper.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.05 }}
            className="skribbl-card p-6 flex flex-col justify-between cursor-default bg-white shadow-[0_6px_0px_#13141f]"
          >
            <div>
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                transition={{ type: "spring", stiffness: 450, damping: 14 }}
                className="w-12 h-12 rounded-2xl bg-brand-blue text-white border-2 border-brand-border flex items-center justify-center mb-4 shadow-[0_3px_0px_#13141f]"
              >
                <Pencil className="w-5 h-5" />
              </motion.div>
              <h4 className="text-base font-black text-[#13141f] mb-1.5">
                Responsive Canvas & Tools
              </h4>
              <p className="text-xs text-brand-border/70 font-bold leading-relaxed">
                Freehand pen, precision eraser, custom color picker, and dynamic brush sizes with smart per-user Undo/Redo.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-2 border-brand-border/10 text-[11px] font-black text-brand-blue">
              HTML5 Canvas with 60 FPS delta syncing
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.15 }}
            className="skribbl-card p-6 flex flex-col justify-between cursor-default bg-white shadow-[0_6px_0px_#13141f]"
          >
            <div>
              <motion.div
                whileHover={{ scale: 1.15, rotate: 8 }}
                transition={{ type: "spring", stiffness: 450, damping: 14 }}
                className="w-12 h-12 rounded-2xl bg-brand-green text-white border-2 border-brand-border flex items-center justify-center mb-4 shadow-[0_3px_0px_#13141f]"
              >
                <Users className="w-5 h-5" />
              </motion.div>
              <h4 className="text-base font-black text-[#13141f] mb-1.5">
                Live Multiplayer Cursors & Chat
              </h4>
              <p className="text-xs text-brand-border/70 font-bold leading-relaxed">
                See where everyone is pointing with color-coded live cursor labels and talk directly inside the room chat with quick emoji reactions.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-2 border-brand-border/10 text-[11px] font-black text-brand-green">
              Real-time WebSockets via Socket.IO
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.25 }}
            className="skribbl-card p-6 flex flex-col justify-between cursor-default bg-white shadow-[0_6px_0px_#13141f]"
          >
            <div>
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                transition={{ type: "spring", stiffness: 450, damping: 14 }}
                className="w-12 h-12 rounded-2xl bg-brand-orange text-white border-2 border-brand-border flex items-center justify-center mb-4 shadow-[0_3px_0px_#13141f]"
              >
                <Play className="w-5 h-5" />
              </motion.div>
              <h4 className="text-base font-black text-[#13141f] mb-1.5">
                Stroke Replay & PNG Export
              </h4>
              <p className="text-xs text-brand-border/70 font-bold leading-relaxed">
                Watch artwork unfold step-by-step with the animated replay engine, or export the full canvas as a clean PNG image.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-2 border-brand-border/10 text-[11px] font-black text-brand-orange">
              Server-authoritative timeline
            </div>
          </motion.div>
        </div>

        {/* ── Built-in Keyboard Shortcuts Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-4 bg-white border-2 border-brand-border rounded-2xl shadow-[0_4px_0px_#13141f] flex flex-wrap items-center justify-center gap-4 text-xs font-black text-brand-border select-none"
        >
          <div className="flex items-center gap-1.5 text-brand-blue">
            <Command className="w-4 h-4" />
            <span>Keyboard Shortcuts:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-brand-bg rounded border-2 border-brand-border font-mono text-[10px]">P</kbd> Pen</span>
            <span><kbd className="px-1.5 py-0.5 bg-brand-bg rounded border-2 border-brand-border font-mono text-[10px]">E</kbd> Eraser</span>
            <span><kbd className="px-1.5 py-0.5 bg-brand-bg rounded border-2 border-brand-border font-mono text-[10px]">Ctrl+Z</kbd> Undo</span>
            <span><kbd className="px-1.5 py-0.5 bg-brand-bg rounded border-2 border-brand-border font-mono text-[10px]">Ctrl+Y</kbd> Redo</span>
            <span><kbd className="px-1.5 py-0.5 bg-brand-bg rounded border-2 border-brand-border font-mono text-[10px]">D</kbd> Save PNG</span>
            <span><kbd className="px-1.5 py-0.5 bg-brand-bg rounded border-2 border-brand-border font-mono text-[10px]">R</kbd> Replay</span>
            <span><kbd className="px-1.5 py-0.5 bg-brand-bg rounded border-2 border-brand-border font-mono text-[10px]">[ / ]</kbd> Brush Size</span>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="w-full border-t-2 border-brand-border/10 py-6 px-4 text-center select-none bg-white">
        <p className="text-brand-border/60 text-xs font-black">
          InkLink — Open Collaborative Whiteboard · Next.js · Motion.dev · Socket.IO · TypeScript
        </p>
      </footer>
    </main>
  );
}
