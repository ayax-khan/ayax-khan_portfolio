import 'server-only'

import { env } from '@/lib/env'
import { githubFetchJson } from '@/lib/github/client'
import { getGithubCache, isFresh, setGithubCache } from '@/lib/github/cache'
import type { GithubCommit } from '@/lib/github/types'

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

  const owner = env.GITHUB_USERNAME
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
