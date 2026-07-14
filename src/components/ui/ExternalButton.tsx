'use client'

import { type ComponentProps } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

type Props = {
  variant?: Variant
  className?: string
} & Omit<ComponentProps<'a'>, 'className'>

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-hover)] hover:shadow-md',
  secondary:
    'bg-[var(--surface)] text-[var(--fg)] ring-1 ring-[var(--border)] hover:bg-[var(--surface-2)] hover:ring-[var(--muted-2)]',
  ghost:
    'bg-transparent text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]',
}

export function ExternalButton({ variant = 'secondary', className, children, ...rest }: Props) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${variantClasses[variant]} ${className ?? ''}`}
      target="_blank"
      rel="noreferrer"
      {...rest}
    >
      {children}
    </a>
  )
}
