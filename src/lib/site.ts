import { env } from '@/lib/env'

export type SocialLink = { label: string; href: string }

/**
 * Central site/profile configuration.
 *
 * Keep this in code for simplicity; you can later move it to DB `Setting` if you want a CMS-like flow.
 */
export const site = {
  name: env.PROFILE_NAME ?? 'Your Name',
  role: env.PROFILE_ROLE ?? 'Software Engineer',
  headline:
    env.PROFILE_HEADLINE ??
    'I build secure, high-performance web systems with TypeScript, Next.js, and Postgres.',
  location: env.PROFILE_LOCATION ?? 'Remote / Your City',
  email: env.PROFILE_EMAIL ?? 'you@example.com',
  siteUrl: env.SITE_URL,
  description:
    env.SITE_DESCRIPTION ??
    'Secure, performance-focused developer portfolio with projects, writing, and contact.',
  socials: {
    github: env.SOCIAL_GITHUB,
    linkedin: env.SOCIAL_LINKEDIN,
    x: env.SOCIAL_X,
  } as const,
  nav: [
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
}

export function socialLinks(): SocialLink[] {
  const out: SocialLink[] = []
  if (site.socials.github) out.push({ label: 'GitHub', href: site.socials.github })
  if (site.socials.linkedin) out.push({ label: 'LinkedIn', href: site.socials.linkedin })
  if (site.socials.x) out.push({ label: 'X', href: site.socials.x })
  return out
}
