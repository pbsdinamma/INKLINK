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
import { InkLinkLogo } from "@/components/ui/InkLinkLogo";
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
  Undo2,
  Redo2,
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
            {/* InkLink Brand Logo */}
            <div className="mx-auto mb-4 flex justify-center">
              <InkLinkLogo size={56} priority />
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
    <div className="fixed inset-0 w-full h-full overflow-hidden select-none bg-[#faf9fb]">
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1e1b4b",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            fontWeight: "700",
            fontSize: "13px",
            fontFamily: "var(--font-sans)",
          },
        }}
      />

      {/* ── Top Floating Navigation Bar (Stitch Design Spec) ── */}
      <header className="fixed top-4 left-4 right-4 rounded-xl z-50 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md">
        <div className="flex justify-between items-center w-full px-4 py-2.5">
          {/* Brand & Document Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Logo / Quill Icon */}
            <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
              <InkLinkLogo size={30} priority />
              <span className="text-base font-extrabold text-indigo-600 tracking-tight">InkLink</span>
            </div>
            {/* Breadcrumbs & Document Title */}
            <nav className="flex items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => router.push("/")}
                className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Workspace
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">Room</span>
              <span className="text-slate-300">/</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100">
                <span className="text-slate-800 font-bold font-mono uppercase">{roomId}</span>
                <button
                  onClick={handleCopyRoomId}
                  className="hover:text-indigo-600 transition-colors cursor-pointer p-0.5"
                  title="Copy Invite Link"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              </div>
            </nav>
            {/* Cloud Sync Badge */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 text-emerald-600 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Saved to Cloud</span>
            </div>
          </div>

          {/* Center History Undo/Redo & Zoom Quick Actions */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 px-2 py-1 rounded-lg border border-slate-200/60 text-xs font-semibold">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <span className="w-px h-4 bg-slate-200 mx-1" />
            <span className="font-mono text-xs px-1 text-slate-700 font-bold">100%</span>
          </div>

          {/* Trailing Action Cluster & Multiplayer Stack */}
          <div className="flex items-center gap-2.5">
            {/* Live Collaborators Avatar Pile */}
            <div className="flex items-center -space-x-2 mr-1">
              {users.slice(0, 4).map((u) => (
                <div
                  key={u.id}
                  className="w-8 h-8 rounded-full border-2 border-white text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500 shadow-xs"
                  style={{ backgroundColor: u.color }}
                  title={u.username}
                >
                  {u.username.slice(0, 2).toUpperCase()}
                </div>
              ))}
              {users.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shadow-xs">
                  +{users.length - 4}
                </div>
              )}
            </div>

            {/* Chat toggle */}
            <button
              onClick={handleToggleChat}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showChat
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat</span>
              {unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-black">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Secondary Action: Export */}
            <button
              onClick={() => downloadRef.current()}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200/80 bg-white text-slate-800 hover:bg-slate-50 transition-all text-xs font-bold active:scale-95 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Export Canvas as PNG"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Primary Action: Share */}
            <button
              onClick={handleCopyRoomId}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-xs font-bold active:scale-95 flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Share Room Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Level 0: Fullscreen Infinite Canvas ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
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


        {/* Active Replay Floating Pill */}
        <AnimatePresence>
          {isReplaying && (
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 select-none pointer-events-auto"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold tracking-wide">
                Replaying canvas history...
              </span>
              <button
                onClick={handleToggleReplay}
                className="text-[10px] font-bold uppercase px-2.5 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 cursor-pointer shadow-xs transition-transform active:scale-95"
              >
                Stop
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connecting Overlay */}
        {!connected && !reconnecting && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center p-6 bg-white border border-slate-200 rounded-3xl shadow-xl max-w-xs">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-slate-800 font-bold text-sm">
                Connecting to canvas...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Level 4 Floating Docks ── */}
      {/* Floating Bottom Toolbar */}
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

      {/* Floating Bottom-Left Mini-Map & Zoom Controls */}
      <WorkspaceControls />

      {/* Floating Right Collaboration Dock */}
      <ChatPanel
        isOpen={showChat}
        onClose={handleToggleChat}
        socket={socket}
        messages={liveChatMessages}
        onSendMessage={sendMessage}
        users={users}
        currentUserId={currentUserId}
        onInvite={handleCopyRoomId}
      />
    </div>
  );
}