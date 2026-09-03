'use client'

import * as React from 'react'
import { Role } from '@prisma/client'
import { demoLoginAction } from '@/actions/auth'
import { ShieldCheck, Edit3, GraduationCap, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface DemoRoleSwitcherProps {
  currentRole?: Role | null
  currentUserName?: string
}

export function DemoRoleSwitcher({ currentRole, currentUserName }: DemoRoleSwitcherProps) {
  const [isPending, startTransition] = React.useTransition()

  const handleRoleSwitch = (role: Role) => {
    if (role === currentRole) return
    startTransition(async () => {
      toast.loading(`Switching view to ${role}...`)
      await demoLoginAction(role)
      toast.success(`Switched role to ${role}`)
    })
  }

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 p-1 rounded-full text-xs shadow-inner">
      <span className="px-2 font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
        Role Switcher:
      </span>
      
      <button
        onClick={() => handleRoleSwitch(Role.ADMIN)}
        disabled={isPending}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
          currentRole === Role.ADMIN
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Test as Administrator"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Admin
      </button>

      <button
        onClick={() => handleRoleSwitch(Role.EDITOR)}
        disabled={isPending}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
          currentRole === Role.EDITOR
            ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Test as Assigned Editor"
      >
        <Edit3 className="h-3.5 w-3.5" />
        Editor
      </button>

      <button
        onClick={() => handleRoleSwitch(Role.STUDENT)}
        disabled={isPending}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
          currentRole === Role.STUDENT
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Test as Student"
      >
        <GraduationCap className="h-3.5 w-3.5" />
        Student
      </button>

      {isPending && <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-500 ml-1 mr-2" />}
    </div>
  )
}
