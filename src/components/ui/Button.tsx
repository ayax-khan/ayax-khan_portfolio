import { type ComponentProps } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type Props = {
  variant?: ButtonVariant
  className?: string
} & Omit<ComponentProps<'button'>, 'className'>

function classes(variant: ButtonVariant) {
  switch (variant) {
    case 'secondary':
      return 'bg-[color:var(--surface-2)] text-[color:var(--fg)] ring-1 ring-[color:var(--border)] hover:bg-[color:var(--surface)]'
    case 'ghost':
      return 'bg-transparent text-[color:var(--fg)] hover:bg-[color:var(--surface-2)]'
    default:
      return 'bg-[color:var(--fg)] text-[color:var(--bg)] hover:opacity-90'
  }
}

export function Button(props: Props) {
  const variant = props.variant ?? 'primary'
  const { className, type, ...rest } = props
  const safeType = type === 'submit' || type === 'reset' || type === 'button' ? type : 'button'

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--selection)] ${classes(variant)} ${className ?? ''}`}
      type={safeType}
      {...rest}
    />
  )
}
