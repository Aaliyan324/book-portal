'use client'

import * as React from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { searchUsersAction, addCollaboratorAction, removeCollaboratorAction } from '@/actions/collaborators'
import { Search, UserPlus, UserMinus, ShieldAlert, Check, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Role } from '@prisma/client'

interface EditorSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lessonId: string
  lessonTitle: string
  currentCollaborators: {
    id: string
    userId: string
    user: {
      id: string
      name: string
      email: string
      role: Role
      avatarUrl?: string | null
    }
  }[]
}

export function EditorSelector({
  open,
  onOpenChange,
  lessonId,
  lessonTitle,
  currentCollaborators,
}: EditorSelectorProps) {
  const [query, setQuery] = React.useState('')
  const [users, setUsers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const assignedUserIds = new Set(currentCollaborators.map((c) => c.userId))

  const handleSearch = React.useCallback(async (q: string) => {
    setLoading(true)
    try {
      const results = await searchUsersAction(q)
      setUsers(results)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (open) {
      handleSearch('')
    }
  }, [open, handleSearch])

  const handleAssign = (userId: string, userName: string) => {
    startTransition(async () => {
      try {
        await addCollaboratorAction(lessonId, userId)
        toast.success(`Assigned ${userName} as editor`)
        handleSearch(query)
      } catch (err: any) {
        toast.error(err.message || 'Failed to assign editor')
      }
    })
  }

  const handleRemove = (userId: string, userName: string) => {
    startTransition(async () => {
      try {
        await removeCollaboratorAction(lessonId, userId)
        toast.success(`Removed ${userName} from editors`)
        handleSearch(query)
      } catch (err: any) {
        toast.error(err.message || 'Failed to remove editor')
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Manage Lesson Editors"
      description={`Grant specific editor access to "${lessonTitle}"`}
      className="max-w-xl"
    >
      <div className="space-y-4 py-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search users by name or email..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            className="pl-9"
          />
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/60 p-3 text-xs text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-start gap-2">
          <UserCheck className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Assigned editors will gain permission to modify <strong>ONLY this lesson</strong>. They cannot edit other lessons unless explicitly assigned.
          </span>
        </div>

        {/* User Search List */}
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="p-4 text-center text-xs text-slate-400">Loading user directory...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">No users found</div>
          ) : (
            users.map((u) => {
              const isAssigned = assignedUserIds.has(u.id)
              const isAdmin = u.role === Role.ADMIN

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {u.name}
                        </span>
                        {isAdmin ? (
                          <Badge variant="default" className="text-[10px]">Admin</Badge>
                        ) : isAssigned ? (
                          <Badge variant="purple" className="text-[10px]">Assigned Editor</Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>

                  <div>
                    {isAdmin ? (
                      <span className="text-xs text-slate-400 italic">Full Admin Access</span>
                    ) : isAssigned ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleRemove(u.id, u.name)}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs"
                      >
                        <UserMinus className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={isPending}
                        onClick={() => handleAssign(u.id, u.name)}
                        className="text-xs"
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Dialog>
  )
}
