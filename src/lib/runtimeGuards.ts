export function hasGithubEnv() {
  return Boolean(process.env.GITHUB_USERNAME && process.env.GITHUB_TOKEN)
}

export function hasDatabaseEnv() {
  return Boolean(process.env.DATABASE_URL)
}
