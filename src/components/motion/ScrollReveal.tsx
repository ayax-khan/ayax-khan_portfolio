'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
  scale?: number
  duration?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 20,
  x = 0,
  scale = 1,
  duration = 0.6,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-40px' })

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y, x, scale }}
        animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : { opacity: 0, y, x, scale }}
        transition={{
          duration,
          delay,
          ease: [0.2, 0.9, 0.2, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
