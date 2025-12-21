'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { env } from '@/lib/env'

function parseTags(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.replace(/\s+/g, ' '))
    .slice(0, 20)
}

const UpdateOverrideSchema = z.object({
  repoFullName: z.string().min(3),
  visible: z.boolean().optional(),
  featured: z.boolean().optional(),
  demoUrl: z.string().url().nullable().optional(),
  customTitle: z.string().min(1).max(120).nullable().optional(),
  customSummary: z.string().min(1).max(500).nullable().optional(),
  tags: z.array(z.string().min(1).max(30)).max(20).optional(),
  sortOrder: z.number().int().nullable().optional(),
})

export async function updateProjectOverride(input: unknown) {
  const parsed = UpdateOverrideSchema.safeParse(input)
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
      tags: data.tags ?? [],
      sortOrder: data.sortOrder ?? null,
    },
    update: {
      ...data,
    },
  })
}

export async function resetProjectOverride(repoFullName: string) {
  await prisma.projectOverride.delete({ where: { repoFullName } })
}

export async function resetProjectOverrideFromForm(formData: FormData) {
  const repoFullName = String(formData.get('repoFullName') ?? '')
  if (!repoFullName) return
  await resetProjectOverride(repoFullName)
}

export async function syncGithubNow() {
  const owner = env.GITHUB_USERNAME
  // Clear cached repo list and any commit caches for this owner.
  await prisma.githubApiCache.deleteMany({
    where: {
      owner,
      kind: { in: ['repos', 'repo', 'commits'] },
    },
  })
}

export async function saveProjectOrderFromForm(formData: FormData) {
  const raw = String(formData.get('orderJson') ?? '')
  if (!raw) return

  const parsed = z.array(z.string().min(3)).safeParse(JSON.parse(raw))
  if (!parsed.success) throw new Error('Invalid order payload')

  const order = parsed.data

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < order.length; i++) {
      const repoFullName = order[i]
      await tx.projectOverride.upsert({
        where: { repoFullName },
        create: {
          repoFullName,
          visible: true,
          featured: false,
          demoUrl: null,
          customTitle: null,
          customSummary: null,
          tags: [],
          sortOrder: i,
        },
        update: { sortOrder: i },
      })
    }
  })
}

export async function updateProjectOverrideFromForm(formData: FormData) {
  const repoFullName = String(formData.get('repoFullName') ?? '')
  const visible = formData.get('visible') === 'on'
  const featured = formData.get('featured') === 'on'
  const demoUrlRaw = String(formData.get('demoUrl') ?? '').trim()
  const customTitleRaw = String(formData.get('customTitle') ?? '').trim()
  const customSummaryRaw = String(formData.get('customSummary') ?? '').trim()
  const sortOrderRaw = String(formData.get('sortOrder') ?? '').trim()
  const tagsRaw = String(formData.get('tags') ?? '').trim()

  await updateProjectOverride({
    repoFullName,
    visible,
    featured,
    demoUrl: demoUrlRaw ? demoUrlRaw : null,
    customTitle: customTitleRaw ? customTitleRaw : null,
    customSummary: customSummaryRaw ? customSummaryRaw : null,
    tags: tagsRaw ? parseTags(tagsRaw) : [],
    sortOrder: sortOrderRaw ? Number(sortOrderRaw) : null,
  })
}
