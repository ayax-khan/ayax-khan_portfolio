'use client'

import { useActionState } from 'react'
import { submitContact, type ContactActionState } from './actions'
import { Button } from '@/components/ui/Button'

const initialState: ContactActionState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm text-[color:var(--muted)]" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Your name"
          autoComplete="name"
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
        />
      </div>

      <div>
        <label className="block text-sm text-[color:var(--muted)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
        />
      </div>

      <div>
        <label className="block text-sm text-[color:var(--muted)]" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="What can I help you with?"
          rows={6}
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-[color:var(--fg)] outline-none focus:ring-2 focus:ring-[color:var(--selection)]"
        />
        <p className="mt-1 text-xs text-[color:var(--muted)]">Please include context, timeline, and a link if relevant.</p>
      </div>

      {state.status === 'error' ? <p className="text-sm text-red-300">{state.message}</p> : null}
      {state.status === 'success' ? <p className="text-sm text-emerald-300">Thanks — I’ll reply soon.</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
