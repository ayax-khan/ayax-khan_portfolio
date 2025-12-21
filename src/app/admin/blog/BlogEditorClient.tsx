'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Markdown } from '@/components/ui/Markdown'
import { Prose } from '@/components/ui/Prose'

export type AdminBlogPost = {
  id: string
  slug: string
  title: string
  summary: string | null
  content: string
  metaTitle: string | null
  metaDescription: string | null
  tags: string[]
  categories: string[]
  published: boolean
  publishedAt: string | null
  updatedAt: string
}

type Props = {
  posts: AdminBlogPost[]
  onSave: (formData: FormData) => void
  onDelete: (formData: FormData) => void
}

function isoDate(iso: string | null) {
  if (!iso) return '—'
  try {
    return new Date(iso).toISOString().slice(0, 10)
  } catch {
    return iso
  }
}

function normalizeChip(v: string) {
  return v.trim().replace(/\s+/g, ' ')
}

function ChipsEditor({
  label,
  values,
  onChange,
  placeholder,
  max = 30,
  inputName,
}: {
  label: string
  values: string[]
  onChange: (next: string[]) => void
  placeholder: string
  max?: number
  inputName: string
}) {
  const [draft, setDraft] = useState('')

  return (
    <div>
      <label className="block text-sm text-[color:var(--muted)]">{label}</label>
      <input type="hidden" name={inputName} value={values.join(', ')} />

      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1 text-xs font-semibold text-[color:var(--fg)]"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== t))}
              className="text-[color:var(--muted)] hover:text-[color:var(--fg)]"
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const next = normalizeChip(draft.replace(/,$/, ''))
            if (!next) return
            if (values.includes(next)) return
            if (values.length >= max) return
            onChange([...values, next])
            setDraft('')
          }
        }}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
      />
      <p className="mt-1 text-xs text-[color:var(--muted)]">Press Enter (or comma) to add.</p>
    </div>
  )
}

export function BlogEditorClient({ posts, onSave, onDelete }: Props) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | 'new'>(posts[0]?.id ?? 'new')

  function makeEmptyDraft(): AdminBlogPost {
    return {
      id: '',
      slug: '',
      title: '',
      summary: null,
      content: '',
      metaTitle: null,
      metaDescription: null,
      tags: [],
      categories: [],
      published: false,
      publishedAt: null,
      updatedAt: new Date().toISOString(),
    }
  }

  function load(id: string | 'new') {
    if (id === 'new') {
      setSelectedId('new')
      setDraft(makeEmptyDraft())
      setTags([])
      setCategories([])
      return
    }

    const found = posts.find((p) => p.id === id)
    setSelectedId(id)
    setDraft(found ?? makeEmptyDraft())
    setTags(found?.tags ?? [])
    setCategories(found?.categories ?? [])
  }

  const [draft, setDraft] = useState<AdminBlogPost | null>(posts[0] ?? makeEmptyDraft())
  const [tags, setTags] = useState<string[]>(posts[0]?.tags ?? [])
  const [categories, setCategories] = useState<string[]>(posts[0]?.categories ?? [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) => `${p.title} ${p.slug} ${(p.tags ?? []).join(' ')} ${(p.categories ?? []).join(' ')}`.toLowerCase().includes(q))
  }, [posts, query])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[240px] flex-1">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, slug, tags..."
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
          />
        </div>

        <div className="w-[260px]">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Post</label>
          <select
            value={selectedId}
            onChange={(e) => {
              const v = e.target.value
              load(v === 'new' ? 'new' : v)
            }}
            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--fg)] outline-none"
          >
            <option value="new">+ New draft</option>
            {filtered.map((p) => (
              <option key={p.id} value={p.id}>
                {p.published ? '● ' : '○ '}{p.title} ({p.slug})
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-[color:var(--muted)]">{filtered.length} posts</div>
      </div>

      {draft ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
            <form action={onSave} className="space-y-4">
              <input type="hidden" name="id" value={draft.id} />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-[color:var(--muted)]">Slug</label>
                  <input
                    name="slug"
                    value={draft.slug}
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                    placeholder="my-first-post"
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[color:var(--muted)]">Title</label>
                  <input
                    name="title"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="My First Post"
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[color:var(--muted)]">Summary</label>
                <textarea
                  name="summary"
                  value={draft.summary ?? ''}
                  onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>

              <div>
                <label className="block text-sm text-[color:var(--muted)]">Content (Markdown)</label>
                <textarea
                  name="content"
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  rows={16}
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 font-mono text-sm text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-[color:var(--muted)]">Meta title</label>
                  <input
                    name="metaTitle"
                    value={draft.metaTitle ?? ''}
                    onChange={(e) => setDraft({ ...draft, metaTitle: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[color:var(--muted)]">Meta description</label>
                  <input
                    name="metaDescription"
                    value={draft.metaDescription ?? ''}
                    onChange={(e) => setDraft({ ...draft, metaDescription: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  />
                </div>
              </div>

              <ChipsEditor label="Tags" values={tags} onChange={setTags} placeholder="Type a tag and press Enter" inputName="tags" />
              <ChipsEditor
                label="Categories"
                values={categories}
                onChange={setCategories}
                placeholder="Type a category and press Enter"
                inputName="categories"
              />

              <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                <input
                  type="checkbox"
                  name="published"
                  checked={draft.published}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Published
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
                >
                  Save
                </button>

                {draft.id ? (
                  <form action={onDelete}>
                    <input type="hidden" name="id" value={draft.id} />
                    <button
                      type="submit"
                      className="rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface-2)]"
                    >
                      Delete
                    </button>
                  </form>
                ) : null}

                <span className="text-xs text-[color:var(--muted)]">Published: {isoDate(draft.publishedAt)}</span>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="muted">Preview</Badge>
              {tags.map((t) => (
                <Badge key={t} variant="muted">
                  {t}
                </Badge>
              ))}
              {categories.map((c) => (
                <Badge key={c} variant="muted">
                  {c}
                </Badge>
              ))}
            </div>

            <Prose>
              <h1>{draft.title || 'Untitled'}</h1>
              {draft.summary ? <p className="lead">{draft.summary}</p> : null}
              <Markdown content={draft.content || '_Start writing..._'} />
            </Prose>
          </div>
        </div>
      ) : null}
    </div>
  )
}
