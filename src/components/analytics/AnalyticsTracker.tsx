'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function sendEvent(payload: unknown) {
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // ignore
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    const qs = search?.toString()
    const path = qs ? `${pathname}?${qs}` : pathname

    sendEvent({
      type: 'PAGE_VIEW',
      path,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    })
  }, [pathname, search])

  return null
}
