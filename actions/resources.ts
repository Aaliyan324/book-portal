'use server'

import { requireLessonEditPermission } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

export async function addResourceAction(data: {
  lessonId: string
  title: string
  url: string
  fileName: string
  mimeType: string
  size: number
  storageKey?: string
}) {
  const user = await requireLessonEditPermission(data.lessonId)

  const resource = await prisma.resource.create({
    data: {
      lessonId: data.lessonId,
      uploadedById: user.id,
      title: data.title,
      url: data.url,
      fileName: data.fileName,
      mimeType: data.mimeType,
      size: data.size,
      storageKey: data.storageKey || null,
    },
  })

  revalidatePath(`/admin/lessons/${data.lessonId}/edit`)
  revalidatePath(`/editor/lessons/${data.lessonId}/edit`)
  revalidatePath('/courses')
  return { success: true, resource }
}

export async function deleteResourceAction(resourceId: string, lessonId: string) {
  await requireLessonEditPermission(lessonId)

  await prisma.resource.delete({
    where: { id: resourceId },
  })

  revalidatePath(`/admin/lessons/${lessonId}/edit`)
  revalidatePath(`/editor/lessons/${lessonId}/edit`)
  revalidatePath('/courses')
  return { success: true }
}
