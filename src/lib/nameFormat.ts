export function shortDisplayName(fullName: string): string {
  const cleaned = (fullName ?? '').trim().replace(/\s+/g, ' ')
  if (!cleaned) return ''

  const parts = cleaned.split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0]!

  const first = parts[0]!
  const last = parts[parts.length - 1]!
  const initial = first.charAt(0).toUpperCase()

  // If the last part is very short (e.g., "A"), fall back to first + second.
  if (last.length <= 2 && parts.length >= 3) {
    const betterLast = parts[1]!
    return `${initial}. ${betterLast}`
  }

  return `${initial}. ${last}`
}
