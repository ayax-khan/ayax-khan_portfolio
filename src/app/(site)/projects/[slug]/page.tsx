import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton'
import { LinkButton } from '@/components/ui/LinkButton'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Markdown } from '@/components/ui/Markdown'
import { Prose } from '@/components/ui/Prose'
import { getProjectsFromGithub } from '@/lib/github/repos'
import { getRepoReadme } from '@/lib/github/readme'
import { getRepoCommitCount } from '@/lib/github/commits'

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
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{project.language ?? 'N/A'}</Badge>
          <Badge variant="muted">&starf; {project.stars}</Badge>
          <Badge variant="muted">{commitCount} commits</Badge>
          <Badge variant="muted">Updated {new Date(project.updatedAt).toISOString().slice(0, 10)}</Badge>
          {project.tags.map((t) => (
            <Badge key={t} variant="muted">
              {t}
            </Badge>
          ))}
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <p className="mt-2 max-w-2xl text-[color:var(--muted)]">{project.description ?? '—'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <TrackedLinkButton
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            analyticsMeta={{ kind: 'github_repo', repoFullName: project.fullName, slug: project.slug }}
          >
            GitHub Repo
          </TrackedLinkButton>
          {project.demoUrl ? (
            <TrackedLinkButton
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              variant="ghost"
              analyticsMeta={{ kind: 'demo', repoFullName: project.fullName, slug: project.slug }}
            >
              Live Demo
            </TrackedLinkButton>
          ) : null}
          <LinkButton href="/projects" variant="ghost">
            All Projects
          </LinkButton>
        </div>
      </header>

      {readme ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">README</h2>
          <Prose>
            <Markdown content={readme} />
          </Prose>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          <Card title="Overview">
            <p>No README found for this repository.</p>
          </Card>
          <Card title="Highlights">
            <ul className="list-disc space-y-1 pl-5">
              <li>Language: {project.language ?? 'N/A'}</li>
              <li>Stars: {project.stars}</li>
              <li>Commits: {commitCount}</li>
              {project.demoUrl ? <li>Demo: <Link href={project.demoUrl} target="_blank" rel="noreferrer" className="text-[color:var(--muted)] hover:text-[color:var(--fg)]">available</Link></li> : null}
            </ul>
          </Card>
        </section>
      )}
    </div>
  )
}
