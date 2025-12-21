'use client'

import { useEffect, useMemo, useState } from 'react'

type CommitItem = { sha: string; message: string; date: string; url: string }
import { Badge } from '@/components/ui/Badge'

type ProjectRow = {
  fullName: string
  slug: string
  repoName: string
  repoUrl: string
  language: string | null
  stars: number
  updatedAt: string

  // Override-able fields
  visible: boolean
  featured: boolean
  demoUrl: string | null
  customTitle: string | null
  customSummary: string | null
  tags: string[]
  sortOrder: number | null
  isFork: boolean
  archived: boolean
}

type Props = {
  projects: ProjectRow[]
  onUpdate: (formData: FormData) => void
  onReset: (formData: FormData) => void
  onSaveOrder: (formData: FormData) => void
  onSyncNow: () => void
}

function formatDate(iso: string) {
  // Deterministic formatting to avoid hydration mismatches across server/client locales.
  // Output: YYYY-MM-DD
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toISOString().slice(0, 10)
  } catch {
    return iso
  }
}

const filters = ['all', 'featured', 'visible', 'hidden'] as const

type Filter = (typeof filters)[number]

export function ProjectsClient({ projects, onUpdate, onReset, onSaveOrder, onSyncNow }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [language, setLanguage] = useState<string>('all')
  const [showForks, setShowForks] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [ordering, setOrdering] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)
  const [ordered, setOrdered] = useState<ProjectRow[]>(projects)
  const [commitState, setCommitState] = useState<
    Record<string, { status: 'idle' | 'loading' | 'loaded' | 'error'; commits: CommitItem[]; error?: string }>
  >({})

  const [tagsByProject, setTagsByProject] = useState<Record<string, string[]>>({})
  const [tagDraft, setTagDraft] = useState('')

  function normalizeTag(tag: string) {
    return tag.trim().replace(/\s+/g, ' ')
  }

  // keep in sync if server sends new data (e.g. after save)
  useEffect(() => {
    setOrdered(projects)
    setTagsByProject((prev) => {
      const next = { ...prev }
      for (const p of projects) {
        if (!next[p.fullName]) next[p.fullName] = p.tags
      }
      return next
    })
  }, [projects])

  useEffect(() => {
    if (!open) return
    setTagsByProject((prev) => ({ ...prev, [open]: prev[open] ?? projects.find((p) => p.fullName === open)?.tags ?? [] }))
    setTagDraft('')
  }, [open, projects])

  const languages = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) if (p.language) set.add(p.language)
    return ['all', ...Array.from(set).sort()]
  }, [projects])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ordered.filter((p) => {
      if (filter === 'featured' && !p.featured) return false
      if (filter === 'visible' && !p.visible) return false
      if (filter === 'hidden' && p.visible) return false
      if (!showForks && p.isFork) return false
      if (!showArchived && p.archived) return false
      if (language !== 'all' && (p.language ?? 'Unknown') !== language) return false
      if (!q) return true
      const hay = `${p.fullName} ${p.customTitle ?? p.repoName} ${p.customSummary ?? ''} ${(p.tags ?? []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [ordered, query, filter, language, showForks, showArchived])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <form action={onSyncNow} className="shrink-0">
          <button
            type="submit"
            className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-2 text-sm font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface)]"
          >
            Sync now
          </button>
        </form>

        <div className="min-w-[220px] flex-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by repo, title, tags..."
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
          />
        </div>

        <div className="w-[160px]">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Filter</label>
          <select
            value={filter}
            onChange={(e) => {
              const v = e.target.value as Filter
              if (filters.includes(v)) setFilter(v)
            }}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--fg)] outline-none"
          >
            <option value="all">All</option>
            <option value="featured">Featured</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <div className="w-[160px]">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--fg)] outline-none"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
          <span className="whitespace-nowrap">Showing {filtered.length} of {projects.length}</span>

          <label className="flex items-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-xs font-semibold text-[color:var(--fg)]">
            <input type="checkbox" checked={showForks} onChange={(e) => setShowForks(e.target.checked)} />
            Forks
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-xs font-semibold text-[color:var(--fg)]">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
            Archived
          </label>

          <button
            type="button"
            onClick={() => setOrdering((v) => !v)}
            className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-xs font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface)]"
          >
            {ordering ? 'Exit reorder' : 'Reorder'}
          </button>

          {ordering ? (
            <form action={onSaveOrder} onSubmit={() => setOrdering(false)}>
              <input type="hidden" name="orderJson" value={JSON.stringify(ordered.map((p) => p.fullName))} />
              <button
                type="submit"
                className="rounded-xl bg-[color:var(--fg)] px-3 py-2 text-xs font-semibold text-[color:var(--bg)] hover:opacity-90"
              >
                Save order
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const isOpen = open === p.fullName
          return (
            <div
              key={p.fullName}
              className={
                'rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] ' +
                (ordering ? 'cursor-move' : '')
              }
              draggable={ordering}
              onDragStart={() => setDragging(p.fullName)}
              onDragEnd={() => setDragging(null)}
              onDragOver={(e) => {
                if (!ordering) return
                e.preventDefault()
              }}
              onDrop={() => {
                if (!ordering || !dragging || dragging === p.fullName) return

                const from = ordered.findIndex((x) => x.fullName === dragging)
                const to = ordered.findIndex((x) => x.fullName === p.fullName)
                if (from < 0 || to < 0) return

                const next = [...ordered]
                const [moved] = next.splice(from, 1)
                next.splice(to, 0, moved)
                setOrdered(next)
              }}
            >
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={p.repoUrl} target="_blank" rel="noreferrer" className="truncate text-sm font-semibold text-[color:var(--fg)] hover:underline">
                      {p.fullName}
                    </a>
                    {p.featured ? <Badge>Featured</Badge> : null}
                    {!p.visible ? <Badge>Hidden</Badge> : null}
                    {p.isFork ? <Badge variant="muted">Fork</Badge> : null}
                    {p.archived ? <Badge variant="muted">Archived</Badge> : null}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                    <span>{p.language ?? 'Unknown'}</span>
                    <span>· ★ {p.stars}</span>
                    <span>· Updated {formatDate(p.updatedAt)}</span>
                    {p.sortOrder != null ? <span>· Order {p.sortOrder}</span> : null}
                  </div>
                  {p.customSummary ? (
                    <p className="mt-2 line-clamp-2 text-sm text-[color:var(--muted)]">{p.customSummary}</p>
                  ) : null}
                  {p.tags.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <Badge key={t} variant="muted">{t}</Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : p.fullName)}
                    className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface)]"
                  >
                    {isOpen ? 'Close' : 'Edit'}
                  </button>
                </div>
              </div>

              {isOpen ? (
                <div className="border-t border-[color:var(--border)] p-4">
                  <form action={onUpdate} className="grid gap-4 md:grid-cols-2">
                    <input type="hidden" name="repoFullName" value={p.fullName} />

                    <div className="flex flex-wrap gap-6 md:col-span-2">
                      <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                        <input type="checkbox" name="visible" defaultChecked={p.visible} /> Visible
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                        <input type="checkbox" name="featured" defaultChecked={p.featured} /> Featured
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm text-[color:var(--muted)]">Custom title</label>
                      <input
                        name="customTitle"
                        defaultValue={p.customTitle ?? ''}
                        placeholder={p.repoName}
                        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                      />
                      <p className="mt-1 text-xs text-[color:var(--muted)]">Leave same as repo name to keep default.</p>
                    </div>

                    <div>
                      <label className="block text-sm text-[color:var(--muted)]">Demo URL</label>
                      <input
                        name="demoUrl"
                        defaultValue={p.demoUrl ?? ''}
                        placeholder="https://..."
                        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-[color:var(--muted)]">Custom summary</label>
                      <textarea
                        name="customSummary"
                        defaultValue={p.customSummary ?? ''}
                        rows={3}
                        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[color:var(--muted)]">Tags</label>

                      {/* Hidden input submitted to server action */}
                      <input type="hidden" name="tags" value={(tagsByProject[p.fullName] ?? p.tags).join(', ')} />

                      <div className="mt-2 flex flex-wrap gap-2">
                        {(tagsByProject[p.fullName] ?? p.tags).map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1 text-xs font-semibold text-[color:var(--fg)]"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => {
                                setTagsByProject((prev) => ({
                                  ...prev,
                                  [p.fullName]: (prev[p.fullName] ?? p.tags).filter((x) => x !== t),
                                }))
                              }}
                              className="text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                              aria-label={`Remove tag ${t}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <input
                        value={open === p.fullName ? tagDraft : ''}
                        onChange={(e) => setTagDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (open !== p.fullName) return
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault()
                            const next = normalizeTag(tagDraft.replace(/,$/, ''))
                            if (!next) return
                            setTagsByProject((prev) => {
                              const existing = prev[p.fullName] ?? p.tags
                              if (existing.includes(next)) return prev
                              if (existing.length >= 20) return prev
                              return { ...prev, [p.fullName]: [...existing, next] }
                            })
                            setTagDraft('')
                          }
                        }}
                        placeholder="Type tag and press Enter"
                        className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                      />
                      <p className="mt-1 text-xs text-[color:var(--muted)]">Press Enter (or comma) to add. Max 20 tags.</p>
                    </div>

                    <div>
                      <label className="block text-sm text-[color:var(--muted)]">Sort order</label>
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={p.sortOrder ?? ''}
                        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:col-span-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
                      >
                        Save
                      </button>
                      <button
                        type="submit"
                        formAction={onReset}
                        className="rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface-2)]"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="md:col-span-2">
                      <details className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
                        <summary className="cursor-pointer text-sm font-semibold text-[color:var(--fg)]">Commit timeline preview</summary>
                        <div className="mt-3 space-y-2">
                          <button
                            type="button"
                            onClick={async () => {
                              const key = p.fullName
                              const existing = commitState[key]
                              if (existing?.status === 'loading') return

                              setCommitState((prev) => ({
                                ...prev,
                                [key]: { status: 'loading', commits: prev[key]?.commits ?? [] },
                              }))

                              try {
                                const res = await fetch(`/admin/projects/commits?repo=${encodeURIComponent(p.repoName)}`)
                                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                                const json = (await res.json()) as { commits: CommitItem[] }
                                setCommitState((prev) => ({
                                  ...prev,
                                  [key]: { status: 'loaded', commits: json.commits ?? [] },
                                }))
                              } catch (e) {
                                const msg = e instanceof Error ? e.message : 'Failed to load commits'
                                setCommitState((prev) => ({
                                  ...prev,
                                  [key]: { status: 'error', commits: prev[key]?.commits ?? [], error: msg },
                                }))
                              }
                            }}
                            className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface-2)]"
                          >
                            Load latest commits
                          </button>

                          {commitState[p.fullName]?.status === 'loading' ? (
                            <p className="text-sm text-[color:var(--muted)]">Loading…</p>
                          ) : null}

                          {commitState[p.fullName]?.status === 'error' ? (
                            <p className="text-sm text-[color:var(--muted)]">{commitState[p.fullName]?.error}</p>
                          ) : null}

                          {commitState[p.fullName]?.status === 'loaded' ? (
                            <ul className="space-y-2">
                              {commitState[p.fullName]?.commits.map((c) => (
                                <li key={c.sha} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                                  <a href={c.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[color:var(--fg)] hover:underline">
                                    {c.message.split('\n')[0]}
                                  </a>
                                  <div className="mt-1 text-xs text-[color:var(--muted)]">
                                    {c.sha.slice(0, 7)} · {formatDate(c.date)}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </details>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
