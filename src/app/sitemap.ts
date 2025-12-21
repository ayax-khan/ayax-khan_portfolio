import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'
import { listPublishedPosts } from '@/lib/blog'
import { getProjectsFromGithub } from '@/lib/github/repos'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.SITE_URL

  // These functions already return [] when required runtime env is missing.
  const [posts, projects] = await Promise.all([listPublishedPosts(), getProjectsFromGithub()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/projects`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ?? new Date(),
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(p.updatedAt),
  }))

  return [...staticRoutes, ...blogRoutes, ...projectRoutes]
}
