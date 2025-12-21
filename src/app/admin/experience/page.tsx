import { Card } from '@/components/ui/Card'
import { getSetting } from '@/lib/settings'
import { saveExperienceJson } from './actions'

export const metadata = {
  title: 'Admin · Experience',
  description: 'Manage experience entries.',
}

export const dynamic = 'force-dynamic'

export default async function AdminExperiencePage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Experience</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use the admin panel.
          </p>
        </Card>
      </div>
    )
  }

  const json = (await getSetting<string>('profile.experienceJson')) ?? '[]'

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Experience</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          For now, manage experience as JSON (array). Later we can build a full UI editor.
        </p>
      </header>

      <Card title="Experience JSON">
        <form
          action={async (formData) => {
            'use server'
            await saveExperienceJson(String(formData.get('json') ?? '[]'))
          }}
          className="mt-3 space-y-4"
        >
          <textarea
            name="json"
            defaultValue={json}
            rows={14}
            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 font-mono text-sm text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
          />
          <button
            type="submit"
            className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
          >
            Save
          </button>
        </form>
      </Card>

      <Card title="Expected shape">
        <pre className="whitespace-pre-wrap text-sm text-[color:var(--muted)]">{`[
  {
    "company": "Company",
    "role": "Role",
    "start": "2023-01",
    "end": "Present",
    "highlights": ["Shipped X", "Improved Y"]
  }
]`}</pre>
      </Card>
    </div>
  )
}
