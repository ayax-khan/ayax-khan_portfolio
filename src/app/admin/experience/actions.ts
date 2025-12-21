'use server'

import { z } from 'zod'
import { setSetting } from '@/lib/settings'

const ExperienceSchema = z.string().max(50_000)

export async function saveExperienceJson(input: unknown) {
  const jsonText = ExperienceSchema.parse(input)
  // Store raw JSON text for now; we will render later.
  await setSetting('profile.experienceJson', jsonText)
}
