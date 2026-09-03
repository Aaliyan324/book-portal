import { z } from 'zod'
import { Role, CourseStatus, LessonStatus, BlockType } from '@prisma/client'

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  bannerUrl: z.string().url('Invalid banner URL').optional().or(z.literal('')),
  status: z.nativeEnum(CourseStatus).default(CourseStatus.DRAFT),
})

export const lessonSchema = z.object({
  courseId: z.string().min(1, 'Please select a course'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  status: z.nativeEnum(LessonStatus).default(LessonStatus.DRAFT),
  position: z.number().int().min(0).default(0),
  estimatedDuration: z.number().int().min(1, 'Duration must be at least 1 minute').default(10),
})

export const blockSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  type: z.nativeEnum(BlockType),
  position: z.number().int().min(0),
  content: z.string(),
  metadata: z.string().optional(),
})

export const userRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.nativeEnum(Role),
})

export const collaboratorSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  userId: z.string().min(1, 'User ID is required'),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type LessonInput = z.infer<typeof lessonSchema>
export type BlockInput = z.infer<typeof blockSchema>
