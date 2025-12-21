'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Tab = { key: string; label: string }

export function ProfileTabNav({ tabs, baseHref }: { tabs: Tab[]; baseHref: string }) {
  const search = useSearchParams()
  const current = (search.get('tab') ?? 'profile').toLowerCase()

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = current === t.key
        const href = t.key === 'profile' ? baseHref : `${baseHref}?tab=${encodeURIComponent(t.key)}`
        return (
          <Link
            key={t.key}
            href={href}
            className={
              'rounded-xl border px-3 py-1.5 text-sm transition-colors ' +
              (active
                ? 'border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--fg)]'
                : 'border-[color:var(--border)] bg-transparent text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]')
            }
          >
            {t.label}
          </Link>
        )
      })}
    </div>
  )
}
