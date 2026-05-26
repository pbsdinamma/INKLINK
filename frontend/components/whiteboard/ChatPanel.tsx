"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/types";
import { useChat } from "@/hooks/useChat";
import type { AppSocket } from "@/lib/socket";
import { Send, MessageSquare, X } from "lucide-react";

interface ChatPanelProps {
  socket: AppSocket | null;
  initialMessages: ChatMessage[];
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({
  socket,
  initialMessages,
  isOpen,
  onClose,
}: ChatPanelProps) {
  const { messages, sendMessage } = useChat(socket, initialMessages);
  const [input, setInput] = useState("");
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

  if (!isOpen) return null;

  return (
    <div className="skribbl-card h-full flex flex-col overflow-hidden bg-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-brand-border/10 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-blue" />
          <span className="text-sm font-black text-brand-border select-none">Chat</span>
          {messages.length > 0 && (
            <span className="text-xs bg-brand-blue/10 border-2 border-brand-border/10 text-brand-blue font-black rounded-full px-2 py-0.5">
              {messages.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-brand-border/40 hover:text-brand-border transition-colors p-1 rounded-lg hover:bg-brand-border/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-none">
        {messages.length === 0 && (
          <div className="text-center text-brand-border/30 text-xs font-black py-8 select-none">
            No messages yet. Say hi! 👋
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex flex-col gap-0.5 bg-brand-bg/40 border border-brand-border/5 p-2.5 rounded-2xl"
            >
              <div className="flex items-center gap-1.5 justify-between">
                <span
                  className="text-[11px] font-black tracking-wide"
                  style={{ color: msg.userColor }}
                >
                  {msg.username}
                </span>
                <span className="text-brand-border/30 text-[9px] font-bold">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-xs font-bold text-brand-border leading-relaxed break-words">
                {msg.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t-2 border-brand-border/10 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            maxLength={500}
            className="skribbl-input flex-1 text-xs px-3 py-2.5 w-full font-bold select-text placeholder-brand-border/30"
          />
          <motion.button
            whileHover={input.trim() ? { scale: 1.05 } : {}}
            whileTap={input.trim() ? { scale: 0.95 } : {}}
            onClick={handleSend}
            disabled={!input.trim()}
            className="skribbl-button bg-brand-blue text-white w-9 h-9 flex items-center justify-center shrink-0 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
