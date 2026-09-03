import Link from 'next/link'
import { requireEditorOrAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LessonStatus, Role } from '@prisma/client'
import { FileText, Edit3, CheckCircle, Clock, ArrowRight, Lock } from 'lucide-react'

export default async function EditorDashboardPage() {
  const user = await requireEditorOrAdmin()

  // Find ONLY assigned lessons for this specific editor (or all if ADMIN)
  let assignedLessons: any[] = []

  if (user.role === Role.ADMIN) {
    assignedLessons = await prisma.lesson.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        course: { select: { title: true } },
        blocks: { select: { id: true } },
      },
    })
  } else {
    const collaborations = await prisma.lessonCollaborator.findMany({
      where: { userId: user.id },
      include: {
        lesson: {
          include: {
            course: { select: { title: true } },
            blocks: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    assignedLessons = collaborations.map((c) => c.lesson)
  }

  const publishedCount = assignedLessons.filter((l) => l.status === LessonStatus.PUBLISHED).length
  const draftCount = assignedLessons.filter((l) => l.status === LessonStatus.DRAFT).length

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={user} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Edit3 className="h-6 w-6 text-purple-600" /> Editor Studio
            </h1>
            <p className="text-sm text-slate-500">
              Assigned workspace for {user.name}. You can edit content on lessons explicitly granted to you by an admin.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-purple-600">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Assigned Lessons</span>
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{assignedLessons.length}</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Published</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{publishedCount}</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Drafts</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{draftCount}</div>
          </Card>
        </div>

        {/* Assigned Lessons List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Your Assigned Lessons ({assignedLessons.length})
          </h2>

          {assignedLessons.length === 0 ? (
            <Card className="p-8 text-center space-y-3 border-dashed">
              <Lock className="h-8 w-8 text-purple-500 mx-auto" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No lessons assigned yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                An administrator must assign you as a collaborator on a specific lesson before you can edit it.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedLessons.map((lesson) => (
                <Card key={lesson.id} className="hover-card-blue flex flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={lesson.status === LessonStatus.PUBLISHED ? 'success' : 'warning'} className="text-[10px]">
                        {lesson.status}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {lesson.blocks?.length || 0} blocks
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base line-clamp-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{lesson.description}</p>
                    <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      Course: {lesson.course?.title}
                    </p>
                  </div>

                  <Link href={`/editor/lessons/${lesson.id}/edit`}>
                    <Button variant="outline" className="w-full justify-between text-xs">
                      <span>Open Block Studio</span>
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
