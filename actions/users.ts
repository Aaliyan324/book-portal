'use server'

import { requireAdmin } from '@/lib/permissions/permissions'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import { Role } from '@prisma/client'

export async function updateUserRoleAction(userId: string, role: Role) {
  const admin = await requireAdmin()

  // Prevent admin from demoting themselves
  if (admin.id === userId && role !== Role.ADMIN) {
    throw new Error('You cannot change your own admin role')
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/editors')
  revalidatePath('/admin/students')
  return { success: true, user }
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin()

  if (admin.id === userId) {
    throw new Error('You cannot delete your own admin account')
  }

  await prisma.user.delete({
    where: { id: userId },
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/editors')
  revalidatePath('/admin/students')
  return { success: true }
}
