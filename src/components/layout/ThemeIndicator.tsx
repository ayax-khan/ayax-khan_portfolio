'use client'

import { useEffect, useState } from 'react'

type ThemeName = 'light' | 'navy'

function normalizeTheme(input: unknown): ThemeName | null {
  return input === 'light' || input === 'navy' ? input : null
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" fill="currentColor" />
      <path
        d="M12 2v2.3M12 19.7V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.3M19.7 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M21 14.8C20.1 15.1 19.1 15.3 18 15.3C13.6 15.3 10 11.7 10 7.3C10 6.2 10.2 5.2 10.5 4.3C6.7 5.5 4 9.1 4 13.3C4 18.1 7.9 22 12.7 22C16.9 22 20.5 19.3 21.7 15.5C21.5 15.3 21.2 15.1 21 14.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ThemeIndicator({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeName>('light')

  useEffect(() => {
    const existing = normalizeTheme(document.documentElement.dataset.theme)

    let stored: ThemeName | null = null
    try {
      stored = normalizeTheme(localStorage.getItem('theme'))
    } catch {
      // ignore
    }

    const resolved = stored ?? existing ?? 'light'
    setTheme(resolved)
    setMounted(true)
  }, [])

  const isNavy = mounted && theme === 'navy'

  return (
    <span className={className} aria-hidden="true">
      {isNavy ? <MoonIcon className="h-4 w-4 text-indigo-200" /> : <SunIcon className="h-4 w-4 text-amber-500" />}
    </span>
  )
}
