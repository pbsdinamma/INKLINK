"use client";

import { useEffect, useState, useCallback } from "react";
import type { AppSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types";

export function useChat(
  socket: AppSocket | null,
  initialMessages: ChatMessage[] = [],
  onNewMessage?: (msg: ChatMessage) => void
) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    if (initialMessages.length > 0) setMessages(initialMessages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages.length]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev.slice(-199), msg]);
      onNewMessage?.(msg);
    };
    socket.on("chat:message", handleMessage);
    return () => { socket.off("chat:message", handleMessage); };
  }, [socket, onNewMessage]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !message.trim()) return;
      socket.emit("chat:message", { message: message.trim() });
    },
    [socket]
  );

  return { messages, sendMessage };
}
