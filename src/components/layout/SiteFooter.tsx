import Link from 'next/link'

import { getPublicProfile, publicSocialLinks } from '@/lib/publicProfile'

export async function SiteFooter() {
  const profile = await getPublicProfile()
  const links = publicSocialLinks(profile)

  return (
    <footer className="border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[color:var(--muted)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with Next.js, TypeScript, Tailwind, Prisma, and Postgres.
          </p>
          <div className="flex items-center gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:text-[color:var(--fg)]">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
