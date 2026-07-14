'use client'

import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

type Post = {
  slug: string
  title: string
  summary: string | null
  publishedAt: Date | null
  tags: string[]
}

type Props = {
  posts: Post[]
}

export function BlogSection({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Writing"
            title="Latest Articles"
            description="Thoughts on engineering, AI, system design, and building production-ready software."
            action={
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                Read all articles
                <span aria-hidden="true">&rarr;</span>
              </Link>
            }
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, idx) => (
            <ScrollReveal key={post.slug} delay={0.1 * idx}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {/* Thumbnail placeholder */}
                  <div className="flex h-44 items-center justify-center bg-[var(--surface-2)]">
                    <span className="text-5xl font-bold text-[var(--muted-2)] opacity-20">
                      {post.title.charAt(0)}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-[var(--muted-2)]">
                      {post.publishedAt ? (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
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

                    <h3 className="mt-3 text-base font-semibold text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                      {post.title}
                    </h3>

                    {post.summary ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                        {post.summary}
                      </p>
                    ) : null}

                    {post.tags.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="muted">
                            {tag}
                          </Badge>
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
