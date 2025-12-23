'use client'

import { useMemo } from 'react'

export type RotatingProject = {
  slug: string
  name: string
  description: string | null
  repoUrl: string
  demoUrl: string | null
  thumbnailUrl: string | null
}

type Props = {
  title: string
  projects: RotatingProject[]
  /** portrait | landscape affects the frame ratio */
  orientation?: 'portrait' | 'landscape'
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function RotatingProjectStack({ title, projects, orientation = 'landscape' }: Props) {
  const items = useMemo(() => projects.filter(Boolean).slice(0, 8), [projects])
  if (items.length === 0) return null

  // If reduced motion, we still render a static stack.
  const noMotion = typeof window !== 'undefined' && prefersReducedMotion()

  return (
    <section className="rot-stack">
      <div className="rot-stack__head">
        <h3 className="rot-stack__title">{title}</h3>
        <p className="rot-stack__meta">{items.length} projects</p>
      </div>

      <div className={`rot-stack__frame rot-stack__frame--${orientation} ${noMotion ? 'rot-stack__frame--static' : ''}`}>
        {items.map((p, idx) => (
          <a
            key={`${p.slug}-${idx}`}
            href={p.demoUrl ?? p.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="rot-card"
            style={{ ['--i' as any]: idx } as React.CSSProperties}
          >
            <div className="rot-card__media">
              {p.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumbnailUrl} alt="" className="rot-card__img" loading="lazy" />
              ) : (
                <div className="rot-card__placeholder" aria-hidden="true" />
              )}
            </div>
            <div className="rot-card__body">
              <div className="rot-card__name">{p.name}</div>
              {p.description ? <div className="rot-card__desc">{p.description}</div> : null}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
