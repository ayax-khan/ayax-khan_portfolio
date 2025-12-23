import 'server-only'

import { getSetting } from '@/lib/settings'
import { site } from '@/lib/site'

export type PublicProfile = {
  name: string
  title: string
  bio: string
  location: string
  email: string
  imageUrl: string
  skills: string[]
  socials: Record<string, string>
}

export type SocialLink = { label: string; href: string }

/**
 * Public profile settings used on the marketing site.
 *
 * DB-first (admin panel writes to Setting), with env/code fallback (site.ts).
 */
export async function getPublicProfile(): Promise<PublicProfile> {
  const [name, title, bio, location, email, imageUrl, skills, socials] = await Promise.all([
    getSetting<string>('profile.name'),
    getSetting<string>('profile.title'),
    getSetting<string>('profile.bio'),
    getSetting<string>('profile.location'),
    getSetting<string>('profile.email'),
    getSetting<string>('profile.imageUrl'),
    getSetting<string[]>('profile.skills'),
    getSetting<Record<string, string>>('social.links'),
  ])

  return {
    name: (name ?? site.name).trim(),
    title: (title ?? site.role).trim(),
    // Map homepage "headline" to DB "bio" (short bio/headline). Fallback to env headline.
    bio: (bio ?? site.headline) ?? '',
    location: (location ?? site.location) ?? '',
    email: (email ?? site.email) ?? '',
    imageUrl: (imageUrl ?? '').trim(),
    skills: Array.isArray(skills) && skills.length ? skills : [],
    // Prefer admin-managed links if present; otherwise fall back to env-driven site.socials.
    socials:
      socials && Object.keys(socials).length
        ? socials
        : {
            ...(site.socials.github ? { GitHub: site.socials.github } : {}),
            ...(site.socials.linkedin ? { LinkedIn: site.socials.linkedin } : {}),
            ...(site.socials.x ? { X: site.socials.x } : {}),
          },
  }
}

export function publicSocialLinks(profile: PublicProfile): SocialLink[] {
  const out: SocialLink[] = []
  for (const [label, href] of Object.entries(profile.socials ?? {})) {
    if (typeof href === 'string' && href.trim().length > 0) out.push({ label, href })
  }
  // stable sort: common socials first
  const order = ['GitHub', 'LinkedIn', 'X']
  out.sort((a, b) => {
    const ai = order.indexOf(a.label)
    const bi = order.indexOf(b.label)
    if (ai === -1 && bi === -1) return a.label.localeCompare(b.label)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
  return out
}
