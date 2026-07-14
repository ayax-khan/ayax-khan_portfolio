'use client'

import {
  Brain,
  Cpu,
  Cloud,
  Shield,
  GitBranch,
  Code2,
  Eye,
} from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

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
    name: 'Computer Vision',
    icon: Eye,
    skills: [
      { name: 'OpenCV', years: '2+ yrs', level: 'Advanced' },
      { name: 'YOLO', years: '1+ yr', level: 'Intermediate' },
      { name: 'Image Segmentation', years: '1+ yr', level: 'Intermediate' },
      { name: 'OCR Systems', years: '1+ yr', level: 'Intermediate' },
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
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Expertise"
            title="Skills & Technologies"
            description="Technologies I work with daily to build production-ready AI systems."
            align="center"
          />
        </ScrollReveal>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {skillCategories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.name}
                className="min-w-[260px] flex-shrink-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--fg)]">{category.name}</h3>
                </div>
                <div className="space-y-2.5">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <span className="text-sm text-[var(--fg)]">{skill.name}</span>
                      <span className="text-[11px] text-[var(--muted-2)]">
                        {skill.years}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
