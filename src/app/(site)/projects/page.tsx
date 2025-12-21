import { Card } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui/LinkButton'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getProjectsFromGithub } from '@/lib/github/repos'

export const metadata = {
  title: 'Projects',
  description: 'A curated list of projects synced from GitHub, with portfolio-specific details.',
}

export default async function ProjectsPage() {
  const projects = await getProjectsFromGithub()

  const languages = Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))
    .sort()
    .slice(0, 12)

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

      {projects.length === 0 ? (
        <Card title="No projects yet">
          <p>
            Configure <span className="font-mono">GITHUB_USERNAME</span> and <span className="font-mono">GITHUB_TOKEN</span> to
            fetch your repos.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Card
              key={p.fullName}
              title={p.name}
              footer={
                <div className="flex flex-wrap gap-2">
                  <LinkButton href={`/projects/${p.slug}`} variant="secondary">
                    Details
                  </LinkButton>
                  <LinkButton href={p.repoUrl} variant="ghost" target="_blank" rel="noreferrer">
                    GitHub
                  </LinkButton>
                  {p.demoUrl ? (
                    <LinkButton href={p.demoUrl} variant="ghost" target="_blank" rel="noreferrer">
                      Live demo
                    </LinkButton>
                  ) : null}
                </div>
              }
            >
              <p>{p.description ?? '—'}</p>
              <p className="mt-3 text-xs text-[color:var(--muted)]">
                {p.language ?? 'N/A'} · ★ {p.stars} · Updated {new Date(p.updatedAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
