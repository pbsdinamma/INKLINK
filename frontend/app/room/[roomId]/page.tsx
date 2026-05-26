"use client";

import { use, useCallback, useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@/components/whiteboard/Canvas";
import { Toolbar } from "@/components/whiteboard/Toolbar";
import { UserList } from "@/components/whiteboard/UserList";
import { ChatPanel } from "@/components/whiteboard/ChatPanel";
import { useSocket } from "@/hooks/useSocket";
import { getSocket } from "@/lib/socket";
import type { RoomState, Stroke, User, ChatMessage, Tool } from "@/types";
import {
  DEFAULT_COLOR,
  DEFAULT_BRUSH_SIZE,
  DEFAULT_TOOL,
} from "@/lib/constants";
import {
  Copy,
  MessageSquare,
  Users,
  Wifi,
  WifiOff,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("username") ?? "Anonymous";
  const [nameInput, setNameInput] = useState("");

  // ─── Drawing State ────────────────────────────────────────
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState(DEFAULT_BRUSH_SIZE);
  const [tool, setTool] = useState<Tool>(DEFAULT_TOOL);

  // ─── Room State ───────────────────────────────────────────
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // ─── Undo / Redo Bug Fix States ───────────────────────────
  const [redoCount, setRedoCount] = useState(0);

  // ─── UI Panels State ──────────────────────────────────────
  const [showChat, setShowChat] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [isReplaying, setIsReplaying] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ─── Canvas Action Refs ───────────────────────────────────
  const undoRef = useRef<() => void>(() => {});
  const redoRef = useRef<() => void>(() => {});
  const clearRef = useRef<() => void>(() => {});
  const downloadRef = useRef<() => void>(() => {});
  const replayRef = useRef<() => void>(() => {});

  // ─── Room Sync Handlers ───────────────────────────────────
  const handleRoomState = useCallback(
    (state: RoomState & { yourUserId?: string }) => {
      setStrokes(state.strokes);
      setUsers(state.users);
      setChatMessages(state.chat);

      // Identify our own userId from yourUserId or username match fallback
      if (state.yourUserId) {
        setCurrentUserId(state.yourUserId);
      } else if (state.users.length > 0) {
        const me = state.users.find((u: User) => u.username === username);
        if (me) setCurrentUserId(me.id);
      }
    },
    [username]
  );

  const handleUsersUpdate = useCallback((updated: User[]) => {
    setUsers(updated);
  }, []);

  const handleBoardUpdate = useCallback((updated: Stroke[]) => {
    setStrokes(updated);
  }, []);

  const { connected, reconnecting } = useSocket(
    { roomId, username, enabled: !!searchParams.get("username") },
    handleRoomState,
    handleUsersUpdate,
    handleBoardUpdate
  );

  const socket = getSocket();

  // ─── Undo / Redo Bug Fix Logic ────────────────────────────
  // Calculate if the user has drawn any strokes they can undo
  const canUndo = strokes.some(
    (s) => s.userId === currentUserId || s.userId === "local"
  );
  const canRedo = redoCount > 0;

  // Track strokes length to clear/reset redo availability
  const prevStrokesLengthRef = useRef(0);
  useEffect(() => {
    // If a new stroke was added by us, reset local redo count
    if (strokes.length > prevStrokesLengthRef.current) {
      const lastStroke = strokes[strokes.length - 1];
      if (
        lastStroke &&
        (lastStroke.userId === currentUserId || lastStroke.userId === "local")
      ) {
        setRedoCount(0);
      }
    }
    // If board is fully cleared, reset redo count
    if (strokes.length === 0) {
      setRedoCount(0);
    }
    prevStrokesLengthRef.current = strokes.length;
  }, [strokes, currentUserId]);

  const handleUndo = useCallback(() => {
    undoRef.current();
    setRedoCount((prev) => prev + 1);
  }, []);

  const handleRedo = useCallback(() => {
    redoRef.current();
    setRedoCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Increment unread count if chat panel is hidden
  const handleNewMessage = useCallback(() => {
    if (!showChat) setUnreadCount((n) => n + 1);
  }, [showChat]);

  const handleToggleChat = () => {
    setShowChat((v) => !v);
    setUnreadCount(0);
  };

  const handleCopyRoomId = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Room invite link copied!", { duration: 2500 });
    });
  };

  // ─── Direct Invite Onboarding Dialog ─────────────────────
  if (!searchParams.get("username")) {
    const handleNameSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!nameInput.trim()) return;
      router.replace(
        `/room/${roomId}?username=${encodeURIComponent(nameInput.trim())}`
      );
    };

    return (
      <main className="min-h-screen text-[#13141f] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Playful Floating Doodles (Background) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 md:left-24 w-12 h-12 border-4 border-[#ff7e1b] rounded-xl opacity-30"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -15, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-20 md:left-40 w-16 h-16 border-4 border-[#1e6bf1] rounded-full opacity-20"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 20, 0],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-40 right-10 md:right-32 w-14 h-14 border-4 border-[#00c853] rounded-[12px] opacity-25"
          />
          <motion.div
            animate={{
              y: [0, 18, 0],
              rotate: [0, -8, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-32 right-20 md:right-48 w-12 h-12 border-4 border-[#ffdf00] rounded-full opacity-35"
          />
        </div>

        <div className="relative w-full max-w-md text-center z-10">
          <div className="skribbl-card bg-white p-8 relative overflow-hidden text-center">
            <h2 className="text-2xl font-black mb-1 text-brand-border select-none">
              Welcome to InkLink!
            </h2>
            <p className="text-brand-border/50 text-xs font-black mb-6 select-none leading-relaxed">
              To join this collaborative canvas, please choose a nickname.
            </p>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                className="w-full bg-white border-3 border-[#13141f] rounded-2xl px-4 py-3.5 text-sm font-black text-[#13141f] placeholder-[#13141f]/35 focus:outline-none focus:border-[#1e6bf1]"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-[#ff7e1b] text-white font-black py-4 border-3 border-[#13141f] rounded-2xl flex items-center justify-center gap-2 hover:bg-[#ff7e1b]/95 shadow-[0_5px_0px_#13141f] cursor-pointer"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-brand-bg text-brand-border overflow-hidden p-4 gap-4 relative">
      {/* Playful, thick-bordered Hot Toast */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#13141f",
            border: "3px solid #13141f",
            borderRadius: "16px",
            boxShadow: "0 6px 0px #13141f",
            fontWeight: "900",
            fontSize: "13px",
            fontFamily: "var(--font-sans)",
          },
        }}
      />

      {/* ─── Top Navbar ──────────────────────────────────────── */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="skribbl-card flex items-center justify-between px-5 py-3 select-none shrink-0 bg-white z-10"
      >
        {/* Left: Brand logo + Copy invite link */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center w-8 h-8 rounded-xl border-2 border-brand-border hover:bg-brand-bg select-none transition-colors"
            title="Leave Room"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-black text-brand-border select-none">
              Ink<span className="text-brand-blue">Link</span>
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyRoomId}
            className="skribbl-button flex items-center gap-2 bg-brand-bg hover:bg-brand-bg/85 px-3 py-1.5 text-xs font-black select-none shadow-[0_3px_0px_#13141f]"
            title="Copy Invite Link"
          >
            <span className="font-mono tracking-wider text-brand-blue uppercase">
              {roomId}
            </span>
            <Copy className="w-3.5 h-3.5 text-brand-blue shrink-0" />
          </motion.button>
        </div>

        {/* Center: Realtime Connection Badge */}
        <div className="flex items-center gap-2">
          {reconnecting ? (
            <div className="flex items-center gap-1.5 text-brand-orange text-xs font-black bg-brand-orange/5 border-2 border-brand-orange/20 rounded-full px-3 py-1 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Reconnecting...
            </div>
          ) : connected ? (
            <div className="flex items-center gap-1.5 text-brand-green text-xs font-black bg-brand-green/5 border-2 border-brand-green/20 rounded-full px-3 py-1">
              <Wifi className="w-3.5 h-3.5" />
              Sync Active
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-brand-pink text-xs font-black bg-brand-pink/5 border-2 border-brand-pink/20 rounded-full px-3 py-1">
              <WifiOff className="w-3.5 h-3.5" />
              Offline
            </div>
          )}
        </div>

        {/* Right: User list and chat controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUsers((v) => !v)}
            className={`skribbl-button relative flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-black transition-all shadow-[0_3px_0px_#13141f] ${
              showUsers
                ? "bg-brand-blue text-white hover:bg-brand-blue/90"
                : "bg-white text-brand-border hover:bg-brand-bg"
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Players</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-black border ${
                showUsers
                  ? "bg-white text-brand-blue border-white/20"
                  : "bg-brand-bg text-brand-border border-brand-border/10"
              }`}
            >
              {users.length}
            </span>
          </button>

          <button
            onClick={handleToggleChat}
            className={`skribbl-button relative flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-black transition-all shadow-[0_3px_0px_#13141f] ${
              showChat
                ? "bg-brand-blue text-white hover:bg-brand-blue/90"
                : "bg-white text-brand-border hover:bg-brand-bg"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Chat</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-pink text-white text-[9px] font-black border-2 border-brand-border rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </motion.header>

      {/* ─── Main Room Workspace ─────────────────────────────── */}
      <div className="flex-1 flex gap-4 overflow-hidden relative">
        {/* Left Sidebar: Users */}
        <AnimatePresence mode="popLayout">
          {showUsers && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="w-72 shrink-0 h-full hidden lg:block"
            >
              <UserList users={users} currentUserId={currentUserId} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Drawing Canvas */}
        <div className="flex-1 relative h-[calc(100%-80px)] mb-[80px] overflow-hidden">
          <Canvas
            socket={socket}
            initialStrokes={strokes}
            color={color}
            brushSize={brushSize}
            tool={tool}
            onUndoRedoReady={(undo, redo) => {
              undoRef.current = undo;
              redoRef.current = redo;
            }}
            onClearReady={(clear) => {
              clearRef.current = clear;
            }}
            onDownloadReady={(download) => {
              downloadRef.current = download;
            }}
            onReplayReady={(replay) => {
              replayRef.current = replay;
            }}
          />

          {/* Sockets Connecting Overlay */}
          {!connected && !reconnecting && (
            <div className="absolute inset-0 bg-brand-bg/85 backdrop-blur-sm flex items-center justify-center z-30 rounded-[24px] border-3 border-brand-border">
              <div className="text-center p-6 bg-white border-3 border-brand-border rounded-3xl shadow-[0_6px_0px_#13141f] max-w-xs">
                <Loader2 className="w-8 h-8 text-brand-blue animate-spin mx-auto mb-3" />
                <p className="text-brand-border font-black text-sm">
                  Connecting to canvas...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Chat */}
        <AnimatePresence mode="popLayout">
          {showChat && (
            <motion.div
              initial={{ x: 280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="w-72 shrink-0 h-full hidden md:block"
            >
              <ChatPanel
                socket={socket}
                initialMessages={chatMessages}
                isOpen={showChat}
                onClose={handleToggleChat}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Bottom Floating Toolbar (Viewport Fixed Centered) ─── */}
      <Toolbar
        color={color}
        brushSize={brushSize}
        tool={tool}
        canUndo={canUndo}
        canRedo={canRedo}
        onColorChange={setColor}
        onBrushSizeChange={setBrushSize}
        onToolChange={setTool}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={() => clearRef.current()}
        onDownload={() => downloadRef.current()}
        onReplay={() => {
          setIsReplaying(true);
          replayRef.current();
          // Reset replaying flag when replay loop completes
          setTimeout(() => setIsReplaying(false), 3000);
        }}
        isReplaying={isReplaying}
      />
    </div>
  );
}
