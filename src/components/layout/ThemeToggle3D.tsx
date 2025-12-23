'use client'

// Backwards-compatible export: the 3D toggle was removed in favor of a simpler UI.
// Keep this component name so any existing imports do not break.

import { ThemeToggle } from './ThemeToggle'

export function ThemeToggle3D({ className }: { className?: string }) {
  return <ThemeToggle className={className} compact />
}
