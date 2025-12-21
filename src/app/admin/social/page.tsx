import { Card } from '@/components/ui/Card'
import { getSetting } from '@/lib/settings'
import { saveSocialLinks } from './actions'

export const metadata = {
  title: 'Admin · Social Links',
  description: 'Manage social URLs used across your portfolio.',
}

export const dynamic = 'force-dynamic'

const fields = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'x', label: 'X (Twitter)' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'website', label: 'Website' },
] as const

type Links = Record<string, string>

export default async function AdminSocialPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Social Links</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use the admin panel.
          </p>
        </Card>
      </div>
    )
  }

  const current = (await getSetting<Links>('social.links')) ?? {}

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Social Links</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Add the profile links you want to show in footer and contact page.</p>
      </header>

      <Card title="Links">
        <form
          action={async (formData) => {
            'use server'
            const payload: Links = {}
            for (const f of fields) {
              payload[f.key] = String(formData.get(f.key) ?? '').trim()
            }
            await saveSocialLinks(payload)
          }}
          className="mt-3 space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm text-[color:var(--muted)]">{f.label}</label>
                <input
                  name={f.key}
                  defaultValue={current[f.key] ?? ''}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
          >
            Save
          </button>
        </form>
      </Card>
    </div>
  )
}
