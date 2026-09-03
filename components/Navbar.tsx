'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Role } from '@prisma/client'
import { DemoRoleSwitcher } from '@/components/DemoRoleSwitcher'
import { signOutAction } from '@/actions/auth'
import {
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  LogOut,
  User as UserIcon,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface NavbarProps {
  user?: {
    id: string
    name: string
    email: string
    role: Role
    avatarUrl?: string | null
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()

  const getRoleBadge = (role?: Role) => {
    if (role === Role.ADMIN) return <Badge variant="default" className="text-[10px]">Admin</Badge>
    if (role === Role.EDITOR) return <Badge variant="purple" className="text-[10px]">Editor</Badge>
    return <Badge variant="secondary" className="text-[10px]">Student</Badge>
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Hopenx
              </span>
              <span className="text-[10px] font-semibold text-slate-400 -mt-1 tracking-widest uppercase">
                LMS Portal
              </span>
            </div>
          </Link>

          {/* Role Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/courses"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith('/courses')
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Courses
            </Link>

            {user?.role === Role.ADMIN && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/dashboard')
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Portal
                </Link>
                <Link
                  href="/admin/lessons"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/lessons')
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Lessons
                </Link>
                <Link
                  href="/admin/users"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/users')
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Users
                </Link>
              </>
            )}

            {user?.role === Role.EDITOR && (
              <Link
                href="/editor/dashboard"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/editor')
                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="h-4 w-4" />
                Editor Studio
              </Link>
            )}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Interactive Role Switcher Widget */}
          <DemoRoleSwitcher currentRole={user?.role} currentUserName={user?.name} />

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
                    {user.name}
                  </span>
                  <span className="mt-0.5">{getRoleBadge(user.role)}</span>
                </div>
              </Link>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-3.5 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-500/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
