import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { getPostBySlug } from '@/lib/blog'
import { ArrowLeft, Calendar } from 'lucide-react'

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
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
      >
        <ArrowLeft size={16} />
        Back to blog
      </Link>

      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">{post.title}</h1>
        {post.summary ? (
          <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">{post.summary}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {post.publishedAt ? (
            <span className="flex items-center gap-1.5 text-sm text-[var(--muted-2)]">
              <Calendar size={14} />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          ) : null}
          {post.tags.map((t) => (
            <Badge key={t} variant="muted">{t}</Badge>
          ))}
        </div>
      </header>

      <div className="mt-10 border-t border-[var(--border)] pt-10">
        <div
          className="blog-content prose prose-lg max-w-none"
          style={{
            '--tw-prose-body': 'var(--muted)',
            '--tw-prose-headings': 'var(--fg)',
            '--tw-prose-links': 'var(--accent)',
            '--tw-prose-bold': 'var(--fg)',
            '--tw-prose-quotes': 'var(--muted)',
            '--tw-prose-code': 'var(--fg)',
            '--tw-prose-pre-bg': 'var(--surface-2)',
            '--tw-prose-hr': 'var(--border)',
          } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
}
