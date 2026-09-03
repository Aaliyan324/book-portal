import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { updateCourseAction } from '@/actions/courses'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { CourseStatus } from '@prisma/client'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const admin = await requireAdmin()
  const { courseId } = await params

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  })

  if (!course) notFound()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8 space-y-6">
        <Link href="/admin/courses" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Courses
        </Link>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle>Edit Course: {course.title}</CardTitle>
            <CardDescription>Update title, description, thumbnail, or publication status</CardDescription>
          </CardHeader>

          <CardContent>
            <form action={async (formData: FormData) => {
              'use server'
              const title = formData.get('title') as string
              const description = formData.get('description') as string
              const thumbnailUrl = formData.get('thumbnailUrl') as string
              const status = formData.get('status') as CourseStatus

              await updateCourseAction(course.id, {
                title,
                description,
                thumbnailUrl,
                status,
              })
            }} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Course Title
                </label>
                <Input name="title" defaultValue={course.title} required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Short Description
                </label>
                <Textarea name="description" defaultValue={course.description} required rows={3} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Thumbnail Image URL
                </label>
                <Input name="thumbnailUrl" defaultValue={course.thumbnailUrl || ''} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Course Status
                </label>
                <Select name="status" defaultValue={course.status}>
                  <option value={CourseStatus.DRAFT}>Draft</option>
                  <option value={CourseStatus.PUBLISHED}>Published</option>
                  <option value={CourseStatus.ARCHIVED}>Archived</option>
                </Select>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gradient" className="w-full">
                  <Save className="h-4 w-4 mr-1" /> Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
