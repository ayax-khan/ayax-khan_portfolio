import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
  variant?: 'default' | 'muted'
}

export function Badge({ children, variant = 'default' }: Props) {
  const cls =
    variant === 'muted'
      ? 'border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)]'
      : 'border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--fg)]'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}
