import 'server-only'

import { prisma } from '@/lib/db'

export async function listPublishedPosts() {
  if (!process.env.DATABASE_URL) return []

  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      publishedAt: true,
      tags: true,
    },
  })
}

export async function getPostBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return null

  return prisma.blogPost.findUnique({
    where: { slug },
  })
}
