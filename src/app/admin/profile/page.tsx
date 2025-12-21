import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { getSetting } from '@/lib/settings'
import { saveSkills } from '../skills/actions'
import { saveSocialLinks } from '../social/actions'
import type { EducationEntry, ExperienceEntry, ResumeEntry } from './actions'
import {
  addEducationEntry,
  addExperienceEntry,
  deleteEducationEntry,
  deleteExperienceEntry,
  deleteResume,
  getEducationEntries,
  getExperienceEntries,
  saveProfile,
  setActiveResume,
  updateEducationEntry,
  updateExperienceEntry,
  uploadResumes,
} from './actions'
import { ProfileTabNav } from './TabNav'

export const metadata = {
  title: 'Admin · Profile',
  description: 'Manage profile, resumes, skills, experience, education, and social links.',
}

export const dynamic = 'force-dynamic'

type Links = Record<string, string>

type ResumeSettings = { activeId: string | null; items: ResumeEntry[] }

const tabs = [
  { key: 'profile', label: 'Profile' },
  { key: 'resume', label: 'Resume/CV' },
  { key: 'skills', label: 'Skills' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'social', label: 'Social' },
] as const

function normalizeTab(value: unknown) {
  const raw = String(value ?? 'profile').toLowerCase()
  const ok = new Set<string>(tabs.map((t) => t.key))
  return ok.has(raw) ? raw : 'profile'
}

export default async function AdminProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use the admin panel.
          </p>
        </Card>
      </div>
    )
  }

  const sp = await searchParams
  const tab = normalizeTab(sp.tab)

  const [name, title, bio, location, imageUrl, skills, experience, education, socialLinks, resumes] =
    await Promise.all([
      getSetting<string>('profile.name'),
      getSetting<string>('profile.title'),
      getSetting<string>('profile.bio'),
      getSetting<string>('profile.location'),
      getSetting<string>('profile.imageUrl'),
      getSetting<string[]>('profile.skills'),
      getExperienceEntries(),
      getEducationEntries(),
      getSetting<Links>('social.links'),
      getSetting<ResumeSettings>('profile.resumes'),
    ])

  const resumeSettings: ResumeSettings = resumes ?? { activeId: null, items: [] }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Profile Management</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Manage your public profile and portfolio data.</p>
        <ProfileTabNav tabs={tabs as unknown as { key: string; label: string }[]} baseHref="/admin/profile" />
      </header>

      {tab === 'profile' ? (
        <Card title="Profile details">
          <form
            action={async (formData) => {
              'use server'
              await saveProfile({
                name: String(formData.get('name') ?? '').trim(),
                title: String(formData.get('title') ?? '').trim(),
                bio: String(formData.get('bio') ?? ''),
                location: String(formData.get('location') ?? '').trim(),
                profileImageUrl: String(formData.get('profileImageUrl') ?? '').trim(),
              })
              redirect('/admin/profile')
            }}
            className="mt-3 space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Name</label>
                <input
                  name="name"
                  defaultValue={name ?? ''}
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Title / Role</label>
                <input
                  name="title"
                  defaultValue={title ?? ''}
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[color:var(--muted)]">Location</label>
              <input
                name="location"
                defaultValue={location ?? ''}
                className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
              />
            </div>

            <div>
              <label className="block text-sm text-[color:var(--muted)]">Bio</label>
              <textarea
                name="bio"
                defaultValue={bio ?? ''}
                rows={6}
                className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
              />
            </div>

            <div>
              <label className="block text-sm text-[color:var(--muted)]">Profile image URL</label>
              <input
                name="profileImageUrl"
                defaultValue={imageUrl ?? ''}
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
            >
              Save
            </button>
          </form>
        </Card>
      ) : null}

      {tab === 'resume' ? (
        <div className="space-y-6">
          <Card title="Upload resume/CV (PDF)">
            <form
              action={async (formData) => {
                'use server'
                await uploadResumes(formData)
                redirect('/admin/profile?tab=resume')
              }}
              className="mt-3 space-y-4"
            >
              <input
                type="file"
                name="resumes"
                multiple
                accept="application/pdf,.pdf"
                className="block w-full text-sm text-[color:var(--muted)] file:mr-4 file:rounded-xl file:border-0 file:bg-[color:var(--surface-2)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--fg)]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
              >
                Upload
              </button>
            </form>
          </Card>

          <Card title="Uploaded resumes">
            {resumeSettings.items.length === 0 ? (
              <p className="mt-3 text-sm text-[color:var(--muted)]">No resumes uploaded yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {resumeSettings.items.map((r) => {
                  const isActive = resumeSettings.activeId === r.id
                  return (
                    <div
                      key={r.id}
                      className="flex flex-col gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={isActive ? 'text-sm font-semibold' : 'text-sm'}>{r.originalName}</span>
                          {isActive ? (
                            <span className="rounded-full bg-[color:var(--fg)] px-2 py-0.5 text-xs font-semibold text-[color:var(--bg)]">Active</span>
                          ) : null}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-[color:var(--muted)]">
                          <span>{new Date(r.uploadedAt).toLocaleString()}</span>
                          <Link href={r.url} target="_blank" className="underline">
                            View
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {!isActive ? (
                          <form
                            action={async () => {
                              'use server'
                              await setActiveResume(r.id)
                              redirect('/admin/profile?tab=resume')
                            }}
                          >
                            <button
                              type="submit"
                              className="rounded-xl bg-[color:var(--fg)] px-3 py-1.5 text-xs font-semibold text-[color:var(--bg)] hover:opacity-90"
                            >
                              Set active
                            </button>
                          </form>
                        ) : null}

                        <form
                          action={async () => {
                            'use server'
                            await deleteResume(r.id)
                            redirect('/admin/profile?tab=resume')
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-xl border border-[color:var(--border)] bg-transparent px-3 py-1.5 text-xs font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface)]"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      ) : null}

      {tab === 'skills' ? (
        <Card title="Skills">
          <form
            action={async (formData) => {
              'use server'
              const raw = String(formData.get('skills') ?? '')
              const list = raw
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean)
              await saveSkills(list)
              redirect('/admin/profile?tab=skills')
            }}
            className="mt-3 space-y-4"
          >
            <p className="text-sm text-[color:var(--muted)]">Enter one skill per line.</p>
            <textarea
              name="skills"
              defaultValue={(skills ?? []).join('\n')}
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
      ) : null}

      {tab === 'experience' ? (
        <div className="space-y-6">
          <Card title="Add experience">
            <form
              action={async (formData) => {
                'use server'
                await addExperienceEntry(formData)
                redirect('/admin/profile?tab=experience')
              }}
              className="mt-3 grid gap-4 md:grid-cols-2"
            >
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Company</label>
                <input
                  name="company"
                  placeholder="e.g. Systems Ltd"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Role</label>
                <input
                  name="role"
                  placeholder="e.g. Frontend Developer"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Location (optional)</label>
                <input
                  name="location"
                  placeholder="e.g. Lahore / Remote"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[color:var(--muted)]">Start</label>
                  <input
                    name="start"
                    placeholder="2023-01"
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[color:var(--muted)]">End</label>
                  <input
                    name="end"
                    placeholder="Present"
                    className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[color:var(--muted)]">Highlights (one per line)</label>
                <textarea
                  name="highlights"
                  rows={4}
                  placeholder="Shipped X\nImproved Y"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[color:var(--muted)]">Notes (optional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Extra details"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
                >
                  Add
                </button>
              </div>
            </form>
          </Card>

          <Card title="Experience entries">
            {experience.length === 0 ? (
              <p className="mt-3 text-sm text-[color:var(--muted)]">No experience entries yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {experience.map((e: ExperienceEntry) => (
                  <div key={e.id} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--fg)]">{e.role}</p>
                        <p className="text-sm text-[color:var(--muted)]">
                          {e.company}
                          {e.location ? ` · ${e.location}` : ''}
                        </p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                          {e.start ? e.start : ''}{e.end ? ` — ${e.end}` : ''}
                        </p>
                        {e.highlights.length ? (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--muted)]">
                            {e.highlights.map((h, idx) => (
                              <li key={idx}>{h}</li>
                            ))}
                          </ul>
                        ) : null}
                        {e.notes ? <p className="mt-2 text-sm text-[color:var(--muted)]">{e.notes}</p> : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <form
                          action={async () => {
                            'use server'
                            await deleteExperienceEntry(e.id)
                            redirect('/admin/profile?tab=experience')
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-xl border border-[color:var(--border)] bg-transparent px-3 py-1.5 text-xs font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface)]"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>

                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">Edit</summary>
                      <form
                        action={async (formData) => {
                          'use server'
                          await updateExperienceEntry(e.id, formData)
                          redirect('/admin/profile?tab=experience')
                        }}
                        className="mt-3 grid gap-4 md:grid-cols-2"
                      >
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Company</label>
                          <input
                            name="company"
                            defaultValue={e.company}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Role</label>
                          <input
                            name="role"
                            defaultValue={e.role}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Location</label>
                          <input
                            name="location"
                            defaultValue={e.location}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-[color:var(--muted)]">Start</label>
                            <input
                              name="start"
                              defaultValue={e.start}
                              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-[color:var(--muted)]">End</label>
                            <input
                              name="end"
                              defaultValue={e.end}
                              className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-[color:var(--muted)]">Highlights (one per line)</label>
                          <textarea
                            name="highlights"
                            rows={4}
                            defaultValue={e.highlights.join('\n')}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-[color:var(--muted)]">Notes</label>
                          <textarea
                            name="notes"
                            rows={3}
                            defaultValue={e.notes}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <button
                            type="submit"
                            className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
                          >
                            Save changes
                          </button>
                        </div>
                      </form>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ) : null}

      {tab === 'education' ? (
        <div className="space-y-6">
          <Card title="Add education">
            <form
              action={async (formData) => {
                'use server'
                await addEducationEntry(formData)
                redirect('/admin/profile?tab=education')
              }}
              className="mt-3 grid gap-4 md:grid-cols-2"
            >
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Institute</label>
                <input
                  name="institute"
                  placeholder="e.g. Govt. College / University"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Class / Degree</label>
                <input
                  name="program"
                  placeholder="e.g. Matric / Intermediate / BS CS"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Major subject</label>
                <input
                  name="major"
                  placeholder="e.g. Pre-Engineering / Computer Science"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">City (optional)</label>
                <input
                  name="city"
                  placeholder="e.g. Lahore"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Start year</label>
                <input
                  name="startYear"
                  type="number"
                  inputMode="numeric"
                  placeholder="2019"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">End year</label>
                <input
                  name="endYear"
                  type="number"
                  inputMode="numeric"
                  placeholder="2023"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Percentage (0-100)</label>
                <input
                  name="percentage"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="80"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--muted)]">Grade / CGPA (optional)</label>
                <input
                  name="grade"
                  placeholder="e.g. A+ / 3.7/4.0"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[color:var(--muted)]">Notes (optional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Anything else (awards, details, etc)"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
                >
                  Add
                </button>
              </div>
            </form>
          </Card>

          <Card title="Education entries">
            {education.length === 0 ? (
              <p className="mt-3 text-sm text-[color:var(--muted)]">No education entries yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {education.map((e: EducationEntry) => (
                  <div key={e.id} className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--fg)]">{e.program}</p>
                        <p className="text-sm text-[color:var(--muted)]">{e.institute}{e.city ? ` · ${e.city}` : ''}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                          {e.major ? `Major: ${e.major} · ` : ''}
                          {e.startYear ?? ''}{e.endYear ? ` — ${e.endYear}` : ''}
                          {e.percentage != null ? ` · ${e.percentage}%` : ''}
                          {e.grade ? ` · ${e.grade}` : ''}
                        </p>
                        {e.notes ? <p className="mt-2 text-sm text-[color:var(--muted)]">{e.notes}</p> : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <form
                          action={async () => {
                            'use server'
                            // Editing is done inline below; this form is just here for layout consistency.
                          }}
                        />
                        <form
                          action={async () => {
                            'use server'
                            await deleteEducationEntry(e.id)
                            redirect('/admin/profile?tab=education')
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-xl border border-[color:var(--border)] bg-transparent px-3 py-1.5 text-xs font-semibold text-[color:var(--fg)] hover:bg-[color:var(--surface)]"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>

                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">Edit</summary>
                      <form
                        action={async (formData) => {
                          'use server'
                          await updateEducationEntry(e.id, formData)
                          redirect('/admin/profile?tab=education')
                        }}
                        className="mt-3 grid gap-4 md:grid-cols-2"
                      >
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Institute</label>
                          <input
                            name="institute"
                            defaultValue={e.institute}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Class / Degree</label>
                          <input
                            name="program"
                            defaultValue={e.program}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Major subject</label>
                          <input
                            name="major"
                            defaultValue={e.major}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">City</label>
                          <input
                            name="city"
                            defaultValue={e.city}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Start year</label>
                          <input
                            name="startYear"
                            type="number"
                            defaultValue={e.startYear ?? ''}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">End year</label>
                          <input
                            name="endYear"
                            type="number"
                            defaultValue={e.endYear ?? ''}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Percentage</label>
                          <input
                            name="percentage"
                            type="number"
                            step="0.01"
                            defaultValue={e.percentage ?? ''}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[color:var(--muted)]">Grade / CGPA</label>
                          <input
                            name="grade"
                            defaultValue={e.grade}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-[color:var(--muted)]">Notes</label>
                          <textarea
                            name="notes"
                            rows={3}
                            defaultValue={e.notes}
                            className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <button
                            type="submit"
                            className="rounded-xl bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-[color:var(--bg)] hover:opacity-90"
                          >
                            Save changes
                          </button>
                        </div>
                      </form>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ) : null}

      {tab === 'social' ? (
        <Card title="Social links">
          <form
            action={async (formData) => {
              'use server'
              const keys = ['github', 'linkedin', 'x', 'facebook', 'instagram', 'youtube', 'website'] as const
              const payload: Links = {}
              for (const k of keys) payload[k] = String(formData.get(k) ?? '').trim()
              await saveSocialLinks(payload)
              redirect('/admin/profile?tab=social')
            }}
            className="mt-3 space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {([
                { key: 'github', label: 'GitHub' },
                { key: 'linkedin', label: 'LinkedIn' },
                { key: 'x', label: 'X (Twitter)' },
                { key: 'facebook', label: 'Facebook' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'youtube', label: 'YouTube' },
                { key: 'website', label: 'Website' },
              ] as const).map((f) => (
                <div key={f.key}>
                  <label className="block text-sm text-[color:var(--muted)]">{f.label}</label>
                  <input
                    name={f.key}
                    defaultValue={(socialLinks ?? {})[f.key] ?? ''}
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
      ) : null}
    </div>
  )
}
