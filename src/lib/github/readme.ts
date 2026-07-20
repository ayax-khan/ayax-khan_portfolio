import 'server-only'

import { env } from '@/lib/env'
import { githubFetchJson } from '@/lib/github/client'
import { getGithubCache, isFresh, setGithubCache } from '@/lib/github/cache'

const README_TTL_SECONDS = 60 * 60

function argsHashFrom(parts: unknown): string {
  return Buffer.from(JSON.stringify(parts)).toString('base64url')
}

type GithubReadmeResponse = {
  name: string
  content: string
  encoding: string
  download_url: string
}

function githubOwner(): string {
  return process.env.GITHUB_ORG || env.GITHUB_USERNAME
}

export async function getRepoReadme(repoName: string): Promise<string | null> {
  if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_TOKEN) return null

  const owner = githubOwner()
  const repo = repoName
  const kind = 'readme'
  const argsHash = argsHashFrom({})

  const cached = await getGithubCache({ owner, repo, kind, argsHash })
  if (cached && isFresh(cached.expiresAt)) {
    const body = cached.body as string | null
    return body
  }

  try {
    const result = await githubFetchJson<GithubReadmeResponse>(
      `/repos/${owner}/${repo}/readme`,
      { owner, repo, kind, argsHash, etag: cached?.etag ?? null, ttlSeconds: README_TTL_SECONDS },
    )

    if (result.status === 'not_modified' && cached) {
      await setGithubCache({
        owner, repo, kind, argsHash,
        etag: result.etag ?? cached.etag,
        body: cached.body,
        expiresAt: result.expiresAt,
      })
      return cached.body as string | null
    }

    if (result.status !== 'fresh') return null

    const content = Buffer.from(result.data.content, 'base64').toString('utf-8')

    await setGithubCache({ owner, repo, kind, argsHash, etag: result.etag, body: content, expiresAt: result.expiresAt })
    return content
  } catch {
    return null
  }
}
