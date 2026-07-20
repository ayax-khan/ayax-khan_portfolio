'use client'

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--fg)]">Something went wrong</h1>
        <p className="mt-4 text-[var(--muted)]">
          Failed to load the page. This is usually a temporary issue — please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
