'use server'

import { z } from 'zod'
import { setSetting } from '@/lib/settings'

const SkillsSchema = z.array(z.string().min(1).max(60)).max(200)

export async function saveSkills(input: unknown) {
  const skills = SkillsSchema.parse(input)
  await setSetting('profile.skills', skills)
}
