'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Role } from '@prisma/client'
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Users,
  UserCheck,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Shield,
  LogOut,
} from 'lucide-react'
import { signOutAction } from '@/actions/auth'

interface AdminSidebarProps {
  userRole: Role
  userName: string
}

export function AdminSidebar({ userRole, userName }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  const links: { label: string; href: string; icon: any; roles: Role[] }[] = [
    {
      label: 'Dashboard',
      href: userRole === Role.ADMIN ? '/admin/dashboard' : '/editor/dashboard',
      icon: LayoutDashboard,
      roles: [Role.ADMIN, Role.EDITOR],
    },
    {
      label: 'Courses',
      href: '/admin/courses',
      icon: GraduationCap,
      roles: [Role.ADMIN],
    },
    {
      label: 'Lessons',
      href: '/admin/lessons',
      icon: FileText,
      roles: [Role.ADMIN],
    },
    {
      label: 'User Management',
      href: '/admin/users',
      icon: Users,
      roles: [Role.ADMIN],
    },
  ]

  const navContent = (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-[#EA580C]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-[#171717] tracking-tight">Hopenix</span>
            <span className="block text-[10px] font-semibold text-[#EA580C] uppercase tracking-wider -mt-0.5">
              {userRole === Role.ADMIN ? 'Admin Portal' : 'Editor Workspace'}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#525252] mb-2">
            Navigation
          </p>
          {links
            .filter((l) => l.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[2px] text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#171717] text-white font-semibold shadow-sm'
                      : 'text-[#525252] hover:bg-[#E5E5E5]/60 hover:text-[#171717]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#EA580C]' : 'text-[#525252]'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
        </div>

        {/* Quick Actions (Admin Only) */}
        {userRole === Role.ADMIN && (
          <div className="space-y-2 pt-4 border-t border-[#E5E5E5]">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#525252] mb-1">
              Quick Actions
            </p>
            <Link
              href="/admin/courses/new"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-[2px] text-xs text-[#525252] hover:bg-[#EA580C]/10 hover:text-[#EA580C] transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-[#EA580C]" /> New Course
            </Link>
            <Link
              href="/admin/lessons/new"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-[2px] text-xs text-[#525252] hover:bg-[#EA580C]/10 hover:text-[#EA580C] transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-[#EA580C]" /> New Lesson
            </Link>
          </div>
        )}
      </div>

      {/* Footer User Info */}
      <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EA580C]/10 text-[#EA580C] font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#171717] truncate max-w-[110px]">{userName}</p>
              <p className="text-[10px] text-[#525252]">{userRole}</p>
            </div>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="p-1 text-[#525252] hover:text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Top Bar Trigger */}
      <div className="lg:hidden sticky top-16 z-30 flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#D4D4D4]">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#EA580C]" />
          <span className="text-xs font-bold text-[#171717]">
            {userRole === Role.ADMIN ? 'Admin Controls' : 'Editor Workspace'}
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-[2px] text-[#525252] hover:bg-[#E5E5E5] hover:text-[#171717]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-[#D4D4D4] p-5 shrink-0 min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Animated Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Sliding Body */}
          <div className="relative ml-auto w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-[#525252] hover:bg-[#E5E5E5] hover:text-[#171717]"
            >
              <X className="h-5 w-5" />
            </button>
            {navContent}
          </div>
        </div>
      )}
    </>
  )
}
