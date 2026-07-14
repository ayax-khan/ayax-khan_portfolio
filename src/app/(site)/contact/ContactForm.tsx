'use client'

import { useActionState } from 'react'
import { submitContact, type ContactActionState } from './actions'
import { Send } from 'lucide-react'

const initialState: ContactActionState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[var(--fg)]" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Your name"
          autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-all placeholder:text-[var(--muted-2)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-all placeholder:text-[var(--muted-2)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg)]" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="What can I help you with?"
          rows={5}
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-all placeholder:text-[var(--muted-2)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? 'Sending...' : (
          <>
            Send Message
            <Send size={16} />
          </>
        )}
      </button>
    </form>
  )
}
