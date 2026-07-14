'use client'

import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Briefcase } from 'lucide-react'
import type { ExperienceEntry } from '@/app/admin/profile/actions'

type Props = {
  experiences: ExperienceEntry[]
}

export function ExperienceTimeline({ experiences }: Props) {
  if (experiences.length === 0) return null

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Career"
            title="Experience"
            description="A timeline of my professional journey building AI systems and full-stack applications."
            align="center"
          />
        </ScrollReveal>

        <div className="relative mt-16">
          {/* Timeline Line */}
          <div className="absolute left-[19px] top-0 h-full w-px bg-[var(--border)] md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {experiences.map((exp, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <ScrollReveal key={exp.id} delay={0.1 * idx} y={30}>
                  <div className={`relative flex items-start gap-6 md:gap-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                      <Briefcase size={18} className="text-[var(--accent)]" />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-lg font-semibold text-[var(--fg)]">{exp.role}</h3>
                          <p className="text-sm text-[var(--accent)]">{exp.company}</p>
                          <p className="text-xs text-[var(--muted-2)]">
                            {exp.start}{exp.end ? ` — ${exp.end}` : ''}
                            {exp.location ? ` · ${exp.location}` : ''}
                          </p>
                        </div>

                        {exp.highlights.length > 0 ? (
                          <ul className={`mt-4 space-y-2 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                            {exp.highlights.map((h, i) => (
                              <li key={i} className="text-sm leading-relaxed text-[var(--muted)]">
                                {h}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>

                    {/* Spacer for desktop alternating layout */}
                    <div className="hidden flex-1 md:block" />
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
