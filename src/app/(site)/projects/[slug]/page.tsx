import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Markdown } from '@/components/ui/Markdown'
import { getProjectsFromGithub } from '@/lib/github/repos'
import { getRepoReadme } from '@/lib/github/readme'
import { getRepoCommitCount } from '@/lib/github/commits'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/brand-icons'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return {
    title: `Project: ${slug}`,
    description: `Project details and README for ${slug}.`,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const projects = await getProjectsFromGithub()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return notFound()

  const [readme, commitCount] = await Promise.all([
    getRepoReadme(slug),
    getRepoCommitCount(slug),
  ])

  return (
    <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="muted">{project.language ?? 'N/A'}</Badge>
          <Badge variant="muted">★ {project.stars}</Badge>
          <Badge variant="muted">{commitCount} commits</Badge>
          <Badge variant="muted">Updated {new Date(project.updatedAt).toISOString().slice(0, 10)}</Badge>
          {project.tags.map((t) => (
            <Badge key={t} variant="muted">{t}</Badge>
          ))}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-3xl">{project.name}</h1>
          <p className="mt-2 text-base leading-relaxed text-[var(--muted)]">{project.description ?? '—'}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] hover:shadow-md"
          >
            <GithubIcon size={15} />
            GitHub Repo
          </a>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--fg)] transition-all hover:bg-[var(--surface-2)] hover:shadow-sm"
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          ) : null}
        </div>
      </header>

      <div className="mt-10">
        {readme ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8">
            <Markdown content={readme} />
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <Card title="Overview">
              <p>No README found for this repository.</p>
            </Card>
            <Card title="Highlights">
              <ul className="space-y-1 pl-4" style={{ listStyleType: 'disc' }}>
                <li>Language: {project.language ?? 'N/A'}</li>
                <li>Stars: {project.stars}</li>
                <li>Commits: {commitCount}</li>
                {project.demoUrl ? <li>Demo: available</li> : null}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
