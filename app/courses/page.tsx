import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CourseStatus } from '@prisma/client'
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Banner */}
        <div className="rounded-2xl bg-[#171717] text-white p-8 sm:p-12 relative overflow-hidden space-y-4 border border-[#D4D4D4]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#EA580C]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EA580C]/20 text-[#EA580C] text-xs font-semibold border border-[#EA580C]/30">
            <GraduationCap className="h-4 w-4 text-[#EA580C]" /> Public Hopenix Course Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Explore Modern Engineering & Design Courses
          </h1>
          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
            Gain deep technical expertise through interactive block lessons, video tutorials, downloadable resources, and live code examples.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#171717] tracking-tight">
            Published Courses ({courses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="gradient-border-shell-card hover-card-hopenix flex flex-col justify-between group">
                <div className="bg-white p-5 rounded-[4px] space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-[2px] border border-[#D4D4D4]"
                      />
                    ) : (
                      <div className="w-full h-48 bg-[#E5E5E5] flex items-center justify-center text-[#525252] rounded-[2px]">
                        <BookOpen className="h-12 w-12" />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">
                          {course._count.lessons} Lessons
                        </Badge>
                        <span className="text-xs text-[#525252]">
                          By {course.createdBy.name}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#EA580C] transition-colors leading-snug line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#525252] line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <Link href={`/courses/${course.slug}`}>
                      <Button className="w-full bg-[#171717] hover:bg-[#262626] text-white rounded-full h-10 justify-between">
                        <span>View Course Lessons</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

