import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Role } from '@prisma/client'
import { Edit3 } from 'lucide-react'

export default async function AdminEditorsPage() {
  const admin = await requireAdmin()

  const editors = await prisma.user.findMany({
    where: { role: Role.EDITOR },
    orderBy: { name: 'asc' },
    include: {
      assignedCollaborations: {
        include: {
          lesson: { select: { title: true, course: { select: { title: true } } } },
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
            <Edit3 className="h-6 w-6 text-purple-600" /> Lesson Editors Directory
          </h1>
          <p className="text-sm text-slate-500">
            View assigned editors and their specific lesson permissions.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Editor</TableHead>
              <TableHead>Assigned Lessons</TableHead>
              <TableHead>Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                  No editors currently registered.
                </TableCell>
              </TableRow>
            ) : (
              editors.map((editor) => (
                <TableRow key={editor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={editor.avatarUrl || `https://avatar.vercel.sh/${editor.name}`}
                        alt={editor.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{editor.name}</p>
                        <p className="text-xs text-slate-400">{editor.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {editor.assignedCollaborations.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No assigned lessons</span>
                      ) : (
                        editor.assignedCollaborations.map((c) => (
                          <Badge key={c.id} variant="purple" className="text-[10px]">
                            {c.lesson.title}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {new Date(editor.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </main>

      <Footer />
    </div>
  )
}
