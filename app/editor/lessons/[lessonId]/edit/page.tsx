import { requireLessonEditPermission } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { updateLessonAction } from '@/actions/lessons'
import { addResourceAction, deleteResourceAction } from '@/actions/resources'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { LessonStatus } from '@prisma/client'
import { LessonBlockEditor } from '@/components/editor/LessonBlockEditor'
import { ResourceUploader } from '@/components/uploads/ResourceUploader'
import { ArrowLeft, Save, Edit3, Sparkles, Paperclip, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditorEditLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params

  // Strict server-side RBAC check: throws 403 if user is not assigned as editor
  const user = await requireLessonEditPermission(lessonId)

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: true,
      blocks: { orderBy: { position: 'asc' } },
      resources: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!lesson) notFound()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar user={user} />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8 space-y-6">
        <Link href="/editor/dashboard" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-purple-600">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Editor Studio
        </Link>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Lesson Details & Resources */}
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-purple-600" /> Edit Assigned Lesson
                </CardTitle>
                <CardDescription>Update title, description, and save draft content</CardDescription>
              </CardHeader>

              <CardContent>
                <form action={async (formData: FormData) => {
                  'use server'
                  const title = formData.get('title') as string
                  const description = formData.get('description') as string

                  await updateLessonAction(lesson.id, {
                    title,
                    description,
                    status: lesson.status, // Editors keep existing status unless admin publishes
                    estimatedDuration: lesson.estimatedDuration,
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
                    <Textarea name="description" defaultValue={lesson.description} required rows={3} />
                  </div>

                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-500">Status:</span>
                    <Badge variant={lesson.status === LessonStatus.PUBLISHED ? 'success' : 'warning'}>
                      {lesson.status}
                    </Badge>
                  </div>

                  <Button type="submit" variant="gradient" className="w-full text-xs">
                    <Save className="h-3.5 w-3.5 mr-1" /> Save Draft Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Attached Resources */}
            <Card className="p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Paperclip className="h-4 w-4 text-blue-600" /> Lesson Resources ({lesson.resources.length})
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

          {/* Right Column: Block Builder Studio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" /> Editor Block Builder Studio
              </h2>
              <span className="text-xs text-slate-400">Collaborator Access</span>
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
