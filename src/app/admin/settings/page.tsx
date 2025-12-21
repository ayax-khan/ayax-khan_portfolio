import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/Card'
import { upsertSetting } from './actions'

export const metadata = {
  title: 'Admin · Settings',
  description: 'Site/profile settings stored in the database.',
}

export const dynamic = 'force-dynamic'

const editableSettings = [
  { key: 'profile.name', label: 'Profile name' },
  { key: 'profile.role', label: 'Role' },
  { key: 'profile.headline', label: 'Headline' },
  { key: 'profile.location', label: 'Location' },
  { key: 'profile.email', label: 'Email' },
  { key: 'social.github', label: 'GitHub URL' },
  { key: 'social.linkedin', label: 'LinkedIn URL' },
  { key: 'social.x', label: 'X URL' },
] as const

export default async function AdminSettingsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Admin · Settings</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use the admin panel.
          </p>
        </Card>
      </div>
    )
  }

  const settings = await prisma.setting.findMany()
  const map = new Map(settings.map((s) => [s.key, (s.value as { value?: unknown } | null)?.value as string | undefined]))

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          Optional: store editable settings in Postgres. (Currently, the public site still uses `.env` + `src/lib/site.ts`.)
        </p>
      </header>

      <Card title="Editable settings">
        <form
          action={async (formData) => {
            'use server'
            for (const s of editableSettings) {
              const value = String(formData.get(s.key) ?? '')
              await upsertSetting({ key: s.key, value })
            }
          }}
          className="mt-3 space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {editableSettings.map((s) => (
              <div key={s.key}>
                <label className="block text-sm text-[color:var(--muted)]">{s.label}</label>
                <input
                  name={s.key}
                  defaultValue={map.get(s.key) ?? ''}
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
          >
            Save settings
          </button>
        </form>
      </Card>

      <Card title="Note">
        <p>
          If you want these settings to power the public site, I can wire `src/lib/site.ts` to read from `Setting` with safe
          caching.
        </p>
      </Card>
    </div>
  )
}
