'use client'

import Image from 'next/image'
import { ArrowRight, Download } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/brand-icons'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { FadeIn } from '@/components/motion/FadeIn'

type Props = {
  name: string
  title: string
  bio: string
  imageUrl: string
  github?: string
  linkedin?: string
}

const stats = [
  { value: '20+', label: 'Projects' },
  { value: 'AI', label: 'Solutions' },
  { value: 'Open', label: 'Source' },
  { value: 'R&D', label: 'Research' },
]

const techIcons = [
  { label: 'Python', icon: '🐍', x: '15%', y: '20%', delay: '0s' },
  { label: 'TypeScript', icon: 'TS', x: '80%', y: '15%', delay: '0.5s' },
  { label: 'React', icon: '⚛️', x: '85%', y: '60%', delay: '1s' },
  { label: 'Docker', icon: '🐳', x: '10%', y: '65%', delay: '1.5s' },
  { label: 'AI', icon: '🤖', x: '20%', y: '75%', delay: '2s' },
  { label: 'Node', icon: '🟢', x: '75%', y: '75%', delay: '2.5s' },
]

export function Hero({ name, title, bio, imageUrl, github, linkedin }: Props) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden pt-24">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 grid-dot-pattern opacity-[0.04]" />

      {/* Floating Tech Icons */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {techIcons.map((tech) => (
          <FadeIn key={tech.label} delay={Number.parseFloat(tech.delay)}>
            <div
              className="animate-float absolute flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm shadow-sm"
              style={{ left: tech.x, top: tech.y }}
            >
              {tech.icon}
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Content */}
          <div className="lg:col-span-7">
            {/* Availability Badge */}
            <ScrollReveal delay={0} y={10}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Available for AI Projects
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1} y={20}>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Hi, I&apos;m <span className="text-[var(--accent)]">{name.split(' ')[0]}</span>.
                <br />
                <span className="text-[var(--fg)]">AI Engineer & Full Stack Developer</span>
                <br />
                <span className="text-[var(--muted)]">building intelligent products.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2} y={20}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
                {bio}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3} y={20}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] hover:shadow-md"
                >
                  View Projects
                  <ArrowRight size={18} />
                </a>
                <a
                  href="/resume"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-base font-semibold text-[var(--fg)] transition-all hover:bg-[var(--surface-2)] hover:shadow-sm"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4} y={20}>
              <div className="mt-6 flex items-center gap-4">
                {github ? (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                  >
                    <GithubIcon />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                ) : null}
                {linkedin ? (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                  >
                    <LinkedinIcon />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                ) : null}
              </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={0.5} y={20}>
              <div className="mt-10 grid grid-cols-4 gap-4 border-t border-[var(--border)] pt-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-xl font-bold text-[var(--fg)] sm:text-2xl">{stat.value}</div>
                    <div className="mt-0.5 text-xs text-[var(--muted-2)] sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right - Profile Image */}
          <div className="flex justify-center lg:col-span-5">
            <ScrollReveal delay={0.15} scale={1} y={0}>
              <div className="relative">
                <div className="absolute inset-0 rounded-[var(--radius-lg)] bg-[var(--accent-soft)] opacity-60 blur-3xl" />
                <div className="relative h-[280px] w-[280px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] shadow-lg sm:h-[340px] sm:w-[340px]">
                  <Image
                    src={imageUrl || '/ayaz.png'}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 280px, 340px"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
