import Link from 'next/link'
import { type ComponentProps } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'default' | 'lg'

type Props = {
  variant?: Variant
  size?: Size
  className?: string
} & Omit<ComponentProps<typeof Link>, 'className'>

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-hover)] hover:shadow-md',
  secondary:
    'bg-[var(--surface)] text-[var(--fg)] ring-1 ring-[var(--border)] hover:bg-[var(--surface-2)] hover:ring-[var(--muted-2)]',
  ghost:
    'bg-transparent text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]',
}

const sizeClasses: Record<Size, string> = {
  default: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

export function LinkButton({ variant = 'primary', size = 'default', className, ...rest }: Props) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ''}`}
      {...rest}
    />
  )
}
