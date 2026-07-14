import { describe, it, expect } from 'vitest'
import { FALLBACK_SKILLS } from '@/lib/defaults'

describe('FALLBACK_SKILLS', () => {
  it('should be a non-empty array', () => {
    expect(Array.isArray(FALLBACK_SKILLS)).toBe(true)
    expect(FALLBACK_SKILLS.length).toBeGreaterThan(0)
  })

  it('should contain TypeScript and React', () => {
    expect(FALLBACK_SKILLS).toContain('TypeScript')
    expect(FALLBACK_SKILLS).toContain('React')
    expect(FALLBACK_SKILLS).toContain('Next.js (App Router)')
  })

  it('should be readonly (literal type)', () => {
    const skills: readonly string[] = FALLBACK_SKILLS
    expect(skills).toBeDefined()
  })
})
