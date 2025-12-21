import 'server-only'

import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export type SettingValue = { value: Prisma.InputJsonValue }

export async function getSetting<T>(key: string): Promise<T | null> {
  if (!process.env.DATABASE_URL) return null
  const s = await prisma.setting.findUnique({ where: { key } })
  if (!s) return null
  const v = s.value as unknown as SettingValue | null
  if (!v || typeof v !== 'object' || !('value' in v)) return null
  return v.value as T
}

export async function setSetting(key: string, value: Prisma.InputJsonValue) {
  if (!process.env.DATABASE_URL) throw new Error('Database not configured')
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: { value } },
    update: { value: { value } },
  })
}
