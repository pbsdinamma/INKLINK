"use client";

import Image from "next/image";
import { RoomForm } from "@/components/landing/RoomForm";
import { motion } from "framer-motion";
import {
  Pencil,
  Zap,
  Users,
  MessageSquare,
  Play,
  Download,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-[#13141f] flex flex-col justify-between selection:bg-brand-blue/15">
      {/* ── Top Header / Brand Bar ──────────────────────────────── */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-sm shadow-brand-blue/30">
            <Pencil className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-[#13141f]">
              Ink<span className="text-brand-blue">Link</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Collaborative Whiteboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            No sign-up required · Free & instant
          </div>
        </div>
      </header>

      {/* ── Hero Section: Intro + Form + Product Visual ─────────── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Description, Clean Feature Row & CTA Form */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Subtle Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/5 border border-brand-blue/15 rounded-full text-xs font-bold text-brand-blue w-max mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Real-time Collaborative Canvas
            </div>

            {/* Clean, Bold Heading */}
            <h2 className="text-4xl sm:text-5xl font-black text-[#13141f] tracking-tight leading-[1.1] mb-4">
              Draw, sketch & collaborate together in{" "}
              <span className="text-brand-blue">real time.</span>
            </h2>

            {/* Concise Product Description */}
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed mb-6">
              InkLink is a lightweight, real-time multiplayer whiteboard built for brainstorming, rapid sketching, and team work sessions. Jump in with zero setup — draw simultaneously, view live cursors, chat with room members, and replay board history.
            </p>

            {/* Clean Feature Highlights (Simpler, uncluttered inline icons) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-7 text-xs font-semibold text-slate-700">
              <div className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>60 FPS Sync</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>Multiplayer Cursors</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="inline-flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>Room Chat</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="inline-flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>Replay & PNG Export</span>
              </div>
            </div>

            {/* Functional & Prominent CTA Card */}
            <div className="w-full">
              <RoomForm />
            </div>
          </div>

          {/* Right Column: Authentic Product Visual (Clean, unadorned app frame) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full">
              {/* Clean App Window Frame */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden">
                {/* Minimal Window Header */}
                <div className="bg-slate-50/90 border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between select-none">
                  {/* Window dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>

                  {/* Clean URL bar */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-3 py-0.5 text-[11px] font-mono text-slate-500 shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>inklink.app/room/art-studio</span>
                  </div>

                  {/* Live status */}
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-blue">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
              </div>

              {/* Subdued Caption */}
              <p className="mt-3 text-xs font-medium text-slate-500 text-center select-none">
                Live product preview with real-time multiplayer drawing, cursors, chat, and toolbar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Clean 3-Column Feature Grid ────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-200/70">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl sm:text-3xl font-black text-[#13141f] tracking-tight">
            Built for speed and effortless collaboration
          </h3>
          <p className="text-sm font-medium text-slate-600 mt-2">
            Every feature is designed to make drawing and brainstorming with others as immediate as sketching on real paper.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
                <Pencil className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#13141f] mb-1.5">
                Responsive Canvas & Tools
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Freehand pen, precision eraser, tailored color palette, and dynamic brush sizes with smart per-user Undo/Redo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-brand-blue">
              HTML5 Canvas with 60 FPS delta syncing
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#13141f] mb-1.5">
                Live Multiplayer Cursors & Chat
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                See where everyone is pointing with color-coded live cursor labels and talk directly inside the room chat with unread notifications.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-brand-blue">
              Real-time WebSockets via Socket.IO
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
                <Play className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#13141f] mb-1.5">
                Stroke Replay & PNG Export
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch artwork unfold step-by-step with the animated replay engine, or export the full canvas as a clean PNG image.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-brand-blue">
              Server-authoritative timeline
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="w-full border-t border-slate-200/80 py-6 px-4 text-center select-none bg-white">
        <p className="text-slate-500 text-xs font-medium">
          InkLink — Open Collaborative Whiteboard · Next.js · Socket.IO · TypeScript
        </p>
      </footer>
    </main>
  );
}
