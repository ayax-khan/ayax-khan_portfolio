import Link from 'next/link'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Admin',
  description: 'Admin controls for projects and blog posts.',
}

export const dynamic = 'force-dynamic'

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Basic controls for featured projects, visibility, and blog publishing.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Projects">
          <p>Manage project overrides (visible/featured, demo URL, custom title/summary).</p>
          <div className="mt-4">
            <Link href="/admin/projects" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              Open →
            </Link>
          </div>
        </Card>
        <Card title="Blog">
          <p>Create/edit posts and publish/unpublish.</p>
          <div className="mt-4">
            <Link href="/admin/blog" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              Open →
            </Link>
          </div>
        </Card>
        <Card title="Messages">
          <p>View and manage contact form submissions.</p>
          <div className="mt-4">
            <Link href="/admin/messages" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              Open →
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Settings">
          <p>Optional editable settings stored in the database.</p>
          <div className="mt-4">
            <Link href="/admin/settings" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
              Open →
            </Link>
          </div>
        </Card>

        <Card title="Security">
        <p className="text-sm">
          These routes are protected by HTTP Basic Auth via <span className="font-mono">ADMIN_USER</span> /{' '}
          <span className="font-mono">ADMIN_PASSWORD</span>. Configure these in <span className="font-mono">.env</span>. 
        </p>
      </Card>
      </div>
    </div>
  )
}
