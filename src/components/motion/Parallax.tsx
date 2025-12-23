'use client'

import { type ReactNode, useEffect, useRef } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** max translateY in px across viewport scroll */
  strength?: number
  /** optional max rotate in deg */
  rotate?: number
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function Parallax({ children, className, strength = 18, rotate = 0 }: Props) {
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

      // progress roughly from -1 (above) to +1 (below)
      const center = rect.top + rect.height / 2
      const progress = (center - vh / 2) / (vh / 2)
      const clamped = Math.max(-1, Math.min(1, progress))

      const y = -clamped * strength
      const r = -clamped * rotate
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg)`
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [rotate, strength])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}
