'use client'

import { type ComponentPropsWithoutRef } from 'react'
import { LinkButton } from '@/components/ui/LinkButton'

type Props = ComponentPropsWithoutRef<typeof LinkButton> & {
  analyticsMeta?: Record<string, unknown>
}

export function TrackedLinkButton({ analyticsMeta, onClick, ...props }: Props) {
  return (
    <LinkButton
      {...props}
      onClick={(e) => {
        try {
          fetch('/api/analytics', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              type: 'CLICK',
              path: typeof location !== 'undefined' ? location.pathname : props.href,
              referrer: typeof document !== 'undefined' ? document.referrer : undefined,
              meta: analyticsMeta ?? {},
            }),
            keepalive: true,
          }).catch(() => {})
        } catch {
          // ignore
        }
        onClick?.(e)
      }}
    />
  )
}
