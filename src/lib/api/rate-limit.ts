/* ═══════════════════════════════════════════════════════════
   In-Memory Rate Limiter
   ─────────────────────────────────────────────────────────
   Simple token-bucket rate limiter for API routes.
   In production, replace with Redis-based limiter.
   ═══════════════════════════════════════════════════════════ */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60s
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  }, 60_000);
}

interface RateLimitConfig {
  /** Max requests per window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  headers: Record<string, string>;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 30, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  let entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowSeconds * 1000,
    };
    store.set(key, entry);
  }

  entry.count++;

  const remaining = Math.max(0, config.limit - entry.count);
  const allowed = entry.count <= config.limit;

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
    headers: {
      "X-RateLimit-Limit": String(config.limit),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
    },
  };
}

/**
 * Extract a rate-limit key from a request.
 * Uses X-Forwarded-For in production, falls back to a static key.
 */
export function getRateLimitKey(request: Request, prefix = "api"): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "anonymous";
  return `${prefix}:${ip}`;
}
