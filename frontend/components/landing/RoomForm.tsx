"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, User, KeyRound, RefreshCw } from "lucide-react";

const ADJECTIVES = ["Inky", "Swift", "Cosmic", "Pixel", "Buttery", "Vibrant", "Agile"];
const NOUNS = ["Panda", "Falcon", "Fox", "Nib", "Otter", "Doodle", "Spark"];

export function RoomForm({ className }: { className?: string } = {}) {
  const router = useRouter();
  const [username, setUsername] = useState("InkyPanda...");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState<"create" | "join">("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShuffleName = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 89 + 10);
    setUsername(`${adj}${noun}${num}`);
    setError("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || username === "InkyPanda...") {
      setError("Please enter your nickname!");
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
      {/* Room Quick-Action Card with Neo-Brutalist Frame matching Stitch spec */}
      <div className="bg-white border-[2.5px] border-slate-900 rounded-3xl p-6 shadow-brutal transition-all">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("create");
              setError("");
            }}
            className={`py-2.5 rounded-lg transition-all text-center cursor-pointer ${
              mode === "create"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Create New Room
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("join");
              setError("");
            }}
            className={`py-2.5 rounded-lg transition-all text-center cursor-pointer ${
              mode === "join"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Join Existing Room
          </button>
        </div>

        {/* Input Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nickname Input Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <label htmlFor="nickname" className="tracking-wide">
                Your Nickname
              </label>
              <button
                type="button"
                onClick={handleShuffleName}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold text-xs cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Random</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="nickname"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => {
                  if (username === "InkyPanda...") setUsername("");
                }}
                placeholder="e.g. InkyPanda..."
                maxLength={20}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-0 text-slate-800 font-semibold placeholder:text-slate-400 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Join Code (Shown only in Join mode) */}
          <AnimatePresence mode="popLayout">
            {mode === "join" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label
                  htmlFor="joinCode"
                  className="block text-xs font-bold text-slate-800 tracking-wide text-left"
                >
                  Room Invite Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    id="joinCode"
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="e.g. 47R7WZJQ"
                    maxLength={16}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-0 text-slate-800 font-mono font-bold placeholder:text-slate-400 text-sm uppercase tracking-wider outline-none transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-left"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Big Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm text-base cursor-pointer disabled:opacity-50"
          >
            <span>
              {loading
                ? "Connecting..."
                : mode === "create"
                ? "Create Room & Start Drawing"
                : "Join Room"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
