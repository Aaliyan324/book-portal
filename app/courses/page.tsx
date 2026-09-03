import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CourseStatus } from '@prisma/client'
import { GraduationCap, BookOpen, ArrowRight, Play } from 'lucide-react'

export default async function StudentCoursesPage() {
  const user = await getCurrentUser()

  const courses = await prisma.course.findMany({
    where: { status: CourseStatus.PUBLISHED },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { lessons: true } },
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={user} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-sm border border-blue-400/30">
            <GraduationCap className="h-4 w-4 text-blue-400" /> Public Student Learning Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Explore Modern Web & Engineering Courses
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Gain deep technical expertise through interactive lessons, video tutorials, downloadable resources, and live code examples.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Available Courses ({courses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover-card-blue flex flex-col justify-between overflow-hidden">
                <div>
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                      <BookOpen className="h-12 w-12 opacity-80" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="default" className="text-[10px]">
                        {course._count.lessons} Lessons
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium">
                        By {course.createdBy.name}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="pt-0">
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="gradient" className="w-full justify-between group">
                      <span>View Course Lessons</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
