import 'server-only'

import crypto from 'node:crypto'
import { headers } from 'next/headers'

type HeaderLike = { get(name: string): string | null }

function sha256Hex(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export function getClientIp(headersList: HeaderLike): string | null {
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    // first IP in list is the client
    const first = forwardedFor.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = headersList.get('x-real-ip')
  if (realIp) return realIp
  return null
}

export async function requestFingerprint() {
  const h = await headers()
  const ip = getClientIp(h) ?? 'unknown'
  const ua = h.get('user-agent') ?? 'unknown'
  const origin = h.get('origin')
  const host = h.get('host')

  const ipHash = sha256Hex(ip)
  const visitorId = sha256Hex(`${ipHash}:${ua}`)

  // Store only hashed identifiers to reduce sensitivity.
  return {
    ip,
    ipHash,
    visitorId,
    userAgent: ua,
    origin,
    host,
  }
}
