"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, User, KeyRound, Dices } from "lucide-react";

const FUN_NAMES = [
  "InkyPanda",
  "ArtWhiz",
  "SketchFox",
  "DoodleKing",
  "PixelNinja",
  "ColorSage",
  "BrushMaster",
  "NeonOtter",
  "CanvasHero",
  "InkFalcon",
];

export function RoomForm({ className }: { className?: string } = {}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState<"create" | "join">("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShuffleName = () => {
    const random = FUN_NAMES[Math.floor(Math.random() * FUN_NAMES.length)];
    setUsername(random);
    setError("");
  };

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
      {/* Stitch Neo-Brutalist Prominent Card */}
      <motion.div
        layout
        className="bg-white border-3 border-[#13141f] rounded-3xl p-6 sm:p-7 shadow-[0_8px_0px_#13141f] relative"
      >
        {/* Sleek Tab Switcher with sliding pill */}
        <div className="flex bg-[#f3f7ff] p-1.5 rounded-2xl mb-5 relative border-2 border-[#13141f]/20">
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
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-colors relative z-10 cursor-pointer ${
                  isActive ? "text-white" : "text-[#13141f]/60 hover:text-[#13141f]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="roomModeSlider"
                    className="absolute inset-0 bg-brand-blue border-2 border-[#13141f] rounded-xl -z-10 shadow-[0_2px_0px_#13141f]"
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  />
                )}
                {m === "create" ? "Create New Room" : "Join Existing Room"}
              </motion.button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nickname Input with Quick Shuffle Dice */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-brand-border text-left">
                Your Nickname
              </label>
              <button
                type="button"
                onClick={handleShuffleName}
                className="inline-flex items-center gap-1 text-[11px] font-black text-brand-blue hover:text-brand-blue/80 transition-colors cursor-pointer"
                title="Random nickname"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Random</span>
              </button>
            </div>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-brand-border/40 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. InkyPanda..."
                maxLength={20}
                className="w-full bg-[#fbfcfe] border-2 border-brand-border/30 focus:bg-white focus:border-brand-blue rounded-xl pl-10 pr-10 py-2.5 text-sm font-black text-[#13141f] placeholder:text-brand-border/30 transition-all outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Join Code (Conditional with smooth transition) */}
          <AnimatePresence mode="popLayout">
            {mode === "join" && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="block text-xs font-black text-brand-border text-left">
                  Room Invite Code
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-brand-border/40 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="e.g. A1B2C3D4"
                    maxLength={16}
                    className="w-full bg-[#fbfcfe] border-2 border-brand-border/30 focus:bg-white focus:border-brand-blue rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono font-black text-[#13141f] placeholder:text-brand-border/30 uppercase tracking-wider transition-all outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message with bouncy spring shake */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6, x: [-5, 5, -5, 0] }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="text-xs font-black text-brand-pink text-left bg-brand-pink/10 border-2 border-brand-pink/20 rounded-xl px-3 py-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white font-black py-3.5 border-3 border-brand-border rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-blue/95 shadow-[0_4px_0px_#13141f] cursor-pointer active:translate-y-0.5 active:shadow-[0_1px_0px_#13141f] transition-all disabled:opacity-50"
          >
            <span>
              {loading
                ? "Connecting..."
                : mode === "create"
                ? "Create Room & Start Drawing"
                : "Join Room"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
