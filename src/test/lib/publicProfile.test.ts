import { describe, it, expect } from 'vitest'
import { publicSocialLinks } from '@/lib/publicProfile'

type PublicProfile = {
  name: string
  title: string
  bio: string
  location: string
  email: string
  imageUrl: string
  skills: string[]
  socials: Record<string, string>
}

const baseProfile: PublicProfile = {
  name: 'Test User',
  title: 'Engineer',
  bio: 'Bio',
  location: 'Remote',
  email: 'test@example.com',
  imageUrl: '',
  skills: [],
  socials: {},
}

describe('publicSocialLinks', () => {
  it('should return an empty array when no socials provided', () => {
    expect(publicSocialLinks(baseProfile as any)).toEqual([])
  })

  it('should return links for provided socials', () => {
    const profile = {
      ...baseProfile,
      socials: { GitHub: 'https://github.com/test', LinkedIn: 'https://linkedin.com/in/test' },
    }
    const links = publicSocialLinks(profile as any)
    expect(links).toHaveLength(2)
    expect(links[0].label).toBe('GitHub')
    expect(links[1].label).toBe('LinkedIn')
  })

  it('should filter out empty hrefs', () => {
    const profile = {
      ...baseProfile,
      socials: { GitHub: 'https://github.com/test', X: '' },
    }
    const links = publicSocialLinks(profile as any)
    expect(links).toHaveLength(1)
    expect(links[0].label).toBe('GitHub')
  })

  it('should sort common socials first in order', () => {
    const profile = {
      ...baseProfile,
      socials: { X: 'https://x.com/test', LinkedIn: 'https://linkedin.com/in/test', GitHub: 'https://github.com/test' },
    }
    const links = publicSocialLinks(profile as any)
    expect(links[0].label).toBe('GitHub')
    expect(links[1].label).toBe('LinkedIn')
    expect(links[2].label).toBe('X')
  })
})
