"use client";

import { motion } from "framer-motion";
import type { User } from "@/types";
import { cn } from "@/lib/utils";

interface UserListProps {
  users: User[];
  currentUserId?: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  return (
    <div className="skribbl-card p-4 h-full flex flex-col gap-3 min-h-[180px]">
      <div className="flex items-center justify-between border-b-2 border-brand-border/10 pb-2">
        <span className="text-xs font-black text-brand-border/40 uppercase tracking-wider select-none">
          Players
        </span>
        <span className="text-xs font-black bg-brand-blue text-white border-2 border-brand-border rounded-full px-2 py-0.5 shadow-[0_2px_0px_#13141f] select-none">
          {users.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-none">
        {users.length === 0 ? (
          <div className="text-center text-xs font-bold text-brand-border/30 py-6 select-none">
            Alone in room...
          </div>
        ) : (
          users.map((user, idx) => {
            const isMe = user.id === currentUserId;
            return (
              <motion.div
                key={user.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 border-2 border-transparent rounded-xl transition-all",
                  isMe
                    ? "bg-brand-blue/5 border-brand-blue/30"
                    : "hover:bg-brand-bg/50"
                )}
              >
                {/* Colored Avatar */}
                <div className="relative shrink-0 select-none">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-brand-border flex items-center justify-center text-sm font-black text-white shadow-[0_2.5px_0px_#13141f] transition-transform group-hover:scale-105"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green border-2 border-white rounded-full" />
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
          })
        )}
      </div>
    </div>
  );
}
