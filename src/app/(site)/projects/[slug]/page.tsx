import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TrackedLinkButton } from '@/components/analytics/TrackedLinkButton'
import { LinkButton } from '@/components/ui/LinkButton'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getProjectsFromGithub } from '@/lib/github/repos'
import { getRepoCommits } from '@/lib/github/commits'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return {
    title: `Project: ${slug}`,
    description: `Project details and recent activity for ${slug}.`,
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

  const commits = await getRepoCommits({ repoName: slug, perPage: 25 })

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{project.language ?? 'N/A'}</Badge>
          <Badge variant="muted">★ {project.stars}</Badge>
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

      <section className="grid gap-4 md:grid-cols-2">
        <Card title="Overview">
          <p>
            Key outcomes, architecture notes, and what you learned can go here.
            If you want, we can later fetch the repo README and render it (cached) as the long description.
          </p>
        </Card>
        <Card title="Highlights">
          <ul className="list-disc space-y-1 pl-5">
            <li>Feature 1 / result</li>
            <li>Feature 2 / result</li>
            <li>Performance/security improvement</li>
          </ul>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading title="Recent commits" description="A small timeline from the latest GitHub activity." />
        {commits.length === 0 ? (
          <Card title="No commits found">
            <p>This can happen if the repo is private, empty, or GitHub credentials are not configured.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {commits.map((c) => (
              <div key={c.sha} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <p className="text-sm font-medium text-[color:var(--fg)]">{c.message.split('\n')[0]}</p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  {new Date(c.date).toLocaleString()} · <span className="font-mono">{c.sha.slice(0, 7)}</span>
                </p>
                <div className="mt-3">
                  <Link href={c.url} target="_blank" rel="noreferrer" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                    View on GitHub →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
