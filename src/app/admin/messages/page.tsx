import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/Card'
import { deleteMessage } from './actions'

export const metadata = {
  title: 'Admin · Messages',
  description: 'Contact form submissions.',
}

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Admin · Messages</h1>
        <Card title="Database not configured">
          <p>
            Set <span className="font-mono">DATABASE_URL</span> to use the admin panel.
          </p>
        </Card>
      </div>
    )
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ createdAt: 'desc' }],
    take: 100,
  })

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Latest contact form submissions (up to 100).</p>
      </header>

      {messages.length === 0 ? (
        <Card title="No messages">
          <p>When someone submits the contact form, messages will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m.id} title={`${m.name} — ${m.email}`}>
              <p className="mb-2 text-xs text-[color:var(--muted)]">ID: <span className="font-mono">{m.id.slice(0, 8)}</span></p>
              <p className="whitespace-pre-wrap">{m.message}</p>
              <p className="mt-3 text-xs text-[color:var(--muted)]">
                {new Date(m.createdAt).toLocaleString()} · {m.userAgent ? 'UA stored' : 'No UA'}
              </p>

              <form
                className="mt-4"
                action={async () => {
                  'use server'
                  await deleteMessage(m.id)
                }}
              >
                <button
                  type="submit"
                  className="rounded-xl bg-[color:var(--surface-2)] px-4 py-2 text-sm font-semibold text-[color:var(--fg)] ring-1 ring-[color:var(--border)] hover:bg-[color:var(--surface)]"
                >
                  Delete
                </button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
