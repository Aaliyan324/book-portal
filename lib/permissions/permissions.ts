import { getCurrentUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { Role, LessonStatus } from '@prisma/client'

export class AuthError extends Error {
  constructor(message: string = 'Unauthorized', public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Ensures user is authenticated. Throws 401 AuthError if not.
 */
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    throw new AuthError('Authentication required', 401)
  }
  return user
}

/**
 * Ensures user is authenticated and has ADMIN role. Throws 403 if not admin.
 */
export async function requireAdmin() {
  const user = await requireUser()
  if (user.role !== Role.ADMIN) {
    throw new AuthError('Admin privileges required', 403)
  }
  return user
}

/**
 * Ensures user is authenticated and has ADMIN or EDITOR role.
 */
export async function requireEditorOrAdmin() {
  const user = await requireUser()
  if (user.role !== Role.ADMIN && user.role !== Role.EDITOR) {
    throw new AuthError('Editor or Admin privileges required', 403)
  }
  return user
}

/**
 * Verifies whether a given user can edit a specific lesson.
 * Returns true if user is ADMIN, or if user is assigned as a collaborator on that lesson.
 */
export async function canEditLesson(userId: string, lessonId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  if (!user) return false
  if (user.role === Role.ADMIN) return true
  if (user.role !== Role.EDITOR) return false

  const collaborator = await prisma.lessonCollaborator.findUnique({
    where: {
      lessonId_userId: {
        lessonId,
        userId,
      },
    },
  })

  return !!collaborator
}

/**
 * Asserts user can edit lesson. Throws AuthError(403) if denied.
 */
export async function requireLessonEditPermission(lessonId: string) {
  const user = await requireUser()
  const allowed = await canEditLesson(user.id, lessonId)
  if (!allowed) {
    throw new AuthError('You do not have permission to edit this lesson', 403)
  }
  return user
}

/**
 * Verifies whether a user can view a lesson.
 * Published lessons can be viewed by anyone (including students).
 * Draft/Archived lessons require ADMIN or assigned EDITOR permission.
 */
export async function canViewLesson(userId: string | null, lessonId: string): Promise<boolean> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { status: true },
  })

  if (!lesson) return false
  if (lesson.status === LessonStatus.PUBLISHED) return true
  if (!userId) return false

  return canEditLesson(userId, lessonId)
}
