import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/Card'
import { BlogEditorClient } from './BlogEditorClient'
import { deleteBlogPostFromForm, upsertBlogPostFromForm } from './actions'

export const metadata = {
  title: 'Admin · Blog',
  description: 'Create/edit/publish blog posts with markdown + SEO fields.',
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

  const posts = await prisma.blogPost.findMany({ orderBy: [{ updatedAt: 'desc' }] })

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Admin · Blog</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          Create/edit posts stored in Postgres. Use Markdown content, draft/publish toggle, and SEO fields.
        </p>
      </header>

      <BlogEditorClient
        posts={posts.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          summary: p.summary,
          content: p.content,
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          tags: p.tags,
          categories: p.categories,
          published: p.published,
          publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
          updatedAt: p.updatedAt.toISOString(),
        }))}
        onSave={upsertBlogPostFromForm}
        onDelete={deleteBlogPostFromForm}
      />
    </div>
  )
}
