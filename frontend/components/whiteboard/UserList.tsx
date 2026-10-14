"use client";

import { motion, AnimatePresence } from "motion/react";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

interface UserListProps {
  users: User[];
  currentUserId?: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  return (
    <div className="skribbl-card p-4 h-full flex flex-col gap-3 min-h-[180px] bg-white">
      <div className="flex items-center justify-between border-b-2 border-brand-border/10 pb-2">
        <span className="text-xs font-black text-brand-border/40 uppercase tracking-wider select-none">
          Players
        </span>
        <motion.span
          key={users.length}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="text-xs font-black bg-brand-blue text-white border-2 border-brand-border rounded-full px-2 py-0.5 shadow-[0_2px_0px_#13141f] select-none"
        >
          {users.length}
        </motion.span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-none">
        {users.length === 0 ? (
          <div className="text-center text-xs font-bold text-brand-border/30 py-6 select-none">
            Alone in room...
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {users.map((user, idx) => {
              const isMe = user.id === currentUserId;
              return (
                <motion.div
                  layout
                  key={user.id}
                  initial={{ x: -16, opacity: 0, scale: 0.95 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -16, opacity: 0, scale: 0.95 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 24,
                    delay: idx * 0.03,
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 border-2 rounded-xl transition-colors cursor-default select-none",
                    isMe
                      ? "bg-brand-blue/8 border-brand-blue/30 shadow-[0_2px_0px_rgba(30,107,241,0.15)]"
                      : "bg-[#fbfcfe] border-brand-border/10 hover:border-brand-border/20 hover:bg-brand-bg/60"
                  )}
                >
                  {/* Colored Avatar with spring pop */}
                  <div className="relative shrink-0 select-none">
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: [0, -5, 5, 0] }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                      className="w-8 h-8 rounded-full border-2 border-brand-border flex items-center justify-center text-sm font-black text-white shadow-[0_2.5px_0px_#13141f]"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </motion.div>
                    {/* Animated online status dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green border-2 border-white rounded-full flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-75 animate-ping" />
                    </span>
                  </div>

                  {/* Username */}
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-black text-brand-border truncate leading-none mb-0.5">
                      {user.username}
                    </span>
                    {isMe && (
                      <span className="text-[10px] font-black text-brand-blue uppercase tracking-wider leading-none">
                        You
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
