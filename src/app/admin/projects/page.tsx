import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/Card'
import { upsertProjectOverride, deleteProjectOverride } from './actions'
import { getProjectsFromGithub } from '@/lib/github/repos'

export const metadata = {
  title: 'Admin · Projects',
  description: 'Manage project overrides (featured/visible/demo URL/custom text).',
}

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Admin · Projects</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use the admin panel.
          </p>
        </Card>
      </div>
    )
  }

  const [projects, overrides] = await Promise.all([
    getProjectsFromGithub(),
    prisma.projectOverride.findMany({ orderBy: [{ updatedAt: 'desc' }] }),
  ])

  const overrideMap = new Map(overrides.map((o) => [o.repoFullName, o]))

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Admin · Projects</h1>
          <p className="mt-2 max-w-2xl text-[color:var(--muted)]">
            Toggle visibility/featured and set custom title/summary/demo URL. Data is stored in Postgres (ProjectOverride).
          </p>
        </div>
      </header>

      {projects.length === 0 ? (
        <Card title="No GitHub projects loaded">
          <p>
            Configure <span className="font-mono">GITHUB_USERNAME</span> and <span className="font-mono">GITHUB_TOKEN</span>.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => {
            const o = overrideMap.get(p.fullName)
            return (
              <Card key={p.fullName} title={p.fullName}>
                <form
                  action={async (formData) => {
                    'use server'
                    const repoFullName = String(formData.get('repoFullName'))
                    const visible = formData.get('visible') === 'on'
                    const featured = formData.get('featured') === 'on'
                    const demoUrlRaw = String(formData.get('demoUrl') ?? '').trim()
                    const customTitleRaw = String(formData.get('customTitle') ?? '').trim()
                    const customSummaryRaw = String(formData.get('customSummary') ?? '').trim()
                    const sortOrderRaw = String(formData.get('sortOrder') ?? '').trim()

                    await upsertProjectOverride({
                      repoFullName,
                      visible,
                      featured,
                      demoUrl: demoUrlRaw ? demoUrlRaw : null,
                      customTitle: customTitleRaw ? customTitleRaw : null,
                      customSummary: customSummaryRaw ? customSummaryRaw : null,
                      sortOrder: sortOrderRaw ? Number(sortOrderRaw) : null,
                    })
                  }}
                  className="mt-3 space-y-3"
                >
                  <input type="hidden" name="repoFullName" value={p.fullName} />

                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                      <input type="checkbox" name="visible" defaultChecked={o?.visible ?? true} /> Visible
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                      <input type="checkbox" name="featured" defaultChecked={o?.featured ?? false} /> Featured
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-sm text-[color:var(--muted)]">Custom title</label>
                      <input
                        name="customTitle"
                        defaultValue={o?.customTitle ?? ''}
                        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[color:var(--muted)]">Demo URL</label>
                      <input
                        name="demoUrl"
                        defaultValue={o?.demoUrl ?? ''}
                        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[color:var(--muted)]">Custom summary</label>
                    <textarea
                      name="customSummary"
                      defaultValue={o?.customSummary ?? ''}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-sm text-[color:var(--muted)]">Sort order (optional)</label>
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={o?.sortOrder ?? ''}
                        className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                      />
                    </div>
                    <div className="flex items-end justify-end gap-2">
                      <button
                        type="submit"
                        className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
                      >
                        Save
                      </button>

                      {o ? (
                        <button
                          formAction={async () => {
                            'use server'
                            await deleteProjectOverride(p.fullName)
                          }}
                          className="rounded-xl bg-[color:var(--surface-2)] px-4 py-2 text-sm font-semibold text-[color:var(--fg)] ring-1 ring-[color:var(--border)] hover:bg-[color:var(--surface)]"
                        >
                          Reset
                        </button>
                      ) : null}
                    </div>
                  </div>
                </form>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
