import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { createLessonAction } from '@/actions/lessons'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { LessonStatus } from '@prisma/client'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function NewLessonPage() {
  const admin = await requireAdmin()

  const courses = await prisma.course.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8 space-y-6">
        <Link href="/admin/lessons" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Lessons
        </Link>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle>Create New Lesson</CardTitle>
            <CardDescription>Specify title, course, description, and initial status</CardDescription>
          </CardHeader>

          <CardContent>
            <form action={async (formData: FormData) => {
              'use server'
              const courseId = formData.get('courseId') as string
              const title = formData.get('title') as string
              const description = formData.get('description') as string
              const thumbnailUrl = formData.get('thumbnailUrl') as string
              const status = formData.get('status') as LessonStatus
              const estimatedDuration = parseInt(formData.get('estimatedDuration') as string || '10')

              const res = await createLessonAction({
                courseId,
                title,
                description,
                thumbnailUrl,
                status,
                estimatedDuration,
              })

              redirect(`/admin/lessons/${res.lesson.id}/edit`)
            }} className="space-y-4">

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Course
                </label>
                <Select name="courseId" required defaultValue={courses[0]?.id}>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Lesson Title
                </label>
                <Input name="title" required placeholder="e.g. Introduction to Server Components" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Short Description
                </label>
                <Textarea name="description" required rows={3} placeholder="Key objectives and topics covered in this lesson..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Estimated Duration (Minutes)
                </label>
                <Input type="number" name="estimatedDuration" defaultValue={15} min={1} required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Lesson Status
                </label>
                <Select name="status" defaultValue={LessonStatus.DRAFT}>
                  <option value={LessonStatus.DRAFT}>Draft</option>
                  <option value={LessonStatus.PUBLISHED}>Published</option>
                </Select>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gradient" className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Create Lesson & Open Block Builder
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
