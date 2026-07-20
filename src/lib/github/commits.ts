import 'server-only'

import { env } from '@/lib/env'
import { githubFetchJson } from '@/lib/github/client'
import { getGithubCache, isFresh, setGithubCache } from '@/lib/github/cache'
import type { GithubCommit } from '@/lib/github/types'

function githubOwner(): string {
  return process.env.GITHUB_ORG || env.GITHUB_USERNAME
}

export type CommitItem = {
  sha: string
  message: string
  date: string
  url: string
}

const COMMITS_TTL_SECONDS = 60 * 10

function argsHashFrom(parts: unknown): string {
  return Buffer.from(JSON.stringify(parts)).toString('base64url')
}

export async function getRepoCommits(args: {
  repoName: string
  perPage?: number
}): Promise<CommitItem[]> {
  if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_TOKEN) return []

  const owner = githubOwner()
  const repo = args.repoName
  const kind = 'commits'
  const perPage = args.perPage ?? 30
  const argsHash = argsHashFrom({ perPage })

  const cached = await getGithubCache({ owner, repo, kind, argsHash })
  if (cached && isFresh(cached.expiresAt)) {
    return mapCommits(Array.isArray(cached.body) ? (cached.body as unknown as GithubCommit[]) : [])
  }

  const result = await githubFetchJson<GithubCommit[]>(
    `/repos/${owner}/${repo}/commits?per_page=${perPage}`,
    { owner, repo, kind, argsHash, etag: cached?.etag ?? null, ttlSeconds: COMMITS_TTL_SECONDS },
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
    return mapCommits(Array.isArray(cached.body) ? (cached.body as unknown as GithubCommit[]) : [])
  }

  if (result.status !== 'fresh') {
    throw new Error('Unexpected GitHub cache state')
  }

  await setGithubCache({ owner, repo, kind, argsHash, etag: result.etag, body: result.data, expiresAt: result.expiresAt })
  return mapCommits(result.data)
}

function mapCommits(commits: GithubCommit[]): CommitItem[] {
  return commits.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    date: c.commit.author?.date ?? c.commit.committer?.date ?? new Date().toISOString(),
    url: c.html_url,
  }))
}

export async function getRepoCommitCount(repoName: string): Promise<number> {
  if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_TOKEN) return 0

  const owner = githubOwner()
  const repo = repoName
  const kind = 'commit-count'
  const argsHash = argsHashFrom({})

  const cached = await getGithubCache({ owner, repo, kind, argsHash })
  if (cached && isFresh(cached.expiresAt)) {
    return (cached.body as number) ?? 0
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&page=1`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          'User-Agent': 'portfolio-site',
        },
        cache: 'no-store',
      },
    )

    let count = 0
    const link = res.headers.get('link')
    if (link) {
      const match = link.match(/page=(\d+)>; rel="last"/)
      if (match) count = parseInt(match[1]!, 10)
    }

    if (count === 0) {
      const body = (await res.json()) as unknown[]
      count = body.length
    }

    const expiresAt = new Date(Date.now() + COMMITS_TTL_SECONDS * 1000)
    await setGithubCache({ owner, repo, kind, argsHash, etag: null, body: count, expiresAt })
    return count
  } catch {
    return 0
  }
}
