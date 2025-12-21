import { type ReactNode } from 'react'

export function SectionHeading(props: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{props.title}</h2>
        {props.description ? <p className="mt-1 text-sm text-[color:var(--muted)]">{props.description}</p> : null}
      </div>
      {props.action ? <div>{props.action}</div> : null}
    </div>
  )
}
