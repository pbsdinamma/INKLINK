"use client";

import Image from "next/image";
import { RoomForm } from "@/components/landing/RoomForm";
import { motion } from "framer-motion";
import {
  Pencil,
  Sparkles,
  Users,
  MessageSquare,
  Play,
  Download,
  Zap,
  ShieldCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-[#13141f] relative overflow-x-hidden flex flex-col justify-between">
      {/* ── Playful Floating Doodles (Background) ──────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 12, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-8 md:left-20 w-14 h-14 border-4 border-[#ff7e1b] rounded-2xl opacity-25"
        />
        <motion.div
          animate={{
            y: [0, 22, 0],
            rotate: [0, -14, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-28 left-16 md:left-36 w-16 h-16 border-4 border-[#1e6bf1] rounded-full opacity-20"
        />
        <motion.div
          animate={{
            y: [0, -26, 0],
            rotate: [0, 18, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-36 right-8 md:right-28 w-14 h-14 border-4 border-[#00c853] rounded-[14px] opacity-25"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-36 right-16 md:right-40 w-14 h-14 border-4 border-[#ffdf00] rounded-full opacity-30"
        />
      </div>

      {/* ── Top Header / Brand Bar ──────────────────────────────── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -6 }}
            className="w-11 h-11 bg-[#1e6bf1] border-3 border-[#13141f] rounded-2xl shadow-[0_4px_0px_#13141f] flex items-center justify-center cursor-pointer"
          >
            <Pencil className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none text-[#13141f]">
              Ink<span className="text-[#1e6bf1]">Link</span>
            </h1>
            <p className="text-[10px] font-black text-[#13141f]/50 uppercase tracking-widest mt-0.5">
              Multiplayer Whiteboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-[#13141f] rounded-full text-xs font-black shadow-[0_2px_0px_#13141f] text-[#00c853]">
            <span className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
            100% Free · No Sign-Up Needed
          </div>
        </div>
      </header>

      {/* ── Main Hero Section: Description + Form + Demo Image ──── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Description, Key Highlights & Form */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f3f7ff] border-3 border-[#13141f] rounded-full text-xs font-black text-[#1e6bf1] shadow-[0_3px_0px_#13141f] w-max mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#ff7e1b]" />
              Real-time Collaborative Canvas
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-5xl font-black text-[#13141f] tracking-tight leading-[1.08] mb-4 select-none"
            >
              Draw, sketch & collaborate together in{" "}
              <span className="text-[#1e6bf1] underline decoration-[#ffdf00] decoration-wavy decoration-2">
                real time.
              </span>
            </motion.h2>

            {/* Clear Short Description of What the Website Does */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-[#13141f]/75 text-sm sm:text-base font-bold leading-relaxed mb-6 select-none"
            >
              <strong>InkLink</strong>{" "}is a fast, interactive multiplayer whiteboard designed for friends, teams, and creatives. Draw together simultaneously with zero lag, chat in live rooms, see everyone&apos;s real-time cursors, replay your canvas history stroke-by-stroke, and export your creations instantly.
            </motion.p>

            {/* Quick Feature Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="grid grid-cols-2 gap-2.5 mb-8 text-xs font-black text-[#13141f]/80"
            >
              <div className="flex items-center gap-2 p-2 bg-white/80 border-2 border-[#13141f] rounded-xl shadow-[0_2px_0px_#13141f]">
                <Zap className="w-3.5 h-3.5 text-[#ff7e1b] shrink-0" />
                <span>60 FPS Live Sync</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/80 border-2 border-[#13141f] rounded-xl shadow-[0_2px_0px_#13141f]">
                <Users className="w-3.5 h-3.5 text-[#1e6bf1] shrink-0" />
                <span>Multiplayer Cursors</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/80 border-2 border-[#13141f] rounded-xl shadow-[0_2px_0px_#13141f]">
                <MessageSquare className="w-3.5 h-3.5 text-[#ff5c8a] shrink-0" />
                <span>Built-in Room Chat</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/80 border-2 border-[#13141f] rounded-xl shadow-[0_2px_0px_#13141f]">
                <Play className="w-3.5 h-3.5 text-[#00c853] shrink-0" />
                <span>Drawing Replay</span>
              </div>
            </motion.div>

            {/* Join / Create Room Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.3 }}
              className="w-full"
            >
              <RoomForm />
            </motion.div>
          </div>

          {/* Right Column: Live Demo Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.25 }}
            className="lg:col-span-7 flex flex-col items-center"
          >
            <div className="w-full relative group">
              {/* Playful Floating Tags around Demo Window */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3.5 right-6 z-20 flex items-center gap-2 bg-[#ffdf00] text-[#13141f] border-3 border-[#13141f] rounded-full px-3.5 py-1 text-xs font-black shadow-[0_3px_0px_#13141f]"
              >
                <Users className="w-3.5 h-3.5" />
                <span>3 Players Online Now</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-3.5 left-6 z-20 hidden sm:flex items-center gap-2 bg-[#ff5c8a] text-white border-3 border-[#13141f] rounded-full px-3.5 py-1 text-xs font-black shadow-[0_3px_0px_#13141f]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time Multi-Cursor Sync</span>
              </motion.div>

              {/* Browser Window Mockup Frame */}
              <div className="bg-white border-4 border-[#13141f] rounded-[28px] shadow-[0_12px_0px_#13141f] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                {/* Browser Title Bar */}
                <div className="bg-[#f0f4ff] border-b-3 border-[#13141f] px-4 py-2.5 flex items-center justify-between select-none">
                  {/* Traffic light buttons */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5c8a] border-2 border-[#13141f]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffdf00] border-2 border-[#13141f]" />
                    <span className="w-3 h-3 rounded-full bg-[#00c853] border-2 border-[#13141f]" />
                  </div>

                  {/* Browser URL pill */}
                  <div className="flex items-center gap-1.5 bg-white border-2 border-[#13141f] rounded-lg px-4 py-0.5 text-[11px] font-black text-[#13141f]/60 font-mono shadow-[0_1.5px_0px_#13141f]">
                    <ShieldCheck className="w-3 h-3 text-[#00c853]" />
                    <span>inklink.app/room/demo-room</span>
                  </div>

                  {/* Live sync badge */}
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#1e6bf1]">
                    <span className="w-2 h-2 rounded-full bg-[#1e6bf1] animate-ping" />
                    <span>LIVE</span>
                  </div>
                </div>

                {/* Actual Demo Screenshot showing the full page with 3 users */}
                <div className="relative w-full aspect-[16/9] bg-white overflow-hidden">
                  <Image
                    src="/demo-preview.png"
                    alt="InkLink Real-Time Collaborative Whiteboard with Multiple Users"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-top select-none"
                  />
                </div>
              </div>
            </div>

            {/* Caption under demo image */}
            <p className="mt-4 text-xs font-bold text-[#13141f]/60 text-center select-none">
              👆 Live preview: Collaborative drawing, player roster, room chat, and full tool suite.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Feature Cards Row ──────────────────────────────────── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-black text-[#13141f] tracking-tight">
            Everything you need for creative teamwork
          </h3>
          <p className="text-sm font-bold text-[#13141f]/60 mt-1">
            Built from the ground up for speed, fun, and seamless collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="skribbl-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1e6bf1]/10 border-3 border-[#13141f] flex items-center justify-center text-[#1e6bf1] mb-4 shadow-[0_3px_0px_#13141f]">
                <Pencil className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-[#13141f] mb-2">
                Expressive Canvas & Tools
              </h4>
              <p className="text-xs font-bold text-[#13141f]/70 leading-relaxed">
                Freehand pen, precision eraser, playful color swatches, adjustable brush sizes, and smart per-user Undo/Redo controls with keyboard shortcut support.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-[#13141f]/10 text-[11px] font-black text-[#1e6bf1]">
              Full HTML5 Canvas Performance →
            </div>
          </div>

          {/* Card 2 */}
          <div className="skribbl-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ff7e1b]/10 border-3 border-[#13141f] flex items-center justify-center text-[#ff7e1b] mb-4 shadow-[0_3px_0px_#13141f]">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-[#13141f] mb-2">
                Multiplayer Rooms & Chat
              </h4>
              <p className="text-xs font-bold text-[#13141f]/70 leading-relaxed">
                Share an instant room link to invite anyone. Track other players&apos; cursors live with colorful labels, and discuss ideas using the built-in room chat with unread notifications.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-[#13141f]/10 text-[11px] font-black text-[#ff7e1b]">
              Real-time WebSockets via Socket.IO →
            </div>
          </div>

          {/* Card 3 */}
          <div className="skribbl-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#00c853]/10 border-3 border-[#13141f] flex items-center justify-center text-[#00c853] mb-4 shadow-[0_3px_0px_#13141f]">
                <Play className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-[#13141f] mb-2">
                Stroke Replay & PNG Export
              </h4>
              <p className="text-xs font-bold text-[#13141f]/70 leading-relaxed">
                Watch drawings come to life with an animated stroke-by-stroke replay engine, complete with pause and stop controls. Download your artwork in high-resolution PNG format anytime.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-[#13141f]/10 text-[11px] font-black text-[#00c853]">
              Instant One-Click Download →
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full border-t-3 border-[#13141f]/10 py-6 px-4 text-center select-none bg-white/40">
        <p className="text-[#13141f]/60 text-xs font-black tracking-wide">
          InkLink — Collaborative Whiteboard · Next.js · Socket.IO · TypeScript · HTML5 Canvas
        </p>
      </footer>
    </main>
  );
}
