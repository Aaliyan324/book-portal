'use server'

import { requireUser, requireAdmin, requireLessonEditPermission } from '@/lib/permissions/permissions'
import { lessonSchema } from '@/lib/validation/schemas'
import { prisma } from '@/lib/db/prisma'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { LessonStatus, Role } from '@prisma/client'

export async function createLessonAction(data: {
  courseId: string
  title: string
  description: string
  thumbnailUrl?: string
  status?: LessonStatus
  estimatedDuration?: number
}) {
  const user = await requireUser()
  if (user.role !== Role.ADMIN) {
    throw new Error('Only admins can create new lessons')
  }

  const validated = lessonSchema.parse(data)
  const slug = validated.slug || slugify(validated.title)
  const existing = await prisma.lesson.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  // Find max position in course
  const maxLesson = await prisma.lesson.findFirst({
    where: { courseId: validated.courseId },
    orderBy: { position: 'desc' },
  })
  const nextPosition = (maxLesson?.position ?? 0) + 1

  const lesson = await prisma.lesson.create({
    data: {
      courseId: validated.courseId,
      title: validated.title,
      slug: finalSlug,
      description: validated.description,
      thumbnailUrl: validated.thumbnailUrl || null,
      status: validated.status || LessonStatus.DRAFT,
      position: nextPosition,
      estimatedDuration: validated.estimatedDuration || 10,
      createdById: user.id,
      updatedById: user.id,
    },
  })

  revalidatePath('/admin/lessons')
  revalidatePath(`/admin/courses/${validated.courseId}`)
  revalidatePath('/courses')
  return { success: true, lesson }
}

export async function updateLessonAction(
  lessonId: string,
  data: {
    title: string
    description: string
    thumbnailUrl?: string
    status?: LessonStatus
    estimatedDuration?: number
  }
) {
  const user = await requireLessonEditPermission(lessonId)

  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl || null,
      status: data.status,
      estimatedDuration: data.estimatedDuration,
      updatedById: user.id,
    },
  })

  revalidatePath('/admin/lessons')
  revalidatePath(`/admin/lessons/${lessonId}`)
  revalidatePath(`/editor/lessons/${lessonId}/edit`)
  revalidatePath('/editor/dashboard')
  revalidatePath('/courses')
  return { success: true, lesson }
}

export async function deleteLessonAction(lessonId: string) {
  await requireAdmin()
  const lesson = await prisma.lesson.delete({
    where: { id: lessonId },
  })

  revalidatePath('/admin/lessons')
  revalidatePath('/editor/dashboard')
  revalidatePath('/courses')
  return { success: true, lesson }
}

export async function duplicateLessonAction(lessonId: string) {
  const admin = await requireAdmin()

  const original = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      blocks: true,
      resources: true,
    },
  })

  if (!original) throw new Error('Original lesson not found')

  const newTitle = `${original.title} (Copy)`
  const baseSlug = slugify(newTitle)
  const finalSlug = `${baseSlug}-${Date.now()}`

  const duplicated = await prisma.lesson.create({
    data: {
      courseId: original.courseId,
      title: newTitle,
      slug: finalSlug,
      description: original.description,
      thumbnailUrl: original.thumbnailUrl,
      status: LessonStatus.DRAFT,
      position: original.position + 1,
      estimatedDuration: original.estimatedDuration,
      createdById: admin.id,
      updatedById: admin.id,
      blocks: {
        create: original.blocks.map((block) => ({
          type: block.type,
          position: block.position,
          content: block.content,
          metadata: block.metadata,
        })),
      },
    },
  })

  revalidatePath('/admin/lessons')
  return { success: true, lesson: duplicated }
}

export async function toggleLessonStatusAction(lessonId: string, status: LessonStatus) {
  await requireAdmin()
  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: { status },
  })

  revalidatePath('/admin/lessons')
  revalidatePath('/editor/dashboard')
  revalidatePath('/courses')
  return { success: true, lesson }
}

export async function reorderLessonsAction(lessonOrders: { id: string; position: number }[]) {
  await requireAdmin()

  await prisma.$transaction(
    lessonOrders.map(({ id, position }) =>
      prisma.lesson.update({
        where: { id },
        data: { position },
      })
    )
  )

  revalidatePath('/admin/lessons')
  revalidatePath('/courses')
  return { success: true }
}
