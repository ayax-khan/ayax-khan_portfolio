'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'

function parseList(raw: string | undefined) {
  return (raw ?? '')
    .split(/[\n,]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.replace(/\s+/g, ' '))
    .slice(0, 30)
}

const BlogPostInput = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/i, 'Slug can contain letters, numbers, and hyphens only.'),
  title: z.string().min(2).max(200),
  summary: z.string().max(500).nullable().optional(),
  content: z.string().min(1),
  metaTitle: z.string().max(200).nullable().optional(),
  metaDescription: z.string().max(300).nullable().optional(),
  tags: z.string().optional(),
  categories: z.string().optional(),
  published: z.boolean().optional(),
})

export async function upsertBlogPost(input: unknown) {
  const parsed = BlogPostInput.safeParse(input)
  if (!parsed.success) throw new Error('Invalid input')

  const tags = parseList(parsed.data.tags)
  const categories = parseList(parsed.data.categories)
  const published = parsed.data.published ?? false

  if (parsed.data.id) {
    const existing = await prisma.blogPost.findUnique({ where: { id: parsed.data.id } })
    const publishedAt = published
      ? (existing?.publishedAt ?? (existing?.published ? existing.publishedAt : new Date()))
      : null

    await prisma.blogPost.update({
      where: { id: parsed.data.id },
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        summary: parsed.data.summary ?? null,
        content: parsed.data.content,
        metaTitle: parsed.data.metaTitle ?? null,
        metaDescription: parsed.data.metaDescription ?? null,
        tags,
        categories,
        published,
        publishedAt,
      },
    })
    return
  }

  await prisma.blogPost.create({
    data: {
      slug: parsed.data.slug,
      title: parsed.data.title,
      summary: parsed.data.summary ?? null,
      content: parsed.data.content,
      metaTitle: parsed.data.metaTitle ?? null,
      metaDescription: parsed.data.metaDescription ?? null,
      tags,
      categories,
      published,
      publishedAt: published ? new Date() : null,
    },
  })
}

export async function upsertBlogPostFromForm(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()
  await upsertBlogPost({
    id: id || undefined,
    slug: String(formData.get('slug') ?? '').trim(),
    title: String(formData.get('title') ?? '').trim(),
    summary: String(formData.get('summary') ?? '').trim() || null,
    content: String(formData.get('content') ?? ''),
    metaTitle: String(formData.get('metaTitle') ?? '').trim() || null,
    metaDescription: String(formData.get('metaDescription') ?? '').trim() || null,
    tags: String(formData.get('tags') ?? ''),
    categories: String(formData.get('categories') ?? ''),
    published: formData.get('published') === 'on',
  })
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

export async function deleteBlogPostFromForm(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()
  if (!id) return
  await deleteBlogPost(id)
}
