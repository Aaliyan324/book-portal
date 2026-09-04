'use server'

import { signInSchema, signUpSchema } from '@/lib/validation/schemas'
import { prisma } from '@/lib/db/prisma'
import { verifyPassword, hashPassword, setAuthCookie, removeAuthCookie, getDashboardPath, getCurrentUser } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function signInAction(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = signInSchema.safeParse({ email, password })
  if (!validation.success) {
    redirect(`/login?error=${encodeURIComponent(validation.error.issues[0]?.message || 'Invalid input')}`)
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  if (!user) {
    redirect(`/login?error=${encodeURIComponent('Invalid email or password')}`)
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    redirect(`/login?error=${encodeURIComponent('Invalid email or password')}`)
  }

  await setAuthCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })

  redirect(getDashboardPath(user.role))
}

export async function signUpAction(formData: FormData): Promise<void> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = signUpSchema.safeParse({ name, email, password })
  if (!validation.success) {
    redirect(`/sign-up?error=${encodeURIComponent(validation.error.issues[0]?.message || 'Invalid input')}`)
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (existing) {
    redirect(`/sign-up?error=${encodeURIComponent('An account with this email already exists')}`)
  }

  const passwordHash = await hashPassword(password)
  const newUser = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: Role.STUDENT, // Always default to STUDENT
    },
  })

  await setAuthCookie({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
  })

  redirect(getDashboardPath(newUser.role))
}

export async function signOutAction(): Promise<void> {
  await removeAuthCookie()
  redirect('/login')
}

export async function changePasswordAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: 'All fields are required' }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'New passwords do not match' }
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' }
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser) {
    return { success: false, error: 'User not found' }
  }

  const isValid = await verifyPassword(currentPassword, dbUser.passwordHash)
  if (!isValid) {
    return { success: false, error: 'Incorrect current password' }
  }

  const newHash = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  })

  revalidatePath('/profile')
  revalidatePath('/profile/security')
  return { success: true }
}

export async function demoLoginAction(role: Role): Promise<void> {
  let email = process.env.ADMIN_EMAIL || 'admin@hopenix.com'
  if (role === Role.EDITOR) email = 'editor@hopenix.com'
  if (role === Role.STUDENT) email = 'student@hopenix.com'

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) {
    redirect(`/login?error=${encodeURIComponent('Demo user not found. Please run seed script.')}`)
  }

  await setAuthCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })

  redirect(getDashboardPath(user.role))
}

