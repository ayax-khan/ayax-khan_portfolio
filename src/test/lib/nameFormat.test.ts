import { describe, it, expect } from 'vitest'
import { shortDisplayName } from '@/lib/nameFormat'

describe('shortDisplayName', () => {
  it('should return initial and last name for a full name', () => {
    expect(shortDisplayName('Muhammad Ayaz')).toBe('M. Ayaz')
    expect(shortDisplayName('John Doe')).toBe('J. Doe')
  })

  it('should return the same name if it has no spaces', () => {
    expect(shortDisplayName('Ayaz')).toBe('Ayaz')
    expect(shortDisplayName('')).toBe('')
    expect(shortDisplayName('A')).toBe('A')
  })

  it('should handle three-part names', () => {
    expect(shortDisplayName('Muhammad Ali Khan')).toBe('M. Khan')
  })

  it('should fallback to second part when last is short and parts >= 3', () => {
    expect(shortDisplayName('John A B C')).toBe('J. A')
  })
})
