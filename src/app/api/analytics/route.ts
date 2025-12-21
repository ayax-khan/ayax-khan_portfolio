import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requestFingerprint } from '@/lib/security/requestFingerprint'

export const dynamic = 'force-dynamic'

const EventSchema = z.object({
  type: z.enum(['PAGE_VIEW', 'CLICK', 'PROJECT_INTEREST']),
  path: z.string().min(1).max(500),
  referrer: z.string().max(500).optional(),
  meta: z.record(z.string(), z.any()).optional(),
})

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const parsed = EventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const fp = await requestFingerprint()

  await prisma.analyticsEvent.create({
    data: {
      type: parsed.data.type,
      path: parsed.data.path,
      referrer: parsed.data.referrer ?? null,
      meta: {
        ...(parsed.data.meta ?? {}),
        visitorId: fp.visitorId,
        ua: fp.userAgent,
      },
    },
  })

  return NextResponse.json({ ok: true })
}
