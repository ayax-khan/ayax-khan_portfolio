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
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Career"
            title="Experience"
            description="A timeline of my professional journey building AI systems and full-stack applications."
            align="center"
          />
        </ScrollReveal>

        <div className="relative mt-10">
          <div className="absolute left-[18px] top-0 h-full w-px bg-[var(--border)] md:left-1/2 md:-translate-x-px" />

          <div className="space-y-8">
            {experiences.map((exp, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <ScrollReveal key={exp.id} delay={0.1 * idx} y={20}>
                  <div className={`relative flex items-start gap-5 md:gap-10 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                      <Briefcase size={16} className="text-[var(--accent)]" />
                    </div>

                    <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                        <div className="flex flex-col gap-0.5">
                          <h3 className="text-base font-semibold text-[var(--fg)]">{exp.role}</h3>
                          <p className="text-sm text-[var(--accent)]">{exp.company}</p>
                          <p className="text-xs text-[var(--muted-2)]">
                            {exp.start}{exp.end ? ` — ${exp.end}` : ''}
                            {exp.location ? ` · ${exp.location}` : ''}
                          </p>
                        </div>

                        {exp.highlights.length > 0 ? (
                          <ul className={`mt-3 space-y-1.5 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                            {exp.highlights.map((h, i) => (
                              <li key={i} className="text-sm leading-relaxed text-[var(--muted)]">
                                {h}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>

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
