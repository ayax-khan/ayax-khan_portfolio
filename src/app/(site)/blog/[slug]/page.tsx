import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { getPostBySlug } from '@/lib/blog'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: slug }

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.summary ?? undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post || !post.published) return notFound()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/blog" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
          ← Back to blog
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--fg)]">{post.title}</h1>
        {post.summary ? <p className="mt-3 text-lg text-[color:var(--muted)]">{post.summary}</p> : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {post.publishedAt ? (
            <Badge variant="muted">{new Date(post.publishedAt).toISOString().slice(0, 10)}</Badge>
          ) : null}
          {post.tags.map((t) => (
            <Badge key={t} variant="muted">
              {t}
            </Badge>
          ))}
        </div>

        <hr className="my-6 border-[color:var(--border)]" />

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  )
}
