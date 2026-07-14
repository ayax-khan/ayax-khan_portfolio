import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { listPublishedPosts } from '@/lib/blog'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog',
  description: 'Writing about engineering, AI, performance, security, and delivery.',
}

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts()
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort().slice(0, 12)

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-24">
      <header className="max-w-3xl">
        <p className="mb-4 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
          Blog
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)] sm:text-5xl">
          Articles
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          Thoughts on engineering, AI, system design, and building production-ready software.
        </p>
      </header>

      {tags.length > 0 ? (
        <div className="mt-10 flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge key={t} variant="muted">{t}</Badge>
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <Card title="No posts yet" className="mt-12">
          <p>Create posts in the database. Set published=true to show here.</p>
        </Card>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
              <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-44 items-center justify-center bg-[var(--surface-2)]">
                  <span className="text-5xl font-bold text-[var(--muted-2)] opacity-20">
                    {p.title.charAt(0)}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-[var(--muted-2)]">
                    {p.publishedAt ? (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(p.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      5 min read
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-[var(--fg)] group-hover:text-[var(--accent)]">
                    {p.title}
                  </h3>

                  {p.summary ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                      {p.summary}
                    </p>
                  ) : null}

                  {p.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="muted">{t}</Badge>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                    Read article
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
