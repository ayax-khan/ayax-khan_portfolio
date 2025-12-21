'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { rateLimitOrSkip } from '@/lib/security/rateLimit'
import { requestFingerprint } from '@/lib/security/requestFingerprint'

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(5000),
})

export type ContactActionState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function submitContact(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  }

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid form input. Please check your entries.' }
  }

  const fp = await requestFingerprint()

  // Lightweight CSRF posture: ensure same-origin.
  // This is defense-in-depth; Next.js server actions already include protections.
  const origin = fp.origin
  const host = fp.host
  if (origin && host) {
    try {
      const o = new URL(origin)
      if (o.host !== host) {
        return { status: 'error', message: 'Request rejected.' }
      }
    } catch {
      return { status: 'error', message: 'Request rejected.' }
    }
  }

  // Rate limit primarily by hashed IP (best-effort), plus by email as a secondary guard.
  const [byIp, byEmail] = await Promise.all([
    rateLimitOrSkip(`contact:ip:${fp.ipHash}`),
    rateLimitOrSkip(`contact:email:${parsed.data.email}`),
  ])

  if (!byIp.ok || !byEmail.ok) {
    return { status: 'error', message: 'Too many requests. Please try again later.' }
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      ipHash: fp.ipHash,
      userAgent: fp.userAgent,
    },
  })

  return { status: 'success' }
}
