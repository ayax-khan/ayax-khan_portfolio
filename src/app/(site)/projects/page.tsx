import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getProjectsFromGithub } from '@/lib/github/repos'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/brand-icons'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Featured projects synced from GitHub with portfolio-specific details.',
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    const sp = await searchParams
    const selectedTag = String(sp.tag ?? '').trim()

    const allProjects = await getProjectsFromGithub().catch(() => [])
    const projects = allProjects.filter((p) => p.featured)

    const allTags = Array.from(new Set(projects.flatMap((p) => p.tags ?? []))).sort()
    const filteredProjects = selectedTag ? projects.filter((p) => p.tags.includes(selectedTag)) : projects

    return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <header className="max-w-3xl">
        <p className="mb-3 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
          Portfolio
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
          Production-ready applications, AI systems, and tools I have built.
        </p>
        <a
          href="https://github.com/orgs/DEVSSDO/repositories"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-all hover:bg-[var(--surface-2)] hover:shadow-sm"
        >
          <GithubIcon size={16} />
          Browse all repositories on GitHub
        </a>
      </header>

      {allTags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-1.5">
          <Link
            href="/projects"
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all ${
              !selectedTag
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
            }`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/projects?tag=${encodeURIComponent(t)}`}
              className={`rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedTag === t
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null}

      {filteredProjects.length === 0 ? (
        <Card title={selectedTag ? `No projects for tag: ${selectedTag}` : 'No featured projects yet'} className="mt-10">
          <p>Mark projects as featured in the admin panel to see them here.</p>
        </Card>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filteredProjects.map((p) => (
            <Link
              key={p.fullName}
              href={`/projects/${p.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative h-40 w-full bg-[var(--surface-2)] sm:h-44">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[var(--muted-2)] opacity-20">
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent opacity-60" />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[var(--fg)] group-hover:text-[var(--accent)]">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                    {p.description ?? 'No description available.'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <Badge key={t} variant="muted">{t}</Badge>
                    ))}
                    {p.language ? <Badge variant="accent">{p.language}</Badge> : null}
                  </div>

                  <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)] pt-3">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--muted-2)]">
                      <GithubIcon size={13} />
                      {p.stars} stars
                    </span>
                    <div className="ml-auto flex gap-1.5">
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                        aria-label={`View ${p.name} on GitHub`}
                      >
                        <GithubIcon size={15} />
                      </a>
                      {p.demoUrl ? (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                          aria-label={`View ${p.name} demo`}
                        >
                          <ExternalLink size={15} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
  } catch (err) {
    console.error('Projects page error:', err)
    return (
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">Projects</h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">Something went wrong loading projects. Please try again later.</p>
        </header>
      </div>
    )
  }
}
