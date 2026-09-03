import Link from 'next/link'
import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { CourseStatus } from '@prisma/client'
import { Plus, BookOpen, Edit, Trash2, ExternalLink } from 'lucide-react'
import { deleteCourseAction, toggleCourseStatusAction } from '@/actions/courses'

export default async function AdminCoursesPage() {
  const admin = await requireAdmin()

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { lessons: true } },
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Course Management
            </h1>
            <p className="text-sm text-slate-500">
              Create, edit, and publish courses across the portal.
            </p>
          </div>

          <Link href="/admin/courses/new">
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" /> Create Course
            </Button>
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                  No courses created yet. Click &quot;Create Course&quot; to begin.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="h-10 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <Link href={`/courses/${course.slug}`} className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600">
                          {course.title}
                        </Link>
                        <p className="text-xs text-slate-400 truncate max-w-xs">{course.description}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={course.status === CourseStatus.PUBLISHED ? 'success' : 'warning'}>
                      {course.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold">{course._count.lessons}</span> lessons
                  </TableCell>

                  <TableCell className="text-slate-600 dark:text-slate-400 text-xs">
                    {course.createdBy.name}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                      </Link>

                      <form action={async () => { 'use server'; await deleteCourseAction(course.id) }}>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    </div>
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
