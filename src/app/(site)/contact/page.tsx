import { ContactForm } from './ContactForm'
import { getPublicProfile, publicSocialLinks } from '@/lib/publicProfile'
import { Mail, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contact',
  description: 'Send a message or reach out via email/social links.',
}

export default async function ContactPage() {
  const profile = await getPublicProfile()
  const links = publicSocialLinks(profile)

  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="mb-3 inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
            Contact
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
            Have a project in mind? Let&apos;s discuss how I can help bring your ideas to life.
          </p>

          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--fg)]">Email</p>
                <p className="text-xs text-[var(--muted)]">{profile.email || 'hello@ayaz.dev'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--fg)]">Location</p>
                <p className="text-xs text-[var(--muted)]">{profile.location || 'Remote / Worldwide'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--fg)]">Availability</p>
                <p className="text-xs text-[var(--muted)]">Open to freelance & full-time</p>
              </div>
            </div>
          </div>

          {links.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] px-3.5 py-1.5 text-xs font-medium text-[var(--muted)] transition-all hover:border-[var(--fg)] hover:text-[var(--fg)]"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
