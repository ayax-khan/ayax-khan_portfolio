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
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <header className="max-w-3xl">
        <p className="mb-3 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
          Blog
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
          Articles
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
          Thoughts on engineering, AI, system design, and building production-ready software.
        </p>
      </header>

      {tags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Badge key={t} variant="muted">{t}</Badge>
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <Card title="No posts yet" className="mt-10">
          <p>Create posts in the database. Set published=true to show here.</p>
        </Card>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
              <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-36 items-center justify-center bg-[var(--surface-2)]">
                  <span className="text-4xl font-bold text-[var(--muted-2)] opacity-20">
                    {p.title.charAt(0)}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--muted-2)]">
                    {p.publishedAt ? (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(p.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      5 min read
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--accent)]">
                    {p.title}
                  </h3>

                  {p.summary ? (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
                      {p.summary}
                    </p>
                  ) : null}

                  {p.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="muted">{t}</Badge>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                    Read article
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
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
