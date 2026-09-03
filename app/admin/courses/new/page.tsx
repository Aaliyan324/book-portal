import { requireAdmin } from '@/lib/permissions/permissions'
import { createCourseAction } from '@/actions/courses'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { CourseStatus } from '@prisma/client'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function NewCoursePage() {
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8 space-y-6">
        <Link href="/admin/courses" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Courses
        </Link>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Enter course details and thumbnail</CardDescription>
          </CardHeader>

          <CardContent>
            <form action={async (formData: FormData) => {
              'use server'
              const title = formData.get('title') as string
              const description = formData.get('description') as string
              const thumbnailUrl = formData.get('thumbnailUrl') as string
              const status = formData.get('status') as CourseStatus

              await createCourseAction({
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
                <Input name="title" required placeholder="e.g. Advanced Next.js & Serverless Systems" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Short Description
                </label>
                <Textarea name="description" required rows={3} placeholder="Comprehensive guide covering App Router, Prisma, and deployment..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Thumbnail Image URL (Optional)
                </label>
                <Input name="thumbnailUrl" placeholder="https://images.unsplash.com/..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Course Status
                </label>
                <Select name="status" defaultValue={CourseStatus.DRAFT}>
                  <option value={CourseStatus.DRAFT}>Draft</option>
                  <option value={CourseStatus.PUBLISHED}>Published</option>
                </Select>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gradient" className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Create Course
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
