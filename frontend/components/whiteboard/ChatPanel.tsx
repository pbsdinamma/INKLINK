"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ChatMessage } from "@/types";
import { useChat } from "@/hooks/useChat";
import type { AppSocket } from "@/lib/socket";
import { Send, MessageSquare, X } from "lucide-react";

interface ChatPanelProps {
  socket?: AppSocket | null;
  initialMessages?: ChatMessage[];
  messages?: ChatMessage[];
  onSendMessage?: (msg: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_EMOJIS = ["🎨", "🔥", "👏", "❤️", "😂", "🚀"];

export function ChatPanel({
  socket = null,
  initialMessages = [],
  messages: externalMessages,
  onSendMessage: externalSendMessage,
  isOpen,
  onClose,
}: ChatPanelProps) {
  const internalChat = useChat(externalMessages ? null : socket, initialMessages);
  const messages = externalMessages ?? internalChat.messages;
  const sendMessage = externalSendMessage ?? internalChat.sendMessage;
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
    <div className="skribbl-card h-full flex flex-col overflow-hidden bg-white select-none shadow-[0_8px_0px_#13141f]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-brand-border/10 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-blue" />
          <span className="text-sm font-black text-brand-border select-none">Chat</span>
          {messages.length > 0 && (
            <motion.span
              key={messages.length}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="text-xs bg-brand-blue/10 border-2 border-brand-border/10 text-brand-blue font-black rounded-full px-2 py-0.5"
            >
              {messages.length}
            </motion.span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 450, damping: 14 }}
          onClick={onClose}
          className="text-brand-border/40 hover:text-brand-border transition-colors p-1 rounded-lg hover:bg-brand-border/5 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-none">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-10 select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border-2 border-brand-blue/20 flex items-center justify-center text-xl mb-3 shadow-[0_3px_0px_rgba(30,107,241,0.2)]">
              💬
            </div>
            <p className="text-xs font-black text-brand-border">No messages yet!</p>
            <p className="text-[10px] font-bold text-brand-border/40 mt-1 max-w-[160px]">
              Type a message or tap an emoji below to say hi to the room!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                layout
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="flex flex-col gap-0.5 bg-brand-bg/40 border border-brand-border/10 p-2.5 rounded-2xl shadow-[0_1px_2px_rgba(19,20,31,0.03)]"
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
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Emoji Reaction Pill Bar */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 bg-[#fbfcfe] border-t-2 border-brand-border/10 shrink-0">
        {QUICK_EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            type="button"
            whileHover={{ scale: 1.35, y: -2 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            onClick={() => sendMessage(emoji)}
            className="text-base p-1 rounded-lg hover:bg-brand-bg transition-colors cursor-pointer select-none"
            title={`Send ${emoji}`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-brand-border/10 shrink-0 bg-white">
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
            whileHover={input.trim() ? { scale: 1.08, y: -1 } : {}}
            whileTap={input.trim() ? { scale: 0.92 } : {}}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="skribbl-button bg-brand-blue text-white w-9 h-9 flex items-center justify-center shrink-0 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_2.5px_0px_#13141f]"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
