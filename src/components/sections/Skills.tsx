'use client'

import {
  Brain,
  Cpu,
  Database,
  Cloud,
  Shield,
  GitBranch,
  Globe,
  Code2,
} from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer'

type SkillCategory = {
  name: string
  icon: typeof Brain
  skills: { name: string; years?: string; level?: string }[]
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Artificial Intelligence',
    icon: Brain,
    skills: [
      { name: 'Machine Learning', years: '3+ yrs', level: 'Advanced' },
      { name: 'LLMs & RAG', years: '2+ yrs', level: 'Advanced' },
      { name: 'LangGraph', years: '1+ yr', level: 'Intermediate' },
      { name: 'n8n', years: '1+ yr', level: 'Intermediate' },
    ],
  },
  {
    name: 'Backend & API',
    icon: Code2,
    skills: [
      { name: 'Python', years: '4+ yrs', level: 'Advanced' },
      { name: 'FastAPI', years: '3+ yrs', level: 'Advanced' },
      { name: 'Node.js', years: '3+ yrs', level: 'Advanced' },
      { name: 'Next.js', years: '2+ yrs', level: 'Advanced' },
    ],
  },
  {
    name: 'Frontend',
    icon: Globe,
    skills: [
      { name: 'React', years: '3+ yrs', level: 'Advanced' },
      { name: 'TypeScript', years: '3+ yrs', level: 'Advanced' },
      { name: 'Tailwind CSS', years: '2+ yrs', level: 'Advanced' },
      { name: 'Framer Motion', years: '1+ yr', level: 'Intermediate' },
    ],
  },
  {
    name: 'Database & Storage',
    icon: Database,
    skills: [
      { name: 'PostgreSQL', years: '3+ yrs', level: 'Advanced' },
      { name: 'Supabase', years: '2+ yrs', level: 'Advanced' },
      { name: 'Prisma', years: '2+ yrs', level: 'Advanced' },
      { name: 'Redis', years: '1+ yr', level: 'Intermediate' },
    ],
  },
  {
    name: 'DevOps & Cloud',
    icon: Cloud,
    skills: [
      { name: 'Docker', years: '3+ yrs', level: 'Advanced' },
      { name: 'AWS', years: '2+ yrs', level: 'Intermediate' },
      { name: 'Cloudflare', years: '1+ yr', level: 'Intermediate' },
      { name: 'GitHub Actions', years: '2+ yrs', level: 'Advanced' },
    ],
  },
  {
    name: 'Security & Quality',
    icon: Shield,
    skills: [
      { name: 'Security Auditing', years: '2+ yrs', level: 'Advanced' },
      { name: 'Testing', years: '3+ yrs', level: 'Advanced' },
      { name: 'Git', years: '4+ yrs', level: 'Advanced' },
      { name: 'CI/CD', years: '2+ yrs', level: 'Advanced' },
    ],
  },
]

export function Skills() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Expertise"
            title="Skills & Technologies"
            description="A comprehensive overview of the technologies I work with daily to build production-ready AI systems."
            align="center"
          />
        </ScrollReveal>

        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => {
            const Icon = category.icon
            return (
              <StaggerItem key={category.name}>
                <div className="group rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--fg)]">{category.name}</h3>
                  </div>
                  <div className="space-y-3">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--fg)]">{skill.name}</span>
                        <span className="text-xs text-[var(--muted-2)]">
                          {skill.years}
                        </span>
                      </div>
                    ))}
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
