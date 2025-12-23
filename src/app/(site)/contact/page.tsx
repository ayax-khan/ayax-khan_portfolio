import { ContactForm } from './ContactForm'
import { Card } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui/LinkButton'
import { getPublicProfile, publicSocialLinks } from '@/lib/publicProfile'

export const metadata = {
  title: 'Contact',
  description: 'Send a message or reach out via email/social links.',
}

export default async function ContactPage() {
  const profile = await getPublicProfile()
  const links = publicSocialLinks(profile)

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Contact</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          Use the form below. Submissions are validated server-side and stored in Postgres.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Send a message">
          <ContactForm />
        </Card>

        <Card title="Other ways to reach me">
          <p className="text-sm">
            If you prefer, you can also reach me via email or social profiles.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.email ? <LinkButton href={`mailto:${profile.email}`} variant="secondary">Email</LinkButton> : null}
            {links.map((l) => (
              <LinkButton key={l.href} href={l.href} variant="ghost" target="_blank" rel="noreferrer">
                {l.label}
              </LinkButton>
            ))}
          </div>
          <p className="mt-6 text-xs text-[color:var(--muted)]">
            Privacy: messages are stored for reply purposes. Rate limiting may apply.
          </p>
        </Card>
      </div>
    </div>
  )
}
