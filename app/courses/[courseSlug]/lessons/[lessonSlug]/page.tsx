import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LessonBlockEditor } from '@/components/editor/LessonBlockEditor'
import { QRCodeButtonClient } from '@/components/lessons/QRCodeButtonClient'
import { MobileCourseDrawer } from '@/components/lessons/MobileCourseDrawer'
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

  const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id)
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const fullLessonUrl = `${baseUrl}/courses/${course.slug}/lessons/${currentLesson.slug}`

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#525252] font-medium overflow-x-auto py-1">
          <Link href="/courses" className="hover:text-[#EA580C]">Courses</Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-[#a3a3a3]" />
          <Link href={`/courses/${course.slug}`} className="hover:text-[#EA580C] truncate max-w-xs">{course.title}</Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-[#a3a3a3]" />
          <span className="text-[#171717] font-semibold truncate">{currentLesson.title}</span>
        </nav>

        {/* Mobile Course Contents Drawer Trigger */}
        <MobileCourseDrawer
          courseTitle={course.title}
          courseSlug={course.slug}
          lessons={course.lessons}
          currentLessonId={currentLesson.id}
        />

        {/* Sidebar + Main Lesson Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Left Navigation Sidebar */}
          <aside className="hidden lg:block space-y-4">
            <div className="rounded-[4px] border border-[#D4D4D4] bg-white p-4 space-y-3 shadow-sm sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1.5 border-b border-[#E5E5E5] pb-2">
                <BookOpen className="h-4 w-4 text-[#EA580C]" /> Course Outline
              </h3>

              <div className="space-y-1">
                {course.lessons.map((l, idx) => {
                  const isActive = l.id === currentLesson.id

                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${course.slug}/lessons/${l.slug}`}
                      className={`flex items-center gap-3 p-2.5 rounded-[2px] text-xs transition-colors ${
                        isActive
                          ? 'bg-[#171717] text-white font-semibold'
                          : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                        isActive ? 'bg-[#EA580C] text-white font-bold' : 'bg-[#E5E5E5] text-[#525252]'
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

          {/* Main Lesson Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header Title Card */}
            <div className="rounded-[4px] border border-[#D4D4D4] bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      Lesson {currentIndex + 1} of {course.lessons.length}
                    </Badge>
                    <span className="text-xs text-[#525252] flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-[#EA580C]" /> {currentLesson.estimatedDuration} mins
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                    {currentLesson.title}
                  </h1>
                </div>

                <QRCodeButtonClient url={fullLessonUrl} title={currentLesson.title} />
              </div>

              <p className="text-sm text-[#525252] leading-relaxed">
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
              <div className="rounded-[4px] border border-[#D4D4D4] bg-white p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-[#EA580C]" /> Downloadable Lesson Resources
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      download={res.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-[2px] border border-[#D4D4D4] bg-white hover:border-[#EA580C] transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <div className="p-2 rounded-[2px] bg-[#EA580C]/10 text-[#EA580C]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-[#171717] truncate">
                            {res.title}
                          </p>
                          <p className="text-[10px] text-[#525252]">
                            {formatBytes(res.size)}
                          </p>
                        </div>
                      </div>

                      <Download className="h-4 w-4 text-[#525252] group-hover:text-[#EA580C] shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Next / Previous Lesson Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E5E5E5]">
              {prevLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}>
                  <Button variant="outline" size="sm" className="gap-2 text-xs rounded-full">
                    <ArrowLeft className="h-4 w-4" /> Previous Lesson
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                  <Button className="bg-[#171717] hover:bg-[#262626] text-white rounded-full text-xs px-5 h-9 gap-2">
                    Next Lesson <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/courses/${course.slug}`}>
                  <Button className="bg-[#EA580C] hover:bg-[#c2410c] text-white rounded-full text-xs px-5 h-9 gap-2">
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

