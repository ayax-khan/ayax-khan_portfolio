export default function ProjectsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
      <div className="max-w-3xl">
        <div className="mb-3 h-6 w-20 animate-pulse rounded-full bg-[var(--surface-2)]" />
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[var(--surface-2)] sm:h-10" />
        <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-[var(--surface-2)]" />
      </div>

      <div className="mt-8 flex flex-wrap gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 w-16 animate-pulse rounded-xl bg-[var(--surface-2)]" />
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <div className="h-40 w-full animate-pulse bg-[var(--surface-2)] sm:h-44" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-36 animate-pulse rounded bg-[var(--surface-2)]" />
              <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-2)]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--surface-2)]" />
              <div className="flex gap-1.5">
                <div className="h-5 w-14 animate-pulse rounded bg-[var(--surface-2)]" />
                <div className="h-5 w-14 animate-pulse rounded bg-[var(--surface-2)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
