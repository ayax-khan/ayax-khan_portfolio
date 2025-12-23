import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/Card'
import { getProjectsFromGithub } from '@/lib/github/repos'
import { ProjectsClient } from './ProjectsClient'
import {
  resetProjectOverrideFromForm,
  saveProjectOrderFromForm,
  syncGithubNow,
  updateProjectOverrideFromForm,
} from './actions'

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

  const overrides = await (async () => {
    try {
      return await prisma.projectOverride.findMany()
    } catch {
      return []
    }
  })()
  const projects = await getProjectsFromGithub({ includeHidden: true, includeForks: true, includeArchived: true, overrides })

  const overrideMap = new Map(overrides.map((o) => [o.repoFullName, o]))

  const rows = projects.map((p) => {
    const o = overrideMap.get(p.fullName)
    const repoName = p.fullName.split('/')[1] ?? p.slug
    return {
      fullName: p.fullName,
      slug: p.slug,
      repoName,
      repoUrl: p.repoUrl,
      language: p.language,
      stars: p.stars,
      updatedAt: p.updatedAt,
      visible: o?.visible ?? true,
      featured: o?.featured ?? false,
      demoUrl: o?.demoUrl ?? p.demoUrl,
      thumbnailUrl: (o as any)?.thumbnailUrl ?? p.thumbnailUrl,
      customTitle: o?.customTitle ?? null,
      customSummary: o?.customSummary ?? (p.description ?? null),
      tags: o?.tags ?? [],
      sortOrder: o?.sortOrder ?? null,
      isFork: p.isFork,
      archived: p.archived,
    }
  })

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

      {rows.length === 0 ? (
        <Card title="No GitHub projects loaded">
          <p>
            Configure <span className="font-mono">GITHUB_USERNAME</span> and <span className="font-mono">GITHUB_TOKEN</span>.
          </p>
        </Card>
      ) : (
        <ProjectsClient
          projects={rows}
          onUpdate={updateProjectOverrideFromForm}
          onReset={resetProjectOverrideFromForm}
          onSaveOrder={saveProjectOrderFromForm}
          onSyncNow={syncGithubNow}
        />
      )}
    </div>
  )
}
