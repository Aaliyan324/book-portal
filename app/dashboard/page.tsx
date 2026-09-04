import { requireUser } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CourseStatus, LessonStatus } from '@prisma/client'
import Link from 'next/link'
import { GraduationCap, PlayCircle, BookOpen, Clock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function StudentDashboardPage() {
  const user = await requireUser()
  const firstName = user.name.split(' ')[0] || user.name

  // Fetch published courses and latest published lessons
  const [publishedCourses, latestLessons] = await Promise.all([
    prisma.course.findMany({
      where: { status: CourseStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            lessons: {
              where: { status: LessonStatus.PUBLISHED },
            },
          },
        },
        lessons: {
          where: { status: LessonStatus.PUBLISHED },
          orderBy: { position: 'asc' },
          take: 1,
          select: { slug: true, title: true },
        },
      },
    }),
    prisma.lesson.findMany({
      where: { status: LessonStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: {
        course: { select: { title: true, slug: true } },
      },
    }),
  ])

  // Conceptual continue learning course (first published course)
  const continueCourse = publishedCourses[0]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-[#171717] text-white p-6 sm:p-10 border border-[#D4D4D4]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#EA580C]/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EA580C]/20 border border-[#EA580C]/30 text-[#EA580C] text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Hopenix Student Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              Continue your educational path, explore interactive courses, and build real-world software skills.
            </p>
          </div>
        </div>

        {/* Continue Learning Highlight Banner */}
        {continueCourse && continueCourse.lessons.length > 0 && (
          <div className="gradient-border-shell-card">
            <div className="bg-white p-6 rounded-[4px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {continueCourse.thumbnailUrl ? (
                  <img
                    src={continueCourse.thumbnailUrl}
                    alt={continueCourse.title}
                    className="h-16 w-24 rounded-[2px] object-cover border border-[#D4D4D4] shrink-0"
                  />
                ) : (
                  <div className="h-16 w-24 rounded-[2px] bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center border border-[#EA580C]/20 shrink-0">
                    <BookOpen className="h-8 w-8" />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                    Jump Back In
                  </span>
                  <h3 className="text-lg font-bold text-[#171717]">{continueCourse.title}</h3>
                  <p className="text-xs text-[#525252]">Next lesson: {continueCourse.lessons[0].title}</p>
                </div>
              </div>

              <Link href={`/courses/${continueCourse.slug}/lessons/${continueCourse.lessons[0].slug}`}>
                <Button className="bg-[#EA580C] hover:bg-[#c2410c] text-white rounded-full px-6 h-11 gap-2 font-medium">
                  <PlayCircle className="h-4 w-4" /> Continue Learning
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Available Courses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#EA580C]" /> Available Courses ({publishedCourses.length})
            </h2>
            <Link href="/courses" className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center gap-1">
              Browse All Catalog <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCourses.map((course) => (
              <div
                key={course.id}
                className="gradient-border-shell-card hover-card-hopenix group flex flex-col justify-between"
              >
                <div className="bg-white p-5 rounded-[4px] space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-44 w-full rounded-[2px] object-cover border border-[#D4D4D4]"
                      />
                    ) : (
                      <div className="h-44 w-full rounded-[2px] bg-[#E5E5E5] flex items-center justify-center text-[#525252]">
                        <BookOpen className="h-10 w-10" />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">
                          {course._count.lessons} Lessons
                        </Badge>
                        <span className="text-[11px] text-[#525252] flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#EA580C]" /> Self-Paced
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#171717] group-hover:text-[#EA580C] transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#525252] line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Full Access
                    </span>
                    {course.lessons.length > 0 ? (
                      <Link href={`/courses/${course.slug}`}>
                        <Button size="sm" className="bg-[#171717] hover:bg-[#262626] text-white rounded-full text-xs px-4">
                          View Course
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" disabled className="text-xs">
                        Upcoming
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Lessons Feed */}
        <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
          <h2 className="text-xl font-bold text-[#171717]">Latest Published Lessons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/courses/${lesson.course.slug}/lessons/${lesson.slug}`}
                className="block p-4 rounded-[4px] border border-[#D4D4D4] bg-white hover:border-[#EA580C] transition-all hover:-translate-y-0.5 space-y-2"
              >
                <Badge variant="secondary" className="text-[9px]">
                  {lesson.course.title}
                </Badge>
                <h4 className="text-sm font-bold text-[#171717] line-clamp-1">{lesson.title}</h4>
                <p className="text-xs text-[#525252] flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#EA580C]" /> {lesson.estimatedDuration} min read
                </p>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
