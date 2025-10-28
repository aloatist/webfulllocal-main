/**
 * Rate Limiter
 * Bảo vệ API khỏi abuse và DDoS attacks
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number; // milliseconds
  uniqueTokenPerInterval: number; // max requests per interval
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 * Trong production nên dùng Redis
 */
export class RateLimiter {
  private interval: number;
  private uniqueTokenPerInterval: number;

  constructor(config: RateLimitConfig) {
    this.interval = config.interval;
    this.uniqueTokenPerInterval = config.uniqueTokenPerInterval;
  }

  /**
   * Check if request is rate limited
   */
  async check(identifier: string): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;

    // Clean up expired entries
    this.cleanup();

    // Get or create entry
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + this.interval,
      };
    }

    const entry = store[key];
    entry.count++;

    const remaining = Math.max(0, this.uniqueTokenPerInterval - entry.count);
    const success = entry.count <= this.uniqueTokenPerInterval;

    return {
      success,
      remaining,
      reset: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup() {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Rate limit middleware
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10, // 10 requests per minute
  }
): Promise<NextResponse | null> {
  const identifier = getClientIdentifier(request);
  const limiter = new RateLimiter(config);
  
  const { success, remaining, reset } = await limiter.check(identifier);

  if (!success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.uniqueTokenPerInterval.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Preset rate limit configs
 */
export const RateLimitPresets = {
  // Strict: 5 requests per minute
  strict: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 5,
  },
  // Normal: 10 requests per minute
  normal: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  },
  // Lenient: 30 requests per minute
  lenient: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 30,
  },
  // API: 100 requests per minute
  api: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 100,
  },
  // Auth: 5 requests per 15 minutes
  auth: {
    interval: 15 * 60 * 1000,
    uniqueTokenPerInterval: 5,
  },
};

/**
 * Usage example:
 * 
 * // In API route
 * export async function POST(request: NextRequest) {
 *   const rateLimitResponse = await rateLimit(request, RateLimitPresets.strict);
 *   if (rateLimitResponse) return rateLimitResponse;
 *   
 *   // Continue with normal logic
 *   return NextResponse.json({ success: true });
 * }
 */
