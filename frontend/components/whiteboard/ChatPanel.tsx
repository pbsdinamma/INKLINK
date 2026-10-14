"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ChatMessage, User } from "@/types";
import { useChat } from "@/hooks/useChat";
import type { AppSocket } from "@/lib/socket";
import {
  Send,
  MessageSquare,
  X,
  Users,
  Mic,
  Smile,
  Activity,
  UserPlus,
  Settings,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ChatPanelProps {
  socket?: AppSocket | null;
  initialMessages?: ChatMessage[];
  messages?: ChatMessage[];
  onSendMessage?: (msg: string) => void;
  isOpen: boolean;
  onClose: () => void;
  users?: User[];
  currentUserId?: string;
  onInvite?: () => void;
}

const QUICK_EMOJIS = ["👏", "🔥", "❤️", "🚀", "💡", "🎨"];

export function ChatPanel({
  socket = null,
  initialMessages = [],
  messages: externalMessages,
  onSendMessage: externalSendMessage,
  isOpen,
  onClose,
  users = [],
  currentUserId,
  onInvite,
}: ChatPanelProps) {
  const internalChat = useChat(externalMessages ? null : socket, initialMessages);
  const messages = externalMessages ?? internalChat.messages;
  const sendMessage = externalSendMessage ?? internalChat.sendMessage;
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "reactions" | "activity" | "members">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleHuddle = () => {
    toast("Voice Huddle feature coming soon!", { icon: "🎙️" });
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed top-20 right-4 bottom-4 w-84 rounded-2xl z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl flex flex-col justify-between p-4 select-none pointer-events-auto">
      {/* ── Header with Huddle Voice Quick Access from Stitch ── */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 leading-tight">
                Room Collaboration
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{users.length || 1} online now</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Join Voice Huddle Button */}
            <button
              onClick={handleHuddle}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Start Voice Huddle"
            >
              <Mic className="w-3 h-3" />
              <span>Huddle</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Navigation Tabs from Stitch ── */}
        <nav className="grid grid-cols-4 gap-1 mt-3 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-1 rounded-lg text-center flex items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === "chat"
                ? "bg-white text-indigo-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("reactions")}
            className={`py-1 rounded-lg text-center flex items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === "reactions"
                ? "bg-white text-indigo-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smile className="w-3 h-3" />
            <span>React</span>
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-1 rounded-lg text-center flex items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === "activity"
                ? "bg-white text-indigo-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Activity</span>
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`py-1 rounded-lg text-center flex items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === "members"
                ? "bg-white text-indigo-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-3 h-3" />
            <span>({users.length || 1})</span>
          </button>
        </nav>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto chat-scroll py-3 space-y-3 my-2">
        {activeTab === "chat" && (
          <>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 select-none">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg mb-2 shadow-xs">
                  💬
                </div>
                <p className="text-xs font-bold text-slate-800">No messages yet!</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
                  Say hi or drop a note to your whiteboard team!
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5"
                  >
                    <div
                      className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-xs"
                      style={{ backgroundColor: msg.userColor || "#6366f1" }}
                    >
                      {msg.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-[11px] font-bold text-slate-800 truncate">
                          {msg.username}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5 mt-1 border border-slate-200/60 text-xs font-medium text-slate-800 break-words leading-relaxed">
                        {msg.message}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={bottomRef} />
          </>
        )}

        {activeTab === "members" && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Connected Members
            </h3>
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: u.color }}
                  >
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {u.username}
                  </span>
                </div>
                {u.id === currentUserId && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "reactions" && (
          <div className="p-3 text-center space-y-4">
            <p className="text-xs font-bold text-slate-600">Quick React on Board</p>
            <div className="grid grid-cols-3 gap-2">
              {["👏", "🔥", "❤️", "🚀", "💡", "🎨", "🎉", "👍", "💯"].map((em) => (
                <button
                  key={em}
                  onClick={() => sendMessage(em)}
                  className="p-3 text-2xl rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 cursor-pointer transition-transform hover:scale-115 active:scale-95"
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-2 text-xs text-slate-500">
            <p className="p-2 rounded-lg bg-slate-50 border border-slate-200/50">
              🟢 Live canvas synchronization active.
            </p>
            <p className="p-2 rounded-lg bg-slate-50 border border-slate-200/50">
              ⚡ Multi-user cursor tracking enabled at 60 FPS.
            </p>
          </div>
        )}
      </div>

      {/* ── Chat Footer Input & Actions from Stitch ── */}
      <div className="pt-2 border-t border-slate-200/60 space-y-2.5">
        {/* Quick Emoji Reaction Pill Bar */}
        <div className="flex items-center justify-between px-1">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => sendMessage(emoji)}
              className="text-base p-1 rounded-lg hover:bg-slate-100 transition-transform hover:scale-125 cursor-pointer"
              title={`Send ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Chat Composer */}
        <div className="relative bg-white rounded-xl border border-slate-300 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all p-2 shadow-xs">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-0 p-0 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:ring-0 resize-none outline-none"
            placeholder="Type message or '@canvas'..."
            rows={2}
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => sendMessage("🎨")}
                className="p-1 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Send Art Emoji"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Actions: Invite Teammate */}
        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            onClick={onInvite}
            className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Teammate</span>
          </button>
          <button
            type="button"
            onClick={() => toast("Room settings are locked to standard collaborative mode", { icon: "🔒" })}
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Room Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
