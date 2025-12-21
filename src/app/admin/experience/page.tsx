import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminExperiencePage() {
  redirect('/admin/profile?tab=experience')
}
