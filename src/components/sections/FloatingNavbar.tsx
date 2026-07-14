'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/research', label: 'Research' },
  { href: '/contact', label: 'Contact' },
]

export function FloatingNavbar({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-5xl -translate-x-1/2 rounded-2xl border border-[var(--border)] transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg)]/80 py-2 shadow-sm nav-blur'
          : 'bg-[var(--bg)]/60 py-3 nav-blur'
      }`}
    >
      <div className="flex items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/Mayaz.png" alt="Logo" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
          <span className="text-sm font-semibold text-[var(--fg)]">{name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/resume"
            className="hidden rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-hover)] sm:inline-flex"
          >
            Resume
          </Link>
          <ThemeToggle compact />
          <button
            className="flex items-center justify-center rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/resume"
              className="mt-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Resume
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
