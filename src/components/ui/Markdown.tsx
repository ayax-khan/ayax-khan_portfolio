import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

const components: Partial<Components> = {
  h1: ({ children, ...props }) => (
    <h1 className="mb-4 mt-8 text-3xl font-bold tracking-tight text-[color:var(--fg)] first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mb-3 mt-10 border-b border-[color:var(--border)] pb-2 text-2xl font-semibold tracking-tight text-[color:var(--fg)]" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mb-2 mt-8 text-xl font-semibold tracking-tight text-[color:var(--fg)]" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mb-2 mt-6 text-lg font-semibold text-[color:var(--fg)]" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-7 text-[color:var(--muted)] last:mb-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-6 text-[color:var(--muted)] last:mb-0" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-[color:var(--muted)] last:mb-0" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="font-medium text-[color:var(--fg)] underline underline-offset-2 decoration-[color:var(--border)] hover:decoration-[color:var(--fg)] transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="mb-4 border-l-4 border-[color:var(--border)] pl-4 italic text-[color:var(--muted)] last:mb-0" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="rounded-md bg-[color:var(--surface-2)] px-1.5 py-0.5 font-mono text-sm text-[color:var(--fg)]" {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className="block overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 font-mono text-sm leading-relaxed text-[color:var(--fg)]" {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }) => (
    <pre className="mb-4 overflow-hidden rounded-xl last:mb-0" {...props}>
      {children}
    </pre>
  ),
  table: ({ children, ...props }) => (
    <div className="mb-4 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-sm text-[color:var(--muted)]" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-[color:var(--border)] bg-[color:var(--surface)]" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="border-b border-[color:var(--border)] last:border-0" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-2 text-left font-semibold text-[color:var(--fg)]" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2" {...props}>
      {children}
    </td>
  ),
  hr: (props) => (
    <hr className="my-8 border-[color:var(--border)]" {...props} />
  ),
  img: ({ src, alt, ...props }) => (
    <img
      src={src}
      alt={alt ?? ''}
      className="my-6 max-w-full rounded-xl border border-[color:var(--border)]"
      loading="lazy"
      {...props}
    />
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-[color:var(--fg)]" {...props}>
      {children}
    </strong>
  ),
}

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
