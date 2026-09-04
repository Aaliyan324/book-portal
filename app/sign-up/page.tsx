import { getCurrentUser, getDashboardPath } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { SignUpFormClient } from '@/components/auth/SignUpFormClient'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const user = await getCurrentUser()
  if (user) redirect(getDashboardPath(user.role))

  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
      <SignUpFormClient error={error} />
    </div>
  )
}

