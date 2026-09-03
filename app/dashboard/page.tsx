import { getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'

export default async function DashboardRedirectPage() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (user.role === Role.ADMIN) redirect('/admin/dashboard')
  if (user.role === Role.EDITOR) redirect('/editor/dashboard')
  redirect('/courses')
}
