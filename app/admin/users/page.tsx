import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { UserManagementClient } from '@/components/admin/UserManagementClient'
import { Users } from 'lucide-react'

export default async function AdminUsersPage() {
  const admin = await requireAdmin()

  const rawUsers = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          assignedCollaborations: true,
        },
      },
    },
  })

  const users = rawUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt,
    assignedCount: u._count.assignedCollaborations,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-[#EA580C]" /> User & Role Management
          </h1>
          <p className="text-sm text-[#525252]">
            Inspect portal users, search credentials, manage editor assignments, and handle role promotions.
          </p>
        </div>

        <UserManagementClient initialUsers={users} currentAdminId={admin.id} />
      </main>

      <Footer />
    </div>
  )
}

