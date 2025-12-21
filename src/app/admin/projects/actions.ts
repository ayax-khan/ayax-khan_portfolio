'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'

const UpsertOverrideSchema = z.object({
  repoFullName: z.string().min(3),
  visible: z.boolean().optional(),
  featured: z.boolean().optional(),
  demoUrl: z.string().url().nullable().optional(),
  customTitle: z.string().min(1).max(120).nullable().optional(),
  customSummary: z.string().min(1).max(500).nullable().optional(),
  sortOrder: z.number().int().nullable().optional(),
})

export async function upsertProjectOverride(input: unknown) {
  const parsed = UpsertOverrideSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error('Invalid input')
  }

  const { repoFullName, ...data } = parsed.data

  await prisma.projectOverride.upsert({
    where: { repoFullName },
    create: {
      repoFullName,
      visible: data.visible ?? true,
      featured: data.featured ?? false,
      demoUrl: data.demoUrl ?? null,
      customTitle: data.customTitle ?? null,
      customSummary: data.customSummary ?? null,
      sortOrder: data.sortOrder ?? null,
    },
    update: {
      ...data,
    },
  })
}

export async function deleteProjectOverride(repoFullName: string) {
  await prisma.projectOverride.delete({ where: { repoFullName } })
}
