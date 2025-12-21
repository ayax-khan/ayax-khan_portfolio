import { AdminSidebar } from './AdminSidebar'

export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </main>
    </div>
  )
}
