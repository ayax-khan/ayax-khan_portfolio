import 'server-only'

import { z } from 'zod'

/**
 * Build-friendly environment access.
 *
 * - `next build` may run without runtime env vars.
 * - Sensitive vars MUST still be present at runtime (GitHub token, DB URL).
 */

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function optional(name: string): string | undefined {
  const v = process.env[name]
  return v && v.length > 0 ? v : undefined
}

export const env = {
  // Profile/site (optional)
  get PROFILE_NAME() {
    return optional('PROFILE_NAME')
  },
  get PROFILE_ROLE() {
    return optional('PROFILE_ROLE')
  },
  get PROFILE_HEADLINE() {
    return optional('PROFILE_HEADLINE')
  },
  get PROFILE_LOCATION() {
    return optional('PROFILE_LOCATION')
  },
  get PROFILE_EMAIL() {
    return optional('PROFILE_EMAIL')
  },
  get SITE_DESCRIPTION() {
    return optional('SITE_DESCRIPTION')
  },
  get SOCIAL_GITHUB() {
    return optional('SOCIAL_GITHUB')
  },
  get SOCIAL_LINKEDIN() {
    return optional('SOCIAL_LINKEDIN')
  },
  get SOCIAL_X() {
    return optional('SOCIAL_X')
  },

  get DATABASE_URL() {
    return z.string().url().parse(required('DATABASE_URL'))
  },
  get GITHUB_TOKEN() {
    return z.string().min(1).parse(required('GITHUB_TOKEN'))
  },
  get GITHUB_USERNAME() {
    return z.string().min(1).parse(required('GITHUB_USERNAME'))
  },
  // Safe default to allow build without env.
  get SITE_URL() {
    return z.string().url().parse(process.env.SITE_URL ?? 'http://localhost:3000')
  },
  get UPSTASH_REDIS_REST_URL() {
    const v = optional('UPSTASH_REDIS_REST_URL')
    return v ? z.string().url().parse(v) : undefined
  },
  get UPSTASH_REDIS_REST_TOKEN() {
    const v = optional('UPSTASH_REDIS_REST_TOKEN')
    return v ? z.string().min(1).parse(v) : undefined
  },
} as const
