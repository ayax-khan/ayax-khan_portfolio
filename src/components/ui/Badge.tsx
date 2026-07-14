import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
  variant?: 'default' | 'muted' | 'accent'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: Props) {
  const cls = {
    default: 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg)]',
    muted: 'border-[var(--border)] bg-transparent text-[var(--muted)]',
    accent: 'border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent)]',
  }[variant]

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${cls} ${className}`}>
      {children}
    </span>
  )
}
