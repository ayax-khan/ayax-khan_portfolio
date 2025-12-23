'use client'

import { type ReactNode, useEffect, useRef } from 'react'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

type Props = {
  children: ReactNode
  className?: string
  /** CSS variable name to write progress into. Default: --scroll-progress */
  cssVarName?: string
}

/**
 * Sets a CSS variable on the wrapper element: 0..1 based on scroll position.
 * This keeps animations mostly in CSS (cheap), without pulling a motion lib.
 */
export function ScrollProgress({ children, className, cssVarName = '--scroll-progress' }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const el = ref.current
    if (!el) return

    let raf = 0

    const tick = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1

      // Progress starts when section top hits ~80% viewport, ends when bottom hits ~20% viewport.
      const start = vh * 0.8
      const end = vh * 0.2
      const total = rect.height + (start - end)
      const current = start - rect.top
      const p = total <= 0 ? 0 : current / total
      const clamped = Math.max(0, Math.min(1, p))

      el.style.setProperty(cssVarName, clamped.toFixed(4))
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(tick)
    }

    // init
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [cssVarName])

  return (
    <div ref={ref} className={className} style={{ [cssVarName as any]: '0' }}>
      {children}
    </div>
  )
}
