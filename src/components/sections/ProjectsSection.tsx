'use client'

import { ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/brand-icons'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import type { PortfolioProject } from '@/lib/github/repos'

type Props = {
  projects: PortfolioProject[]
}

export function ProjectsSection({ projects }: Props) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Work"
            title="Featured Projects"
            description="Production-ready systems I've built, from AI agents to full-stack platforms."
            action={
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                View all projects
                <span aria-hidden="true">&rarr;</span>
              </Link>
            }
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.slice(0, 4).map((project, idx) => (
            <ScrollReveal key={project.slug} delay={0.1 * idx}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-48 w-full overflow-hidden bg-[var(--surface-2)] sm:h-56">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-[var(--muted-2)] opacity-30">
                        {project.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent opacity-60" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[var(--fg)] group-hover:text-[var(--accent)]">
                      {project.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                      {project.description || 'No description available.'}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="muted">
                          {tag}
                        </Badge>
                      ))}
                      {project.language ? (
                        <Badge variant="accent">{project.language}</Badge>
                      ) : null}
                    </div>

                    <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)] pt-4">
                      <span className="flex items-center gap-1.5 text-xs text-[var(--muted-2)]">
                        <GithubIcon size={14} />
                        {project.stars} stars
                      </span>
                      <div className="ml-auto flex gap-2">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                          aria-label={`View ${project.name} on GitHub`}
                        >
                          <GithubIcon size={16} />
                        </a>
                        {project.demoUrl ? (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                            aria-label={`View ${project.name} demo`}
                          >
                            <ExternalLink size={16} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
