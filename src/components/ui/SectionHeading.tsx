import { type ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  description?: ReactNode
  action?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({ title, subtitle, description, action, align = 'left' }: Props) {
  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center text-center' : ''}`}>
      {subtitle ? (
        <span className="mb-2 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
          {subtitle}
        </span>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className={`mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
