import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getPublicProfile, publicSocialLinks } from '@/lib/publicProfile'
import { getExperienceEntries, getEducationEntries } from '@/app/admin/profile/actions'
import { FALLBACK_SKILLS } from '@/lib/defaults'
import { ArrowUpRight } from 'lucide-react'

export const metadata = {
  title: 'About',
  description: 'Bio, skills, experience, and education.',
}

export default async function AboutPage() {
  const profile = await getPublicProfile()
  const links = publicSocialLinks(profile)
  const experience = await getExperienceEntries()
  const education = await getEducationEntries()

  const displaySkills = profile.skills.length > 0
    ? profile.skills
    : FALLBACK_SKILLS

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-24">
      {/* Header */}
      <header className="max-w-3xl">
        <p className="mb-4 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
          About
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          {profile.bio}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-all hover:border-[var(--fg)] hover:text-[var(--fg)]"
            >
              {l.label}
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </header>

      {/* Core Strengths */}
      <section className="mt-20">
        <SectionHeading
          subtitle="Principles"
          title="Core Strengths"
          description="The areas I focus on when delivering production-grade systems."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card title="Architecture" hover>
            <p>Clean boundaries, predictable data flows, and pragmatic decisions that scale with the team.</p>
          </Card>
          <Card title="Security" hover>
            <p>Strong validation, safe defaults, and secrets confined to the server.</p>
          </Card>
          <Card title="Execution" hover>
            <p>Clear scope, incremental delivery, and focus on outcomes (not just features).</p>
          </Card>
        </div>
      </section>

      {/* Skills & Experience */}
      <section className="mt-20 grid gap-10 md:grid-cols-2">
        <div>
          <SectionHeading title="Skills" description="Technologies I work with daily." />
          <div className="mt-6 flex flex-wrap gap-2">
            {displaySkills.map((s) => (
              <Badge key={s} variant="accent">{s}</Badge>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading title="Experience" description="Professional journey." />
          <div className="mt-6 space-y-6">
            {experience.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No experience entries yet.</p>
            ) : (
              experience.map((e) => (
                <div key={e.id}>
                  <p className="font-semibold text-[var(--fg)]">{e.role} &middot; {e.company}</p>
                  {e.location ? <p className="text-xs text-[var(--muted-2)]">{e.location}</p> : null}
                  <p className="text-xs text-[var(--muted-2)]">{e.start}{e.end ? ` — ${e.end}` : ''}</p>
                  {e.highlights.length > 0 ? (
                    <ul className="mt-2 space-y-1 pl-4 text-sm text-[var(--muted)]" style={{ listStyleType: 'disc' }}>
                      {e.highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Education */}
      {education.length > 0 ? (
        <section className="mt-20">
          <SectionHeading title="Education" description="Academic background." />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {education.map((e) => (
              <Card key={e.id} title={e.program} hover>
                <p className="text-sm text-[var(--muted)]">{e.institute}{e.city ? `, ${e.city}` : ''}</p>
                <p className="mt-1 text-xs text-[var(--muted-2)]">
                  {e.major ? `Major: ${e.major} · ` : ''}
                  {e.startYear ?? ''}{e.endYear ? ` — ${e.endYear}` : ''}
                  {e.percentage != null ? ` · ${e.percentage}%` : ''}
                  {e.grade ? ` · ${e.grade}` : ''}
                </p>
                {e.notes ? <p className="mt-2 text-sm text-[var(--muted)]">{e.notes}</p> : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* How I Work & Availability */}
      <section className="mt-20 grid gap-6 md:grid-cols-2">
        <Card title="How I Work" hover>
          <ul className="space-y-2 pl-4" style={{ listStyleType: 'disc' }}>
            <li>Start with the problem and constraints, then design the smallest safe solution.</li>
            <li>Ship iteratively, measure, and tighten quality (tests, types, observability).</li>
            <li>Prefer boring tech, but choose complexity when it pays off.</li>
          </ul>
        </Card>
        <Card title="Availability" hover>
          <p>If you would like to collaborate, the easiest way is via the contact form.</p>
          <div className="mt-4">
            <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
              Contact <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}
