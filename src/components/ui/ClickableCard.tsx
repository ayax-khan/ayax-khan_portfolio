'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, type MouseEvent } from 'react'

type Props = {
  href: string
  children: ReactNode
  ariaLabel?: string
  className?: string
}

export function ClickableCard({ href, children, ariaLabel, className }: Props) {
  const router = useRouter()

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.metaKey || e.ctrlKey) return
    router.push(href)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      router.push(href)
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`cursor-pointer ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
