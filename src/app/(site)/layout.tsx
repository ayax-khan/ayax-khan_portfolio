import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
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

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">{children}</main>
      <SiteFooter />
    </>
  )
}
