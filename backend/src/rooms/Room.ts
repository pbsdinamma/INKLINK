import type { Stroke, User, ChatMessage } from "../../../shared/types";

/**
 * Represents a single whiteboard room.
 * Stores all strokes, connected users, chat messages,
 * and PER-USER undo/redo stacks (so Ctrl+Z only undoes YOUR strokes).
 */
export class Room {
  readonly id: string;

  /** All committed strokes, keyed by strokeId */
  private strokes: Map<string, Stroke> = new Map();

  /**
   * Global draw order — determines z-ordering on canvas.
   * Only finalized strokes (stroke:end received) appear here.
   */
  private strokeOrder: string[] = [];

  /** In-progress strokes (not yet ended) */
  private activeStrokes: Set<string> = new Set();

  /**
   * Per-user undo stacks.
   * Key: userId, Value: ordered list of their committed strokeIds
   */
  private userUndoStacks: Map<string, string[]> = new Map();

  /**
   * Per-user redo stacks.
   * Cleared when the user draws a new stroke.
   */
  private userRedoStacks: Map<string, string[]> = new Map();

  /** Connected users */
  private users: Map<string, User> = new Map();

  /** Chat messages (capped at 200) */
  private chat: ChatMessage[] = [];

  /** Timestamp of last activity (for GC) */
  lastActivity: number = Date.now();

  constructor(id: string) {
    this.id = id;
  }

  // ─── User Management ───────────────────────────────────────

  addUser(user: User): void {
    this.users.set(user.id, user);
    if (!this.userUndoStacks.has(user.id)) {
      this.userUndoStacks.set(user.id, []);
      this.userRedoStacks.set(user.id, []);
    }
    this.lastActivity = Date.now();
  }

  removeUser(userId: string): void {
    this.users.delete(userId);
    // Keep undo/redo stacks in case user reconnects
    this.lastActivity = Date.now();
  }

  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  get userCount(): number {
    return this.users.size;
  }

  // ─── Drawing ────────────────────────────────────────────────

  startStroke(
    strokeId: string,
    userId: string,
    color: string,
    size: number,
    tool: "pen" | "eraser"
  ): void {
    const stroke: Stroke = {
      id: strokeId,
      points: [],
      color,
      size,
      tool,
      userId,
      timestamp: Date.now(),
      complete: false,
    };
    this.strokes.set(strokeId, stroke);
    this.activeStrokes.add(strokeId);

    // New stroke clears this user's redo stack
    const redoStack = this.userRedoStacks.get(userId) ?? [];
    redoStack.length = 0;
    this.userRedoStacks.set(userId, redoStack);

    this.lastActivity = Date.now();
  }

  appendPoints(
    strokeId: string,
    points: Array<{ x: number; y: number }>
  ): boolean {
    const stroke = this.strokes.get(strokeId);
    if (!stroke || stroke.complete) return false;
    stroke.points.push(...points);
    return true;
  }

  endStroke(strokeId: string): boolean {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return false;
    stroke.complete = true;
    this.activeStrokes.delete(strokeId);
    this.strokeOrder.push(strokeId);

    // Push to the owning user's undo stack
    const undoStack = this.userUndoStacks.get(stroke.userId) ?? [];
    undoStack.push(strokeId);
    this.userUndoStacks.set(stroke.userId, undoStack);

    this.lastActivity = Date.now();
    return true;
  }

  /**
   * Undo the last stroke drawn by `userId`.
   * Only removes that user's own strokes — never touches others'.
   * Returns the new full committed stroke list, or null if nothing to undo.
   */
  undo(userId: string): Stroke[] | null {
    const undoStack = this.userUndoStacks.get(userId);
    if (!undoStack || undoStack.length === 0) return null;

    const strokeId = undoStack.pop()!;
    const redoStack = this.userRedoStacks.get(userId) ?? [];
    redoStack.push(strokeId);
    this.userRedoStacks.set(userId, redoStack);

    // Remove from global draw order (preserve other strokes' positions)
    this.strokeOrder = this.strokeOrder.filter((id) => id !== strokeId);

    return this.getCommittedStrokes();
  }

  /**
   * Redo the last undone stroke by `userId`.
   * Appends it back at the END of the draw order.
   */
  redo(userId: string): Stroke[] | null {
    const redoStack = this.userRedoStacks.get(userId);
    if (!redoStack || redoStack.length === 0) return null;

    const strokeId = redoStack.pop()!;
    const undoStack = this.userUndoStacks.get(userId) ?? [];
    undoStack.push(strokeId);
    this.userUndoStacks.set(userId, undoStack);

    this.strokeOrder.push(strokeId);

    return this.getCommittedStrokes();
  }

  /** Returns whether a user has anything to undo */
  canUndo(userId: string): boolean {
    return (this.userUndoStacks.get(userId)?.length ?? 0) > 0;
  }

  /** Returns whether a user has anything to redo */
  canRedo(userId: string): boolean {
    return (this.userRedoStacks.get(userId)?.length ?? 0) > 0;
  }

  clear(userId: string): void {
    this.strokes.clear();
    this.strokeOrder = [];
    this.activeStrokes.clear();
    // Clear all users' undo/redo stacks
    for (const [uid] of this.userUndoStacks) {
      this.userUndoStacks.set(uid, []);
      this.userRedoStacks.set(uid, []);
    }
    this.lastActivity = Date.now();
  }

  /** Returns committed strokes in draw order */
  getCommittedStrokes(): Stroke[] {
    return this.strokeOrder
      .map((id) => this.strokes.get(id))
      .filter((s): s is Stroke => s !== undefined);
  }

  /** Returns all strokes including in-progress */
  getAllStrokes(): Stroke[] {
    return Array.from(this.strokes.values());
  }

  // ─── Chat ────────────────────────────────────────────────────

  addChatMessage(msg: ChatMessage): void {
    this.chat.push(msg);
    if (this.chat.length > 200) this.chat.shift();
    this.lastActivity = Date.now();
  }

  getChat(): ChatMessage[] {
    return [...this.chat];
  }
}
