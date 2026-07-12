'use client'

import { useCallback, useRef, useState, useEffect } from 'react'

type ToolbarButton = {
  label: string
  command: string
  value?: string
  icon?: string
}

type ToolbarGroup = {
  label?: string
  buttons: ToolbarButton[]
}

const GROUPS: ToolbarGroup[] = [
  {
    buttons: [
      { label: 'Bold', command: 'bold', icon: 'B' },
      { label: 'Italic', command: 'italic', icon: 'I' },
      { label: 'Underline', command: 'underline', icon: 'U' },
      { label: 'Strikethrough', command: 'strikeThrough', icon: 'S' },
    ],
  },
  {
    label: 'Headings',
    buttons: [
      { label: 'H1', command: 'formatBlock', value: 'h1' },
      { label: 'H2', command: 'formatBlock', value: 'h2' },
      { label: 'H3', command: 'formatBlock', value: 'h3' },
      { label: 'H4', command: 'formatBlock', value: 'h4' },
      { label: 'Paragraph', command: 'formatBlock', value: 'p' },
    ],
  },
  {
    label: 'Lists',
    buttons: [
      { label: 'UL', command: 'insertUnorderedList', icon: 'UL' },
      { label: 'OL', command: 'insertOrderedList', icon: 'OL' },
    ],
  },
  {
    label: 'Align',
    buttons: [
      { label: 'Left', command: 'justifyLeft', icon: '≡' },
      { label: 'Center', command: 'justifyCenter', icon: '≡' },
      { label: 'Right', command: 'justifyRight', icon: '≡' },
    ],
  },
  {
    buttons: [
      { label: 'Quote', command: 'formatBlock', value: 'blockquote', icon: '"' },
      { label: 'Code', command: 'formatBlock', value: 'pre', icon: '</>' },
      { label: 'Link', command: 'createLink', icon: '🔗' },
      { label: 'HR', command: 'insertHorizontalRule', icon: '—' },
    ],
  },
]

function exec(command: string, value?: string) {
  document.execCommand(command, false, value)
}

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      if (html !== value) onChange(html)
    }
  }, [onChange, value])

  const handleToolbar = useCallback((cmd: string, val?: string) => {
    if (cmd === 'createLink') {
      const url = prompt('Enter URL:', 'https://')
      if (url) exec(cmd, url)
      return
    }
    exec(cmd, val)
    handleInput()
    if (editorRef.current) editorRef.current.focus()
  }, [handleInput])

  useEffect(() => {
    if (isMounted && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value, isMounted])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      exec('insertHTML', '&emsp;')
    }
  }, [])

  return (
    <div className="rich-editor rounded-xl border border-[color:var(--border)] overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-1.5">
        {GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5 mr-1">
            {gi > 0 && <span className="mx-1 h-5 w-px bg-[color:var(--border)]" />}
            {group.buttons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                title={btn.label}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleToolbar(btn.command, btn.value)
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]"
              >
                {btn.icon ?? btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="min-h-[320px] px-4 py-3 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-inset focus:ring-[color:var(--selection)]"
        data-placeholder={placeholder}
        style={{
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
          lineHeight: 1.7,
        }}
      />
    </div>
  )
}
