'use client'

import { Mail, MapPin, Clock, Send } from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useActionState } from 'react'
import { submitContact, type ContactActionState } from '@/app/(site)/contact/actions'

const initialState: ContactActionState = { status: 'idle' }

export function ContactSection() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <SectionHeading
            subtitle="Contact"
            title="Let's Work Together"
            description="Have a project in mind? Let's discuss how I can help bring your ideas to life."
            align="center"
          />
        </ScrollReveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <ScrollReveal y={20}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[var(--fg)]">Get in touch</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  I am always open to discussing new projects, creative ideas, or opportunities to
                  push AI forward. Send me a message and I will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--fg)]">Email</p>
                    <p className="text-xs text-[var(--muted)]">deskmen112@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--fg)]">Location</p>
                    <p className="text-xs text-[var(--muted)]">Remote / Worldwide</p>
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
            </div>
          </ScrollReveal>

          <ScrollReveal y={20} delay={0.15}>
            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--fg)]" htmlFor="cf-name">
                  Name
                </label>
                <input
                  id="cf-name"
                  name="name"
                  required
                  placeholder="Your name"
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] outline-none transition-all placeholder:text-[var(--muted-2)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg)]" htmlFor="cf-email">
                  Email
                </label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] outline-none transition-all placeholder:text-[var(--muted-2)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg)]" htmlFor="cf-message">
                  Message
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  required
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--fg)] outline-none transition-all placeholder:text-[var(--muted-2)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>

              {state.status === 'error' ? (
                <p className="text-sm text-red-500">{state.message}</p>
              ) : null}
              {state.status === 'success' ? (
                <p className="text-sm text-emerald-600">Thanks — I will reply soon.</p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
              >
                {pending ? 'Sending...' : (
                  <>
                    Send Message
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
