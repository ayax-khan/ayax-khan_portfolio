export type GithubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  archived: boolean
  disabled: boolean
  fork: boolean
  pushed_at: string
  updated_at: string
  homepage: string | null
  topics?: string[]
}

export type GithubCommit = {
  sha: string
  html_url: string
  commit: {
    message: string
    author: { name: string; email: string; date: string } | null
    committer: { name: string; email: string; date: string } | null
  }
  author: { login: string; avatar_url: string; html_url: string } | null
}
