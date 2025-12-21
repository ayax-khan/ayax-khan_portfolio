import { Suspense } from 'react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      <main className="mx-auto max-w-5xl px-4 py-12">{children}</main>
      <SiteFooter />
    </>
  )
}
