'use client'

import Image from 'next/image'
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
  { label: 'Python', icon: '🐍', x: '5%', y: '30%', delay: '0s' },
  { label: 'TypeScript', icon: 'TS', x: '88%', y: '20%', delay: '0.5s' },
  { label: 'React', icon: '⚛️', x: '90%', y: '70%', delay: '1s' },
  { label: 'Docker', icon: '🐳', x: '3%', y: '65%', delay: '1.5s' },
  { label: 'AI', icon: '🤖', x: '92%', y: '45%', delay: '2s' },
  { label: 'Node', icon: '🟢', x: '5%', y: '50%', delay: '2.5s' },
]

export function Hero({ name, title, bio, imageUrl, github, linkedin }: Props) {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 sm:pb-16">
      <div className="pointer-events-none absolute inset-0 grid-dot-pattern opacity-[0.04]" />

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {techIcons.map((tech) => (
          <FadeIn key={tech.label} delay={Number.parseFloat(tech.delay)}>
            <div
              className="animate-float absolute flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[10px] shadow-sm"
              style={{ left: tech.x, top: tech.y }}
            >
              {tech.icon}
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ScrollReveal delay={0} y={10}>
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Available for AI Projects
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1} y={20}>
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                <span className="text-[var(--accent)]">{name}</span>
                <br />
                <span className="text-[var(--fg)]">Vision AI Engineer</span>
                <br />
                <span className="text-base sm:text-lg text-[var(--muted)]">Co-Founder of Buy2Enjoy.pk & Devssdo.com</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2} y={20}>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                {bio}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3} y={20}>
              <div className="mt-4 flex items-center gap-4">
                {github ? (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                  >
                    <GithubIcon size={18} />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                ) : null}
                {linkedin ? (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                  >
                    <LinkedinIcon size={18} />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                ) : null}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4} y={20}>
              <div className="mt-8 grid grid-cols-4 gap-4 border-t border-[var(--border)] pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-bold text-[var(--fg)] sm:text-xl">{stat.value}</div>
                    <div className="mt-0.5 text-xs text-[var(--muted-2)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <ScrollReveal delay={0.15} scale={1} y={0}>
              <div className="relative">
                <div className="absolute inset-0 rounded-[var(--radius-lg)] bg-[var(--accent-soft)] opacity-60 blur-3xl" />
                <div className="relative h-[260px] w-[220px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] shadow-lg sm:h-[320px] sm:w-[260px]">
                  <Image
                    src={imageUrl || '/ayaz.png'}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 220px, 260px"
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
