"use client";

import { useEffect, useState, useCallback } from "react";
import type { AppSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types";

export function useChat(socket: AppSocket | null, initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    if (initialMessages.length > 0) setMessages(initialMessages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages.length]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev.slice(-199), msg]);
    };
    socket.on("chat:message", handleMessage);
    return () => { socket.off("chat:message", handleMessage); };
  }, [socket]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !message.trim()) return;
      socket.emit("chat:message", { message: message.trim() });
    },
    [socket]
  );

  return { messages, sendMessage };
}
