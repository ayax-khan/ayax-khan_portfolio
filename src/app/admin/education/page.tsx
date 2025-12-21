import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminEducationPage() {
  redirect('/admin/profile?tab=education')
}
