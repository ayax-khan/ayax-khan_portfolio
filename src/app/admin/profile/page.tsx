import { Card } from '@/components/ui/Card'
import { getSetting } from '@/lib/settings'
import { saveProfile } from './actions'

export const metadata = {
  title: 'Admin · Profile',
  description: 'Manage name, title, bio, profile image, and resume URL.',
}

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
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

  const [name, title, bio, location, imageUrl, resumeUrl] = await Promise.all([
    getSetting<string>('profile.name'),
    getSetting<string>('profile.title'),
    getSetting<string>('profile.bio'),
    getSetting<string>('profile.location'),
    getSetting<string>('profile.imageUrl'),
    getSetting<string>('profile.resumeUrl'),
  ])

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Update your public portfolio profile details.</p>
      </header>

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
              resumeUrl: String(formData.get('resumeUrl') ?? '').trim(),
            })
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-[color:var(--muted)]">Profile image URL</label>
              <input
                name="profileImageUrl"
                defaultValue={imageUrl ?? ''}
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[color:var(--muted)]">Resume/CV URL (PDF)</label>
              <input
                name="resumeUrl"
                defaultValue={resumeUrl ?? ''}
                placeholder="https://.../resume.pdf"
                className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
              />
            </div>
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
