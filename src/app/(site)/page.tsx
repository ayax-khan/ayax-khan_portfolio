import Link from 'next/link'

import { LinkButton } from '@/components/ui/LinkButton'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { Parallax } from '@/components/motion/Parallax'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { RotatingProjectStack } from '@/components/motion/RotatingProjectStack'
import { getProjectsFromGithub } from '@/lib/github/repos'
import { listPublishedPosts } from '@/lib/blog'
import { site, socialLinks } from '@/lib/site'
import { getPublicProfile } from '@/lib/publicProfile'

export const metadata = {
  title: 'Home',
  description: 'Projects, writing, and contact information.',
}

const coreSkills = ['TypeScript', 'Next.js', 'React', 'PostgreSQL', 'Prisma', 'Security', 'Performance'] as const

export default async function HomePage() {
  const [projects, posts, profile] = await Promise.all([getProjectsFromGithub(), listPublishedPosts(), getPublicProfile()])

  const featured = projects.filter((p) => p.featured).slice(0, 3)
  const latestPosts = posts.slice(0, 3)

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="portfolio-hero relative overflow-hidden rounded-[32px] border border-[color:var(--border)]">
        <div className="absolute inset-0 portfolio-hero__bg" aria-hidden="true" />

        <Parallax strength={22} rotate={2}>
          <div
            className="pointer-events-none absolute -right-10 top-10 hidden h-72 w-72 rounded-full portfolio-hero__orb md:block"
            aria-hidden="true"
          />
        </Parallax>

        <div className="relative z-10 px-6 py-14 sm:px-10 sm:py-16">
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-3">
              {profile.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <span className="hero-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="hero-avatar__img"
                  />
                </span>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="muted">{profile.title}</Badge>
                <Badge variant="muted">{profile.location}</Badge>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={80} y={18}>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              {profile.name}
              <span className="portfolio-hero__accent">.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delayMs={140} y={18}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
              {profile.bio}
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={200} y={18}>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/projects">View Projects</LinkButton>
              <LinkButton href="/contact" variant="secondary">
                Contact
              </LinkButton>
              <LinkButton href="/about" variant="ghost">
                About
              </LinkButton>
              {socialLinks().slice(0, 2).map((l) => (
                <LinkButton key={l.href} href={l.href} variant="ghost" target="_blank" rel="noreferrer">
                  {l.label}
                </LinkButton>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={260} y={18}>
            <div className="mt-10 flex flex-wrap gap-2">
              {coreSkills.map((s) => (
                <Badge key={s} variant="muted">
                  {s}
                </Badge>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ROTATING CATEGORY STACKS */}
      <section className="rot-stacks">
        {(() => {
          const ai = projects.filter((p) => p.tags.map((t) => t.toLowerCase()).includes('ai'))
          const web = projects.filter((p) => p.tags.map((t) => t.toLowerCase()).includes('web'))
          const app = projects.filter((p) => p.tags.map((t) => t.toLowerCase()).includes('app'))

          return (
            <div className="rot-stacks__grid">
              <RotatingProjectStack
                title="AI"
                projects={ai.map((p) => ({
                  slug: p.slug,
                  name: p.name,
                  description: p.description,
                  repoUrl: p.repoUrl,
                  demoUrl: p.demoUrl,
                  thumbnailUrl: p.thumbnailUrl,
                }))}
                orientation="portrait"
              />
              <RotatingProjectStack
                title="Web"
                projects={web.map((p) => ({
                  slug: p.slug,
                  name: p.name,
                  description: p.description,
                  repoUrl: p.repoUrl,
                  demoUrl: p.demoUrl,
                  thumbnailUrl: p.thumbnailUrl,
                }))}
                orientation="landscape"
              />
              <RotatingProjectStack
                title="Apps"
                projects={app.map((p) => ({
                  slug: p.slug,
                  name: p.name,
                  description: p.description,
                  repoUrl: p.repoUrl,
                  demoUrl: p.demoUrl,
                  thumbnailUrl: p.thumbnailUrl,
                }))}
                orientation="portrait"
              />
            </div>
          )
        })()}
      </section>

      {/* PROJECTS (pinned / Apple-style) */}
      <ScrollProgress className="portfolio-pinned">
        <section className="portfolio-pinned__grid">
          <div className="portfolio-pinned__left">
            <ScrollReveal>
              <SectionHeading
                title="Featured Projects"
                description="Work-first. A curated selection synced from GitHub with portfolio-specific overrides."
                action={
                  <Link href="/projects" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                    See all
                  </Link>
                }
              />
            </ScrollReveal>

            <ScrollReveal delayMs={120}>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
                I ship production-ready systems with clean architecture, secure defaults, and performance that you can measure.
                Here are a few representative builds.
              </p>
            </ScrollReveal>

            <ScrollReveal delayMs={180}>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="muted">Engineering</Badge>
                <Badge variant="muted">Design taste</Badge>
                <Badge variant="muted">Security</Badge>
                <Badge variant="muted">Delivery</Badge>
              </div>
            </ScrollReveal>
          </div>

          <div className="portfolio-pinned__right">
            {featured.length === 0 ? (
              <ScrollReveal>
                <Card title="No featured projects yet">
                  Mark projects as featured in the database (ProjectOverride.featured).
                </Card>
              </ScrollReveal>
            ) : (
              <div className="grid gap-4">
                {featured.map((p, idx) => (
                  <ScrollReveal key={p.fullName} delayMs={80 * idx}>
                    <Card
                      className="portfolio-pinned__card"
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

                      {p.tags.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.tags.slice(0, 5).map((t) => (
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
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </ScrollProgress>

      {/* ABOUT */}
      <section className="grid gap-4 md:grid-cols-12">
        <ScrollReveal className="md:col-span-7">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7">
            <p className="text-sm font-semibold text-[color:var(--fg)]">About</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Engineering with taste, safety, and speed.</h2>
            <p className="mt-3 max-w-prose text-[color:var(--muted)]">
              Im {profile.name}. {profile.bio}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <LinkButton href="/about" variant="secondary">
                More about me
              </LinkButton>
              <LinkButton href="/contact" variant="ghost">
                Work with me
              </LinkButton>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="md:col-span-5" delayMs={120}>
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7">
            <p className="text-sm font-semibold text-[color:var(--fg)]">Skills</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              A quick snapshot of the tools I ship with day-to-day.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {coreSkills.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* BLOG */}
      <section className="space-y-5">
        <ScrollReveal>
          <SectionHeading
            title="Writing"
            description="Notes on engineering, architecture, and delivery."
            action={
              <Link href="/blog" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                Read all
              </Link>
            }
          />
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {latestPosts.length ? (
            latestPosts.map((p, idx) => (
              <ScrollReveal key={p.slug} delayMs={60 * idx}>
                <Card
                  title={p.title}
                  footer={
                    <LinkButton href={`/blog/${p.slug}`} variant="secondary">
                      Read
                    </LinkButton>
                  }
                >
                  <p className="text-xs text-[color:var(--muted)]">
                    {p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : 'Draft'}
                  </p>
                </Card>
              </ScrollReveal>
            ))
          ) : (
            <ScrollReveal>
              <Card title="No posts yet">
                Publish your first post in the admin panel, and it will show up here.
              </Card>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="portfolio-cta relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 sm:p-10">
        <div className="absolute inset-0 portfolio-cta__bg" aria-hidden="true" />
        <div className="relative z-10">
          <ScrollReveal>
            <h2 className="text-2xl font-semibold tracking-tight">Let’s build something exceptional.</h2>
          </ScrollReveal>
          <ScrollReveal delayMs={120}>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
              If you want help shipping a production-grade feature, improving performance, or tightening security, send a message.
            </p>
          </ScrollReveal>
          <ScrollReveal delayMs={200}>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/contact" variant="secondary">
                Contact
              </LinkButton>
              {profile.email ? (
                <LinkButton href={`mailto:${profile.email}`} variant="ghost">
                  Email
                </LinkButton>
              ) : null}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
