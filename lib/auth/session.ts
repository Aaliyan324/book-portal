import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { Role } from '@prisma/client'

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.JWT_SECRET || 'hopenix-production-jwt-secret-key-32-chars-long'
)

export const AUTH_COOKIE_NAME = 'hopenix_auth_token'

export interface JWTPayload {
  userId: string
  email: string
  role: Role
  name: string
}

export function getDashboardPath(role?: Role | null): string {
  if (role === Role.ADMIN) return '/admin/dashboard'
  if (role === Role.EDITOR) return '/editor/dashboard'
  return '/dashboard'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET_KEY)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function setAuthCookie(payload: JWTPayload) {
  const token = await signToken(payload)
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload?.userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    })
    return user
  } catch {
    return null
  }
}

