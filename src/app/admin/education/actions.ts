'use server'

import { z } from 'zod'
import { setSetting } from '@/lib/settings'

const EducationSchema = z.string().max(50_000)

export async function saveEducationJson(input: unknown) {
  const jsonText = EducationSchema.parse(input)
  await setSetting('profile.educationJson', jsonText)
}
