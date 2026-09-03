import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LessonBlockEditor } from '@/components/editor/LessonBlockEditor'
import { QRCodeButtonClient } from '@/components/lessons/QRCodeButtonClient'
import { LessonStatus } from '@prisma/client'
import {
  ChevronRight,
  BookOpen,
  Clock,
  ArrowLeft,
  ArrowRight,
  Paperclip,
  Download,
  CheckCircle,
  FileText,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { formatBytes } from '@/lib/utils'

export default async function StudentLessonViewPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>
}) {
  const user = await getCurrentUser()
  const { courseSlug, lessonSlug } = await params

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      lessons: {
        where: { status: LessonStatus.PUBLISHED },
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!course) notFound()

  const currentLesson = await prisma.lesson.findUnique({
    where: { slug: lessonSlug },
    include: {
      blocks: { orderBy: { position: 'asc' } },
      resources: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!currentLesson || currentLesson.courseId !== course.id) notFound()

  // Calculate Next and Previous lesson index
  const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id)
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const fullLessonUrl = `${baseUrl}/courses/${course.slug}/lessons/${currentLesson.slug}`

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={user} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto py-1">
          <Link href="/courses" className="hover:text-blue-600">Courses</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link href={`/courses/${course.slug}`} className="hover:text-blue-600 truncate max-w-xs">{course.title}</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-slate-900 dark:text-slate-100 font-semibold truncate">{currentLesson.title}</span>
        </nav>

        {/* Sidebar + Main Lesson Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Navigation Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <BookOpen className="h-4 w-4 text-blue-600" /> Course Outline
              </h3>

              <div className="space-y-1">
                {course.lessons.map((l, idx) => {
                  const isActive = l.id === currentLesson.id

                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${course.slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                        isActive ? 'bg-white text-blue-600 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="truncate">{l.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Main Lesson View */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header Title Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-[10px]">
                      Lesson {currentIndex + 1} of {course.lessons.length}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5" /> {currentLesson.estimatedDuration} mins
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {currentLesson.title}
                  </h1>
                </div>

                <QRCodeButtonClient url={fullLessonUrl} title={currentLesson.title} />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentLesson.description}
              </p>
            </div>

            {/* Lesson Blocks */}
            <LessonBlockEditor
              lessonId={currentLesson.id}
              initialBlocks={currentLesson.blocks as any}
              readOnly={true}
            />

            {/* Lesson Downloadable Resources */}
            {currentLesson.resources.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-blue-600" /> Downloadable Lesson Resources
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      download={res.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {res.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formatBytes(res.size)}
                          </p>
                        </div>
                      </div>

                      <Download className="h-4 w-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Next / Previous Lesson Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              {prevLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Previous Lesson
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                  <Button variant="gradient" size="sm" className="gap-2">
                    Next Lesson <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/courses/${course.slug}`}>
                  <Button variant="gradient" size="sm" className="gap-2">
                    Complete Course <CheckCircle className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
