'use server'

import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { Role } from '@prisma/client'

export async function addCollaboratorAction(lessonId: string, userId: string) {
  await requireAdmin()

  // Ensure user is an EDITOR or ADMIN
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, name: true },
  })

  if (!targetUser) {
    throw new Error('User not found')
  }

  // Auto-upgrade STUDENT to EDITOR if assigned as a collaborator
  if (targetUser.role === Role.STUDENT) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: Role.EDITOR },
    })
  }

  // Create unique collaborator record
  const collaborator = await prisma.lessonCollaborator.upsert({
    where: {
      lessonId_userId: {
        lessonId,
        userId,
      },
    },
    create: {
      lessonId,
      userId,
    },
    update: {},
  })

  revalidatePath('/admin/lessons')
  revalidatePath(`/admin/lessons/${lessonId}`)
  revalidatePath('/admin/editors')
  return { success: true, collaborator }
}

export async function removeCollaboratorAction(lessonId: string, userId: string) {
  await requireAdmin()

  await prisma.lessonCollaborator.deleteMany({
    where: {
      lessonId,
      userId,
    },
  })

  revalidatePath('/admin/lessons')
  revalidatePath(`/admin/lessons/${lessonId}`)
  revalidatePath('/admin/editors')
  return { success: true }
}

export async function searchUsersAction(query: string) {
  await requireAdmin()

  if (!query || query.trim().length === 0) {
    return prisma.user.findMany({
      take: 20,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    })
  }

  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 20,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  })
}
