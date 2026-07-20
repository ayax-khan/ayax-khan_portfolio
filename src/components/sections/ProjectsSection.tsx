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
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Work"
            title="Featured Projects"
            action={
              <div className="flex items-center gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                >
                  View all projects
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <a
                  href="https://github.com/orgs/DEVSSDO/repositories"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                >
                  <GithubIcon size={14} />
                  GitHub Org
                </a>
              </div>
            }
          />
        </ScrollReveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.slice(0, 4).map((project, idx) => (
            <ScrollReveal key={project.slug} delay={0.1 * idx}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[var(--fg)] group-hover:text-[var(--accent)]">
                      {project.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                      {project.description || 'No description available.'}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="muted">
                          {tag}
                        </Badge>
                      ))}
                      {project.language ? (
                        <Badge variant="accent">{project.language}</Badge>
                      ) : null}
                    </div>

                    <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)] pt-3">
                      <div className="ml-auto flex gap-1.5">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                          aria-label={`View ${project.name} on GitHub`}
                        >
                          <GithubIcon size={15} />
                        </a>
                        {project.demoUrl ? (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                            aria-label={`View ${project.name} demo`}
                          >
                            <ExternalLink size={15} />
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
