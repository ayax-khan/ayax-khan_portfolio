'use client'

import { FileText, BookOpen, Award, GitBranch, GraduationCap, ExternalLink } from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer'

const researchItems = [
  {
    icon: FileText,
    title: 'Research Papers',
    description: 'Exploring AI safety, LLM alignment, and efficient neural architectures.',
    count: '3 Papers',
  },
  {
    icon: BookOpen,
    title: 'Experiments',
    description: 'Hands-on experiments with RAG systems, agentic workflows, and fine-tuning.',
    count: '12+ Experiments',
  },
  {
    icon: GitBranch,
    title: 'Open Source',
    description: 'Active contributor to AI/ML tools, automation frameworks, and developer tooling.',
    count: '15+ Repos',
  },
  {
    icon: GraduationCap,
    title: 'Certifications',
    description: 'Deep Learning, Cloud Architecture, and System Design certifications.',
    count: '8 Certifications',
  },
]

export function Research() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Research"
            title="Publications & Research"
            description="Academic work, experiments, and contributions to the AI/ML community."
            align="center"
          />
        </ScrollReveal>

        <StaggerContainer className="mt-8 grid gap-3">
          {researchItems.map((item) => {
            const Icon = item.icon
            return (
              <StaggerItem key={item.title}>
                <div className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--fg)]">{item.title}</h3>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">{item.description}</p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="text-xs font-medium text-[var(--accent)]">{item.count}</span>
                    <ExternalLink size={14} className="text-[var(--muted-2)] transition-colors group-hover:text-[var(--accent)]" />
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
