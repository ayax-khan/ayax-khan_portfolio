import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { listPublishedPosts } from '@/lib/blog'

export const metadata = {
  title: 'Blog',
  description: 'Writing about engineering, performance, security, and delivery.',
}

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts()
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort().slice(0, 12)

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Notes on engineering, delivery, performance, and security.</p>
      </header>

      {tags.length ? (
        <section className="space-y-3">
          <SectionHeading title="Tags" description="Topics covered in recent writing." />
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t} variant="muted">
                {t}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      {posts.length === 0 ? (
        <Card title="No posts yet">
          <p>Create posts in the database (BlogPost). Set published=true to show here.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((p) => (
            <Card
              key={p.slug}
              title={p.title}
              footer={
                <Link href={`/blog/${p.slug}`} className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
                  Read →
                </Link>
              }
            >
              <p>{p.summary ?? '—'}</p>
              <p className="mt-3 text-xs text-[color:var(--muted)]">
                {p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : 'Draft'}
                {p.tags.length ? ` · ${p.tags.join(', ')}` : ''}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
