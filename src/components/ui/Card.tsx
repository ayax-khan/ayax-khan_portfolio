import { type ReactNode } from 'react'

type Props = {
  title?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Card(props: Props) {
  return (
    <div
      className={`portfolio-card rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-[cubic-bezier(.2,.9,.2,1)] hover:-translate-y-0.5 hover:scale-[1.01] hover:border-[color:color-mix(in_srgb,var(--border),var(--fg) 20%)] ${
        props.className ?? ''
      }`}
    >
      {props.title ? <h3 className="text-base font-semibold tracking-tight text-[color:var(--fg)]">{props.title}</h3> : null}
      <div className={props.title ? 'mt-2 text-sm text-[color:var(--muted)]' : 'text-sm text-[color:var(--muted)]'}>
        {props.children}
      </div>
      {props.footer ? <div className="mt-4">{props.footer}</div> : null}
    </div>
  )
}
