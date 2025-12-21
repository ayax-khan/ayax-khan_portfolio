import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Prose } from '@/components/ui/Prose'
import { Badge } from '@/components/ui/Badge'
import { Markdown } from '@/components/ui/Markdown'
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

      <Prose>
        <h1>{post.title}</h1>
        {post.summary ? <p className="lead">{post.summary}</p> : null}

        <div className="not-prose mt-4 flex flex-wrap items-center gap-2">
          {post.publishedAt ? (
            <Badge variant="muted">{new Date(post.publishedAt).toISOString().slice(0, 10)}</Badge>
          ) : null}
          {post.tags.map((t) => (
            <Badge key={t} variant="muted">
              {t}
            </Badge>
          ))}
        </div>

        <hr />

        <Markdown content={post.content} />
      </Prose>
    </div>
  )
}
