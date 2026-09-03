'use server'

import { requireAdmin } from '@/lib/permissions/permissions'
import { courseSchema } from '@/lib/validation/schemas'
import { prisma } from '@/lib/db/prisma'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { CourseStatus } from '@prisma/client'

export async function createCourseAction(data: {
  title: string
  description: string
  thumbnailUrl?: string
  bannerUrl?: string
  status?: CourseStatus
}) {
  const admin = await requireAdmin()
  const validated = courseSchema.parse(data)

  const slug = validated.slug || slugify(validated.title)
  
  // Check slug uniqueness
  const existing = await prisma.course.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  const course = await prisma.course.create({
    data: {
      title: validated.title,
      slug: finalSlug,
      description: validated.description,
      thumbnailUrl: validated.thumbnailUrl || null,
      bannerUrl: validated.bannerUrl || null,
      status: validated.status || CourseStatus.DRAFT,
      createdById: admin.id,
    },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  return { success: true, course }
}

export async function updateCourseAction(
  courseId: string,
  data: {
    title: string
    description: string
    thumbnailUrl?: string
    bannerUrl?: string
    status?: CourseStatus
  }
) {
  await requireAdmin()
  const validated = courseSchema.parse(data)

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      title: validated.title,
      description: validated.description,
      thumbnailUrl: validated.thumbnailUrl || null,
      bannerUrl: validated.bannerUrl || null,
      status: validated.status,
    },
  })

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${courseId}`)
  revalidatePath(`/courses/${course.slug}`)
  revalidatePath('/courses')
  return { success: true, course }
}

export async function deleteCourseAction(courseId: string) {
  await requireAdmin()
  await prisma.course.delete({
    where: { id: courseId },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  return { success: true }
}

export async function toggleCourseStatusAction(courseId: string, status: CourseStatus) {
  await requireAdmin()
  const course = await prisma.course.update({
    where: { id: courseId },
    data: { status },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  return { success: true, course }
}
