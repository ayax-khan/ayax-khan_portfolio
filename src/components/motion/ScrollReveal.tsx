'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** animate once and keep visible */
  once?: boolean
  /** delay in ms */
  delayMs?: number
  /** initial Y offset in px */
  y?: number
  /** initial scale */
  scale?: number
  /** IntersectionObserver threshold */
  threshold?: number
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function ScrollReveal({
  children,
  className,
  once = true,
  delayMs = 0,
  y = 14,
  scale = 0.98,
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) io.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [once, threshold])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0) scale(1)' : `translate3d(0,${y}px,0) scale(${scale})`,
        transitionProperty: 'opacity, transform',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(.2,.9,.2,1)',
        transitionDelay: `${delayMs}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
