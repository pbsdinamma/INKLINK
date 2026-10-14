"use client";

import { RoomForm } from "@/components/landing/RoomForm";
import { HeroCanvasPreview } from "@/components/landing/HeroCanvasPreview";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { InkLinkLogo } from "@/components/ui/InkLinkLogo";
import { motion } from "motion/react";
import {
  Zap,
  Users,
  MessageSquare,
  Play,
  Command,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const scrollToRoom = () => {
    const el = document.getElementById("join-room");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white min-h-screen flex flex-col scroll-smooth">
      {/* ── Top Header / Main Navigation (Stitch spec) ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative shrink-0"
            >
              <InkLinkLogo size={40} priority />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                InkLink
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
                COLLABORATIVE WHITEBOARD
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#demo" className="hover:text-indigo-600 transition-colors">
              Interactive Canvas
            </a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#shortcuts" className="hover:text-indigo-600 transition-colors">
              Shortcuts
            </a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Status & Primary CTA */}
          <div className="flex items-center gap-4">
            {/* Live Instant Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-slate-900 bg-white shadow-brutal-sm text-xs font-bold text-slate-800">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>No sign-up required · Free & instant</span>
            </div>

            {/* Launch Canvas Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToRoom}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all duration-150 cursor-pointer"
            >
              Launch Canvas
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-grow">
        {/* ── Hero Section (Stitch spec) ── */}
        <section className="hero-bg-wash pt-12 pb-20 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Copy & Room Quick-Action Form */}
              <div className="lg:col-span-5 flex flex-col pt-2">
                {/* Category Tag */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide mb-6"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Real-time Collaborative Canvas</span>
                </motion.div>

                {/* Big Impact Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]"
                >
                  Draw, sketch & collaborate together in{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                    real time.
                  </span>
                </motion.h1>

                {/* Descriptive Paragraph */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
                >
                  InkLink is an open, real-time multiplayer whiteboard built for brainstorming, rapid sketching, and team work sessions. Jump in with zero setup — draw simultaneously, view live cursors, chat with room members, and replay board history.
                </motion.p>

                {/* Key Metric Micro-Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-bold text-slate-600"
                >
                  <span className="flex items-center gap-1.5 text-blue-600">
                    <Zap className="w-4 h-4" />
                    60 FPS Sync
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5 text-indigo-600">
                    <Users className="w-4 h-4" />
                    Multiplayer Cursors
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <MessageSquare className="w-4 h-4" />
                    Room Chat
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5 text-orange-600">
                    <Play className="w-4 h-4" />
                    Replay & PNG Export
                  </span>
                </motion.div>

                {/* Room Quick-Action Card with Neo-Brutalist Frame */}
                <div id="join-room" className="mt-8">
                  <RoomForm />
                </div>
              </div>

              {/* Right Column: Interactive Canvas Preview Window (from Stitch) */}
              <div className="lg:col-span-7 flex flex-col items-center" id="demo">
                <HeroCanvasPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Grid Section (Stitch Bento spec) ── */}
        <section className="py-24 bg-white border-b border-slate-200" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header badge & headline */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4">
                ENGINEERED FOR CREATORS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Built for speed and effortless collaboration
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                Every feature is designed to make drawing and brainstorming with others as immediate as sketching on real paper.
              </p>
            </div>

            {/* 3 Distinct Feature Cards from Stitch */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Card 1: 60 FPS Freehand Sync */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="bg-white rounded-3xl border-2 border-slate-900 p-8 shadow-brutal flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-6 shadow-sm">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    60 FPS Freehand Sync
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Quadratic bezier curves interpolate raw pointer movement into buttery smooth ink lines without jagged steps or dropped frames.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-blue-600">HTML5 Canvas 2D</span>
                  <span className="text-blue-600">Ultra Low Latency</span>
                </div>
              </motion.article>

              {/* Card 2: Multiplayer Cursors & Chat */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="bg-white rounded-3xl border-2 border-slate-900 p-8 shadow-brutal flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-6 shadow-sm">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    Multiplayer Cursors & Chat
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    See teammate cursors glide in real-time with spring interpolation. Send instant messages and react with 1-tap quick emoji pills.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-600">Socket.IO Broadcasting</span>
                  <span className="text-emerald-600">Online Presence</span>
                </div>
              </motion.article>

              {/* Card 3: Canvas History Replay */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="bg-white rounded-3xl border-2 border-slate-900 p-8 shadow-brutal flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white mb-6 shadow-sm">
                    <Play className="w-7 h-7 fill-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    Canvas History Replay
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Watch diagrams and sketches materialize stroke-by-stroke. Perfect for design presentations, tutorials, and step-by-step walkthroughs.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-orange-600">Timeline Engine</span>
                  <span className="text-orange-600">Export as PNG</span>
                </div>
              </motion.article>
            </div>

            {/* Power-User Keyboard Shortcuts Strip from Stitch */}
            <div
              id="shortcuts"
              className="bg-white rounded-2xl border-2 border-slate-900 p-4 sm:p-5 shadow-brutal flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-800"
            >
              <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                <Command className="w-4 h-4" />
                <span>Power User Shortcuts:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                  P
                </kbd>
                <span className="text-slate-600">Pen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                  E
                </kbd>
                <span className="text-slate-600">Eraser</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                  Ctrl+Z
                </kbd>
                <span className="text-slate-600">Undo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                  Ctrl+Y
                </kbd>
                <span className="text-slate-600">Redo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                  D
                </kbd>
                <span className="text-slate-600">Save PNG</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                  R
                </kbd>
                <span className="text-slate-600">Replay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900">
                  [ / ]
                </kbd>
                <span className="text-slate-600">Brush Size</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section (Stitch spec) ── */}
        <section className="py-24 bg-[#f8fafc]" id="faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold tracking-widest uppercase mb-4">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Everything you need to know
              </h2>
              <p className="mt-3 text-slate-600 text-base font-medium">
                Clear, straightforward answers about how InkLink works under the hood.
              </p>
            </div>

            <FaqAccordion />
          </div>
        </section>
      </main>

      {/* ── Main Footer (Stitch spec) ── */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo and summary */}
            <div className="flex items-center gap-3">
              <InkLinkLogo size={32} />
              <span className="text-lg font-bold text-slate-900">InkLink</span>
              <span className="text-xs text-slate-400">
                © 2026 InkLink. Real-time digital ideation.
              </span>
            </div>
            {/* Links */}
            <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Security
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 transition-colors flex items-center gap-1 text-slate-800"
              >
                <span>GitHub v2.4</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
