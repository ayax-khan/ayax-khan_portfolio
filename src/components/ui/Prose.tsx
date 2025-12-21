import { type ReactNode } from 'react'

export function Prose(props: { children: ReactNode }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-[color:var(--fg)] prose-a:underline-offset-4 prose-a:hover:opacity-80">
      {props.children}
    </div>
  )
}
