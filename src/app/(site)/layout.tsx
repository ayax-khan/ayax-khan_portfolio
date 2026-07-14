import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FloatingNavbar } from '@/components/sections/FloatingNavbar'
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker'
import { getPublicProfile } from '@/lib/publicProfile'
import { shortDisplayName } from '@/lib/nameFormat'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getPublicProfile()
  const shortName = shortDisplayName(profile.name) || profile.name
  return {
    title: shortName,
    description: profile.bio,
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getPublicProfile()
  const shortName = shortDisplayName(profile.name) || profile.name

  return (
    <>
      <FloatingNavbar name={shortName} />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      <main>{children}</main>
    </>
  )
}
