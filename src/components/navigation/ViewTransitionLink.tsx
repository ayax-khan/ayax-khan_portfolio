'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ComponentProps, type MouseEvent, useCallback } from 'react'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

type Props = {
  href: string
  className?: string
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'onClick'>

/**
 * Progressive-enhancement navigation using the View Transitions API.
 *
 * - If unsupported, falls back to normal client navigation.
 * - Respects prefers-reduced-motion.
 * - Preserves Next.js prefetching by still rendering a <Link>.
 */
export function ViewTransitionLink({ href, className, ...rest }: Props) {
  const router = useRouter()

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // Allow opening in new tab/window, copying link address, etc.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }

      // If the consumer set a target, don't hijack.
      // (e.g. target=_blank)
      const target = (e.currentTarget.getAttribute('target') ?? '').toLowerCase()
      if (target && target !== '_self') return

      // Only enhance internal links.
      if (!href.startsWith('/')) return

      // Avoid transitions if user prefers reduced motion.
      if (prefersReducedMotion()) return

      const startViewTransition = (document as any).startViewTransition as undefined | ((cb: () => void) => void)
      if (!startViewTransition) return

      e.preventDefault()
      // IMPORTANT: call with the document binding to avoid "Illegal invocation" in some browsers.
      ;(document as any).startViewTransition(() => {
        router.push(href)
      })
    },
    [href, router]
  )

  return <Link href={href} className={className} onClick={onClick} {...rest} />
}
