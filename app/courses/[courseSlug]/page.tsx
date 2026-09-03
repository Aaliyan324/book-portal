import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LessonStatus } from '@prisma/client'
import { BookOpen, Clock, Play, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function CourseDetailPage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const user = await getCurrentUser()
  const { courseSlug } = await params

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      createdBy: { select: { name: true, avatarUrl: true } },
      lessons: {
        where: { status: LessonStatus.PUBLISHED },
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!course) notFound()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={user} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <Link href="/courses" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Courses
        </Link>

        {/* Course Header Banner */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                {course.lessons.length} Lessons
              </Badge>
              <Badge variant="success" className="text-xs">Published</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <img
                src={course.createdBy.avatarUrl || `https://avatar.vercel.sh/${course.createdBy.name}`}
                alt={course.createdBy.name}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span>Created by <strong className="text-slate-800 dark:text-slate-200">{course.createdBy.name}</strong></span>
            </div>
          </div>

          <div>
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-56 object-cover rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" />
            ) : (
              <div className="w-full h-56 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                <BookOpen className="h-16 w-16 opacity-80" />
              </div>
            )}
          </div>
        </div>

        {/* Lesson Outline List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Course Lessons
          </h2>

          <div className="space-y-3">
            {course.lessons.length === 0 ? (
              <p className="text-sm text-slate-400">No published lessons available in this course yet.</p>
            ) : (
              course.lessons.map((lesson, idx) => (
                <Card key={lesson.id} className="hover-card-blue p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{lesson.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {lesson.estimatedDuration} mins
                    </span>
                    <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`}>
                      <Button variant="gradient" size="sm" className="gap-1 text-xs">
                        <Play className="h-3.5 w-3.5" /> Start Lesson
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
