'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'

const BlogPostInput = z.object({
  id: z.string().optional(),
  slug: z.string().min(2).max(200),
  title: z.string().min(2).max(200),
  summary: z.string().max(500).nullable().optional(),
  content: z.string().min(1),
  tags: z.string().optional(),
  published: z.boolean().optional(),
})

export async function upsertBlogPost(input: unknown) {
  const parsed = BlogPostInput.safeParse(input)
  if (!parsed.success) throw new Error('Invalid input')

  const tags = (parsed.data.tags ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const published = parsed.data.published ?? false

  const data = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    summary: parsed.data.summary ?? null,
    content: parsed.data.content,
    tags,
    published,
    publishedAt: published ? new Date() : null,
  }

  if (parsed.data.id) {
    await prisma.blogPost.update({ where: { id: parsed.data.id }, data })
  } else {
    await prisma.blogPost.create({ data })
  }
}

export async function setBlogPublished(args: { id: string; published: boolean }) {
  await prisma.blogPost.update({
    where: { id: args.id },
    data: {
      published: args.published,
      publishedAt: args.published ? new Date() : null,
    },
  })
}

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({ where: { id } })
}
