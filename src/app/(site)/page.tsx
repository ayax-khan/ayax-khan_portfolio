import Link from 'next/link'
import { LinkButton } from '@/components/ui/LinkButton'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getProjectsFromGithub } from '@/lib/github/repos'
import { listPublishedPosts } from '@/lib/blog'
import { site, socialLinks } from '@/lib/site'

export const metadata = {
  title: 'Home',
  description: 'Projects, writing, and contact information.',
}

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getProjectsFromGithub(), listPublishedPosts()])

  const featured = projects.filter((p) => p.featured).slice(0, 3)
  const latestPosts = posts.slice(0, 3)

  return (
    <div className="space-y-14">
      <section className="rounded-3xl border border-[color:var(--border)] bg-gradient-to-b from-[color:var(--surface-2)] to-[color:var(--surface)] p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{site.role}</Badge>
          <Badge variant="muted">{site.location}</Badge>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{site.name}</h1>
        <p className="mt-4 max-w-2xl text-[color:var(--muted)]">{site.headline}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href="/projects">View Projects</LinkButton>
          <LinkButton href="/contact" variant="secondary">Contact</LinkButton>
          <LinkButton href="/about" variant="ghost">About</LinkButton>
          {socialLinks().slice(0, 2).map((l) => (
            <LinkButton key={l.href} href={l.href} variant="ghost" target="_blank" rel="noreferrer">
              {l.label}
            </LinkButton>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card title="Security-first">
            <p>Validation, least-privilege secrets, hardened headers, and safe server actions.</p>
          </Card>
          <Card title="Performance">
            <p>Server-side data fetching, caching where it matters, and clean user experiences.</p>
          </Card>
          <Card title="Product mindset">
            <p>Clear outcomes, measurable improvements, and a focus on maintainability.</p>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Featured Projects"
          description="A selection of work synced from GitHub with portfolio-specific overrides."
          action={
            <Link href="/projects" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              See all
            </Link>
          }
        />

        {featured.length === 0 ? (
          <Card title="No featured projects yet">
            Mark projects as featured in the database (ProjectOverride.featured).
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((p) => (
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
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card title="Writing">
          <p>Short notes and longer posts about engineering, architecture, and delivery.</p>
          <div className="mt-4">
            <LinkButton href="/blog" variant="secondary">Read posts</LinkButton>
          </div>
          {latestPosts.length ? (
            <ul className="mt-4 space-y-2 text-sm">
              {latestPosts.map((p) => (
                <li key={p.slug}>
                  <Link className="text-[color:var(--muted)] hover:text-[color:var(--fg)]" href={`/blog/${p.slug}`}>
                    {p.title}
                  </Link>
                  <span className="ml-2 text-xs text-[color:var(--muted)]">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'Draft'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[color:var(--muted)]">No published posts yet.</p>
          )}
        </Card>

        <Card title="Let’s build something">
          <p>
            If you want help shipping a production-grade feature, improving performance, or tightening security, send a message.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton href="/contact" variant="secondary">
              Contact
            </LinkButton>
            {site.email ? (
              <LinkButton href={`mailto:${site.email}`} variant="ghost">
                Email
              </LinkButton>
            ) : null}
          </div>
        </Card>
      </section>
    </div>
  )
}
