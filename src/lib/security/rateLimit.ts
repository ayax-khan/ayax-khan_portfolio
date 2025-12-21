import 'server-only'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from '@/lib/env'

export type RateLimitResult = {
  ok: boolean
  limit: number
  remaining: number
  reset: number
}

let ratelimit: Ratelimit | null = null

function getRatelimit() {
  if (ratelimit) return ratelimit
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
  })

  return ratelimit
}

export async function rateLimitOrSkip(key: string): Promise<RateLimitResult> {
  const rl = getRatelimit()
  if (!rl) {
    // Postgres-only fallback can be added later; for now we skip when Redis is not configured.
    return { ok: true, limit: 0, remaining: 0, reset: 0 }
  }

  const result = await rl.limit(key)
  return {
    ok: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}
