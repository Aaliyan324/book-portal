import Link from 'next/link'
import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CourseStatus, LessonStatus, Role } from '@prisma/client'
import {
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Edit3,
  Plus,
  ArrowRight,
  UploadCloud,
  Paperclip,
  Sparkles,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const admin = await requireAdmin()

  // Execute metrics queries in parallel
  const [
    totalCourses,
    totalLessons,
    publishedLessons,
    draftLessons,
    totalStudents,
    totalEditors,
    recentLessons,
    latestUploads,
    activeEditors,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.lesson.count({ where: { status: LessonStatus.PUBLISHED } }),
    prisma.lesson.count({ where: { status: LessonStatus.DRAFT } }),
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.EDITOR } }),
    prisma.lesson.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        course: { select: { title: true } },
        createdBy: { select: { name: true } },
        collaborators: { include: { user: { select: { name: true, avatarUrl: true } } } },
      },
    }),
    prisma.resource.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        lesson: { select: { title: true } },
        uploadedBy: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: Role.EDITOR },
      take: 5,
      include: {
        assignedCollaborations: {
          include: { lesson: { select: { title: true } } },
        },
      },
    }),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" /> Admin Control Center
            </h1>
            <p className="text-sm text-slate-500">
              Overview of course analytics, assigned lesson editors, and media resources.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/courses/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Quick Create Course
              </Button>
            </Link>
            <Link href="/admin/lessons/new">
              <Button variant="gradient" className="gap-2">
                <Plus className="h-4 w-4" /> Quick Create Lesson
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="p-4 border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Total Courses</span>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCourses}</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Total Lessons</span>
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalLessons}</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Published</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{publishedLessons}</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Drafts</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{draftLessons}</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-purple-600">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Editors</span>
              <Edit3 className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalEditors}</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-sky-500">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Students</span>
              <Users className="h-4 w-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalStudents}</div>
          </Card>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Lessons (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recently Updated Lessons
              </h2>
              <Link href="/admin/lessons" className="text-xs text-blue-600 hover:underline">
                View all lessons
              </Link>
            </div>

            <Card>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentLessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/lessons/${lesson.id}/edit`} className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </Link>
                        <Badge variant={lesson.status === LessonStatus.PUBLISHED ? 'success' : 'warning'} className="text-[10px]">
                          {lesson.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Course: {lesson.course.title} • By {lesson.createdBy.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {lesson.collaborators.length > 0 && (
                        <div className="flex -space-x-2 overflow-hidden mr-2">
                          {lesson.collaborators.map((c) => (
                            <img
                              key={c.id}
                              src={c.user.avatarUrl || `https://avatar.vercel.sh/${c.user.name}`}
                              alt={c.user.name}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900"
                              title={`Assigned Editor: ${c.user.name}`}
                            />
                          ))}
                        </div>
                      )}
                      <Link href={`/admin/lessons/${lesson.id}/edit`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Active Editors & Latest Resources Sidebar */}
          <div className="space-y-6">
            
            {/* Active Editors Panel */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-purple-600" /> Active Editors
                </h3>
                <Link href="/admin/editors" className="text-xs text-blue-600 hover:underline">
                  Manage
                </Link>
              </div>

              <div className="space-y-3">
                {activeEditors.map((ed) => (
                  <div key={ed.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={ed.avatarUrl || `https://avatar.vercel.sh/${ed.name}`}
                        alt={ed.name}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{ed.name}</p>
                        <p className="text-[10px] text-slate-400">{ed.assignedCollaborations.length} assigned lesson(s)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Latest Resource Uploads */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-blue-600" /> Recent Uploads
                </h3>
              </div>

              <div className="space-y-3">
                {latestUploads.map((res) => (
                  <div key={res.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{res.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {res.fileName} • {res.lesson?.title || 'General'}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
