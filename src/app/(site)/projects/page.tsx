import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui/LinkButton'
import { ClickableCard } from '@/components/ui/ClickableCard'
import { ExternalButton } from '@/components/ui/ExternalButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getProjectsFromGithub } from '@/lib/github/repos'

export const metadata = {
  title: 'Projects',
  description: 'A curated list of projects synced from GitHub, with portfolio-specific details.',
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const selectedTag = String(sp.tag ?? '').trim()

  const projects = await getProjectsFromGithub()

  const languages = Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))
    .sort()
    .slice(0, 12)

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort()

  const filteredProjects = selectedTag ? projects.filter((p) => p.tags.includes(selectedTag)) : projects

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          Synced from GitHub (server-side) with database overrides for visibility, featured status, and demo links.
        </p>
      </header>

      {languages.length ? (
        <section className="space-y-3">
          <SectionHeading title="Top languages" description="A quick view of the technologies across my repos." />
          <div className="flex flex-wrap gap-2">
            {languages.map((l) => (
              <Badge key={l} variant="muted">
                {l}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      {allTags.length ? (
        <section className="space-y-3">
          <SectionHeading title="Tags" description="Filter projects by tag." />
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/projects" variant={selectedTag ? 'ghost' : 'secondary'}>
              All
            </LinkButton>
            {allTags.map((t) => (
              <LinkButton
                key={t}
                href={`/projects?tag=${encodeURIComponent(t)}`}
                variant={selectedTag === t ? 'secondary' : 'ghost'}
              >
                {t}
              </LinkButton>
            ))}
          </div>
        </section>
      ) : null}

      {filteredProjects.length === 0 ? (
        <Card title={selectedTag ? `No projects for tag: ${selectedTag}` : 'No projects yet'}>
          <p>
            Configure <span className="font-mono">GITHUB_USERNAME</span> and <span className="font-mono">GITHUB_TOKEN</span> to
            fetch your repos.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredProjects.map((p) => (
            <ClickableCard key={p.fullName} href={`/projects/${p.slug}`} ariaLabel={p.name}>
              <Card
                title={p.name}
                footer={
                  <div className="flex flex-wrap gap-2">
                    <ExternalButton href={p.repoUrl}>GitHub</ExternalButton>
                    {p.demoUrl ? <ExternalButton href={p.demoUrl}>Live demo</ExternalButton> : null}
                  </div>
                }
              >
                <p>{p.description ?? '—'}</p>

                {p.tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Badge key={t} variant="muted">
                        {t}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                <p className="mt-3 text-xs text-[color:var(--muted)]">
                  {p.language ?? 'N/A'} · ★ {p.stars} · Updated {new Date(p.updatedAt).toISOString().slice(0, 10)}
                </p>
              </Card>
            </ClickableCard>
          ))}
        </div>
      )}
    </div>
  )
}
