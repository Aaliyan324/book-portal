'use server'

import { signInSchema, signUpSchema } from '@/lib/validation/schemas'
import { prisma } from '@/lib/db/prisma'
import { verifyPassword, hashPassword, setAuthCookie, removeAuthCookie } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'

export async function signInAction(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = signInSchema.safeParse({ email, password })
  if (!validation.success) {
    redirect(`/login?error=${encodeURIComponent(validation.error.issues[0]?.message || 'Invalid input')}`)
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
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

  let targetPath = '/courses'
  if (user.role === Role.ADMIN) targetPath = '/admin/dashboard'
  else if (user.role === Role.EDITOR) targetPath = '/editor/dashboard'

  redirect(targetPath)
}

export async function signUpAction(formData: FormData): Promise<void> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validation = signUpSchema.safeParse({ name, email, password })
  if (!validation.success) {
    redirect(`/sign-up?error=${encodeURIComponent(validation.error.issues[0]?.message || 'Invalid input')}`)
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (existing) {
    redirect(`/sign-up?error=${encodeURIComponent('An account with this email already exists')}`)
  }

  const passwordHash = await hashPassword(password)
  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: Role.STUDENT,
    },
  })

  await setAuthCookie({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
  })

  redirect('/courses')
}

export async function signOutAction(): Promise<void> {
  await removeAuthCookie()
  redirect('/login')
}

export async function demoLoginAction(role: Role): Promise<void> {
  let email = 'admin@hopenx.com'
  if (role === Role.EDITOR) email = 'editor@hopenx.com'
  if (role === Role.STUDENT) email = 'student@hopenx.com'

  const user = await prisma.user.findUnique({
    where: { email },
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

  let targetPath = '/courses'
  if (user.role === Role.ADMIN) targetPath = '/admin/dashboard'
  else if (user.role === Role.EDITOR) targetPath = '/editor/dashboard'

  redirect(targetPath)
}
