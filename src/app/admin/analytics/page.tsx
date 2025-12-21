import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Admin · Analytics',
  description: 'Traffic and engagement metrics.',
}

export const dynamic = 'force-dynamic'

function parseDays(v: unknown) {
  const n = Number(String(v ?? '30'))
  if (!Number.isFinite(n)) return 30
  return Math.min(365, Math.max(1, Math.trunc(n)))
}

function parseDateInput(v: unknown): Date | null {
  const raw = String(v ?? '').trim()
  if (!raw) return null
  // Expect yyyy-mm-dd
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
  const d = new Date(`${raw}T00:00:00.000Z`)
  return Number.isNaN(d.getTime()) ? null : d
}

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10)
}

function addDaysUTC(d: Date, days: number) {
  const copy = new Date(d)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use analytics.
          </p>
        </Card>
      </div>
    )
  }

  const sp = await searchParams

  const presetDays = parseDays(sp.days)
  const fromParam = parseDateInput(sp.from)
  const toParam = parseDateInput(sp.to)

  // Range selection:
  // - If from/to provided, use them.
  // - Else use preset days (default 30).
  const from = fromParam ?? addDaysUTC(new Date(), -presetDays)
  const toStart = toParam ?? new Date()
  // inclusive end-of-day
  const to = addDaysUTC(toStart, 1)

  const [pageViews, events, contactCount] = await Promise.all([
    prisma.analyticsEvent.count({ where: { type: 'PAGE_VIEW', createdAt: { gte: from, lt: to } } }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: from, lt: to } },
      select: { type: true, path: true, meta: true, createdAt: true },
    }),
    prisma.contactMessage.count({ where: { createdAt: { gte: from, lt: to } } }),
  ])

  const visitorSet = new Set<string>()
  for (const e of events) {
    if (e.type !== 'PAGE_VIEW') continue
    const meta = (e.meta ?? {}) as Record<string, unknown>
    const vid = typeof meta.visitorId === 'string' ? meta.visitorId : null
    if (vid) visitorSet.add(vid)
  }
  const totalVisitors = visitorSet.size

  // Page views per project (aggregate by slug from path)
  const projectViews = new Map<string, number>()
  for (const e of events) {
    if (e.type !== 'PAGE_VIEW') continue
    if (!e.path.startsWith('/projects/')) continue
    const slug = e.path.split('?')[0]?.split('/')[2]
    if (!slug) continue
    projectViews.set(slug, (projectViews.get(slug) ?? 0) + 1)
  }

  const mostViewedProjects = Array.from(projectViews.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // GitHub repo clicks
  let githubClicks = 0
  for (const e of events) {
    if (e.type !== 'CLICK') continue
    const meta = (e.meta ?? {}) as Record<string, unknown>
    if (meta.kind === 'github_repo') githubClicks++
  }

  // Daily page views
  const dayViews = new Map<string, number>()
  for (const e of events) {
    if (e.type !== 'PAGE_VIEW') continue
    const day = isoDay(new Date(e.createdAt))
    dayViews.set(day, (dayViews.get(day) ?? 0) + 1)
  }

  const daysList: string[] = []
  for (let d = new Date(from); d < to; d = addDaysUTC(d, 1)) {
    daysList.push(isoDay(d))
  }

  const dailySeries = daysList.map((day) => ({ day, count: dayViews.get(day) ?? 0 }))
  const maxDaily = Math.max(1, ...dailySeries.map((x) => x.count))

  const maxProject = Math.max(1, ...mostViewedProjects.map(([, c]) => c))

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="max-w-2xl text-[color:var(--muted)]">
            Range: {isoDay(from)} → {isoDay(addDaysUTC(to, -1))}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <a
            href="/admin/analytics?days=7"
            className={
              'rounded-xl border px-3 py-2 text-sm font-semibold ' +
              (presetDays === 7 && !fromParam && !toParam
                ? 'border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--fg)]'
                : 'border-[color:var(--border)] bg-transparent text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]')
            }
          >
            7d
          </a>
          <a
            href="/admin/analytics?days=30"
            className={
              'rounded-xl border px-3 py-2 text-sm font-semibold ' +
              (presetDays === 30 && !fromParam && !toParam
                ? 'border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--fg)]'
                : 'border-[color:var(--border)] bg-transparent text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]')
            }
          >
            30d
          </a>
          <a
            href="/admin/analytics?days=90"
            className={
              'rounded-xl border px-3 py-2 text-sm font-semibold ' +
              (presetDays === 90 && !fromParam && !toParam
                ? 'border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--fg)]'
                : 'border-[color:var(--border)] bg-transparent text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]')
            }
          >
            90d
          </a>

          <form action="/admin/analytics" method="get" className="ml-2 flex flex-wrap items-end gap-2">
            <input type="hidden" name="days" value={presetDays} />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">From</label>
              <input
                type="date"
                name="from"
                defaultValue={fromParam ? isoDay(fromParam) : ''}
                className="mt-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--fg)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">To</label>
              <input
                type="date"
                name="to"
                defaultValue={toParam ? isoDay(toParam) : ''}
                className="mt-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm text-[color:var(--fg)]"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
            >
              Apply
            </button>
            <a
              href={`/admin/analytics?days=${presetDays}`}
              className="rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-[color:var(--muted)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--fg)]"
            >
              Reset
            </a>
          </form>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Total visitors">
          <p className="text-2xl font-semibold">{totalVisitors}</p>
        </Card>
        <Card title="Page views">
          <p className="text-2xl font-semibold">{pageViews}</p>
        </Card>
        <Card title="GitHub repo clicks">
          <p className="text-2xl font-semibold">{githubClicks}</p>
        </Card>
        <Card title="Contact submissions">
          <p className="text-2xl font-semibold">{contactCount}</p>
        </Card>
      </div>

      <Card title="Daily page views">
        <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(8px,1fr))] items-end gap-1">
          {dailySeries.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1">
              <div
                title={`${d.day}: ${d.count}`}
                className="w-full rounded-md bg-[color:var(--surface-2)]"
                style={{ height: `${Math.max(2, Math.round((d.count / maxDaily) * 80))}px` }}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-[color:var(--muted)]">Hover bars to see counts.</p>
      </Card>

      <Card title="Most viewed projects">
        {mostViewedProjects.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--muted)]">No project views recorded yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {mostViewedProjects.map(([slug, count]) => (
              <div key={slug} className="grid grid-cols-[120px_1fr_60px] items-center gap-3">
                <div className="truncate font-mono text-xs text-[color:var(--fg)]">{slug}</div>
                <div className="h-2 w-full rounded-full bg-[color:var(--surface-2)]">
                  <div
                    className="h-2 rounded-full bg-[color:var(--fg)]"
                    style={{ width: `${Math.round((count / maxProject) * 100)}%` }}
                  />
                </div>
                <div className="text-right text-xs text-[color:var(--muted)]">{count}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Page views per project">
        {projectViews.size === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--muted)]">No project views recorded yet.</p>
        ) : (
          <p className="mt-2 text-sm text-[color:var(--muted)]">Tracking {projectViews.size} projects in the selected window.</p>
        )}
      </Card>
    </div>
  )
}
