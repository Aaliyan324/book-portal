import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Role } from '@prisma/client'
import { GraduationCap } from 'lucide-react'

export default async function AdminStudentsPage() {
  const admin = await requireAdmin()

  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-600" /> Student Directory
          </h1>
          <p className="text-sm text-slate-500">
            Registered students with read-only access to published courses and lessons.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                  No students currently registered.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl || `https://avatar.vercel.sh/${student.name}`}
                        alt={student.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{student.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">{student.email}</TableCell>

                  <TableCell>
                    <Badge variant="success" className="text-[10px]">Active Student</Badge>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {new Date(student.createdAt).toLocaleDateString()}
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
