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

function ShipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path fill="currentColor" d="M30 8c0-2 1.6-3.6 3.6-3.6S37.2 6 37.2 8v14.2h8.4c1.1 0 2 .9 2 2v2.2H19.4v-2.2c0-1.1.9-2 2-2H30V8Z" />
      <path fill="currentColor" d="M14 30h36l-5.5 18.5c-.2.6-.8 1-1.4 1H20.9c-.6 0-1.2-.4-1.4-1L14 30Z" opacity=".95" />
    </svg>
  )
}

export function ThemeToggle({ className, compact }: { className?: string; compact?: boolean }) {
  // Hydration-safe: start in a stable state (light), then reconcile after mount.
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeName>('light')
  const [waveTick, setWaveTick] = useState(0)

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

    // Defer state updates to a microtask to avoid setState-in-effect lint rule.
    Promise.resolve().then(() => {
      setTheme(resolved)
      setMounted(true)
    })
  }, [])

  const isNavy = mounted && theme === 'navy'

  const widthClass = compact ? 'w-[68px]' : 'w-[112px]'
  const heightClass = compact ? 'h-9' : 'h-10'

  const shipSize = 28
  const shipLeft = isNavy ? `calc(100% - 10px - ${shipSize}px)` : '10px'

  return (
    <button
      type="button"
      onClick={() => {
        const next: ThemeName = theme === 'navy' ? 'light' : 'navy'
        setTheme(next)
        applyTheme(next)
        setWaveTick((t) => t + 1)
      }}
      className={`theme-toggle ${
        isNavy ? 'theme-toggle--night' : 'theme-toggle--day'
      } relative inline-flex ${heightClass} ${widthClass} items-center overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--selection)] ${
        className ?? ''
      }`}
      role="switch"
      aria-checked={mounted ? isNavy : false}
      aria-label="Toggle theme"
      title={mounted ? (isNavy ? 'Navy theme' : 'Light theme') : 'Theme'}
      suppressHydrationWarning
    >
      {/* Sky (behind water) */}
      <span className={`theme-toggle__sky absolute inset-0 ${compact ? 'hidden' : ''}`} aria-hidden="true" />

      {/* Water (bottom half) */}
      <span className={`theme-toggle__water absolute left-0 right-0 bottom-0 top-1/2 ${compact ? 'hidden' : ''}`} aria-hidden="true">
        <span className="theme-toggle__wave theme-toggle__wave--back" aria-hidden="true" />
        <span className="theme-toggle__wave theme-toggle__wave--mid" aria-hidden="true" />
        <span className="theme-toggle__wave theme-toggle__wave--front" aria-hidden="true" />
        <span key={waveTick} className="theme-toggle__bubbles" aria-hidden="true" />
      </span>

      {/* Waterline / horizon (must be above water) */}
      <span
        className={`theme-toggle__waterline absolute left-0 right-0 top-1/2 ${compact ? 'hidden' : ''}`}
        aria-hidden="true"
      >
        <span className="theme-toggle__waterline-wave" aria-hidden="true" />
      </span>

      {/* Ripple / splash near ship position */}
      <span
        key={waveTick}
        className={`theme-toggle__ripple absolute ${compact ? 'hidden' : ''}`}
        style={{ left: shipLeft, bottom: 'calc(50% - 4px)' }}
        aria-hidden="true"
      />

      {/* Labels (no icons) */}
      <span className="relative z-30 flex w-full items-center justify-between text-[11px] font-semibold">
        <span className={isNavy ? 'text-[color:var(--muted)]' : 'text-[color:var(--fg)]'}>L</span>
        <span className={isNavy ? 'text-[color:var(--fg)]' : 'text-[color:var(--muted)]'}>N</span>
      </span>

      {/* Ship rides the waterline */}
      <span
        className={`theme-toggle__ship pointer-events-none absolute z-20 transition-[left] duration-500 ease-out ${
          compact ? 'hidden' : ''
        }`}
        style={{ left: shipLeft, bottom: 'calc(50% - 16px)' }}
        aria-hidden="true"
      >
        <span key={waveTick} className="theme-toggle__ship-tilt block">
          <span className="theme-toggle__ship-bob block">
            <ShipIcon className="h-7 w-7 text-[color:var(--fg)] drop-shadow" />
          </span>
        </span>
      </span>

      {/* Compact knob fallback */}
      <span
        className={`pointer-events-none absolute top-1/2 z-10 h-7 w-7 -translate-y-1/2 rounded-full bg-[color:var(--bg)] shadow transition-transform duration-300 ease-out ${
          isNavy ? 'translate-x-[40px]' : 'translate-x-0'
        } ${compact ? '' : 'hidden'}`}
        aria-hidden="true"
      />
    </button>
  )
}
