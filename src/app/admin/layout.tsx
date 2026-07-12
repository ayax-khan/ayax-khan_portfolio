import { Suspense } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { ToastProvider } from '@/components/ui/Toast'
import { SavedToast } from '@/components/ui/SavedToast'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <SavedToast />
      </Suspense>
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
        </main>
      </div>
    </ToastProvider>
  )
}
