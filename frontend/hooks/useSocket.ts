"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getSocket, type AppSocket } from "@/lib/socket";
import type { RoomState, User, Stroke } from "@/types";

interface UseSocketOptions {
  roomId: string;
  username: string;
  enabled?: boolean;
}

/**
 * Manages the Socket.IO connection lifecycle for a whiteboard room.
 * Handles connect, reconnect, room:join, and room:state sync.
 */
export function useSocket(
  options: UseSocketOptions,
  onRoomState: (state: RoomState) => void,
  onUsersUpdate: (users: User[]) => void,
  onBoardUpdate: (strokes: Stroke[]) => void
) {
  const { roomId, username, enabled = true } = options;
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const socketRef = useRef<AppSocket | null>(null);

  const joinRoom = useCallback(
    (sock: AppSocket) => {
      if (!enabled) return;
      sock.emit("room:join", { roomId, username });
    },
    [roomId, username, enabled]
  );

  useEffect(() => {
    if (!enabled) {
      const socket = getSocket();
      if (socket.connected) {
        socket.disconnect();
      }
      setConnected(false);
      setReconnecting(false);
      return;
    }

    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setConnected(true);
      setReconnecting(false);
      joinRoom(socket);
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    // reconnect_attempt is on the Manager, not the Socket
    const handleReconnectAttempt = () => setReconnecting(true);

    const handleRoomState = (state: RoomState) => onRoomState(state);
    const handleUsersUpdate = (users: User[]) => onUsersUpdate(users);
    const handleBoardUpdate = ({ strokes }: { strokes: Stroke[] }) =>
      onBoardUpdate(strokes);
    const handleBoardClear = () => onBoardUpdate([]);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    (socket.io as any).on("reconnect_attempt", handleReconnectAttempt);
    socket.on("room:state", handleRoomState);
    socket.on("room:users", handleUsersUpdate);
    socket.on("board:update", handleBoardUpdate);
    socket.on("board:clear", handleBoardClear);

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    } else {
      // Already connected (hot reload) — rejoin immediately
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      (socket.io as any).off("reconnect_attempt", handleReconnectAttempt);
      socket.off("room:state", handleRoomState);
      socket.off("room:users", handleUsersUpdate);
      socket.off("board:update", handleBoardUpdate);
      socket.off("board:clear", handleBoardClear);
    };
  }, [roomId, username, enabled, joinRoom, onRoomState, onUsersUpdate, onBoardUpdate]);

  return { connected, reconnecting };
}
