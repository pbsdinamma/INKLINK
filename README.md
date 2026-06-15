# 🎨 INKLINK — Real-time Collaborative Whiteboard

A full-stack multiplayer whiteboard application built with Next.js, Socket.IO, and HTML5 Canvas. Draw together in real time with live cursor tracking, chat, and drawing replay.
https://inklink-pi745jpeu-sathwik-akella-s-projects.vercel.app/

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?logo=socket.io) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎨 Real-time drawing | Freehand pen + eraser, synced instantly |
| 👥 Multiplayer rooms | Create/join rooms via URL |
| 🖱️ Live cursors | See everyone's cursor with colored labels |
| 💬 Room chat | Real-time message panel |
| 🎬 Drawing replay | Replay full board history as animation |
| 📥 Export PNG | Download board with one click |
| 🔁 Auto-reconnect | Handles network interruptions gracefully |

---

## 🗂️ Project Structure

```
multiplayer-whiteboard/
├── shared/              # Shared TypeScript types
│   └── types.ts
├── backend/             # Express + Socket.IO server
│   ├── src/
│   │   ├── server.ts
│   │   ├── rooms/       # Room & RoomManager
│   │   ├── socket/      # Event handlers
│   │   └── middleware/  # Rate limiting
│   └── package.json
└── frontend/            # Next.js App Router
    ├── app/             # Pages
    ├── components/      # UI + Whiteboard components
    ├── hooks/           # useSocket, useCanvas, useCursor, useChat
    └── lib/             # Socket singleton, canvas utils, constants
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone the repo
```bash
git clone <repo-url>
cd multiplayer-whiteboard
```

### 2. Start the backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 4. Open in browser
Visit `http://localhost:3000`, enter your name, and create a room!

---

## 🔌 Socket Event Flow

```
JOIN:
  client  →  server: room:join { roomId, username }
  server  →  client: room:state { strokes[], users[], chat[] }
  server  →  room:   room:users { users[] }

DRAWING (delta-only, no full frames):
  client  →  server: stroke:start { strokeId, color, size, tool }
  client  →  server: stroke:point { strokeId, points[] }  ← batched ~60fps
  client  →  server: stroke:end   { strokeId }
  server  →  room:   mirrors above to all other clients

UNDO/REDO (server-authoritative):
  client  →  server: stroke:undo / stroke:redo
  server  →  room:   board:update { strokes[] }

CURSOR (throttled 30fps):
  client  →  server: cursor:move { x, y }
  server  →  room:   cursor:update { userId, username, color, x, y }

CHAT:
  client  →  server: chat:message { message }
  server  →  room:   chat:message { id, userId, username, userColor, message, timestamp }
```

### Backend → Railway / Render

1. Create a new **Node.js** service
2. Set build command: `npm install && npm run build`
3. Set start command: `npm run start`
4. Add environment variables:
   ```
   PORT=3001
   CORS_ORIGIN=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

### Optional: Redis scaling (Socket.IO multi-instance)

Install the Redis adapter in `backend/`:
```bash
npm install @socket.io/redis-adapter ioredis
```

Then uncomment the Redis adapter block in `backend/src/server.ts` and set:
```
REDIS_URL=redis://your-redis-url
```

---

## 🏗️ Architecture Notes

### Why delta-only events?
Instead of broadcasting full canvas state, only `stroke:point` batches (arrays of `{x,y}` points) are sent. This minimizes WebSocket payload to ~50-200 bytes per batch vs. tens of kilobytes for canvas frames.

### Why server-authoritative undo/redo?
If undo were client-side only, User A undoing would conflict with User B's view. The server maintains the authoritative stroke list, applies undo/redo, and broadcasts `board:update` to all clients.

### CRDT-ready data model
Each `Stroke` has `{ id: nanoid, userId, timestamp }`. This structure is compatible with CRDT operations — adding Yjs or Automerge in the future would be straightforward.

### Rate limiting
Per-socket sliding-window rate limits prevent event flooding:
- `stroke:start`: 20/sec
- `stroke:point`: 120/sec  
- `board:clear`: 3/5sec
- `chat:message`: 5/3sec

---

## 📄 License

MIT
