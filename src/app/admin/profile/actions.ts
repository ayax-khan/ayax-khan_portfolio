'use server'

import { z } from 'zod'
import { setSetting } from '@/lib/settings'

const ProfileSchema = z.object({
  name: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  bio: z.string().max(5000).optional().default(''),
  location: z.string().max(120).optional().default(''),
  profileImageUrl: z.string().url().or(z.literal('')).optional().default(''),
  resumeUrl: z.string().url().or(z.literal('')).optional().default(''),
})

export async function saveProfile(input: unknown) {
  const parsed = ProfileSchema.parse(input)
  await Promise.all([
    setSetting('profile.name', parsed.name),
    setSetting('profile.title', parsed.title),
    setSetting('profile.bio', parsed.bio),
    setSetting('profile.location', parsed.location),
    setSetting('profile.imageUrl', parsed.profileImageUrl),
    setSetting('profile.resumeUrl', parsed.resumeUrl),
  ])
}
