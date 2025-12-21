import Link from 'next/link'

import { site } from '@/lib/site'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--bg)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold text-[color:var(--fg)]">
          {site.name}
        </Link>
        <nav className="flex items-center gap-4">
          {site.nav.map((i) => (
            <Link key={i.href} href={i.href} className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              {i.label}
            </Link>
          ))}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
