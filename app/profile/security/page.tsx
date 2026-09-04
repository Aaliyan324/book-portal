import { requireUser } from '@/lib/permissions/permissions'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SecurityFormClient } from '@/components/profile/SecurityFormClient'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default async function ProfileSecurityPage() {
  const user = await requireUser()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs text-[#EA580C] hover:underline font-medium mb-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Profile
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#171717] flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#EA580C]" /> Security & Password
            </h1>
            <p className="text-sm text-[#525252]">Manage your credentials and security settings.</p>
          </div>
        </div>

        <SecurityFormClient />
      </main>
      <Footer />
    </div>
  )
}
