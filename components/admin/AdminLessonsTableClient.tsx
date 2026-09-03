'use client'

import * as React from 'react'
import Link from 'next/link'
import { LessonStatus, Role } from '@prisma/client'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { QRCodeDialog } from '@/components/lessons/QRCodeDialog'
import { EditorSelector } from '@/components/admin/EditorSelector'
import { duplicateLessonAction, deleteLessonAction } from '@/actions/lessons'
import { FileText, Edit, Copy, QrCode, Trash2, Users, Search, Filter, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface AdminLessonsTableClientProps {
  lessons: any[]
  courses: { id: string; title: string }[]
}

export function AdminLessonsTableClient({ lessons, courses }: AdminLessonsTableClientProps) {
  const [search, setSearch] = React.useState('')
  const [courseFilter, setCourseFilter] = React.useState('ALL')
  const [statusFilter, setStatusFilter] = React.useState('ALL')

  // QR Code Dialog State
  const [qrModal, setQrModal] = React.useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: '',
    title: '',
  })

  // Editor Selector Modal State
  const [editorModal, setEditorModal] = React.useState<{
    open: boolean
    lessonId: string
    title: string
    collaborators: any[]
  }>({
    open: false,
    lessonId: '',
    title: '',
    collaborators: [],
  })

  const [isPending, startTransition] = React.useTransition()

  // Filter lessons
  const filteredLessons = lessons.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
    const matchesCourse = courseFilter === 'ALL' || l.courseId === courseFilter
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter
    return matchesSearch && matchesCourse && matchesStatus
  })

  const handleDuplicate = (lessonId: string, title: string) => {
    startTransition(async () => {
      try {
        await duplicateLessonAction(lessonId)
        toast.success(`Duplicated "${title}"`)
      } catch {
        toast.error('Failed to duplicate lesson')
      }
    })
  }

  const handleDelete = (lessonId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return
    startTransition(async () => {
      try {
        await deleteLessonAction(lessonId)
        toast.success(`Deleted "${title}"`)
      } catch {
        toast.error('Failed to delete lesson')
      }
    })
  }

  const handleGenerateQR = (courseSlug: string, lessonSlug: string, title: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const fullUrl = `${baseUrl}/courses/${courseSlug}/lessons/${lessonSlug}`
    setQrModal({ open: true, url: fullUrl, title })
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search lessons by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="sm:w-48">
          <option value="ALL">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>

        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-40">
          <option value="ALL">All Statuses</option>
          <option value={LessonStatus.PUBLISHED}>Published</option>
          <option value={LessonStatus.DRAFT}>Draft</option>
          <option value={LessonStatus.ARCHIVED}>Archived</option>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lesson</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Editors</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredLessons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                No lessons found matching filters.
              </TableCell>
            </TableRow>
          ) : (
            filteredLessons.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {lesson.thumbnailUrl ? (
                      <img src={lesson.thumbnailUrl} alt={lesson.title} className="h-10 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-14 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                        <FileText className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <Link href={`/admin/lessons/${lesson.id}/edit`} className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600">
                        {lesson.title}
                      </Link>
                      <p className="text-xs text-slate-400">Duration: {lesson.estimatedDuration} mins</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {lesson.course.title}
                </TableCell>

                <TableCell>
                  <Badge variant={lesson.status === LessonStatus.PUBLISHED ? 'success' : 'warning'}>
                    {lesson.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {lesson.collaborators.length > 0 ? (
                      <div className="flex -space-x-2">
                        {lesson.collaborators.map((c: any) => (
                          <img
                            key={c.id}
                            src={c.user.avatarUrl || `https://avatar.vercel.sh/${c.user.name}`}
                            alt={c.user.name}
                            className="h-7 w-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                            title={c.user.name}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">None assigned</span>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditorModal({
                          open: true,
                          lessonId: lesson.id,
                          title: lesson.title,
                          collaborators: lesson.collaborators,
                        })
                      }
                      className="text-xs text-blue-600"
                    >
                      <Users className="h-3.5 w-3.5 mr-1" /> Manage
                    </Button>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/courses/${lesson.course.slug}/lessons/${lesson.slug}`} target="_blank">
                      <Button size="sm" variant="ghost" title="Preview Student View">
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleGenerateQR(lesson.course.slug, lesson.slug, lesson.title)}
                      title="Generate QR Code"
                    >
                      <QrCode className="h-3.5 w-3.5 text-blue-600" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicate(lesson.id, lesson.title)}
                      title="Duplicate Lesson"
                      disabled={isPending}
                    >
                      <Copy className="h-3.5 w-3.5 text-indigo-600" />
                    </Button>

                    <Link href={`/admin/lessons/${lesson.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(lesson.id, lesson.title)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dynamic QR Code Modal */}
      <QRCodeDialog
        open={qrModal.open}
        onOpenChange={(open) => setQrModal((prev) => ({ ...prev, open }))}
        url={qrModal.url}
        title={qrModal.title}
      />

      {/* Editor Assignment Modal */}
      <EditorSelector
        open={editorModal.open}
        onOpenChange={(open) => setEditorModal((prev) => ({ ...prev, open }))}
        lessonId={editorModal.lessonId}
        lessonTitle={editorModal.title}
        currentCollaborators={editorModal.collaborators}
      />
    </div>
  )
}
