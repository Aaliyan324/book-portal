import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Role } from '@prisma/client'
import { updateUserRoleAction, deleteUserAction } from '@/actions/users'
import { Users, Shield, Edit3, GraduationCap, Trash2 } from 'lucide-react'

export default async function AdminUsersPage() {
  const admin = await requireAdmin()

  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          assignedCollaborations: true,
          createdLessons: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" /> User & Role Management
          </h1>
          <p className="text-sm text-slate-500">
            View registered portal users, change roles (Admin, Editor, Student), and inspect permissions.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned Lessons</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || `https://avatar.vercel.sh/${user.name}`}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant={user.role === Role.ADMIN ? 'default' : user.role === Role.EDITOR ? 'purple' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>

                <TableCell className="text-xs font-medium">
                  {user._count.assignedCollaborations} lessons
                </TableCell>

                <TableCell className="text-xs text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.id !== admin.id && (
                      <>
                        <form action={async () => {
                          'use server'
                          const nextRole = user.role === Role.STUDENT ? Role.EDITOR : user.role === Role.EDITOR ? Role.ADMIN : Role.STUDENT
                          await updateUserRoleAction(user.id, nextRole)
                        }}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Toggle Role ({user.role === Role.STUDENT ? 'Make Editor' : user.role === Role.EDITOR ? 'Make Admin' : 'Make Student'})
                          </Button>
                        </form>

                        <form action={async () => { 'use server'; await deleteUserAction(user.id) }}>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      <Footer />
    </div>
  )
}
