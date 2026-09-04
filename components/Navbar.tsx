'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Role } from '@prisma/client'
import { DemoRoleSwitcher } from '@/components/DemoRoleSwitcher'
import { signOutAction } from '@/actions/auth'
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  LogOut,
  Sparkles,
  ShieldCheck,
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
    if (role === Role.ADMIN) return <Badge variant="primary" className="text-[10px]">Admin</Badge>
    if (role === Role.EDITOR) return <Badge variant="purple" className="text-[10px]">Editor</Badge>
    return <Badge variant="secondary" className="text-[10px]">Student</Badge>
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D4D4D4] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-[#EA580C] shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#171717]">
                Hopenix
              </span>
              <span className="text-[10px] font-medium text-[#EA580C] -mt-1 tracking-widest uppercase">
                Learning Portal
              </span>
            </div>
          </Link>

          {/* Role Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/courses"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                pathname.startsWith('/courses')
                  ? 'bg-[#EA580C]/10 text-[#EA580C] font-semibold'
                  : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Courses
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-[#EA580C]/10 text-[#EA580C] font-semibold'
                    : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Student Dashboard
              </Link>
            )}

            {user?.role === Role.ADMIN && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/dashboard')
                      ? 'bg-[#171717] text-white font-semibold'
                      : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
                <Link
                  href="/admin/lessons"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/lessons')
                      ? 'bg-[#171717] text-white font-semibold'
                      : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Lessons
                </Link>
                <Link
                  href="/admin/users"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/users')
                      ? 'bg-[#171717] text-white font-semibold'
                      : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  pathname.startsWith('/editor')
                    ? 'bg-[#EA580C] text-white font-semibold'
                    : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
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
            <div className="flex items-center gap-3 pl-2 border-l border-[#D4D4D4]">
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#EA580C]/40"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EA580C]/10 text-[#EA580C] font-bold text-xs border border-[#EA580C]/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#171717] leading-none">
                    {user.name}
                  </span>
                  <span className="mt-0.5">{getRoleBadge(user.role)}</span>
                </div>
              </Link>

              <Link
                href="/profile/security"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#525252] hover:bg-[#E5E5E5] hover:text-[#171717] transition-colors"
                title="Account Security"
              >
                <ShieldCheck className="h-4 w-4" />
              </Link>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#525252] hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
                className="px-4 py-2 text-sm font-medium text-[#525252] hover:text-[#171717]"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium bg-[#171717] text-white rounded-full hover:bg-[#262626] transition-colors shadow-sm"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

