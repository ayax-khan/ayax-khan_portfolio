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
        <span className="mb-3 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
          {subtitle}
        </span>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)] ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
