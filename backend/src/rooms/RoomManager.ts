import { Room } from "./Room";

/**
 * Singleton that manages all active whiteboard rooms.
 * Handles creation, retrieval, and garbage collection.
 */
export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<string, Room> = new Map();

  /** Interval (ms) between GC runs */
  private readonly GC_INTERVAL = 5 * 60 * 1000; // 5 min
  /** Max idle time before a room is evicted (ms) */
  private readonly ROOM_TTL = 30 * 60 * 1000; // 30 min

  private constructor() {
    // Garbage-collect empty/stale rooms periodically
    setInterval(() => this.garbageCollect(), this.GC_INTERVAL);
  }

  static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  getOrCreate(roomId: string): Room {
    if (!this.rooms.has(roomId)) {
      console.log(`[RoomManager] Creating room: ${roomId}`);
      this.rooms.set(roomId, new Room(roomId));
    }
    return this.rooms.get(roomId)!;
  }

  get(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  delete(roomId: string): void {
    this.rooms.delete(roomId);
    console.log(`[RoomManager] Deleted room: ${roomId}`);
  }

  get roomCount(): number {
    return this.rooms.size;
  }

  private garbageCollect(): void {
    const now = Date.now();
    for (const [id, room] of this.rooms) {
      const idle = now - room.lastActivity > this.ROOM_TTL;
      const empty = room.userCount === 0;
      if (idle || empty) {
        this.rooms.delete(id);
        console.log(`[RoomManager] GC evicted room: ${id}`);
      }
    }
  }
}
