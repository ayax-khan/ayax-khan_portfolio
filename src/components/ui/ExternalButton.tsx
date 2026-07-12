'use client'

import { type ReactNode, type MouseEvent, useCallback } from 'react'

type Props = {
  href: string
  children: ReactNode
}

export function ExternalButton({ href, children }: Props) {
  const onClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      window.open(href, '_blank', 'noopener,noreferrer')
    },
    [href],
  )

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          window.open(href, '_blank', 'noopener,noreferrer')
        }
      }}
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-transparent text-[color:var(--fg)] hover:bg-[color:var(--surface-2)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--selection)]"
    >
      {children}
    </span>
  )
}
