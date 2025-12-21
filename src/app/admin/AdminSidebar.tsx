'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import {
  IconBriefcase,
  IconDashboard,
  IconFileText,
  IconFolder,
  IconGraduationCap,
  IconLink,
  IconMail,
  IconSettings,
  IconSparkles,
  IconUser,
} from '@/components/ui/icons'

type NavItem = {
  href: string
  label: string
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode
}

const coreNav: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: IconDashboard },
  { href: '/admin/projects', label: 'Projects', icon: IconFolder },
  { href: '/admin/blog', label: 'Blog', icon: IconFileText },
  { href: '/admin/messages', label: 'Messages', icon: IconMail },
]

const profileNav: NavItem[] = [
  { href: '/admin/profile', label: 'Profile', icon: IconUser },
  { href: '/admin/skills', label: 'Skills', icon: IconSparkles },
  { href: '/admin/experience', label: 'Experience', icon: IconBriefcase },
  { href: '/admin/education', label: 'Education', icon: IconGraduationCap },
  { href: '/admin/social', label: 'Social Links', icon: IconLink },
]

const systemNav: NavItem[] = [{ href: '/admin/settings', label: 'Settings', icon: IconSettings }]

function Item({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={
        'flex items-center gap-3 rounded-xl px-2 py-1 text-sm transition-colors ' +
        (active
          ? 'bg-[color:var(--surface-2)] text-[color:var(--fg)]'
          : 'text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]')
      }
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--surface-2)] text-[color:var(--fg)]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="hidden whitespace-nowrap group-hover:block">{item.label}</span>
    </Link>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()

  const inProfileSection = useMemo(() => pathname?.startsWith('/admin/profile') || pathname?.startsWith('/admin/skills') || pathname?.startsWith('/admin/experience') || pathname?.startsWith('/admin/education') || pathname?.startsWith('/admin/social'), [pathname])

  const [profileOpen, setProfileOpen] = useState<boolean>(inProfileSection)

  return (
    <aside className="group sticky top-0 h-screen w-14 shrink-0 overflow-hidden border-r border-[color:var(--border)] bg-[color:var(--surface)] transition-[width] duration-300 ease-out will-change-[width] hover:w-56">
      <div className="flex h-full flex-col py-3">
        <div className="flex items-center justify-between px-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[color:var(--surface-2)] text-sm font-bold">
              A
            </span>
            <span className="hidden text-sm font-semibold text-[color:var(--fg)] group-hover:block">Admin</span>
          </Link>
        </div>

        {/* Scrollable area */}
        <div className="mt-2 flex-1 overflow-y-auto px-2 pb-2">
          <div className="space-y-0.5">
            {coreNav.map((i) => (
              <Item key={i.href} item={i} active={pathname === i.href} />
            ))}
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-sm text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]"
            >
              <span className="hidden text-[11px] font-semibold uppercase tracking-wider group-hover:block">
                Profile Management
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--surface-2)] text-[color:var(--fg)] group-hover:hidden">
                <IconUser className="h-5 w-5" />
              </span>
              <span className="hidden text-xs group-hover:block">{profileOpen ? '▾' : '▸'}</span>
            </button>

            {profileOpen ? (
              <div className="mt-1 space-y-0.5">
                {profileNav.map((i) => (
                  <Item key={i.href} item={i} active={pathname === i.href} />
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-2 space-y-0.5">
            {systemNav.map((i) => (
              <Item key={i.href} item={i} active={pathname === i.href} />
            ))}
          </div>
        </div>

        <div className="border-t border-[color:var(--border)] p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="hidden text-xs text-[color:var(--muted)] group-hover:block">Theme</span>
            <ThemeToggle compact />
          </div>
        </div>
      </div>
    </aside>
  )
}
