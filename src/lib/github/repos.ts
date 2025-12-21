import 'server-only'

import { env } from '@/lib/env'
import { githubFetchJson } from '@/lib/github/client'
import { getGithubCache, isFresh, setGithubCache } from '@/lib/github/cache'
import type { GithubRepo } from '@/lib/github/types'
import { prisma } from '@/lib/db'

export type PortfolioProject = {
  slug: string
  name: string
  fullName: string
  description: string | null
  language: string | null
  stars: number
  updatedAt: string
  repoUrl: string
  demoUrl: string | null
  featured: boolean
  visible: boolean
  tags: string[]
  sortOrder: number | null
  isFork: boolean
  archived: boolean
}

const REPOS_TTL_SECONDS = 60 * 20

function argsHashFrom(parts: unknown): string {
  // stable enough for our usage
  return Buffer.from(JSON.stringify(parts)).toString('base64url')
}

export async function getProjectsFromGithub(options?: {
  includeHidden?: boolean
  includeForks?: boolean
  includeArchived?: boolean
  overrides?: Awaited<ReturnType<typeof prisma.projectOverride.findMany>>
}): Promise<PortfolioProject[]> {
  // Allow `next build` without env vars; production requires them.
  if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_TOKEN) return []

  const owner = env.GITHUB_USERNAME
  const repo = '_' // placeholder (we cache repo list under a single bucket)
  const kind = 'repos'
  const argsHash = argsHashFrom({ type: 'user_repos', owner })

  const cached = await getGithubCache({ owner, repo, kind, argsHash })
  if (cached && isFresh(cached.expiresAt)) {
    return mapReposToProjects(Array.isArray(cached.body) ? (cached.body as unknown as GithubRepo[]) : [], options)
  }

  const result = await githubFetchJson<GithubRepo[]>(
    `/users/${owner}/repos?per_page=100&sort=pushed&direction=desc`,
    { owner, repo, kind, argsHash, etag: cached?.etag ?? null, ttlSeconds: REPOS_TTL_SECONDS },
  )

  if (result.status === 'not_modified' && cached) {
    await setGithubCache({
      owner,
      repo,
      kind,
      argsHash,
      etag: result.etag ?? cached.etag,
      body: cached.body,
      expiresAt: result.expiresAt,
    })
    return mapReposToProjects(Array.isArray(cached.body) ? (cached.body as unknown as GithubRepo[]) : [], options)
  }

  if (result.status !== 'fresh') {
    throw new Error('Unexpected GitHub cache state')
  }

  await setGithubCache({ owner, repo, kind, argsHash, etag: result.etag, body: result.data, expiresAt: result.expiresAt })
  return mapReposToProjects(result.data, options)
}

async function mapReposToProjects(
  repos: GithubRepo[],
  options?: {
    includeHidden?: boolean
    includeForks?: boolean
    includeArchived?: boolean
    overrides?: Awaited<ReturnType<typeof prisma.projectOverride.findMany>>
  },
): Promise<PortfolioProject[]> {
  const overrides =
    options?.overrides ??
    (await (async () => {
      try {
        return await prisma.projectOverride.findMany()
      } catch {
        // If DB schema is behind (e.g. migration not applied yet), fall back to no overrides.
        return []
      }
    })())
  const overrideMap = new Map(overrides.map((o) => [o.repoFullName, o]))

  const projects = repos
    .filter((r) => !r.disabled)
    .filter((r) => (options?.includeForks ? true : !r.fork))
    .filter((r) => (options?.includeArchived ? true : !r.archived))
    .map((r) => {
      const o = overrideMap.get(r.full_name)
      const slug = r.name.toLowerCase()

      return {
        slug,
        name: o?.customTitle ?? r.name,
        fullName: r.full_name,
        description: o?.customSummary ?? r.description,
        language: r.language,
        stars: r.stargazers_count,
        updatedAt: r.pushed_at,
        repoUrl: r.html_url,
        demoUrl: o?.demoUrl ?? r.homepage,
        featured: o?.featured ?? false,
        visible: o?.visible ?? true,
        tags: o?.tags ?? [],
        sortOrder: o?.sortOrder ?? null,
        isFork: r.fork,
        archived: r.archived,
      }
    })

  const visibleProjects = options?.includeHidden ? projects : projects.filter((p) => p.visible)

  return visibleProjects
    .sort((a, b) => {
      // sortOrder asc (smaller first) when present
      const ao = a.sortOrder
      const bo = b.sortOrder
      if (ao != null && bo != null && ao !== bo) return ao - bo
      if (ao == null && bo != null) return 1
      if (ao != null && bo == null) return -1
      return Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt)
    })
}
