"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, User, KeyRound } from "lucide-react";

export function RoomForm({ className }: { className?: string } = {}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState<"create" | "join">("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your name!");
      return;
    }

    if (mode === "join" && !joinCode.trim()) {
      setError("Please enter a room invite code!");
      return;
    }

    setLoading(true);
    const roomId =
      mode === "create" ? nanoid(8) : joinCode.trim().toUpperCase();

    router.push(
      `/room/${roomId}?username=${encodeURIComponent(username.trim())}`
    );
  };

  return (
    <div className={className ?? "w-full relative select-none"}>
      {/* Clean, prominent card */}
      <motion.div
        layout
        className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 relative"
      >
        {/* Sleek Tab Switcher */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl mb-5 relative">
          {(["create", "join"] as const).map((m) => {
            const isActive = mode === m;
            return (
              <motion.button
                key={m}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors relative z-10 cursor-pointer ${
                  isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="roomModeSlider"
                    className="absolute inset-0 bg-brand-blue rounded-lg -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                {m === "create" ? "Create New Room" : "Join Existing Room"}
              </motion.button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nickname Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 text-left">
              Your Nickname
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. InkyPanda..."
                maxLength={20}
                className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Join Code (Conditional with smooth transition) */}
          <AnimatePresence mode="popLayout">
            {mode === "join" && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.96 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="block text-xs font-bold text-slate-700 text-left">
                  Room Invite Code
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE..."
                    maxLength={16}
                    className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono font-bold tracking-wider uppercase text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message with Bouncy Spring Shake */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  x: [0, -6, 6, -4, 4, -2, 2, 0],
                }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="text-rose-600 text-xs font-bold bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Action Button with Spring Hover & Tap */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-full group bg-brand-blue hover:bg-brand-blue/95 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand-blue/20 hover:shadow-lg hover:shadow-brand-blue/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <span className="text-sm font-bold">
                  {mode === "create" ? "Create Room & Start Drawing" : "Join Canvas Room"}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
