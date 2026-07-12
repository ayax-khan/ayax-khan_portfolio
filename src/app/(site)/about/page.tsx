import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getPublicProfile, publicSocialLinks } from '@/lib/publicProfile'
import { getExperienceEntries, getEducationEntries } from '@/app/admin/profile/actions'

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
    : ['TypeScript', 'Next.js (App Router)', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'Security', 'Performance']

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold">About</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          I&rsquo;m {profile.name}. {profile.bio}
        </p>
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              {l.label}
            </Link>
          ))}
        </div>
      </header>

      <section className="space-y-4">
        <SectionHeading
          title="Core strengths"
          description="The areas I focus on when delivering production-grade systems."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Architecture">
            <p>Clean boundaries, predictable data flows, and pragmatic decisions that scale with the team.</p>
          </Card>
          <Card title="Security">
            <p>Strong validation, safe defaults, and secrets confined to the server.</p>
          </Card>
          <Card title="Execution">
            <p>Clear scope, incremental delivery, and focus on outcomes (not just features).</p>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card title="Skills">
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </Card>

        <Card title="Experience">
          {experience.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">No experience entries yet. Add them in the admin panel.</p>
          ) : (
            <ul className="space-y-4">
              {experience.map((e) => (
                <li key={e.id}>
                  <p className="text-[color:var(--fg)] font-semibold">{e.role} &middot; {e.company}</p>
                  {e.location ? <p className="text-xs text-[color:var(--muted)]">{e.location}</p> : null}
                  <p className="text-xs text-[color:var(--muted)]">{e.start}{e.end ? ` &mdash; ${e.end}` : ''}</p>
                  {e.highlights.length > 0 ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--muted)]">
                      {e.highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {education.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading title="Education" description="Academic background." />
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((e) => (
              <Card key={e.id} title={e.program}>
                <p className="text-sm text-[color:var(--muted)]">{e.institute}{e.city ? `, ${e.city}` : ''}</p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  {e.major ? `Major: ${e.major} &middot; ` : ''}
                  {e.startYear ?? ''}{e.endYear ? ` &mdash; ${e.endYear}` : ''}
                  {e.percentage != null ? ` &middot; ${e.percentage}%` : ''}
                  {e.grade ? ` &middot; ${e.grade}` : ''}
                </p>
                {e.notes ? <p className="mt-2 text-sm text-[color:var(--muted)]">{e.notes}</p> : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <Card title="How I work">
          <ul className="list-disc space-y-1 pl-5">
            <li>Start with the problem and constraints, then design the smallest safe solution.</li>
            <li>Ship iteratively, measure, and tighten quality (tests, types, observability).</li>
            <li>Prefer boring tech, but choose complexity when it pays off.</li>
          </ul>
        </Card>
        <Card title="Availability">
          <p>If you&rsquo;d like to collaborate, the easiest way is via the contact form.</p>
          <div className="mt-4">
            <Link href="/contact" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              Contact &rarr;
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}
