'use server'

import { z } from 'zod'
import { setSetting } from '@/lib/settings'

const SocialSchema = z.record(z.string().min(1), z.string().url().or(z.literal('')))

export async function saveSocialLinks(input: unknown) {
  const links = SocialSchema.parse(input)
  await setSetting('social.links', links)
}
