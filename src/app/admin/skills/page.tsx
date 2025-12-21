import { Card } from '@/components/ui/Card'
import { getSetting } from '@/lib/settings'
import { saveSkills } from './actions'

export const metadata = {
  title: 'Admin · Skills',
  description: 'Manage skills list.',
}

export const dynamic = 'force-dynamic'

export default async function AdminSkillsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use the admin panel.
          </p>
        </Card>
      </div>
    )
  }

  const skills = (await getSetting<string[]>('profile.skills')) ?? []

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Enter one skill per line. This will be shown on your About page.</p>
      </header>

      <Card title="Skills list">
        <form
          action={async (formData) => {
            'use server'
            const raw = String(formData.get('skills') ?? '')
            const list = raw
              .split(/\r?\n/)
              .map((s) => s.trim())
              .filter(Boolean)
            await saveSkills(list)
          }}
          className="mt-3 space-y-4"
        >
          <textarea
            name="skills"
            defaultValue={skills.join('\n')}
            rows={10}
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
    </div>
  )
}
