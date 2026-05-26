"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Users } from "lucide-react";

export function RoomForm() {
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
    <div className="w-full max-w-md mx-auto relative select-none">
      {/* Playful Floating Badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <div className="flex items-center gap-1.5 bg-white border-3 border-[#13141f] rounded-full px-4 py-1.5 text-xs font-black shadow-[0_3px_0px_#13141f] text-[#1e6bf1]">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          Real-time Drawing
        </div>
        <div className="flex items-center gap-1.5 bg-white border-3 border-[#13141f] rounded-full px-4 py-1.5 text-xs font-black shadow-[0_3px_0px_#13141f] text-[#ff7e1b]">
          <Users className="w-3.5 h-3.5 shrink-0" />
          Multiplayer Rooms
        </div>
      </div>

      {/* Main card */}
      <motion.div
        layout
        className="bg-white border-4 border-[#13141f] rounded-[24px] p-8 shadow-[0_8px_0px_#13141f] relative overflow-hidden"
      >
        {/* Playful Tab Toggles */}
        <div className="flex bg-[#f3f7ff] border-3 border-[#13141f] rounded-2xl p-1 mb-6 relative">
          {(["create", "join"] as const).map((m) => {
            const isActive = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-xl text-sm font-black capitalize transition-all relative z-10 cursor-pointer"
                style={{ color: isActive ? "#ffffff" : "#13141f" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="modeSlider"
                    className="absolute inset-0 bg-[#1e6bf1] border-2 border-[#13141f] rounded-xl -z-10 shadow-[0_2px_0px_#13141f]"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                {m === "create" ? "Create Room" : "Join Room"}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-[#13141f]/50 uppercase tracking-wider pl-1 text-left">
              Your Avatar Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. InkyPanda..."
              maxLength={20}
              className="w-full bg-white border-3 border-[#13141f] rounded-2xl px-4 py-3.5 text-sm font-black text-[#13141f] placeholder-[#13141f]/35 focus:outline-none focus:border-[#1e6bf1] transition-all"
              autoFocus
            />
          </div>

          {/* Join Code (Conditional with animation) */}
          <AnimatePresence mode="popLayout">
            {mode === "join" && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className="block text-xs font-black text-[#13141f]/50 uppercase tracking-wider pl-1 text-left">
                  Room Invite Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE..."
                  maxLength={16}
                  className="w-full bg-white border-3 border-[#13141f] rounded-2xl px-4 py-3.5 text-sm font-black tracking-widest uppercase font-mono text-[#13141f] placeholder-[#13141f]/35 focus:outline-none focus:border-[#1e6bf1] transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[#ff2d55] text-xs font-black bg-[#ff2d55]/5 border-2 border-[#ff2d55]/20 rounded-xl px-3 py-2 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff7e1b] text-white font-black py-4 border-3 border-[#13141f] rounded-2xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-75 disabled:cursor-not-allowed hover:bg-[#ff7e1b]/95 shadow-[0_5px_0px_#13141f] cursor-pointer"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-3 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <span className="tracking-wide text-sm font-black">
                  {mode === "create" ? "Start Drawing!" : "Join Canvas!"}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
