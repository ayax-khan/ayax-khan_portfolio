'use client'

import { type ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  href: string
  ariaLabel: string
  children: ReactNode
}

export function ClickableCard({ href, ariaLabel, children }: Props) {
  const router = useRouter()

  const onClick = useCallback(() => {
    router.push(href)
  }, [href, router])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        router.push(href)
      }
    },
    [href, router],
  )

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className="group cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--selection)]"
    >
      {children}
    </div>
  )
}
