/**
 * Simple in-memory sliding-window rate limiter per socket.
 * Prevents event flooding from a single client.
 */

interface BucketEntry {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Map<string, BucketEntry>>();

/**
 * Returns true if the action is allowed, false if rate-limited.
 * @param socketId - The socket's unique ID
 * @param event    - The event name to rate-limit
 * @param maxPerWindow - Max allowed events in the time window
 * @param windowMs     - Sliding window size in milliseconds
 */
export function checkRateLimit(
  socketId: string,
  event: string,
  maxPerWindow: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const key = `${socketId}:${event}`;

  if (!buckets.has(socketId)) {
    buckets.set(socketId, new Map());
  }
  const socketBuckets = buckets.get(socketId)!;
  const bucket = socketBuckets.get(event);

  if (!bucket || now - bucket.windowStart > windowMs) {
    // New window
    socketBuckets.set(event, { count: 1, windowStart: now });
    return true;
  }

  bucket.count++;
  if (bucket.count > maxPerWindow) {
    return false; // Rate limited
  }
  return true;
}

/** Clean up all rate-limit state for a disconnected socket */
export function clearRateLimit(socketId: string): void {
  buckets.delete(socketId);
}
