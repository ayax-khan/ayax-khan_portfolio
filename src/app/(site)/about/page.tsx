import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { site, socialLinks } from '@/lib/site'

export const metadata = {
  title: 'About',
  description: 'Bio, skills, experience, and how I work.',
}

const skills = [
  'TypeScript',
  'Next.js (App Router)',
  'React',
  'Node.js',
  'PostgreSQL',
  'Prisma',
  'Security',
  'Performance',
] as const

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold">About</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          I’m {site.name}. I enjoy building products that are secure by default, fast in production, and easy to evolve.
        </p>
        <div className="flex flex-wrap gap-2">
          {socialLinks().map((l) => (
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
            {skills.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
          <p className="mt-4">
            This portfolio is built with Next.js + TypeScript + Tailwind + Prisma/Postgres, and it syncs projects from GitHub server-side.
          </p>
        </Card>

        <Card title="Experience (customize)"
        >
          <ul className="space-y-3">
            <li>
              <p className="text-[color:var(--fg)]">Role · Company</p>
              <p className="text-xs text-[color:var(--muted)]">2023 — Present</p>
              <p className="mt-1">Impact statement: shipped X, improved Y by Z%.</p>
            </li>
            <li>
              <p className="text-[color:var(--fg)]">Role · Company</p>
              <p className="text-xs text-[color:var(--muted)]">2021 — 2023</p>
              <p className="mt-1">Impact statement: reduced incidents, improved DX, etc.</p>
            </li>
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card title="How I work">
          <ul className="list-disc space-y-1 pl-5">
            <li>Start with the problem and constraints, then design the smallest safe solution.</li>
            <li>Ship iteratively, measure, and tighten quality (tests, types, observability).</li>
            <li>Prefer boring tech, but choose complexity when it pays off.</li>
          </ul>
        </Card>
        <Card title="Availability">
          <p>If you’d like to collaborate, the easiest way is via the contact form.</p>
          <div className="mt-4">
            <Link href="/contact" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              Contact →
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}
