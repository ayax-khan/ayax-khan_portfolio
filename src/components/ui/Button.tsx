import { type ComponentProps } from 'react'
import { forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'default' | 'lg'

type Props = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} & Omit<ComponentProps<'button'>, 'className'>

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-hover)] hover:shadow-md active:scale-[0.98]',
  secondary:
    'bg-[var(--surface)] text-[var(--fg)] ring-1 ring-[var(--border)] hover:bg-[var(--surface-2)] hover:ring-[var(--muted-2)] active:scale-[0.98]',
  ghost:
    'bg-transparent text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] active:scale-[0.98]',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(props, ref) {
  const variant = props.variant ?? 'primary'
  const size = props.size ?? 'default'
  const { className, type, ...rest } = props
  const safeType = type === 'submit' || type === 'reset' || type === 'button' ? type : 'button'

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ''}`}
      type={safeType}
      {...rest}
    />
  )
})
