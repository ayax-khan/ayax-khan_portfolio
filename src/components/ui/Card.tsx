import { type ReactNode } from 'react'

export function Card(props: { title?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      {props.title ? <h3 className="text-base font-semibold text-[color:var(--fg)]">{props.title}</h3> : null}
      <div className={props.title ? 'mt-2 text-sm text-[color:var(--muted)]' : 'text-sm text-[color:var(--muted)]'}>
        {props.children}
      </div>
      {props.footer ? <div className="mt-4">{props.footer}</div> : null}
    </div>
  )
}
