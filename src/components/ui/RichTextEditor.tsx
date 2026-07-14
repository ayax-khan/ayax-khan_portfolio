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
      { label: 'H1', command: 'h1' },
      { label: 'H2', command: 'h2' },
      { label: 'H3', command: 'h3' },
      { label: 'H4', command: 'h4' },
      { label: 'P', command: 'paragraph' },
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
    buttons: [
      { label: 'Quote', command: 'formatBlock', value: 'blockquote', icon: '"' },
      { label: 'Code', command: 'formatBlock', value: 'pre', icon: '</>' },
      { label: 'Link', command: 'link', icon: '🔗' },
      { label: 'HR', command: 'insertHorizontalRule', icon: '—' },
    ],
  },
]

function execFormat(command: string, value?: string) {
  document.execCommand(command, false, value)
}

let headingEditorRef: HTMLDivElement | null = null

function headingCommand(level: string) {
  execFormat('formatBlock', level === 'paragraph' ? 'p' : level)
  if (headingEditorRef) headingEditorRef.focus()
}

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const linkInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      if (html !== value) onChange(html)
    }
  }, [onChange, value])

  const insertLink = useCallback(() => {
    if (!linkUrl) return
    const trimmed = linkUrl.trim()
    if (!trimmed) return

    const selection = window.getSelection()
    if (!selection || !selection.rangeCount || selection.isCollapsed) {
      execFormat('insertHTML', `<a href="${trimmed}">${trimmed}</a>`)
    } else {
      const url = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`
      execFormat('createLink', url)
    }
    handleInput()
    setShowLinkInput(false)
    setLinkUrl('')
    if (editorRef.current) editorRef.current.focus()
  }, [linkUrl, handleInput])

  const handleToolbar = useCallback(
    (cmd: string, val?: string) => {
      if (cmd === 'link') {
        setShowLinkInput(true)
        setLinkUrl('')
        setTimeout(() => linkInputRef.current?.focus(), 50)
        return
      }
      if (['h1', 'h2', 'h3', 'h4', 'paragraph'].includes(cmd)) {
        headingEditorRef = editorRef.current
        headingCommand(cmd === 'paragraph' ? 'p' : cmd)
        handleInput()
        return
      }
      execFormat(cmd, val)
      handleInput()
      if (editorRef.current) editorRef.current.focus()
    },
    [handleInput],
  )

  useEffect(() => {
    if (isMounted && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value, isMounted])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      execFormat('insertHTML', '&emsp;')
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setShowLinkInput(true)
      setLinkUrl('')
      setTimeout(() => linkInputRef.current?.focus(), 50)
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
                className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)] transition-colors"
              >
                {btn.icon ?? btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {showLinkInput && (
        <div className="flex items-center gap-2 border-b border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2">
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                insertLink()
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false)
                setLinkUrl('')
                if (editorRef.current) editorRef.current.focus()
              }
            }}
            placeholder="https://example.com"
            className="flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg)] px-3 py-1.5 text-sm text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
            autoFocus
          />
          <button
            type="button"
            onClick={insertLink}
            className="rounded-lg bg-[color:var(--fg)] px-3 py-1.5 text-xs font-semibold text-[color:var(--bg)] hover:opacity-90 transition-opacity"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
              if (editorRef.current) editorRef.current.focus()
            }}
            className="rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

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
