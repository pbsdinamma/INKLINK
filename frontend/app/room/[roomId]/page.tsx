"use client";

import { use, useCallback, useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Canvas } from "@/components/whiteboard/Canvas";
import { Toolbar } from "@/components/whiteboard/Toolbar";
import { UserList } from "@/components/whiteboard/UserList";
import { ChatPanel } from "@/components/whiteboard/ChatPanel";
import { useSocket } from "@/hooks/useSocket";
import { useChat } from "@/hooks/useChat";
import { getSocket } from "@/lib/socket";
import type { RoomState, Stroke, User, ChatMessage, Tool } from "@/types";

import { WorkspaceControls } from "@/components/whiteboard/WorkspaceControls";
import {
  DEFAULT_COLOR,
  DEFAULT_BRUSH_SIZE,
  DEFAULT_TOOL,
} from "@/lib/constants";

import {
  Copy,
  Check,
  MessageSquare,
  Users,
  Wifi,
  WifiOff,
  Loader2,
  ChevronLeft,
  Pencil,
  Dices,
  Download,
  Share2,
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
  const [copied, setCopied] = useState(false);

  // ─── Canvas Action Refs ───────────────────────────────────
  const undoRef = useRef<() => void>(() => {});
  const redoRef = useRef<() => void>(() => {});
  const clearRef = useRef<() => void>(() => {});
  const downloadRef = useRef<() => void>(() => {});
  const startReplayRef = useRef<() => boolean>(() => false);
  const stopReplayRef = useRef<() => void>(() => {});

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
  const canUndo = strokes.some(
    (s) => s.userId === currentUserId || s.userId === "local"
  );
  const canRedo = redoCount > 0;

  // Track strokes length to clear/reset redo availability
  const prevStrokesLengthRef = useRef(0);
  useEffect(() => {
    if (strokes.length > prevStrokesLengthRef.current) {
      const lastStroke = strokes[strokes.length - 1];
      if (
        lastStroke &&
        (lastStroke.userId === currentUserId || lastStroke.userId === "local")
      ) {
        setRedoCount(0);
      }
    }
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

  const handleClear = useCallback(() => {
    clearRef.current();
    setRedoCount(0);
    toast("Board cleared", { icon: "🧹" });
  }, []);

  // Increment unread count if chat panel is hidden
  const handleNewMessage = useCallback(() => {
    setShowChat((currentShowChat) => {
      if (!currentShowChat) {
        setUnreadCount((n) => n + 1);
      }
      return currentShowChat;
    });
  }, []);

  const { messages: liveChatMessages, sendMessage } = useChat(
    socket,
    chatMessages,
    handleNewMessage
  );

  const handleToggleChat = () => {
    setShowChat((v) => {
      if (!v) setUnreadCount(0);
      return !v;
    });
  };

  const handleToggleReplay = useCallback(() => {
    if (isReplaying) {
      stopReplayRef.current();
      setIsReplaying(false);
    } else {
      const started = startReplayRef.current();
      if (started) {
        setIsReplaying(true);
      }
    }
  }, [isReplaying]);

  const handleReplayEnd = useCallback(() => {
    setIsReplaying(false);
  }, []);

  const handleCopyRoomId = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Room invite link copied!", { duration: 2500 });
      setTimeout(() => setCopied(false), 2000);
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
      <main className="min-h-screen text-[#13141f] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-brand-bg">
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

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="relative w-full max-w-md text-center z-10"
        >
          <div className="skribbl-card bg-white p-8 relative overflow-hidden text-center shadow-[0_8px_0px_#13141f]">
            {/* Consistent Brand Pencil Icon */}
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-[0_3px_0px_#13141f] border-2 border-brand-border mx-auto mb-4">
              <Pencil className="w-6 h-6" />
            </div>

            <h2 className="text-2xl font-black mb-1 text-brand-border select-none">
              Welcome to Ink<span className="text-brand-blue">Link</span>!
            </h2>
            <p className="text-brand-border/60 text-xs font-bold mb-6 select-none leading-relaxed">
              You&apos;ve been invited to room <span className="font-mono font-black text-brand-blue uppercase px-1.5 py-0.5 bg-brand-blue/10 rounded-lg">{roomId}</span>. Choose a nickname to start sketching!
            </p>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-brand-border text-left">
                    Your Nickname
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const names = [
                        "InkyPanda", "ArtWhiz", "SketchFox", "DoodleKing",
                        "PixelNinja", "ColorSage", "BrushMaster", "NeonOtter"
                      ];
                      setNameInput(names[Math.floor(Math.random() * names.length)]);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-black text-brand-blue hover:text-brand-blue/80 transition-colors cursor-pointer"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>Random</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. InkyPanda..."
                  maxLength={20}
                  className="w-full bg-[#fbfcfe] border-2 border-brand-border/30 focus:bg-white focus:border-brand-blue rounded-xl px-4 py-3 text-sm font-black text-[#13141f] placeholder:text-brand-border/30 focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-brand-blue text-white font-black py-3.5 border-3 border-brand-border rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-blue/95 shadow-[0_4px_0px_#13141f] cursor-pointer active:translate-y-0.5 active:shadow-[0_1px_0px_#13141f] transition-all"
              >
                Join Room & Start Drawing
              </motion.button>
            </form>
          </div>
        </motion.div>
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
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
        className="skribbl-card flex items-center justify-between px-5 py-3 select-none shrink-0 bg-white z-10"
      >
        {/* Left: Brand logo + Copy invite link */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="Leave Room & Back to Home"
          >
            <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-[0_2px_0px_#13141f] border-2 border-brand-border">
              <Pencil className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline text-base font-black text-brand-border select-none">
              Ink<span className="text-brand-blue">Link</span>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={handleCopyRoomId}
            className="skribbl-button flex items-center gap-2 bg-brand-bg hover:bg-brand-bg/85 px-3 py-1.5 text-xs font-black select-none shadow-[0_3px_0px_#13141f] cursor-pointer"
            title="Copy Invite Link"
          >
            <span className="font-mono tracking-wider text-brand-blue uppercase">
              {roomId}
            </span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-brand-green shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-brand-blue shrink-0" />
            )}
          </motion.button>
        </div>

        {/* Center: Realtime Connection Badge */}
        <div className="flex items-center gap-2">
          {reconnecting ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1.5 text-brand-orange text-xs font-black bg-brand-orange/5 border-2 border-brand-orange/20 rounded-full px-3 py-1"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Reconnecting...
            </motion.div>
          ) : connected ? (
            <div className="flex items-center gap-1.5 text-brand-green text-xs font-black bg-brand-green/5 border-2 border-brand-green/20 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-brand-green" />
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
          {/* Overlapping Player Avatars preview */}
          {users.length > 0 && (
            <div className="hidden md:flex items-center -space-x-2 mr-1">
              {users.slice(0, 3).map((u) => (
                <div
                  key={u.id}
                  className="w-7 h-7 rounded-full border-2 border-[#13141f] flex items-center justify-center text-[10px] font-black text-white shadow-[0_1.5px_0px_#13141f]"
                  style={{ backgroundColor: u.color }}
                  title={u.username}
                >
                  {u.username.charAt(0).toUpperCase()}
                </div>
              ))}
              {users.length > 3 && (
                <div className="w-7 h-7 rounded-full border-2 border-[#13141f] bg-white text-brand-border flex items-center justify-center text-[9px] font-black shadow-[0_1.5px_0px_#13141f]">
                  +{users.length - 3}
                </div>
              )}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={() => setShowUsers((v) => !v)}
            className={`skribbl-button relative flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-black transition-colors shadow-[0_3px_0px_#13141f] cursor-pointer ${
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
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={handleToggleChat}
            className={`skribbl-button relative flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-black transition-colors shadow-[0_3px_0px_#13141f] cursor-pointer ${
              showChat
                ? "bg-brand-blue text-white hover:bg-brand-blue/90"
                : "bg-white text-brand-border hover:bg-brand-bg"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Chat</span>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-pink text-white text-[9px] font-black border-2 border-brand-border rounded-full flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Export Canvas as PNG (Stitch header action) */}
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={() => downloadRef.current()}
            className="skribbl-button hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-black bg-white hover:bg-brand-bg transition-colors shadow-[0_3px_0px_#13141f] cursor-pointer"
            title="Export Canvas as PNG"
          >
            <Download className="w-3.5 h-3.5 text-brand-border" />
            <span>Export</span>
          </motion.button>

          {/* Share Room Button (Stitch prominent action) */}
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={handleCopyRoomId}
            className="skribbl-button flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors shadow-[0_3px_0px_#13141f] cursor-pointer"
            title="Share Room Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-brand-green" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </motion.button>
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
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
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
            onStrokesChange={setStrokes}
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
            onReplayReady={(startReplay, stopReplay) => {
              startReplayRef.current = startReplay;
              stopReplayRef.current = stopReplay;
            }}
            onReplayEnd={handleReplayEnd}
          />

          {/* Active Replay Floating Banner */}
          <AnimatePresence>
            {isReplaying && (
              <motion.div
                initial={{ opacity: 0, y: -24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 bg-[#13141f] text-white rounded-2xl shadow-[0_6px_0px_rgba(0,0,0,0.3)] border-2 border-[#13141f] select-none pointer-events-auto"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping" />
                <span className="text-xs font-black tracking-wide">
                  Replaying canvas history...
                </span>
                <button
                  onClick={handleToggleReplay}
                  className="text-[10px] font-black uppercase px-2.5 py-1 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 cursor-pointer shadow-[0_1.5px_0px_rgba(0,0,0,0.4)] transition-transform active:scale-95"
                >
                  Stop
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stitch Workspace Controls (Zoom & Fullscreen) */}
          <WorkspaceControls />

          {/* Subtle Floating Keyboard Shortcuts Pill */}
          <div className="absolute bottom-3 left-48 hidden xl:flex items-center gap-3 px-3 py-1.5 bg-white/80 backdrop-blur-md border-2 border-brand-border/15 rounded-xl text-[10px] font-black text-brand-border/50 select-none shadow-[0_2px_0px_rgba(19,20,31,0.04)] pointer-events-none z-20">
            <span><kbd className="px-1 py-0.5 bg-brand-bg rounded border border-brand-border/10 font-mono text-[9px]">P</kbd> Pen</span>
            <span><kbd className="px-1 py-0.5 bg-brand-bg rounded border border-brand-border/10 font-mono text-[9px]">E</kbd> Eraser</span>
            <span><kbd className="px-1 py-0.5 bg-brand-bg rounded border border-brand-border/10 font-mono text-[9px]">Ctrl+Z</kbd> Undo</span>
            <span><kbd className="px-1 py-0.5 bg-brand-bg rounded border border-brand-border/10 font-mono text-[9px]">D</kbd> Save</span>
            <span><kbd className="px-1 py-0.5 bg-brand-bg rounded border border-brand-border/10 font-mono text-[9px]">R</kbd> Replay</span>
          </div>

          {/* Sockets Connecting Overlay */}
          {!connected && !reconnecting && (
            <div className="absolute inset-0 bg-brand-bg/85 backdrop-blur-sm flex items-center justify-center z-30 rounded-[24px] border-3 border-brand-border">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="text-center p-6 bg-white border-3 border-brand-border rounded-3xl shadow-[0_6px_0px_#13141f] max-w-xs"
              >
                <Loader2 className="w-8 h-8 text-brand-blue animate-spin mx-auto mb-3" />
                <p className="text-brand-border font-black text-sm">
                  Connecting to canvas...
                </p>
              </motion.div>
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
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="w-72 shrink-0 h-full hidden md:block"
            >
              <ChatPanel
                socket={socket}
                messages={liveChatMessages}
                onSendMessage={sendMessage}
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
        onClear={handleClear}
        onDownload={() => downloadRef.current()}
        onReplay={handleToggleReplay}
        isReplaying={isReplaying}
      />
    </div>
  );
}