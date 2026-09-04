import Link from 'next/link'
import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LessonStatus, Role } from '@prisma/client'
import {
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Edit3,
  Plus,
  Paperclip,
  Sparkles,
  ArrowRight,
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={admin} />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <AdminSidebar userRole={admin.role} userName={admin.name} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Header Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#EA580C]" /> Admin Control Center
              </h1>
              <p className="text-sm text-[#525252]">
                System metrics, editor assignments, lesson publishing, and resource tracking.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/courses/new">
                <Button variant="outline" className="gap-2 text-xs rounded-full border-[#D4D4D4]">
                  <Plus className="h-4 w-4" /> New Course
                </Button>
              </Link>
              <Link href="/admin/lessons/new">
                <Button className="gap-2 text-xs rounded-full bg-[#171717] hover:bg-[#262626] text-white">
                  <Plus className="h-4 w-4" /> New Lesson
                </Button>
              </Link>
            </div>
          </div>

          {/* Top Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-[2px] border border-[#D4D4D4] bg-white space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[#525252]">
                <span className="text-xs font-semibold">Total Courses</span>
                <BookOpen className="h-4 w-4 text-[#EA580C]" />
              </div>
              <div className="text-2xl font-black text-[#171717]">{totalCourses}</div>
            </div>

            <div className="p-4 rounded-[2px] border border-[#D4D4D4] bg-white space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[#525252]">
                <span className="text-xs font-semibold">Total Lessons</span>
                <FileText className="h-4 w-4 text-[#171717]" />
              </div>
              <div className="text-2xl font-black text-[#171717]">{totalLessons}</div>
            </div>

            <div className="p-4 rounded-[2px] border border-[#D4D4D4] bg-white space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[#525252]">
                <span className="text-xs font-semibold">Published</span>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#171717]">{publishedLessons}</div>
            </div>

            <div className="p-4 rounded-[2px] border border-[#D4D4D4] bg-white space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[#525252]">
                <span className="text-xs font-semibold">Drafts</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-[#171717]">{draftLessons}</div>
            </div>

            <div className="p-4 rounded-[2px] border border-[#D4D4D4] bg-white space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[#525252]">
                <span className="text-xs font-semibold">Editors</span>
                <Edit3 className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-[#171717]">{totalEditors}</div>
            </div>

            <div className="p-4 rounded-[2px] border border-[#D4D4D4] bg-white space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[#525252]">
                <span className="text-xs font-semibold">Students</span>
                <Users className="h-4 w-4 text-[#EA580C]" />
              </div>
              <div className="text-2xl font-black text-[#171717]">{totalStudents}</div>
            </div>
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Lessons (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#171717]">
                  Recently Updated Lessons
                </h2>
                <Link href="/admin/lessons" className="text-xs text-[#EA580C] font-semibold hover:underline">
                  View all lessons
                </Link>
              </div>

              <div className="gradient-border-shell-card">
                <div className="bg-white rounded-[4px] divide-y divide-[#E5E5E5]">
                  {recentLessons.map((lesson) => (
                    <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-[#E5E5E5]/20 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/lessons/${lesson.id}/edit`} className="font-bold text-sm text-[#171717] hover:text-[#EA580C] transition-colors">
                            {lesson.title}
                          </Link>
                          <Badge variant={lesson.status === LessonStatus.PUBLISHED ? 'success' : 'warning'} className="text-[10px]">
                            {lesson.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#525252]">
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
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                title={`Assigned Editor: ${c.user.name}`}
                              />
                            ))}
                          </div>
                        )}
                        <Link href={`/admin/lessons/${lesson.id}/edit`}>
                          <Button size="sm" variant="outline" className="text-xs rounded-full border-[#D4D4D4]">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Editors & Latest Resources Sidebar */}
            <div className="space-y-6">
              
              {/* Active Editors Panel */}
              <div className="rounded-[4px] border border-[#D4D4D4] bg-white p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-purple-600" /> Assigned Editors
                  </h3>
                  <Link href="/admin/users" className="text-xs text-[#EA580C] hover:underline font-semibold">
                    Users
                  </Link>
                </div>

                <div className="space-y-3">
                  {activeEditors.map((ed) => (
                    <div key={ed.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={ed.avatarUrl || `https://avatar.vercel.sh/${ed.name}`}
                          alt={ed.name}
                          className="h-7 w-7 rounded-full object-cover border border-[#D4D4D4]"
                        />
                        <div>
                          <p className="font-semibold text-[#171717]">{ed.name}</p>
                          <p className="text-[10px] text-[#525252]">{ed.assignedCollaborations.length} assigned lesson(s)</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Resource Uploads */}
              <div className="rounded-[4px] border border-[#D4D4D4] bg-white p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                  <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-[#EA580C]" /> Recent Resources
                  </h3>
                </div>

                <div className="space-y-2">
                  {latestUploads.map((res) => (
                    <div key={res.id} className="p-2.5 rounded-[2px] border border-[#E5E5E5] bg-[#E5E5E5]/20 space-y-0.5">
                      <p className="text-xs font-semibold text-[#171717] truncate">{res.title}</p>
                      <p className="text-[10px] text-[#525252] truncate">
                        {res.fileName} • {res.lesson?.title || 'General'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

