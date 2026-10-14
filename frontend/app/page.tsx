"use client";

import { RoomForm } from "@/components/landing/RoomForm";
import { HeroCanvasPreview } from "@/components/landing/HeroCanvasPreview";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { InkLinkLogo } from "@/components/ui/InkLinkLogo";
import { motion } from "motion/react";
import {
  Pencil,
  Zap,
  Users,
  MessageSquare,
  Play,
  Sparkles,
  Command,
  Palette,
  Clock,
  Layers,
  Heart,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-[#13141f] flex flex-col justify-between selection:bg-brand-blue/15 relative overflow-hidden bg-brand-bg">
      {/* ── Ambient Floating Glows & Doodles (Motion.dev background depth) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -right-24 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl"
        />

        {/* Playful Floating Doodles with Sine Wave Springs */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 12, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 left-8 md:left-20 w-10 h-10 border-3 border-brand-orange rounded-xl opacity-25"
        />
        <motion.div
          animate={{
            y: [0, 22, 0],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-12 md:left-28 w-14 h-14 border-3 border-brand-blue rounded-full opacity-20"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 18, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-48 right-8 md:right-24 w-12 h-12 border-3 border-brand-green rounded-2xl opacity-25"
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
            whileHover={{ scale: 1.08, rotate: [-2, 3, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="cursor-pointer shrink-0"
          >
            <InkLinkLogo size={46} priority />
          </motion.div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-[#13141f]">
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
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-brand-border rounded-full text-xs font-black text-brand-border shadow-[0_3px_0px_#13141f]">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
            No sign-up required · Free & instant
          </div>
        </motion.div>
      </header>

      {/* ── Hero Section: Intro + Form + Live Interactive Preview ─── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Description, Feature Badges & CTA Form */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-blue/10 border-2 border-brand-blue/30 rounded-full text-xs font-black text-brand-blue w-max mb-4 shadow-[0_2px_0px_rgba(30,107,241,0.2)]"
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
              InkLink is an open, real-time multiplayer whiteboard built for brainstorming, rapid sketching, and team work sessions. Jump in with zero setup — draw simultaneously, view live cursors, chat with room members, and replay board history.
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

            {/* Prominent CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.28 }}
              className="w-full"
            >
              <RoomForm />
            </motion.div>
          </div>

          {/* Right Column: Live Interactive Drawing Canvas Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col items-center"
          >
            <HeroCanvasPreview />
          </motion.div>
        </div>
      </div>

      {/* ── Modern Stitch Bento Grid Feature Showcase ─────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t-2 border-brand-border/10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="px-3.5 py-1 bg-brand-green/10 border-2 border-brand-green/30 text-brand-green text-xs font-black rounded-full uppercase tracking-wider mb-3 inline-block">
            Engineered For Creators
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-[#13141f] tracking-tight mt-1">
            Built for speed and effortless collaboration
          </h3>
          <p className="text-sm font-bold text-brand-border/60 mt-2">
            Every feature is designed to make drawing and brainstorming with others as immediate as sketching on real paper.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: 60 FPS Delta Syncing */}
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
                <Zap className="w-6 h-6" />
              </motion.div>
              <h4 className="text-lg font-black text-[#13141f] mb-2">
                60 FPS Freehand Sync
              </h4>
              <p className="text-xs text-brand-border/70 font-bold leading-relaxed">
                Quadratic bezier curves interpolate raw pointer movement into buttery smooth ink lines without jagged steps or dropped frames.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-2 border-brand-border/10 flex items-center justify-between text-[11px] font-black text-brand-blue">
              <span>HTML5 Canvas 2D</span>
              <span>Ultra Low Latency</span>
            </div>
          </motion.div>

          {/* Bento Card 2: Live Multiplayer Presence */}
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
                <Users className="w-6 h-6" />
              </motion.div>
              <h4 className="text-lg font-black text-[#13141f] mb-2">
                Multiplayer Cursors & Chat
              </h4>
              <p className="text-xs text-brand-border/70 font-bold leading-relaxed">
                See teammate cursors glide in real-time with spring interpolation. Send instant messages and react with 1-tap quick emoji pills.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-2 border-brand-border/10 flex items-center justify-between text-[11px] font-black text-brand-green">
              <span>Socket.IO Broadcasting</span>
              <span>Online Presence</span>
            </div>
          </motion.div>

          {/* Bento Card 3: Time Machine Replay */}
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
                <Play className="w-6 h-6" />
              </motion.div>
              <h4 className="text-lg font-black text-[#13141f] mb-2">
                Canvas History Replay
              </h4>
              <p className="text-xs text-brand-border/70 font-bold leading-relaxed">
                Watch diagrams and sketches materialize stroke-by-stroke. Perfect for design presentations, tutorials, and step-by-step walkthroughs.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t-2 border-brand-border/10 flex items-center justify-between text-[11px] font-black text-brand-orange">
              <span>Timeline Engine</span>
              <span>Export as PNG</span>
            </div>
          </motion.div>
        </div>

        {/* ── Built-in Keyboard Shortcuts Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-4 bg-white border-3 border-brand-border rounded-2xl shadow-[0_4px_0px_#13141f] flex flex-wrap items-center justify-center gap-4 text-xs font-black text-brand-border select-none"
        >
          <div className="flex items-center gap-1.5 text-brand-blue">
            <Command className="w-4 h-4" />
            <span>Power User Shortcuts:</span>
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

      {/* ── Frequently Asked Questions (Interactive Accordion) ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t-2 border-brand-border/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="px-3.5 py-1 bg-brand-orange/10 border-2 border-brand-orange/30 text-brand-orange text-xs font-black rounded-full uppercase tracking-wider mb-3 inline-block">
            Frequently Asked Questions
          </span>
          <h3 className="text-3xl font-black text-[#13141f] tracking-tight mt-1">
            Everything you need to know
          </h3>
          <p className="text-sm font-bold text-brand-border/60 mt-2">
            Clear, straightforward answers about how InkLink works under the hood.
          </p>
        </div>

        <FaqAccordion />
      </section>

      {/* ── Final Call to Action ── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="skribbl-card bg-gradient-to-r from-brand-blue to-[#4f46e5] text-white p-8 sm:p-12 rounded-[32px] text-center shadow-[0_10px_0px_#13141f] border-4 border-[#13141f]"
        >
          <h3 className="text-3xl sm:text-4xl font-black mb-3">
            Ready to sketch ideas together?
          </h3>
          <p className="text-white/80 text-sm sm:text-base font-bold max-w-xl mx-auto mb-6">
            No registration, no credit card, no waiting. Spin up a room in 3 seconds and send the link to your team.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-6 py-3.5 bg-white text-brand-border font-black text-sm rounded-2xl border-3 border-brand-border shadow-[0_4px_0px_#13141f] hover:bg-[#ffdf00] transition-colors cursor-pointer"
          >
            Create Your First Room ↑
          </button>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="w-full border-t-2 border-brand-border/10 py-6 px-4 text-center select-none bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-black text-brand-border/60">
          <div className="flex items-center gap-2">
            <span>InkLink Whiteboard</span>
            <span>•</span>
            <span>Built with Next.js, Motion.dev & Socket.IO</span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-border">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
            <span>for creative teams</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
