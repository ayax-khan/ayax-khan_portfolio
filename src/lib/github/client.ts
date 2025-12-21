import 'server-only'

import { env } from '@/lib/env'

const GITHUB_API_BASE = 'https://api.github.com'

export type GithubFetchOptions = {
  // cache key parts for DB caching
  owner: string
  repo: string
  kind: string
  argsHash: string
  etag?: string | null
  ttlSeconds: number
}

export type GithubFetchResult<T> =
  | {
      status: 'fresh'
      data: T
      etag: string | null
      expiresAt: Date
    }
  | {
      status: 'not_modified'
      etag: string | null
      expiresAt: Date
    }

export async function githubFetchJson<T>(
  path: string,
  opts: GithubFetchOptions,
): Promise<GithubFetchResult<T>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-site',
    }

    if (opts.etag) headers['If-None-Match'] = opts.etag

    const res = await fetch(`${GITHUB_API_BASE}${path}`, {
      method: 'GET',
      headers,
      signal: controller.signal,
      // never rely on Next cache here; we implement DB caching.
      cache: 'no-store',
    })

    const etag = res.headers.get('etag')
    const expiresAt = new Date(Date.now() + opts.ttlSeconds * 1000)

    if (res.status === 304) {
      return { status: 'not_modified', etag, expiresAt }
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`GitHub API error ${res.status}: ${text}`)
    }

    const data = (await res.json()) as T
    return { status: 'fresh', data, etag, expiresAt }
  } finally {
    clearTimeout(timeout)
  }
}
