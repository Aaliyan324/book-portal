import Link from 'next/link'
import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { LessonStatus } from '@prisma/client'
import { Plus, FileText, Edit, Copy, QrCode, Trash2, Users, Eye } from 'lucide-react'
import { deleteLessonAction, duplicateLessonAction, toggleLessonStatusAction } from '@/actions/lessons'
import { AdminLessonsTableClient } from '@/components/admin/AdminLessonsTableClient'

export default async function AdminLessonsPage() {
  const admin = await requireAdmin()

  const [lessons, courses] = await Promise.all([
    prisma.lesson.findMany({
      orderBy: [{ courseId: 'asc' }, { position: 'asc' }],
      include: {
        course: { select: { id: true, title: true, slug: true } },
        createdBy: { select: { name: true } },
        collaborators: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
          },
        },
      },
    }),
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    }),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Lesson Management Studio
            </h1>
            <p className="text-sm text-slate-500">
              Manage block-based lessons, assign editors, duplicate lessons, and generate QR codes.
            </p>
          </div>

          <Link href="/admin/lessons/new">
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" /> Create Lesson
            </Button>
          </Link>
        </div>

        {/* Client Table with search, filters, QR modal & Manage Editors */}
        <AdminLessonsTableClient lessons={lessons} courses={courses} />
      </main>

      <Footer />
    </div>
  )
}
