'use server'

import { requireLessonEditPermission } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { BlockType } from '@prisma/client'

export async function addBlockAction(data: {
  lessonId: string
  type: BlockType
  content: string
  metadata?: string
}) {
  await requireLessonEditPermission(data.lessonId)

  // Find max block position
  const maxBlock = await prisma.lessonBlock.findFirst({
    where: { lessonId: data.lessonId },
    orderBy: { position: 'desc' },
  })
  const position = (maxBlock?.position ?? 0) + 1

  const block = await prisma.lessonBlock.create({
    data: {
      lessonId: data.lessonId,
      type: data.type,
      position,
      content: data.content,
      metadata: data.metadata || null,
    },
  })

  revalidatePath(`/admin/lessons/${data.lessonId}/edit`)
  revalidatePath(`/editor/lessons/${data.lessonId}/edit`)
  return { success: true, block }
}

export async function updateBlockAction(
  blockId: string,
  lessonId: string,
  data: {
    content: string
    metadata?: string
  }
) {
  await requireLessonEditPermission(lessonId)

  const block = await prisma.lessonBlock.update({
    where: { id: blockId },
    data: {
      content: data.content,
      metadata: data.metadata !== undefined ? data.metadata : undefined,
    },
  })

  revalidatePath(`/admin/lessons/${lessonId}/edit`)
  revalidatePath(`/editor/lessons/${lessonId}/edit`)
  return { success: true, block }
}

export async function deleteBlockAction(blockId: string, lessonId: string) {
  await requireLessonEditPermission(lessonId)

  await prisma.lessonBlock.delete({
    where: { id: blockId },
  })

  revalidatePath(`/admin/lessons/${lessonId}/edit`)
  revalidatePath(`/editor/lessons/${lessonId}/edit`)
  return { success: true }
}

export async function reorderBlocksAction(lessonId: string, blockOrders: { id: string; position: number }[]) {
  await requireLessonEditPermission(lessonId)

  await prisma.$transaction(
    blockOrders.map(({ id, position }) =>
      prisma.lessonBlock.update({
        where: { id },
        data: { position },
      })
    )
  )

  revalidatePath(`/admin/lessons/${lessonId}/edit`)
  revalidatePath(`/editor/lessons/${lessonId}/edit`)
  return { success: true }
}
