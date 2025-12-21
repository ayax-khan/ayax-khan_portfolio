import 'server-only'

import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export async function getGithubCache(args: {
  owner: string
  repo: string
  kind: string
  argsHash: string
}): Promise<{
  etag: string | null
  body: Prisma.InputJsonValue
  expiresAt: Date
} | null> {
  const entry = await prisma.githubApiCache.findUnique({
    where: {
      owner_repo_kind_argsHash: {
        owner: args.owner,
        repo: args.repo,
        kind: args.kind,
        argsHash: args.argsHash,
      },
    },
  })

  if (!entry) return null

  // Prisma returns JsonValue (nullable); our cache entries should always be non-null JSON.
  if (entry.body === null) return null

  return {
    etag: entry.etag,
    body: entry.body as unknown as Prisma.InputJsonValue,
    expiresAt: entry.expiresAt,
  }
}

export async function setGithubCache(args: {
  owner: string
  repo: string
  kind: string
  argsHash: string
  etag: string | null
  body: Prisma.InputJsonValue
  expiresAt: Date
}): Promise<void> {
  await prisma.githubApiCache.upsert({
    where: {
      owner_repo_kind_argsHash: {
        owner: args.owner,
        repo: args.repo,
        kind: args.kind,
        argsHash: args.argsHash,
      },
    },
    create: {
      owner: args.owner,
      repo: args.repo,
      kind: args.kind,
      argsHash: args.argsHash,
      etag: args.etag,
      body: args.body,
      expiresAt: args.expiresAt,
    },
    update: {
      etag: args.etag,
      body: args.body,
      fetchedAt: new Date(),
      expiresAt: args.expiresAt,
    },
  })
}

export function isFresh(expiresAt: Date) {
  return expiresAt.getTime() > Date.now()
}
