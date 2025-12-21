'use client'

import { useEffect, useRef } from 'react'

export type ThemeName = 'dark' | 'light' | 'navy'

const themes: { value: ThemeName; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'navy', label: 'Navy' },
  { value: 'light', label: 'Light' },
]

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // ignore
  }
}

function normalizeTheme(input: unknown): ThemeName {
  return input === 'light' || input === 'navy' || input === 'dark' ? input : 'dark'
}

export function ThemeToggle({ compact }: { compact?: boolean }) {
  const ref = useRef<HTMLSelectElement | null>(null)

  // Initialize select value after mount without setState in effect.
  useEffect(() => {
    const existing = normalizeTheme(document.documentElement.dataset.theme)

    let stored: ThemeName | null = null
    try {
      stored = normalizeTheme(localStorage.getItem('theme'))
    } catch {
      // ignore
    }

    const theme = stored ?? existing
    document.documentElement.dataset.theme = theme
    if (ref.current) ref.current.value = theme
  }, [])

  return (
    <label className={compact ? '' : 'inline-flex items-center gap-2'}>
      {compact ? null : <span className="text-xs text-[color:var(--muted)]">Theme</span>}
      <select
        ref={ref}
        defaultValue="dark"
        onChange={(e) => {
          const t = normalizeTheme(e.target.value)
          applyTheme(t)
        }}
        className="h-9 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-2 text-sm text-[color:var(--fg)] outline-none"
        aria-label="Theme"
      >
        {themes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  )
}
