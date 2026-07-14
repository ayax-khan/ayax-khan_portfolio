import { type ReactNode } from 'react'

type Props = {
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  hover?: boolean
}

export function Card(props: Props) {
  const hoverClass = props.hover !== false
    ? 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300'
    : ''

  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm ${hoverClass} ${props.className ?? ''}`}
    >
      {props.title ? (
        <h3 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
          {props.title}
        </h3>
      ) : null}
      <div className={props.title ? 'mt-3 text-[15px] leading-relaxed text-[var(--muted)]' : 'text-[15px] leading-relaxed text-[var(--muted)]'}>
        {props.children}
      </div>
      {props.footer ? <div className="mt-5">{props.footer}</div> : null}
    </div>
  )
}
