'use client'

import { useEffect, useState } from 'react'

export type ThemeName = 'light' | 'navy'

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // ignore
  }
}

function normalizeTheme(input: unknown): ThemeName | null {
  return input === 'light' || input === 'navy' ? input : null
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
        fill="currentColor"
      />
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

export function ThemeToggle({ className, compact }: { className?: string; compact?: boolean }) {
  // Hydration-safe: start in a stable state (light), then reconcile after mount.
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
    document.documentElement.dataset.theme = resolved

    Promise.resolve().then(() => {
      setTheme(resolved)
      setMounted(true)
    })
  }, [])

  const isNavy = mounted && theme === 'navy'

  const widthClass = compact ? 'w-[70px]' : 'w-[112px]'
  const heightClass = compact ? 'h-9' : 'h-10'

  // Using translate keeps this CSS-only and smooth.
  const knobTranslate = isNavy ? (compact ? 'translate-x-[32px]' : 'translate-x-[54px]') : 'translate-x-0'

  const toggle = (next?: ThemeName) => {
    const resolvedNext: ThemeName = next ?? (theme === 'navy' ? 'light' : 'navy')
    setTheme(resolvedNext)
    applyTheme(resolvedNext)
  }

  return (
    <button
      type="button"
      onClick={() => toggle()}
      className={`theme-toggle-simple relative inline-flex ${heightClass} ${widthClass} items-center overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-1.5 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--selection)] ${
        className ?? ''
      }`}
      role="switch"
      aria-checked={mounted ? isNavy : false}
      aria-label="Toggle theme"
      title={mounted ? (isNavy ? 'Navy theme' : 'Light theme') : 'Theme'}
      suppressHydrationWarning
    >
      {/* Optional click targets: left = light, right = navy (only when not compact) */}
      {!compact && (
        <span className="absolute inset-0 z-10 grid grid-cols-2" aria-hidden="true">
          <span
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggle('light')
            }}
          />
          <span
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggle('navy')
            }}
          />
        </span>
      )}

      {/* Track */}
      <span
        className={`pointer-events-none absolute inset-0 z-0 theme-toggle-simple__track ${
          isNavy ? 'theme-toggle-simple__track--night' : 'theme-toggle-simple__track--day'
        }`}
        aria-hidden="true"
      />

      {/* Fixed end icons */}
      <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-3" aria-hidden="true">
        <SunIcon className={`h-4 w-4 transition-opacity ${isNavy ? 'opacity-45' : 'opacity-100'} text-amber-500`} />
        <MoonIcon
          className={`h-4 w-4 transition-opacity ${isNavy ? 'opacity-100 text-indigo-200' : 'opacity-70 text-slate-600'}`}
        />
      </span>

      {/* Knob (minimal) */}
      <span
        className={`theme-toggle-simple__knob pointer-events-none relative z-20 inline-flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-transform duration-400 ease-[cubic-bezier(.2,.9,.2,1)] ${knobTranslate}`}
        aria-hidden="true"
      />
    </button>
  )
}
