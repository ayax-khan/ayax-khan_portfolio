import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Safe markdown renderer (no raw HTML).
export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  )
}
