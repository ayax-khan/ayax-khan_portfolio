import { NextResponse } from 'next/server'
import { getRepoCommits } from '@/lib/github/commits'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const repoName = String(url.searchParams.get('repo') ?? '').trim()
  if (!repoName) {
    return NextResponse.json({ error: 'Missing repo' }, { status: 400 })
  }

  const commits = await getRepoCommits({ repoName, perPage: 20 })
  return NextResponse.json({ commits })
}
