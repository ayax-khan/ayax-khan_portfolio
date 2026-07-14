'use client'

import { Quote } from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO, TechFlow AI',
    content:
      'Exceptional ability to translate complex requirements into clean, scalable systems. The AI pipeline architecture he designed reduced our inference costs by 40%.',
  },
  {
    name: 'Marcus Rivera',
    role: 'Founder, DataSync Labs',
    content:
      'One of the most thorough engineers I have worked with. Every PR is well-tested, well-documented, and production-ready. A true force multiplier for any team.',
  },
  {
    name: 'Priya Sharma',
    role: 'Engineering Lead, CloudBase',
    content:
      'His deep understanding of both AI and full-stack development makes him uniquely effective. He bridges the gap between research and production seamlessly.',
  },
]

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Testimonials"
            title="What People Say"
            description="Feedback from clients and colleagues I have had the privilege of working with."
            align="center"
          />
        </ScrollReveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={t.name} delay={0.1 * idx}>
              <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                <Quote size={20} className="text-[var(--accent)] opacity-40" />
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-5 border-t border-[var(--border)] pt-3">
                  <p className="text-sm font-semibold text-[var(--fg)]">{t.name}</p>
                  <p className="text-xs text-[var(--muted-2)]">{t.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
