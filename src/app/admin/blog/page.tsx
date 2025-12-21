import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/Card'
import { upsertBlogPost, setBlogPublished, deleteBlogPost } from './actions'

export const metadata = {
  title: 'Admin · Blog',
  description: 'Create/edit/publish blog posts.',
}

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Admin · Blog</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use the admin panel.
          </p>
        </Card>
      </div>
    )
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: [{ updatedAt: 'desc' }],
  })

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Admin · Blog</h1>
          <p className="mt-2 max-w-2xl text-[color:var(--muted)]">Create/edit posts stored in Postgres. Publish to show on /blog.</p>
        </div>
      </header>

      <Card title="New post">
        <form
          action={async (formData) => {
            'use server'
            await upsertBlogPost({
              slug: String(formData.get('slug') ?? '').trim(),
              title: String(formData.get('title') ?? '').trim(),
              summary: String(formData.get('summary') ?? '').trim() || null,
              content: String(formData.get('content') ?? ''),
              tags: String(formData.get('tags') ?? ''),
              published: formData.get('published') === 'on',
            })
          }}
          className="mt-3 space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm text-[color:var(--muted)]">Slug</label>
              <input name="slug" className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]" />
            </div>
            <div>
              <label className="block text-sm text-[color:var(--muted)]">Title</label>
              <input name="title" className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[color:var(--muted)]">Summary (optional)</label>
            <input name="summary" className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]" />
          </div>

          <div>
            <label className="block text-sm text-[color:var(--muted)]">Tags (comma separated)</label>
            <input name="tags" className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]" />
          </div>

          <div>
            <label className="block text-sm text-[color:var(--muted)]">Content</label>
            <textarea
              name="content"
              rows={10}
              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 font-mono text-sm text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
            <input type="checkbox" name="published" /> Publish
          </label>

          <button
            type="submit"
            className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
          >
            Create
          </button>
        </form>
      </Card>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card title="No posts">
            <p className="text-sm text-[color:var(--muted)]">Create your first post using the form above.</p>
          </Card>
        ) : null}
        {posts.map((p) => (
          <Card key={p.id} title={p.title}>
            <p className="text-sm text-[color:var(--muted)]">
              <span className="font-mono">{p.slug}</span> · {p.published ? 'Published' : 'Draft'}
            </p>
            {p.summary ? <p className="mt-2">{p.summary}</p> : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/blog/${p.slug}`} className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                View →
              </Link>

              <form
                action={async () => {
                  'use server'
                  await setBlogPublished({ id: p.id, published: !p.published })
                }}
              >
                <button className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]" type="submit">
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
              </form>

              <form
                action={async () => {
                  'use server'
                  await deleteBlogPost(p.id)
                }}
              >
                <button className="text-sm text-red-300 hover:text-red-200" type="submit">
                  Delete
                </button>
              </form>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-[color:var(--muted)]">Edit</summary>
              <form
                action={async (formData) => {
                  'use server'
                  await upsertBlogPost({
                    id: p.id,
                    slug: String(formData.get('slug') ?? '').trim(),
                    title: String(formData.get('title') ?? '').trim(),
                    summary: String(formData.get('summary') ?? '').trim() || null,
                    content: String(formData.get('content') ?? ''),
                    tags: String(formData.get('tags') ?? ''),
                    published: formData.get('published') === 'on',
                  })
                }}
                className="mt-3 space-y-3"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm text-[color:var(--muted)]">Slug</label>
                    <input
                      name="slug"
                      defaultValue={p.slug}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[color:var(--muted)]">Title</label>
                    <input
                      name="title"
                      defaultValue={p.title}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[color:var(--muted)]">Summary (optional)</label>
                  <input
                    name="summary"
                    defaultValue={p.summary ?? ''}
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[color:var(--muted)]">Tags (comma separated)</label>
                  <input
                    name="tags"
                    defaultValue={p.tags.join(', ')}
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[color:var(--muted)]">Content</label>
                  <textarea
                    name="content"
                    defaultValue={p.content}
                    rows={10}
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 font-mono text-sm text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                  <input type="checkbox" name="published" defaultChecked={p.published} /> Published
                </label>

                <button
                  type="submit"
                  className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
                >
                  Save
                </button>
              </form>
            </details>
          </Card>
        ))}
      </div>
    </div>
  )
}
