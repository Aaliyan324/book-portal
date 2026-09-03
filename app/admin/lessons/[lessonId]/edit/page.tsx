import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { updateLessonAction } from '@/actions/lessons'
import { addResourceAction, deleteResourceAction } from '@/actions/resources'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { LessonStatus } from '@prisma/client'
import { LessonBlockEditor } from '@/components/editor/LessonBlockEditor'
import { ResourceUploader } from '@/components/uploads/ResourceUploader'
import { ArrowLeft, Save, Users, Eye, Sparkles, Paperclip, Trash2, Download } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function AdminEditLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const admin = await requireAdmin()
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: true,
      blocks: { orderBy: { position: 'asc' } },
      resources: { orderBy: { createdAt: 'desc' } },
      collaborators: {
        include: {
          user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        },
      },
    },
  })

  if (!lesson) notFound()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={admin} />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8 space-y-6">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/admin/lessons" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Lessons
          </Link>

          <div className="flex items-center gap-3">
            <Link href={`/courses/${lesson.course.slug}/lessons/${lesson.slug}`} target="_blank">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" /> Preview Student View
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Lesson Metadata & Assigned Editors */}
          <div className="space-y-6">
            
            {/* Metadata Card */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Lesson Settings</CardTitle>
                <CardDescription>Update title, course, duration, and status</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={async (formData: FormData) => {
                  'use server'
                  const title = formData.get('title') as string
                  const description = formData.get('description') as string
                  const status = formData.get('status') as LessonStatus
                  const estimatedDuration = parseInt(formData.get('estimatedDuration') as string || '10')

                  await updateLessonAction(lesson.id, {
                    title,
                    description,
                    status,
                    estimatedDuration,
                  })
                }} className="space-y-4">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Title
                    </label>
                    <Input name="title" defaultValue={lesson.title} required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <Textarea name="description" defaultValue={lesson.description} required rows={2} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Duration (Mins)
                    </label>
                    <Input type="number" name="estimatedDuration" defaultValue={lesson.estimatedDuration} min={1} required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <Select name="status" defaultValue={lesson.status}>
                      <option value={LessonStatus.DRAFT}>Draft</option>
                      <option value={LessonStatus.PUBLISHED}>Published</option>
                      <option value={LessonStatus.ARCHIVED}>Archived</option>
                    </Select>
                  </div>

                  <Button type="submit" variant="gradient" className="w-full text-xs">
                    <Save className="h-3.5 w-3.5 mr-1" /> Save Settings
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Assigned Editors Panel */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-purple-600" /> Assigned Editors
                </h4>
                <Badge variant="purple" className="text-[10px]">
                  {lesson.collaborators.length} Editors
                </Badge>
              </div>

              <div className="space-y-2">
                {lesson.collaborators.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No editors assigned to this lesson yet.</p>
                ) : (
                  lesson.collaborators.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={c.user.avatarUrl || `https://avatar.vercel.sh/${c.user.name}`} alt={c.user.name} className="h-6 w-6 rounded-full object-cover" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{c.user.name}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Downloadable Resources Panel */}
            <Card className="p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Paperclip className="h-4 w-4 text-blue-600" /> Attached Resources ({lesson.resources.length})
              </h4>

              <ResourceUploader
                onAddResource={async (res) => {
                  'use server'
                  await addResourceAction({
                    lessonId: lesson.id,
                    ...res,
                  })
                }}
              />

              <div className="space-y-2">
                {lesson.resources.map((res) => (
                  <div key={res.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                    <div className="truncate pr-2">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{res.title}</p>
                      <p className="text-[10px] text-slate-400">{res.fileName}</p>
                    </div>
                    <form action={async () => { 'use server'; await deleteResourceAction(res.id, lesson.id) }}>
                      <Button size="sm" variant="ghost" className="text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Right Column: Interactive Block Builder Studio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" /> Block Builder Studio
              </h2>
              <span className="text-xs text-slate-400 font-medium">Reorderable content blocks</span>
            </div>

            <LessonBlockEditor
              lessonId={lesson.id}
              initialBlocks={lesson.blocks as any}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
