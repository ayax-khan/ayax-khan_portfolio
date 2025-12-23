import { site } from '@/lib/site'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { ViewTransitionLink } from '@/components/navigation/ViewTransitionLink'
import { getPublicProfile } from '@/lib/publicProfile'
import { shortDisplayName } from '@/lib/nameFormat'

export async function SiteHeader() {
  const profile = await getPublicProfile()
  const shortName = shortDisplayName(profile.name)

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--bg)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <ViewTransitionLink href="/" className="text-sm font-semibold text-[color:var(--fg)]">
          <span className="md:hidden">{shortName || profile.name}</span>
          <span className="hidden md:inline">{profile.name}</span>
        </ViewTransitionLink>
        <nav className="flex items-center gap-4">
          {site.nav.map((i) => (
            <ViewTransitionLink
              key={i.href}
              href={i.href}
              className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]"
            >
              {i.label}
            </ViewTransitionLink>
          ))}
          <ThemeToggle compact />
        </nav>
      </div>
    </header>
  )
}
