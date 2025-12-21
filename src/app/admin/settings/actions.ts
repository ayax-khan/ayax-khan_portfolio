'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'

const SettingInput = z.object({
  key: z.string().min(1).max(100),
  value: z.string().min(0).max(10_000),
})

export async function upsertSetting(input: unknown) {
  const parsed = SettingInput.safeParse(input)
  if (!parsed.success) throw new Error('Invalid input')

  await prisma.setting.upsert({
    where: { key: parsed.data.key },
    create: { key: parsed.data.key, value: { value: parsed.data.value } },
    update: { value: { value: parsed.data.value } },
  })
}
