import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CourseStatus } from '@prisma/client'
import { Sparkles, GraduationCap, Shield, Zap, ArrowRight, Play, BookOpen, Lock } from 'lucide-react'

export default async function HomePage() {
  const user = await getCurrentUser()

  const courses = await prisma.course.findMany({
    where: { status: CourseStatus.PUBLISHED },
    take: 6,
    include: {
      _count: {
        select: { lessons: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-blue-900/10 via-slate-50 to-slate-50 dark:from-blue-950/40 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 animate-in fade-in">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Enterprise Learning & Lesson Management
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Empower Knowledge with <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">Hopenx Portal</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create high-impact lessons with rich text, videos, PDFs, and attachments. Enforce strict server-side role permissions for Admins, Editors, and Students.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href={user ? '/courses' : '/sign-up'}>
              <Button size="lg" variant="gradient" className="gap-2">
                Explore Courses <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In to Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Course Catalog Grid */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Featured Published Courses
            </h2>
            <p className="text-sm text-slate-500">
              Browse interactive courses built with Hopenx block editor.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="text-blue-600 dark:text-blue-400">
              View All Courses <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover-card-blue flex flex-col justify-between overflow-hidden">
              <div>
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                    <BookOpen className="h-12 w-12 opacity-80" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="default" className="text-[10px]">
                      {course._count.lessons} Lessons
                    </Badge>
                    <Badge variant="success" className="text-[10px]">Published</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {course.description}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardContent className="pt-0">
                <Link href={`/courses/${course.slug}`}>
                  <Button variant="outline" className="w-full justify-between group">
                    <span>Start Learning</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-blue-600" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
