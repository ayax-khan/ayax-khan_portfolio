import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Prose } from '@/components/ui/Prose'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getPostBySlug } from '@/lib/blog'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: slug, description: `Post: ${slug}` }
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
            <Badge variant="muted">{new Date(post.publishedAt).toLocaleDateString()}</Badge>
          ) : null}
          {post.tags.map((t) => (
            <Badge key={t} variant="muted">
              {t}
            </Badge>
          ))}
        </div>

        <hr />

        {/*
          For now we render content as plain text to avoid XSS.
          If you want rich Markdown rendering, we can add a renderer + sanitization step.
        */}
        <Card>
          <pre className="whitespace-pre-wrap text-sm text-[color:var(--muted)]">{post.content}</pre>
        </Card>
      </Prose>
    </div>
  )
}
